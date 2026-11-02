import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { projectCatalog, catalogCsv } from '../lib/observatory.mjs'

const fixture = JSON.parse(readFileSync(new URL('../data/observatory/seed-2026-11-01.json', import.meta.url)))
const fresh = () => structuredClone(fixture)
const cli = new URL('../scripts/query-observatory.mjs', import.meta.url)

test('real research seed projects all twelve products with honest unknowns', () => {
  const result = projectCatalog(fresh())
  assert.equal(result.matched_products, 12)
  assert.equal(result.publication_approved, false)
  assert.ok(result.products.every(p => p.overall_quality_score === null && p.verified_revenue_minor === null && p.tested_coverage === 0 && p.scored_coverage === .1))
  assert.equal(result.products.find(p => p.product_id === 'tally').revenue_evidence, 'vendor_reported')
  assert.equal(result.products.find(p => p.product_id === 'bardeen').revenue_evidence, 'unknown')
})
test('private goals, tenant context, retrieval IDs and research notes are excluded', () => {
  const data = fresh(), sentinel = 'FOUNDER-PRIVATE-SECRET'
  data.customer_records = [{ email: sentinel }]
  data.operating_goals[0].definition = sentinel
  data.products[0].priority_reason = sentinel
  data.sources[0].summary = sentinel
  data.sources[0].retrieval_id = sentinel
  data.observations[0].verification_note = sentinel
  data.assessments[0].rationale = sentinel
  assert.ok(!JSON.stringify(projectCatalog(data)).includes(sentinel))
})
test('provider receipts and private financial observations never enter review export', () => {
  const data = fresh()
  data.sources.push({ ...data.sources[0], source_id: 'secret-receipt', source_class: 'first_party_receipt', canonical_url: 'https://billing.example.com/private' })
  data.observations.push({ ...data.observations[0], observation_id: 'private-money', source_id: 'secret-receipt', basis: 'first_party_verified', signal: 'collected_revenue', value_numeric: 90000, unit: 'currency_minor', currency: 'EUR' })
  const out = JSON.stringify(projectCatalog(data))
  assert.ok(!out.includes('secret-receipt') && !out.includes('private-money'))
})
test('layer, model and search intersect and preserve only matching source lineage', () => {
  const result = projectCatalog(fresh(), { layer: 'API and MCP', model: 'Usage', search: 'web content' })
  assert.equal(result.matched_products, 1)
  assert.equal(result.products[0].product_id, 'firecrawl')
  assert.ok(result.products[0].sources.every(s => s.source_id.startsWith('firecrawl')))
  assert.equal(projectCatalog(fresh(), { layer: 'API and MCP', model: 'One-time' }).matched_products, 0)
})
test('archived products are not exported', () => {
  const data = fresh(); data.products[0].review_state = 'archived'
  assert.equal(projectCatalog(data).matched_products, 11)
})
test('duplicate identities and orphaned evidence fail instead of silently merging', () => {
  const duplicate = fresh(); duplicate.products.push(duplicate.products[0]); assert.throws(() => projectCatalog(duplicate))
  const orphan = fresh(); orphan.observations[0].source_id = 'missing'; assert.throws(() => projectCatalog(orphan))
})
test('fractional minor-unit money and ambiguous currency codes are rejected', () => {
  for (const patch of [{ value_numeric: 1.5, unit: 'currency_minor', currency: 'EUR' }, { value_numeric: 1, unit: 'currency_minor', currency: '$' }]) {
    const data = fresh(); Object.assign(data.observations[0], patch); assert.throws(() => projectCatalog(data))
  }
})
test('unknown scores cannot become zero or full evidence coverage', () => {
  const data = fresh(); data.assessments.find(a => a.state === 'unknown').score = 0
  assert.throws(() => projectCatalog(data))
  const privateSource = fresh(); privateSource.assessments.find(a => a.state === 'unknown').source_id = 'private-reference'
  assert.throws(() => projectCatalog(privateSource))
})
test('latest assessment revision wins without double-counting weight', () => {
  const data = fresh(), row = data.assessments[0]
  data.assessments.push({ ...row, assessment_id: 'new-revision', score: 3, assessed_at: '2026-11-01T18:38:04.158613Z' })
  data.as_of = '2026-11-02T00:00:00Z'
  const p = projectCatalog(data).products.find(p => p.product_id === row.product_id)
  assert.equal(p.dimensions.find(d => d.dimension === row.dimension).score, 3)
  assert.equal(p.scored_coverage, .1)
})
test('tied revisions and incomplete rubric weights fail', () => {
  const data = fresh(); data.assessments.push({ ...data.assessments[0], assessment_id: 'tie' }); assert.throws(() => projectCatalog(data))
  const partial = fresh(); partial.assessments.shift(); assert.throws(() => projectCatalog(partial))
})
test('credential URLs and local addresses cannot enter the portable export', () => {
  for (const url of ['http://tally.so/', 'https://user:secret@tally.so/', 'https://127.0.0.1/', 'https://[::1]/', 'https://private.internal/', 'javascript:alert(1)', 'https://tally.so/?token=PRIVATE', 'https://tally.so/#PRIVATE']) {
    const data = fresh(); data.products[0].canonical_url = url; assert.throws(() => projectCatalog(data))
  }
})
test('future observations and impossible calendar dates fail', () => {
  const data = fresh(); data.observations[0].observed_at = '2028-01-01T00:00:00Z'; assert.throws(() => projectCatalog(data))
  const invalid = fresh(); invalid.as_of = '2026-02-30'; assert.throws(() => projectCatalog(invalid))
})
test('CSV protects formula-like text, preserves null blanks and source URLs', () => {
  const data = fresh(); data.products[0].name = '=HYPERLINK("bad")'
  const csv = catalogCsv(projectCatalog(data))
  assert.ok(csv.includes('"\'=HYPERLINK(""bad"")"'))
  assert.ok(csv.includes('"private_review","false"'))
  assert.ok(csv.includes('https://n8n.io/'))
  assert.ok(!csv.includes('undefined') && !csv.includes('[object Object]'))
})
test('CLI JSON and CSV match the same filtered population', () => {
  const path = new URL('../data/observatory/seed-2026-11-01.json', import.meta.url)
  const json = spawnSync(process.execPath, [cli.pathname, path.pathname, '--layer', 'API and MCP'], { encoding: 'utf8' })
  assert.equal(json.status, 0); assert.equal(json.stderr, '')
  const parsed = JSON.parse(json.stdout); assert.equal(parsed.matched_products, 1)
  const csv = spawnSync(process.execPath, [cli.pathname, path.pathname, '--layer', 'API and MCP', '--format', 'csv'], { encoding: 'utf8' })
  assert.equal(csv.status, 0); assert.equal(csv.stdout, catalogCsv(parsed))
})
test('CLI rejects duplicate flags and protects private parse errors', () => {
  const dir = mkdtempSync(join(tmpdir(), 'observatory-'))
  try {
    const path = join(dir, 'private.json'); writeFileSync(path, '{PRIVATE-INPUT-MUST-NOT-LEAK')
    const parse = spawnSync(process.execPath, [cli.pathname, path], { encoding: 'utf8' })
    assert.equal(parse.status, 1); assert.equal(parse.stdout, ''); assert.equal(parse.stderr, '{"error":"invalid_catalog_request"}\n')
    const duplicate = spawnSync(process.execPath, [cli.pathname, path, '--format', 'json', '--format', 'csv'], { encoding: 'utf8' })
    assert.equal(duplicate.status, 1)
    writeFileSync(path, 'x'.repeat(2 * 1024 * 1024 + 1))
    const large = spawnSync(process.execPath, [cli.pathname, path], { encoding: 'utf8' }); assert.equal(large.status, 1)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
