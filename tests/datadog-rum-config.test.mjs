import assert from 'node:assert/strict'
import test from 'node:test'
import {
  DATADOG_RUM_INTAKE_SOURCES,
  DATADOG_RUM_SCRIPT_ORIGIN,
  DATADOG_RUM_SITE,
  allowsRumMeasurement,
  datadogRumConfig,
  datadogRumCspSources,
  isSensitiveRumPath,
  redactRumEvent,
  redactRumUrl,
  scrubCredentialPaths,
} from '../lib/datadog-rum-config.ts'

test('datadogRumConfig stays off by default when required env vars are absent', () => {
  assert.equal(datadogRumConfig({}), null)
  assert.equal(datadogRumConfig({ NEXT_PUBLIC_DD_RUM_APPLICATION_ID: 'app-1' }), null)
  assert.equal(datadogRumConfig({ NEXT_PUBLIC_DD_RUM_CLIENT_TOKEN: 'pub-1' }), null)
  assert.equal(
    datadogRumConfig({ NEXT_PUBLIC_DD_RUM_APPLICATION_ID: '  ', NEXT_PUBLIC_DD_RUM_CLIENT_TOKEN: 'pub-1' }),
    null,
  )
})

test('datadogRumConfig produces privacy-hardened EU defaults and clamps sample rate', () => {
  const cfg = datadogRumConfig({
    NEXT_PUBLIC_DD_RUM_APPLICATION_ID: 'app-123',
    NEXT_PUBLIC_DD_RUM_CLIENT_TOKEN: 'pub-456',
    NEXT_PUBLIC_DD_RUM_SAMPLE_RATE: '250',
    NEXT_PUBLIC_VERCEL_ENV: 'preview',
  })
  assert.deepEqual(cfg, {
    applicationId: 'app-123',
    clientToken: 'pub-456',
    site: DATADOG_RUM_SITE,
    service: 'agenticincome-ai',
    env: 'preview',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    defaultPrivacyLevel: 'mask',
    trackUserInteractions: false,
    trackResources: false,
  })
  assert.equal(
    datadogRumConfig({
      NEXT_PUBLIC_DD_RUM_APPLICATION_ID: 'app-123',
      NEXT_PUBLIC_DD_RUM_CLIENT_TOKEN: 'pub-456',
      NEXT_PUBLIC_DD_RUM_SAMPLE_RATE: '-10',
    })?.sessionSampleRate,
    0,
  )
  assert.equal(
    datadogRumConfig({
      NEXT_PUBLIC_DD_RUM_APPLICATION_ID: 'app-123',
      NEXT_PUBLIC_DD_RUM_CLIENT_TOKEN: 'pub-456',
      NEXT_PUBLIC_DD_RUM_SAMPLE_RATE: 'not-a-number',
    })?.sessionSampleRate,
    10,
  )
})

test('allowsRumMeasurement respects DNT and Global Privacy Control', () => {
  assert.equal(allowsRumMeasurement(null, false), true)
  assert.equal(allowsRumMeasurement('0', false), true)
  assert.equal(allowsRumMeasurement('1', false), false)
  assert.equal(allowsRumMeasurement('yes', false), false)
  assert.equal(allowsRumMeasurement(null, true), false)
})

test('redactRumEvent strips query/hash/referrer and redacts sensitive paths', () => {
  const view = {
    type: 'view',
    view: {
      url: 'https://www.agenticincome.ai/offers?email=test@example.com#section',
      referrer: 'https://private.example/ref',
    },
    resource: { url: 'https://www.agenticincome.ai/api/offers?token=abc' },
  }
  assert.equal(redactRumEvent(view), true)
  assert.equal(view.view.url, 'https://www.agenticincome.ai/offers')
  assert.equal(view.view.referrer, '')
  assert.equal(view.resource.url, 'https://www.agenticincome.ai/api/offers')

  assert.equal(isSensitiveRumPath('/checkout/cs_test_123'), true)
  assert.equal(redactRumUrl('https://www.agenticincome.ai/checkout/cs_test_123?sig=1'), 'https://www.agenticincome.ai/checkout/:token')
  assert.equal(scrubCredentialPaths('error on /api/auth/tok_999'), 'error on /api/auth/:token')
  assert.equal(redactRumEvent({ type: 'error', view: { url: 'https://www.agenticincome.ai/checkout/cs_test_123' } }), false)
})

test('redactRumEvent drops exact OAuth/checkout routes, percent-encoded paths, and query secrets in errors', () => {
  assert.equal(isSensitiveRumPath('/checkout'), true)
  assert.equal(isSensitiveRumPath('/auth/callback'), true)
  assert.equal(isSensitiveRumPath('/%63heckout/cs_live_123'), true)
  assert.equal(isSensitiveRumPath('/offers'), false)

  const oauthError = {
    type: 'error',
    view: { url: 'https://www.agenticincome.ai/auth/callback?code=SECRET_CODE' },
    error: { message: 'Failed at https://www.agenticincome.ai/auth/callback?code=SECRET_CODE' },
  }
  assert.equal(redactRumEvent(oauthError), false)

  const standardError = {
    type: 'error',
    view: { url: 'https://www.agenticincome.ai/offers' },
    error: {
      message: 'Redirect failed at https://www.agenticincome.ai/checkout?session_id=cs_live_999',
      stack: 'at go (https://www.agenticincome.ai/api/offers?token=SECRET_TOK&page=1)',
    },
  }
  assert.equal(redactRumEvent(standardError), true)
  assert.equal(standardError.error.message, 'Redirect failed at https://www.agenticincome.ai/checkout')
  assert.equal(standardError.error.stack, 'at go (https://www.agenticincome.ai/api/offers?token=:redacted&page=1)')
})

test('datadogRumCspSources stays empty when unset and returns EU script/intake origins when set', () => {
  assert.deepEqual(datadogRumCspSources({}), { scriptSrc: [], connectSrc: [] })
  assert.deepEqual(
    datadogRumCspSources({
      NEXT_PUBLIC_DD_RUM_APPLICATION_ID: 'app-1',
      NEXT_PUBLIC_DD_RUM_CLIENT_TOKEN: 'pub-1',
    }),
    {
      scriptSrc: [DATADOG_RUM_SCRIPT_ORIGIN],
      connectSrc: DATADOG_RUM_INTAKE_SOURCES,
    },
  )
})
