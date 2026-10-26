import assert from 'node:assert/strict'
import test, { after } from 'node:test'
import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'

// mcp-handler 1.1.0 pins its SDK peer to 1.26.0; pnpm-workspace.yaml overrides the SDK
// to a patched 1.x. This proves the handler still serves tools on the overridden SDK.
const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      'echo',
      { description: 'Echo a value back.', inputSchema: { value: z.string() } },
      async ({ value }) => ({ content: [{ type: 'text', text: value }] }),
    )
  },
  { serverInfo: { name: 'runtime-check', version: '1.0.0' } },
  { basePath: '/api', maxDuration: 10, verboseLogs: false, disableSse: true },
)

// mcp-handler starts a module-level cleanup setInterval it never unrefs, so this file's
// process would never go idle. Exit once the tests have reported; process.exit() keeps
// the exit code the runner set, so a failure still fails.
after(() => setImmediate(() => process.exit()))

async function rpc(method, params, id) {
  const res = await handler(new Request('http://localhost/api/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  }))
  if (!res.headers.get('content-type')?.includes('text/event-stream')) {
    return { status: res.status, message: await res.json() }
  }
  // The handler answers over SSE and keeps the stream open, so read up to the first
  // "data:" frame and close it; awaiting the whole body would never finish.
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffered = ''
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) throw new Error(`stream ended without a data frame: ${buffered}`)
      buffered += decoder.decode(value, { stream: true })
      const frame = buffered.split('\n').find((l) => l.startsWith('data:'))
      if (frame) return { status: res.status, message: JSON.parse(frame.slice(5)) }
    }
  } finally {
    await reader.cancel()
  }
}

test('the MCP handler initializes and lists tools on the overridden SDK', async () => {
  const init = await rpc('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'test', version: '1.0.0' },
  }, 1)
  assert.equal(init.status, 200)
  assert.equal(init.message.result.serverInfo.name, 'runtime-check')

  const list = await rpc('tools/list', {}, 2)
  assert.equal(list.status, 200)
  assert.deepEqual(list.message.result.tools.map((t) => t.name), ['echo'])
})

test('a tool call round-trips through the handler', async () => {
  const call = await rpc('tools/call', { name: 'echo', arguments: { value: 'ok' } }, 3)
  assert.equal(call.status, 200)
  assert.equal(call.message.result.content[0].text, 'ok')
})
