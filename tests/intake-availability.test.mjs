import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'
import './support/alias.mjs'
import { getLaunchReadiness } from '../lib/readiness.ts'

const { GET, POST } = await import('../app/api/subscribe/route.ts')
const keys = ['SUBSCRIBE_WEBHOOK_URL', 'ACCESS_REQUEST_EMAIL', 'ANALYTICS_WEBHOOK_URL']
const prior = Object.fromEntries(keys.map((key) => [key, process.env[key]]))
const fetchOriginal = globalThis.fetch

beforeEach(() => {
  for (const key of keys) delete process.env[key]
  globalThis.fetch = () => assert.fail('unexpected outbound request')
})
afterEach(() => {
  globalThis.fetch = fetchOriginal
  for (const key of keys) {
    if (prior[key] === undefined) delete process.env[key]
    else process.env[key] = prior[key]
  }
})

function request(fields = {}) {
  return new Request('https://example.test/api/subscribe', {
    method: 'POST',
    headers: { origin: 'https://example.test', 'x-forwarded-for': '192.0.2.9', 'content-type': 'application/json' },
    body: JSON.stringify({ source: 'offer-blueprint', ...fields }),
  })
}

test('closed intake returns the same state to the form and readiness and issues no reference', async () => {
  const state = GET()
  assert.equal(state.headers.get('cache-control'), 'no-store')
  assert.deepEqual(await state.json(), { mode: 'unwired' })
  assert.equal(getLaunchReadiness().captureMode, 'unwired')
  const response = await POST(request({ email: 'reader@example.test' }))
  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { ok: false, mode: 'unwired', error: 'intake_closed' })
})

test('invalid webhook falls back to an email draft without asking for the visitor address', async () => {
  process.env.SUBSCRIBE_WEBHOOK_URL = 'http://example.test/insecure'
  process.env.ACCESS_REQUEST_EMAIL = 'owner@example.test'
  assert.deepEqual(await GET().json(), { mode: 'manual_email' })
  assert.equal(getLaunchReadiness().captureMode, 'manual_email')
  const response = await POST(request())
  assert.equal(response.status, 202)
  const body = await response.json()
  assert.equal(body.mode, 'manual_email')
  const draft = new URL(body.mailto)
  assert.equal(draft.protocol, 'mailto:')
  assert.equal(draft.pathname, 'owner@example.test')
  assert.ok(draft.searchParams.get('body').includes(body.requestId))
})

test('webhook takes precedence and confirms a reference only after successful delivery', async () => {
  process.env.SUBSCRIBE_WEBHOOK_URL = 'https://example.test/owned-endpoint'
  process.env.ACCESS_REQUEST_EMAIL = 'owner@example.test'
  assert.deepEqual(await GET().json(), { mode: 'webhook' })
  assert.equal(getLaunchReadiness().captureMode, 'webhook')
  assert.equal((await POST(request())).status, 400)
  let sent
  globalThis.fetch = async (url, options) => {
    assert.equal(url, process.env.SUBSCRIBE_WEBHOOK_URL)
    sent = JSON.parse(options.body)
    assert.equal(options.headers['Idempotency-Key'], sent.requestId)
    assert.equal(options.redirect, 'error')
    return new Response(null, { status: 204 })
  }
  const response = await POST(request({ email: 'Reader@Example.Test' }))
  assert.equal(response.status, 200)
  assert.equal(sent.email, 'reader@example.test')
  assert.deepEqual(await response.json(), { ok: true, mode: 'webhook', requestId: sent.requestId })
})

test('intake rechecks the destination on submit and does not issue a receipt on failure', async () => {
  process.env.SUBSCRIBE_WEBHOOK_URL = 'https://example.test/owned-endpoint'
  assert.deepEqual(await GET().json(), { mode: 'webhook' })
  globalThis.fetch = async () => { throw new Error('network unavailable') }
  const failed = await POST(request({ email: 'reader@example.test' }))
  assert.equal(failed.status, 502)
  assert.deepEqual(await failed.json(), { ok: false, error: 'subscribe_failed' })
  delete process.env.SUBSCRIBE_WEBHOOK_URL
  assert.equal((await POST(request({ email: 'reader@example.test' }))).status, 503)
})
