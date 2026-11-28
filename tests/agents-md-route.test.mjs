import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import './support/alias.mjs'

const { GET: getAgentsMd } = await import('../app/agents.md/route.ts')
const read = (rel) => readFileSync(new URL(`../${rel}`, import.meta.url), 'utf8')

test('/agents.md route serves canonical Agentic Income AX discovery without income promises', async () => {
  const res = getAgentsMd()
  assert.equal(res.status, 200)
  assert.match(res.headers.get('content-type') ?? '', /text\/markdown; charset=utf-8/)

  const body = await res.text()
  assert.match(body, /https:\/\/www\.agenticincome\.ai\/llms\.txt/)
  assert.match(body, /https:\/\/www\.agenticincome\.ai\/\.well-known\/agent\.json/)
  assert.match(body, /https:\/\/www\.agenticincome\.ai\/\.well-known\/mcp\.json/)
  assert.match(body, /https:\/\/www\.agenticincome\.ai\/api\/mcp/)
  assert.match(body, /https:\/\/www\.agenticincome\.ai\/api\/v1\/economics/)
  assert.match(body, /No outcome or passive-income guarantees/)
  assert.doesNotMatch(body, /runs? without you/i)
})

test('public/.well-known/agent.json stays aligned with canonical MCP manifest', () => {
  const agent = JSON.parse(read('public/.well-known/agent.json'))
  const mcp = JSON.parse(read('public/.well-known/mcp.json'))

  assert.equal(agent.schema, 'starlight.agent.v1')
  assert.equal(agent.canonical, 'https://www.agenticincome.ai')
  assert.equal(agent.discovery.agentsMd, 'https://www.agenticincome.ai/agents.md')
  assert.equal(agent.discovery.mcpManifest, 'https://www.agenticincome.ai/.well-known/mcp.json')
  assert.equal(agent.mcp.name, mcp.name)
  assert.equal(agent.mcp.endpoint, mcp.endpoint)
  assert.equal(agent.mcp.transport, mcp.transport)
  assert.equal(agent.mcp.docs, mcp.docs)
  assert.ok(agent.disclosures.some((item) => item.includes('No income promises')))
})
