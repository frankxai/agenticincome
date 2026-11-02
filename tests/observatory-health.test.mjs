import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { auditObservatory, observatoryDashboard } from '../lib/observatory-health.mjs'
const seed = JSON.parse(readFileSync(new URL('../data/observatory/seed-2026-11-01.json', import.meta.url)))
const fresh = () => structuredClone(seed)
const at = '2026-11-02T12:00:00Z'
test('health counts the real seed without invented commercial success', () => {
  const r = auditObservatory(fresh(), { audit_at: at })
  assert.equal(r.metrics.products, 12)
  assert.equal(r.metrics.sources, 14)
  assert.equal(r.metrics.observations, 25)
  assert.equal(r.metrics.mean_scored_coverage, .1)
  assert.equal(r.metrics.mean_tested_coverage, 0)
  assert.equal(r.metrics.ranking_eligible_products, 0)
  assert.equal(r.metrics.verified_revenue_minor, null)
  assert.equal(r.research_queue.length, 12)
})
test('freshness is reproducible, strict at the boundary and independent of snapshot time', () => {
  const d = fresh(), boundary = new Date(Date.parse(d.as_of) + 30 * 86400000).toISOString()
  assert.equal(auditObservatory(d, { audit_at: boundary }).metrics.stale_sources, 0)
  assert.equal(auditObservatory(d, { audit_at: new Date(Date.parse(boundary) + 1).toISOString() }).metrics.stale_sources, 14)
  assert.throws(() => auditObservatory(d, { audit_at: '2026-10-01T00:00:00Z' }))
  for (const days of [0, -1, .5, 366, '30']) assert.throws(() => auditObservatory(d, { freshness_days: days }))
})
test('filters define the full audit population including deduplicated source counts', () => {
  const r = auditObservatory(fresh(), { filters: { search: 'firecrawl' } })
  assert.equal(r.metrics.products, 1)
  assert.equal(r.metrics.sources, r.products[0].sources.length)
  const empty = auditObservatory(fresh(), { filters: { search: 'no-match-ever' } })
  assert.equal(empty.metrics.products, 0)
  assert.equal(empty.metrics.mean_tested_coverage, null)
})
test('comparable conflicting observations are flagged; different periods stay distinct', () => {
  const d = fresh(), row = d.observations[0]
  Object.assign(row, { value_numeric: 10, unit: 'users', period_start: '2026-10-01', period_end: '2026-10-31' })
  d.observations.push({ ...row, observation_id: 'contradiction', value_numeric: 11 })
  assert.equal(auditObservatory(d).metrics.products_with_conflicts, 1)
  d.observations.at(-1).period_start = '2026-09-01'
  assert.equal(auditObservatory(d).metrics.products_with_conflicts, 0)
})
test('partial, reversed and future reporting periods fail', () => {
  for (const [start, end] of [['2026-02-30', '2026-10-01'], ['2026-10-01', null], ['2026-10-31', '2026-10-01'], ['2026-10-01', '2027-01-01']]) {
    const d = fresh(); Object.assign(d.observations[0], { period_start: start, period_end: end })
    assert.throws(() => auditObservatory(d))
  }
})
test('ranking requires critical tested dimensions and sufficient coverage, then blocks stale evidence', () => {
  const d = fresh(), id = d.products[0].product_id
  for (const a of d.assessments.filter(a => a.product_id === id)) Object.assign(a, { state: 'tested', score: 3, source_id: d.sources[0].source_id })
  assert.equal(auditObservatory(d).products.find(p => p.product_id === id).audit.ranking_eligible, true)
  assert.equal(auditObservatory(d, { audit_at: '2026-12-10T00:00:00Z' }).metrics.ranking_eligible_products, 0)
})
test('private input is excluded from both health and dashboard; markup is escaped and CSP hashes match', () => {
  const d = fresh(), secret = 'PRIVATE-RECEIPT-SENTINEL'
  d.sources[0].retrieval_id = secret; d.operating_goals[0].definition = secret
  d.products[0].name = '<img src=x onerror=alert(1)>'
  const html = observatoryDashboard(d)
  assert.ok(!JSON.stringify(auditObservatory(d)).includes(secret) && !html.includes(secret))
  assert.ok(!html.includes('<img src=x'))
  assert.ok(html.includes('&lt;img'))
  const script = html.match(/<script>(.*?)<\/script>/s)[1]
  assert.ok(html.includes(`sha256-${createHash('sha256').update(script).digest('base64')}`))
  assert.ok(html.includes("default-src 'none'"))
})
test('CLI serves HTML and health and rejects ignored audit options', () => {
  const cli = new URL('../scripts/query-observatory.mjs', import.meta.url)
  const path = new URL('../data/observatory/seed-2026-11-01.json', import.meta.url).pathname
  const run = (...args) => spawnSync(process.execPath, [cli.pathname, path, ...args], { encoding: 'utf8' })
  const r = run('--format', 'health', '--audit-at', at); assert.equal(r.status, 0); assert.equal(JSON.parse(r.stdout).metrics.products, 12)
  assert.ok(run('--format', 'html').stdout.startsWith('<!doctype html>'))
  const bad = run('--format', 'json', '--audit-at', at)
  assert.equal(bad.status, 1); assert.equal(bad.stderr, '{"error":"invalid_catalog_request"}\n')
})
