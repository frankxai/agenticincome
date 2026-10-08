import assert from 'node:assert/strict'
import test from 'node:test'
import { checkoutUrl, getOffer } from '../lib/offers.ts'
import { findCatalogProduct, isCheckoutLive } from '../lib/polar.ts'
import { getLaunchReadiness, isVerifiedActivationGate } from '../lib/readiness.ts'

function withConfiguration(run) {
  const configured = {
    AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL: 'https://example.invalid/blueprint',
    AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL: 'https://example.invalid/private-intel',
    POLAR_ACCESS_TOKEN: 'test-only-not-a-token',
    POLAR_PRODUCT_ID_BLUEPRINT: 'test-only-blueprint-id',
    POLAR_PRODUCT_ID_PRIVATE_INTEL: 'test-only-private-intel-id',
    SUBSCRIBE_WEBHOOK_URL: 'https://example.invalid/capture',
    ANALYTICS_WEBHOOK_URL: 'https://example.invalid/analytics',
  }
  const previous = Object.fromEntries(Object.keys(configured).map((key) => [key, process.env[key]]))
  Object.assign(process.env, configured)
  try { run() } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
}

test('configured checkout URLs and Polar credentials cannot bypass the paid catalog gate', () => {
  withConfiguration(() => {
    for (const id of ['blueprint', 'private-intel']) {
      const offer = getOffer(id)
      assert.ok(offer)
      assert.equal(checkoutUrl(offer), null)
      assert.equal(isCheckoutLive(id), false)
    }
    const readiness = getLaunchReadiness()
    assert.equal(readiness.items.find((item) => item.id === 'blueprint_checkout').configured, false)
    assert.equal(readiness.items.find((item) => item.id === 'private_intel_checkout').configured, false)
    assert.equal(readiness.fullLaunchReady, false)
  })
})

test('only a mapped product admitted by the catalog can expose a hosted checkout URL', () => {
  withConfiguration(() => {
    const offer = getOffer('blueprint')
    const product = findCatalogProduct('blueprint')
    assert.ok(offer && product)
    const previousStatus = product.status
    try {
      product.status = 'for sale — test-only fixture'
      assert.equal(checkoutUrl(offer), 'https://example.invalid/blueprint')
      product.status = 'unknown readiness'
      assert.equal(checkoutUrl(offer), null)
      product.status = 'for sale — test-only fixture'
      assert.equal(checkoutUrl({ ...offer, slug: 'unknown-offer' }), null)
      assert.equal(checkoutUrl({ ...offer, slug: 'agent-team-pro' }), null)
      assert.equal(checkoutUrl({ ...offer, checkout: { ...offer.checkout, envKey: undefined } }), null)
      process.env.AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL = 'https://user:password@example.invalid/checkout'
      assert.equal(checkoutUrl(offer), null)
    } finally { product.status = previousStatus }
  })
})

test('free starter delivery and scope-first implementation never become paid checkout links', () => {
  withConfiguration(() => {
    const starter = getOffer('starter-kit')
    const service = getOffer('implementation-sprint')
    assert.ok(starter && service)
    assert.equal(starter.checkout.fallback, 'delivery')
    assert.equal(starter.deliveryPath, '/delivery/starter-kit')
    assert.equal(service.accessMode, 'scope-first')
    assert.equal(service.checkout.fallback, 'request-access')
    assert.equal(checkoutUrl({ ...starter, checkout: { ...starter.checkout, envKey: 'AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL' } }), null)
    assert.equal(checkoutUrl({ ...service, checkout: { ...service.checkout, envKey: 'AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL' } }), null)
  })
})

test('runtime configuration cannot substitute for verified commercial evidence', () => {
  withConfiguration(() => {
    const products = ['blueprint', 'private-intel'].map((id) => findCatalogProduct(id))
    assert.ok(products.every(Boolean))
    const previous = products.map((product) => product.status)
    try {
      for (const product of products) product.status = 'for sale — test-only fixture'
      const readiness = getLaunchReadiness()
      assert.equal(readiness.items.find((item) => item.id === 'blueprint_checkout').configured, true)
      assert.equal(readiness.items.find((item) => item.id === 'private_intel_checkout').configured, true)
      assert.equal(readiness.items.find((item) => item.id === 'owned_capture').configured, true)
      assert.equal(readiness.items.find((item) => item.id === 'analytics_forwarding').configured, true)
      assert.equal(readiness.evidenceOfferTotal, 2)
      assert.equal(readiness.evidenceGateTotal, 18)
      assert.equal(readiness.verifiedEvidenceGates, 0)
      for (const offerId of ['blueprint', 'private-intel']) {
        assert.equal(readiness.items.filter((item) => item.id.startsWith(`activation_${offerId}_`)).length, 9)
      }
      assert.ok(readiness.items.filter((item) => item.requirement === 'evidence').every((item) => !item.configured))
      assert.equal(readiness.fullLaunchReady, false)
    } finally {
      products.forEach((product, index) => { product.status = previous[index] })
    }
  })
})

test('an activation gate requires verified state and public-safe evidence', () => {
  assert.equal(isVerifiedActivationGate({ state: 'verified', evidence: [] }), false)
  assert.equal(isVerifiedActivationGate({ state: 'unverified', evidence: ['https://example.org/receipt'] }), false)
  assert.equal(isVerifiedActivationGate({ state: 'verified', evidence: ['https://example.org/receipt'] }), true)
  assert.equal(isVerifiedActivationGate({ state: 'verified', evidence: ['https://example.org/receipt?customer=private'] }), false)
  assert.equal(isVerifiedActivationGate({ state: 'verified', evidence: ['https://user:password@example.org/receipt'] }), false)
})

