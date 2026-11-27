import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { rpc } from './support/mcp-rpc.mjs'

const { GET } = await import('../app/api/v1/economics/route.ts')
const get = (query) => GET(new Request('https://example.test/api/v1/economics?' + query))

test('public REST and MCP agree on both filtered evidence collections', async () => {
  await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'evidence', version: '1' } }, 1)
  for (const [query, name, args] of [
    ['dataset=markets&sector=digital-goods&query=Gumroad', 'search_digital_economies', { sector: 'digital-goods', query: 'Gumroad' }],
    ['dataset=costs&category=payments', 'list_supply_costs', { category: 'payments' }],
  ]) {
    const response = get(query)
    assert.equal(response.status, 200)
    assert.match(response.headers.get('cache-control'), /public/)
    const evidence = await response.json()
    const call = await rpc('tools/call', { name, arguments: args }, 2)
    assert.deepEqual(evidence, JSON.parse(call.result.content[0].text))
    assert.ok(evidence.rows.length > 0)
    assert.ok(evidence.rows.every((row) => row.verification.confirmed && row.sourceUrl.startsWith('https://')))
  }
})

test('strict filters fail clearly and an empty match returns zero records', async () => {
  for (const query of ['', 'dataset=private', 'dataset=markets&category=payments', 'dataset=markets&query=%20',
    'dataset=costs&dataset=markets', 'dataset=costs&category=' + 'x'.repeat(121), 'dataset=costs&confirmedOnly=false']) {
    assert.equal(get(query).status, 400, query)
  }
  const empty = await get('dataset=markets&sector=empty-fixture').json()
  assert.deepEqual(empty.rows, [])
  assert.equal(empty.count, 0)
})

test('published OpenAPI contract locates the supported endpoint', () => {
  const schema = JSON.parse(readFileSync(new URL('../public/economics.openapi.json', import.meta.url), 'utf8'))
  assert.deepEqual(schema.paths['/api/v1/economics'].get.parameters[0].schema.enum, ['markets', 'costs'])
})
