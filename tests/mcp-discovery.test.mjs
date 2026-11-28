import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const wellKnown = JSON.parse(read('public/.well-known/mcp.json'))
const routeSource = read('app/api/mcp/[transport]/route.ts')
const registeredTools = [...routeSource.matchAll(/registerTool\(\s*'([a-z_]+)'/g)].map((m) => m[1])

test('.well-known/mcp.json matches the registered MCP tools exactly', () => {
  assert.equal(registeredTools.length, 17, 'expected exactly 17 registered tools')
  assert.deepEqual([...wellKnown.tools].sort(), [...registeredTools].sort())
})

test('economy vault MCP tools default confirmedOnly to true on the public endpoint', () => {
  assert.ok(registeredTools.includes('search_digital_economies'))
  assert.ok(registeredTools.includes('list_supply_costs'))
  assert.ok(registeredTools.includes('calculate_unit_margin'))
  assert.match(routeSource, /const effectiveConfirmedOnly = confirmedOnly \?\? true/)
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

test('MCP product availability honors the checkout release gate', () => {
  assert.match(
    routeSource,
    /purchasable:\s*isCheckoutLive\(product\.id\)/,
    'list_products must use isCheckoutLive so credentials without CHECKOUT_RELEASE cannot report purchasable: true',
  )
})

test('tools documented on the MCP page are discoverable', () => {
  const docsSource = read('app/mcp/page.tsx')
  const featured = [...docsSource.matchAll(/\bname: '([a-z_]+)'/g)].map((m) => m[1])
  assert.ok(featured.length > 0, 'expected named tools in the MCP documentation')
  for (const name of featured) {
    assert.ok(wellKnown.tools.includes(name), `${name} is featured on the homepage but missing from .well-known/mcp.json`)
  }
})

test('partner economics rows carry a verification date and source', () => {
  const programs = JSON.parse(read('data/programs.json')).programs
  const verified = programs.filter((p) => p.commissionVerifiedAt)
  assert.ok(verified.length >= 5, 'expected at least five programs verified against their own terms')
  for (const p of verified) {
    assert.match(p.commissionVerifiedAt, /^\d{4}-\d{2}-\d{2}$/, `${p.tool} verification date is not YYYY-MM-DD`)
    assert.ok(p.commissionVerifiedAt >= '2026-08-16', `${p.tool} verification predates the first official-terms pass`)
    assert.ok(Date.parse(p.commissionVerifiedAt) <= Date.now(), `${p.tool} verification date is in the future`)
    assert.ok(p.commissionSourceUrl, `${p.tool} verified without a source URL`)
    assert.ok(p.commission, `${p.tool} verified without a commission string`)
  }
})
