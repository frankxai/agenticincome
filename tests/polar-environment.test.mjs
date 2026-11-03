import test from 'node:test'
import assert from 'node:assert/strict'
import { polarRuntimeConfiguration, validPolarCheckoutUrl } from '../lib/commerce/polar-environment.ts'

const key = 'POLAR_PRODUCT_ID_BLUEPRINT'
const production = { POLAR_ACCESS_TOKEN: 'live-token', POLAR_PRODUCT_ID_BLUEPRINT: 'live-product' }
const sandbox = { POLAR_SERVER: 'sandbox', NODE_ENV: 'test', POLAR_SANDBOX_ACCESS_TOKEN: 'sandbox-token', POLAR_SANDBOX_PRODUCT_ID_BLUEPRINT: 'sandbox-product' }

test('default preserves the existing live endpoint with live-only credentials', () => {
  assert.deepEqual(polarRuntimeConfiguration(production, key), { server: 'production', checkoutEndpoint: 'https://api.polar.sh/v1/checkouts/', accessToken: 'live-token', productId: 'live-product' })
})
test('sandbox is explicit and uses only sandbox credentials', () => {
  assert.deepEqual(polarRuntimeConfiguration({ ...production, ...sandbox }, key), { server: 'sandbox', checkoutEndpoint: 'https://sandbox-api.polar.sh/v1/checkouts/', accessToken: 'sandbox-token', productId: 'sandbox-product' })
  assert.equal(polarRuntimeConfiguration({ ...production, POLAR_SERVER: 'sandbox', NODE_ENV: 'test' }, key), null)
  assert.equal(polarRuntimeConfiguration({ ...sandbox, POLAR_SANDBOX_PRODUCT_ID_BLUEPRINT: '' }, key), null)
})
test('invalid server, incomplete production config, or unmapped key fail closed', () => {
  assert.equal(polarRuntimeConfiguration({ ...production, POLAR_SERVER: 'sandb0x' }, key), null)
  assert.equal(polarRuntimeConfiguration({ POLAR_ACCESS_TOKEN: 'live-token' }, key), null)
  assert.equal(polarRuntimeConfiguration(production, 'POLAR_ACCESS_TOKEN'), null)
})
test('sandbox is rejected on production and unknown deployment environments', () => {
  for (const vercel of ['production', 'staging']) assert.equal(polarRuntimeConfiguration({ ...sandbox, VERCEL_ENV: vercel }, key), null)
  assert.equal(polarRuntimeConfiguration({ ...sandbox, NODE_ENV: 'production' }, key), null)
  assert.ok(polarRuntimeConfiguration({ ...sandbox, NODE_ENV: 'production', VERCEL_ENV: 'preview' }, key))
})
test('sandbox checkout URLs cannot escape their host or use insecure protocols', () => {
  assert.equal(validPolarCheckoutUrl('https://sandbox.polar.sh/checkout/test', 'sandbox'), 'https://sandbox.polar.sh/checkout/test')
  for (const url of ['https://polar.sh/checkout/test', 'https://sandbox.polar.sh.evil.test/x', 'https://evil.test@ sandbox.polar.sh/x', 'http://sandbox.polar.sh/x', 'https://user@sandbox.polar.sh/x']) assert.equal(validPolarCheckoutUrl(url, 'sandbox'), null)
  assert.equal(validPolarCheckoutUrl('https://sandbox.polar.sh/checkout/test', 'production'), null)
})
