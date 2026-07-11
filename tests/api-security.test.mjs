import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  ANALYTICS_MAX_BODY_BYTES,
  ANALYTICS_RATE_LIMIT,
  consumeAnalyticsRateLimit,
  isSameOriginRequest,
  readBoundedJson,
  resetAnalyticsRateLimitForTests,
} from '../lib/api-security.ts'
import { normalizeAnalyticsEvent } from '../lib/analytics.ts'
import { createSubscribeRequestId } from '../lib/subscribe-security.ts'

test('rejects oversized analytics payloads', async () => {
  const request = new Request('https://agenticincome.com/api/analytics', {
    method: 'POST',
    headers: { 'content-length': String(ANALYTICS_MAX_BODY_BYTES + 1) },
    body: '{}',
  })
  assert.deepEqual(await readBoundedJson(request), { ok: false, error: 'payload_too_large' })
})

test('allows only the production origin', () => {
  const sameOrigin = new Request('https://agenticincome.com/api/analytics', {
    headers: { origin: 'https://agenticincome.com' },
  })
  const crossOrigin = new Request('https://agenticincome.com/api/analytics', {
    headers: { origin: 'https://attacker.example' },
  })
  const missingOrigin = new Request('https://agenticincome.com/api/analytics')
  assert.equal(isSameOriginRequest(sameOrigin), true)
  assert.equal(isSameOriginRequest(crossOrigin), false)
  assert.equal(isSameOriginRequest(missingOrigin), false)
})

test('rejects unknown events and unapproved properties', () => {
  assert.equal(normalizeAnalyticsEvent({ event: 'arbitrary_event' }), null)
  assert.equal(normalizeAnalyticsEvent({ event: 'offer_view', offer: 'starter', email: 'private@example.com' }), null)
  assert.equal(normalizeAnalyticsEvent({ event: 'offer_view', offer: 'x'.repeat(97) }), null)
  assert.deepEqual(normalizeAnalyticsEvent({ event: 'offer_view', offer: 'starter' }), {
    event: 'offer_view',
    offer: 'starter',
  })
})

test('rate limit closes after the bounded request allowance', () => {
  resetAnalyticsRateLimitForTests()
  for (let index = 0; index < ANALYTICS_RATE_LIMIT; index += 1) {
    assert.equal(consumeAnalyticsRateLimit('client', 1_000).allowed, true)
  }
  assert.equal(consumeAnalyticsRateLimit('client', 1_000).allowed, false)
})

test('subscribe request IDs are random UUIDs and do not expose email', async () => {
  const first = createSubscribeRequestId()
  const second = createSubscribeRequestId()
  const uuid = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/
  assert.match(first, uuid)
  assert.match(second, uuid)
  assert.notEqual(first, second)

  const routeSource = await readFile(new URL('../app/api/subscribe/route.ts', import.meta.url), 'utf8')
  assert.doesNotMatch(routeSource, /createHash|day.*source.*email|Email:\s*\$\{email\}/)
  assert.match(routeSource, /'Idempotency-Key': requestId/)
  assert.match(routeSource, /isSameOriginRequest\(req\)/)
  assert.match(routeSource, /hasJsonContentType\(req\)/)
  assert.match(routeSource, /readBoundedJson\(req\)/)
  assert.match(routeSource, /consumeAnalyticsRateLimit\(`subscribe:\$\{clientKey\}`\)/)
})
