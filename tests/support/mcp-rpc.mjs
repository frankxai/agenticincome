import './alias.mjs'

const { POST } = await import('../../app/api/mcp/[transport]/route.ts')

// mcp-handler answers over SSE and keeps the stream open; read the first data frame only.
export async function rpc(method, params, id) {
  const res = await POST(new Request('http://localhost/api/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  }))
  const type = res.headers.get('content-type') ?? ''
  if (!type.includes('text/event-stream')) return res.json()
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffered = ''
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) throw new Error(`stream ended without a data frame: ${buffered}`)
      buffered += decoder.decode(value, { stream: true })
      const frame = buffered.split('\n').slice(0, -1).find((line) => line.startsWith('data:'))
      if (frame) return JSON.parse(frame.slice(5))
    }
  } finally {
    await reader.cancel()
  }
}
