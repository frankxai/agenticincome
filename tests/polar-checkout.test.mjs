import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const catalogPath = path.join(process.cwd(), 'products', 'catalog.json')
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'))

const PURCHASABLE_STATUS_PREFIX = 'for sale'

function catalogRefusal(product) {
  if (product.price_cents === 0) return 'free_product'
  if (!product.status.trim().toLowerCase().startsWith(PURCHASABLE_STATUS_PREFIX)) {
    return 'checkout_gated'
  }
  return null
}

test('catalog contains all expected products', () => {
  const ids = catalog.products.map((p) => p.id)
  assert.ok(ids.includes('starter-kit'))
  assert.ok(ids.includes('blueprint'))
  assert.ok(ids.includes('private-intel'))
  assert.ok(ids.includes('agent-team-pro'))
})

// Waitlist-first: no product is sold before it holds a PRODUCT-RELEASE-GATE PASS. Flip this
// assertion only in the same change that links the gate receipt.
test('blueprint stays gated until it passes the release gate', () => {
  const blueprint = catalog.products.find((p) => p.id === 'blueprint')
  assert.ok(blueprint)
  assert.equal(blueprint.price_cents, 6700)
  assert.equal(catalogRefusal(blueprint), 'checkout_gated')
})

test('starter-kit is free and refused for sale', () => {
  const starter = catalog.products.find((p) => p.id === 'starter-kit')
  assert.ok(starter)
  assert.equal(catalogRefusal(starter), 'free_product')
})

test('gated products remain gated', () => {
  const privateIntel = catalog.products.find((p) => p.id === 'private-intel')
  assert.ok(privateIntel)
  assert.equal(catalogRefusal(privateIntel), 'checkout_gated')
})
