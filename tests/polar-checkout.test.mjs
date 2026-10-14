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

test('blueprint catalog status is flipped to for sale', () => {
  const blueprint = catalog.products.find((p) => p.id === 'blueprint')
  assert.ok(blueprint)
  assert.equal(blueprint.price_cents, 6700)
  assert.ok(blueprint.status.toLowerCase().startsWith('for sale'))
  assert.equal(catalogRefusal(blueprint), null)
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
