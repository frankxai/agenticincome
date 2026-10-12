import assert from 'node:assert/strict'
import test from 'node:test'
import catalog from '../products/catalog.json' with { type: 'json' }
import { offers, getOffer } from '../lib/offers.ts'

test('Blueprint package is catalog-gated and fails closed prior to Polar activation', () => {
  const product = catalog.products.find((p) => p.id === 'blueprint')
  assert.ok(product, 'Blueprint product exists in catalog')
  assert.equal(product.id, 'blueprint')
  assert.equal(product.price_cents, 6700)
  assert.match(product.status, /^built — checkout gated/i)

  const isPurchasable = product.status.trim().toLowerCase().startsWith('for sale')
  assert.equal(isPurchasable, false, 'Blueprint status must not start with for sale')
})

test('Blueprint offer metadata matches delivery and buyer journey contracts', () => {
  const offer = getOffer('blueprint')
  assert.ok(offer, 'Blueprint offer exists in offers list')
  assert.equal(offer.slug, 'blueprint')
  assert.equal(offer.deliveryPath, '/delivery/blueprint')
  assert.equal(offer.price, '$67')
  assert.equal(offer.checkout.provider, 'external')
  assert.equal(offer.checkout.fallback, 'request-access')
})
