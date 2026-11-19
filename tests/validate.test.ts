import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { validateStructure, notAGraph, type IncomeGraph } from '../lib/income-graph/validate.ts'

const REFERENCE = JSON.parse(
  readFileSync(path.join(process.cwd(), 'tests', 'fixtures', 'request-to-quote-2026-09-02.synthetic.json'), 'utf8'),
) as IncomeGraph

function clone(): IncomeGraph {
  return JSON.parse(JSON.stringify(REFERENCE))
}

test('notAGraph handles null input', () => {
  const result = notAGraph(null)
  assert.equal(result.code, 'S00')
  assert.equal(result.severity, 'error')
  assert.equal(result.path, '/')
  assert.match(result.message, /input is null/)
})

test('notAGraph handles non-object input', () => {
  const result = notAGraph('test')
  assert.equal(result.code, 'S00')
  assert.equal(result.severity, 'error')
  assert.equal(result.path, '/')
  assert.match(result.message, /input is string/)
})

test('validateStructure succeeds on a valid graph', () => {
  const result = validateStructure(REFERENCE)
  assert.deepEqual(result, [])
})

test('validateStructure handles null input identically to notAGraph', () => {
  // @ts-expect-error - testing invalid input
  const result = validateStructure(null)
  assert.equal(result.length, 1)
  assert.equal(result[0].code, 'S00')
})

test('validateStructure handles array input identically to notAGraph', () => {
  // @ts-expect-error - testing invalid input
  const result = validateStructure([])
  assert.equal(result.length, 1)
  assert.equal(result[0].code, 'S00')
})

test('validateStructure reports missing metadata thesis (S02)', () => {
  const graph = clone()
  graph.metadata.thesis = '   '
  const result = validateStructure(graph)
  assert.ok(result.some(f => f.code === 'S02' && f.path === '/metadata/thesis'))
})

test('validateStructure reports duplicate node id (S10)', () => {
  const graph = clone()
  graph.nodes.push(JSON.parse(JSON.stringify(graph.nodes[0])))
  const result = validateStructure(graph)
  assert.ok(result.some(f => f.code === 'S10' && f.path === `/nodes/${graph.nodes.length - 1}/id`))
})

test('validateStructure reports unknown edge endpoints (S13)', () => {
  const graph = clone()
  graph.edges.push({
    id: 'edge-invalid',
    type: 'reaches',
    from: 'nonexistent-node',
    to: 'nonexistent-node',
    owner: 'Test',
    provenance: { source: 'test', date: '2026-01-01' },
    version: '1.0.0',
    visibility: 'public',
    evaluation: 'test'
  })
  const result = validateStructure(graph)
  assert.ok(result.some(f => f.code === 'S13' && f.path.includes('/from')))
  assert.ok(result.some(f => f.code === 'S13' && f.path.includes('/to')))
})

test('validateStructure reports invalid edge type rules (S14)', () => {
  const graph = clone()
  const customer = graph.nodes.find(n => n.type === 'Customer')
  const offer = graph.nodes.find(n => n.type === 'Offer')
  assert.ok(customer && offer)
  graph.edges.push({
    id: 'edge-invalid-rule',
    type: 'serves',
    from: customer.id, // should be Offer
    to: offer.id,      // should be Customer
    owner: 'Test',
    provenance: { source: 'test', date: '2026-01-01' },
    version: '1.0.0',
    visibility: 'public',
    evaluation: 'test'
  })
  const result = validateStructure(graph)
  assert.ok(result.some(f => f.code === 'S14' && f.path.includes('/from')))
  assert.ok(result.some(f => f.code === 'S14' && f.path.includes('/to')))
})

test('completeness: missing required node (C01)', () => {
  const graph = clone()
  graph.nodes = graph.nodes.filter(n => n.type !== 'Customer')
  const result = validateStructure(graph)
  assert.ok(result.some(f => f.code === 'C01' && f.message.includes('Customer')))
})

test('completeness: offer missing price (C04)', () => {
  const graph = clone()
  const offer = graph.nodes.find(n => n.type === 'Offer')
  assert.ok(offer && offer.data)
  delete offer.data.price
  const result = validateStructure(graph)
  assert.ok(result.some(f => f.code === 'C04' && f.path.includes('/data/price')))
})
