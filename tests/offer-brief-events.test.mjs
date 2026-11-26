import './support/alias.mjs'
import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeAnalyticsEvent } from '../lib/analytics.ts'

test('offer brief telemetry accepts only the workflow path and time', () => {
  for (const stage of ['generated', 'exported', 'error']) {
    const event = { event: `offer_brief_${stage}`, path: '/workbench/offer-brief', ts: '2026-11-19T17:00:00Z' }
    assert.deepEqual(normalizeAnalyticsEvent(event), event)
    assert.equal(normalizeAnalyticsEvent({ ...event, source: 'a customer note' }), null)
    assert.equal(normalizeAnalyticsEvent({ ...event, path: '/workbench/offer-brief?account=private' }), null)
  }
})

test('a locally observed funnel event records no payload or source identifiers', async (t) => {
  const { POST } = await import('../app/api/analytics/route.ts')
  const info = t.mock.method(console, 'info', () => {})
  const prior = process.env.ANALYTICS_WEBHOOK_URL
  delete process.env.ANALYTICS_WEBHOOK_URL
  t.after(() => {
    if (prior === undefined) delete process.env.ANALYTICS_WEBHOOK_URL
    else process.env.ANALYTICS_WEBHOOK_URL = prior
  })
  const response = await POST(new Request('http://localhost/api/analytics', {
    method: 'POST',
    headers: { origin: 'http://localhost', 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
    body: JSON.stringify({ event: 'offer_brief_exported', path: '/workbench/offer-brief' }),
  }))
  assert.equal(response.status, 202)
  assert.deepEqual(await response.json(), { ok: true, mode: 'runtime_log' })
  assert.deepEqual(JSON.parse(info.mock.calls[0].arguments[0]), { stream: 'offer_brief_funnel', event: 'offer_brief_exported' })
})
