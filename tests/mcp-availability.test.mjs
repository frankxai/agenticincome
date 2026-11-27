import assert from 'node:assert/strict'
import { after, beforeEach, test } from 'node:test'
import { rpc } from './support/mcp-rpc.mjs'

const ENV_KEYS = [
  'CHECKOUT_RELEASE',
  'POLAR_ACCESS_TOKEN',
  'POLAR_SERVER',
  'POLAR_SUCCESS_URL',
  'POLAR_PRODUCT_ID_BLUEPRINT',
  'AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL',
]

const saved = {}
for (const key of ENV_KEYS) saved[key] = process.env[key]

beforeEach(() => {
  for (const key of ENV_KEYS) delete process.env[key]
})

after(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key]
    else process.env[key] = saved[key]
  }
})

async function listProducts() {
  await rpc('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'availability-test', version: '1.0.0' },
  }, 1)
  const reply = await rpc('tools/call', { name: 'list_products', arguments: {} }, 2)
  return JSON.parse(reply.result.content[0].text).products
}

function configureBlueprint() {
  process.env.POLAR_ACCESS_TOKEN = 'polar_test_token'
  process.env.POLAR_PRODUCT_ID_BLUEPRINT = 'prod_test_blueprint'
  process.env.POLAR_SUCCESS_URL = 'https://www.agenticincome.ai/checkout/success'
}

test('configured Polar credentials without CHECKOUT_RELEASE report purchasable: false', async () => {
  configureBlueprint()
  const products = await listProducts()
  const blueprint = products.find((product) => product.id === 'blueprint')
  const starter = products.find((product) => product.id === 'starter-kit')
  assert.equal(blueprint.status, 'Checkout unavailable')
  assert.match(blueprint.catalogStatus, /^for sale/i)
  assert.equal(starter.purchasable, false)
  assert.match(starter.status, /^free/i)
  assert.equal(new URL(starter.url).pathname, '/delivery/starter-kit')
  for (const product of products.filter(({ id }) => id !== 'starter-kit')) {
    assert.equal(new URL(product.url).pathname, `/offers/${product.id}`)
  }
  assert.equal(blueprint.purchasable, false, 'credentials alone must never open checkout')
})

test('a matching CHECKOUT_RELEASE opens purchasable for the configured product', async () => {
  configureBlueprint()
  process.env.POLAR_SERVER = 'production'
  process.env.CHECKOUT_RELEASE = 'live'
  const blueprint = (await listProducts()).find((product) => product.id === 'blueprint')
  assert.equal(blueprint.purchasable, true)
  assert.equal(blueprint.status, blueprint.catalogStatus)
  assert.match(blueprint.status, /^for sale/i)
})

test('the MCP listing matches the buyer route when only static checkout is configured', async () => {
  process.env.AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL = 'https://buy.polar.sh/polar_c_test123'
  let blueprint = (await listProducts()).find((product) => product.id === 'blueprint')
  assert.equal(blueprint.purchasable, false)
  process.env.CHECKOUT_RELEASE = 'live'
  blueprint = (await listProducts()).find((product) => product.id === 'blueprint')
  assert.equal(blueprint.purchasable, true)
  assert.equal(new URL(blueprint.url).pathname, '/offers/blueprint')
})
