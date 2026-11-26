import assert from 'node:assert/strict'
import { after, beforeEach, test } from 'node:test'
import './support/alias.mjs'

// Availability is decided at call time from env, so the route can be imported once.
const { POST } = await import('../app/api/mcp/[transport]/route.ts')

const ENV_KEYS = [
  'CHECKOUT_RELEASE',
  'POLAR_ACCESS_TOKEN',
  'POLAR_SERVER',
  'POLAR_SUCCESS_URL',
  'POLAR_PRODUCT_ID_BLUEPRINT',
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

// mcp-handler answers over SSE and keeps the stream open; read the first data frame only.
async function rpc(method, params, id) {
  const res = await POST(new Request('http://localhost/api/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  }))
  const type = res.headers.get('content-type') ?? ''
  if (!type.includes('text/event-stream')) return res.json()
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffered = ''
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) throw new Error(`stream ended without a data frame: ${buffered}`)
      buffered += decoder.decode(value, { stream: true })
      const frame = buffered.split('\n').find((line) => line.startsWith('data:'))
      if (frame) return JSON.parse(frame.slice(5))
    }
  } finally {
    await reader.cancel()
  }
}

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
