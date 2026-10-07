import assert from 'node:assert/strict'
import test from 'node:test'
import { checkoutUrl, getOffer } from '../lib/offers.ts'
import { findCatalogProduct, isCheckoutLive } from '../lib/polar.ts'
import { getLaunchReadiness } from '../lib/readiness.ts'

function withConfiguration(run) {
  const configured = {
    AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL: 'https://example.invalid/blueprint',
    AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL: 'https://example.invalid/private-intel',
    POLAR_ACCESS_TOKEN: 'test-only-not-a-token',
    POLAR_PRODUCT_ID_BLUEPRINT: 'test-only-blueprint-id',
    POLAR_PRODUCT_ID_PRIVATE_INTEL: 'test-only-private-intel-id',
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
