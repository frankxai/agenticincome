import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const wellKnown = JSON.parse(read('public/.well-known/mcp.json'))
const routeSource = read('app/api/mcp/[transport]/route.ts')
const registeredTools = [...routeSource.matchAll(/registerTool\(\s*'([a-z_]+)'/g)].map((m) => m[1])

test('.well-known/mcp.json matches the registered MCP tools exactly', () => {
  assert.equal(registeredTools.length, 7, 'expected exactly 7 registered tools')
  assert.deepEqual([...wellKnown.tools].sort(), [...registeredTools].sort())
})

test('discovery metadata points at the real endpoint and docs', () => {
  assert.equal(wellKnown.name, 'agentic-income')
  assert.equal(wellKnown.endpoint, 'https://www.agenticincome.ai/api/mcp')
  assert.equal(wellKnown.transport, 'streamable-http')
  assert.equal(wellKnown.docs, 'https://www.agenticincome.ai/mcp')
})

test('the MCP server discloses affiliate links in registry responses', () => {
  assert.match(routeSource, /Links marked ourLink are affiliate links; Agentic Income may earn a commission\./)
})

test('partner economics rows carry a verification date and source', () => {
  const programs = JSON.parse(read('data/programs.json')).programs
  const verified = programs.filter((p) => p.commissionVerifiedAt)
  assert.ok(verified.length >= 5, 'expected at least the five 2026-08-16 verified programs')
  for (const p of verified) {
    assert.equal(p.commissionVerifiedAt, '2026-08-16')
    assert.ok(p.commissionSourceUrl, `${p.tool} verified without a source URL`)
    assert.ok(p.commission, `${p.tool} verified without a commission string`)
  }
})
