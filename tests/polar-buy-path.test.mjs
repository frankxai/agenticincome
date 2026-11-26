import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, test } from 'node:test'
import './support/alias.mjs'

import catalog from '../products/catalog.json' with { type: 'json' }
import {
  catalogRefusal,
  checkoutReadiness,
  createCheckoutSession,
  isCheckoutLive,
  pricedCatalogProducts,
  successUrl,
  verifyCheckout,
} from '../lib/polar.ts'
import { checkoutUrl, getOffer, offers } from '../lib/offers.ts'
import { getLaunchReadiness } from '../lib/readiness.ts'

const { GET, POST } = await import('../app/api/checkout/route.ts')

// End-to-end buy path with Polar mocked at the fetch boundary: offer page ->
// POST /api/checkout -> Polar session -> /checkout/success verification.
// No request ever leaves the process.

const ENV_KEYS = [
  'CHECKOUT_RELEASE',
  'POLAR_ACCESS_TOKEN',
  'POLAR_SERVER',
  'POLAR_SUCCESS_URL',
  'POLAR_PRODUCT_ID_BLUEPRINT',
  'POLAR_PRODUCT_ID_PRIVATE_INTEL',
  'POLAR_PRODUCT_ID_AGENT_TEAM_PRO',
  'POLAR_PRODUCT_ID_CLAIMS_GUARD_PACK',
  'POLAR_PRODUCT_ID_ABOS_PACK_BUNDLE',
  'POLAR_PRODUCT_ID_VIBE_OS_PACK',
  'AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL',
  'AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL',
  'AGENTIC_INCOME_AGENT_TEAM_PRO_CHECKOUT_URL',
  'ANALYTICS_WEBHOOK_URL',
  'SUBSCRIBE_WEBHOOK_URL',
  'ACCESS_REQUEST_EMAIL',
]

const BLUEPRINT_POLAR_ID = 'prod_test_blueprint'
const CHECKOUT_ID = '3f1c2a9e-6b7d-4e8f-9a0b-1c2d3e4f5a6b'
const POLAR_CHECKOUT_URL = 'https://buy.polar.sh/polar_c_test123'

const savedEnv = {}
const realFetch = globalThis.fetch
let calls = []
let polarReply = () => new Response('{}', { status: 500 })

beforeEach(() => {
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key]
    delete process.env[key]
  }
  calls = []
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init })
    return polarReply(String(url), init)
  }
})

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key]
    else process.env[key] = savedEnv[key]
  }
  globalThis.fetch = realFetch
})

// Credentials only. Nothing here approves a release.
function credentialsOnly() {
  process.env.POLAR_ACCESS_TOKEN = 'polar_oat_test_not_a_real_token'
  process.env.POLAR_PRODUCT_ID_BLUEPRINT = BLUEPRINT_POLAR_ID
  process.env.POLAR_SUCCESS_URL = 'https://agenticincome.ai'
}

// Credentials plus the explicit live approval.
function configureBlueprint() {
  credentialsOnly()
  process.env.CHECKOUT_RELEASE = 'live'
}

function configureEverything() {
  configureBlueprint()
  for (const key of ENV_KEYS.filter((k) => k.startsWith('POLAR_PRODUCT_ID_'))) {
    process.env[key] = `prod_test_${key.toLowerCase()}`
  }
  process.env.AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL = 'https://buy.polar.sh/static-private-intel'
  process.env.AGENTIC_INCOME_AGENT_TEAM_PRO_CHECKOUT_URL = 'https://buy.polar.sh/static-agent-team-pro'
}

let ipCounter = 0
function postCheckout(productId) {
  ipCounter += 1
  return POST(
    new Request('https://agenticincome.ai/api/checkout', {
      method: 'POST',
      headers: {
        origin: 'https://agenticincome.ai',
        'content-type': 'application/json',
        'x-forwarded-for': `203.0.113.${ipCounter % 250}`,
      },
      body: JSON.stringify({ productId }),
    }),
  )
}

// --- every priced SKU has a product page and a delivery desk ---------------

test('every priced catalog SKU has an offer page whose price matches the catalog', () => {
  const priced = pricedCatalogProducts()
  assert.equal(priced.length, catalog.products.filter((p) => p.price_cents > 0).length)
  for (const product of priced) {
    const offer = getOffer(product.id)
    assert.ok(offer, `${product.id} needs an offer entry in lib/offers.ts`)
    const dollars = `$${product.price_cents / 100}`
    const expected = product.interval === 'month' ? `${dollars}/mo` : dollars
    assert.equal(offer.price, expected, `${product.id} price must match products/catalog.json`)
    // A SKU the catalog still gates may point its handoff at its own waitlist;
    // once for sale, the offer and the catalog must agree on the delivery desk.
    const allowed = catalogRefusal(product)
      ? [product.delivery.path, `/offers/${product.id}#request-access`]
      : [product.delivery.path]
    assert.ok(allowed.includes(offer.deliveryPath), `${product.id} delivery path: ${offer.deliveryPath}`)
    assert.equal(offer.checkout.fallback, 'request-access')
    assert.ok(offer.checkout.buyLabel, `${product.id} needs a buyLabel for when checkout is live`)
  }
})

test('offer copy for priced SKUs makes no income or outcome promises', () => {
  // Promise phrasing, not the bare word: "rather than guaranteed outcomes" is a disclaimer.
  const banned = /(?<!than )guaranteed? (income|earnings|returns|results|revenue)|passive income|autopilot|make \$|earn \$|get rich|effortless/i
  for (const product of pricedCatalogProducts()) {
    const offer = getOffer(product.id)
    assert.doesNotMatch(JSON.stringify(offer), banned, product.id)
  }
})

// --- default state: nothing configured, every page degrades to a waitlist ---

test('with no Polar env, every priced SKU refuses honestly and nothing calls Polar', async () => {
  for (const product of pricedCatalogProducts()) {
    assert.equal(isCheckoutLive(product.id), false, product.id)
    const response = await postCheckout(product.id)
    assert.equal(response.status, 503, product.id)
    const body = await response.json()
    assert.equal(body.ok, false)
    assert.match(body.reason, /^checkout_(gated|unconfigured)$/)
  }
  assert.equal(calls.length, 0)
})

test('checkoutReadiness names the exact missing env vars for a for-sale SKU', () => {
  assert.deepEqual(checkoutReadiness('blueprint'), {
    productId: 'blueprint',
    state: 'checkout_unconfigured',
    missingEnv: ['POLAR_ACCESS_TOKEN', 'POLAR_PRODUCT_ID_BLUEPRINT', 'POLAR_SUCCESS_URL', 'CHECKOUT_RELEASE'],
  })
  // A catalog-gated SKU is blocked by the catalog, not by env.
  assert.deepEqual(checkoutReadiness('private-intel').missingEnv, [])
  assert.equal(checkoutReadiness('private-intel').state, 'checkout_gated')
  assert.equal(checkoutReadiness('starter-kit').state, 'free_product')
})

test('GET /api/checkout sends an unconfigured SKU to its waitlist section', async () => {
  const response = await GET(new Request('https://agenticincome.ai/api/checkout?offer=blueprint&utm_source=test'))
  assert.equal(response.status, 302)
  const location = new URL(response.headers.get('location'))
  assert.equal(location.pathname, '/offers/blueprint')
  assert.equal(location.hash, '#request-access')
  assert.equal(location.searchParams.get('utm_source'), 'test')
})

// --- release gate: credentials alone never open checkout ------------------

test('production credentials without CHECKOUT_RELEASE refuse on both paths', async () => {
  credentialsOnly()
  process.env.AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL = 'https://buy.polar.sh/static-blueprint'

  assert.equal(isCheckoutLive('blueprint'), false)
  assert.deepEqual(checkoutReadiness('blueprint'), {
    productId: 'blueprint',
    state: 'checkout_unreleased',
    missingEnv: ['CHECKOUT_RELEASE'],
  })
  const response = await postCheckout('blueprint')
  assert.equal(response.status, 503)
  assert.equal((await response.json()).reason, 'checkout_unreleased')
  assert.equal(await createCheckoutSession('blueprint'), null)

  // Static path: the pasted link is ignored and GET falls back to the waitlist.
  assert.equal(checkoutUrl(getOffer('blueprint')), null)
  const redirect = await GET(new Request('https://agenticincome.ai/api/checkout?offer=blueprint'))
  assert.equal(new URL(redirect.headers.get('location')).hash, '#request-access')

  assert.equal(getLaunchReadiness().items.find((item) => item.id === 'blueprint_checkout').configured, false)
  assert.equal(calls.length, 0, 'nothing reaches Polar without a release')
})

test('sandbox and live are separate approvals that must match POLAR_SERVER', async () => {
  credentialsOnly()
  for (const [release, server, open] of [
    ['sandbox', undefined, false], // sandbox approval never opens production
    ['live', 'sandbox', false], // live approval never runs against sandbox
    ['LIVE ', undefined, true],
    ['sandbox', 'sandbox', true],
    ['yes', undefined, false],
    ['true', undefined, false],
    ['', undefined, false],
  ]) {
    process.env.CHECKOUT_RELEASE = release
    if (server) process.env.POLAR_SERVER = server
    else delete process.env.POLAR_SERVER
    assert.equal(isCheckoutLive('blueprint'), open, `${release}/${server}`)
  }
})

test('a sandbox release opens the API path against sandbox only; static links stay closed', async () => {
  credentialsOnly()
  process.env.POLAR_SERVER = 'sandbox'
  process.env.CHECKOUT_RELEASE = 'sandbox'
  process.env.AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL = 'https://buy.polar.sh/static-blueprint'
  polarReply = () => Response.json({ url: 'https://sandbox.polar.sh/checkout/polar_c_x' })

  assert.equal(await createCheckoutSession('blueprint'), 'https://sandbox.polar.sh/checkout/polar_c_x')
  assert.equal(calls[0].url, 'https://sandbox-api.polar.sh/v1/checkouts/')
  assert.equal(checkoutUrl(getOffer('blueprint')), null, 'static links are live-only')
})

// --- catalog gate holds even when every env var is set ---------------------

test('catalog-gated SKUs stay closed on both paths even with every env var set', async () => {
  configureEverything()
  for (const id of ['private-intel', 'agent-team-pro', 'claims-guard-pack', 'abos-pack-bundle', 'vibe-os-pack']) {
    assert.equal(isCheckoutLive(id), false, id)
    const response = await postCheckout(id)
    assert.equal(response.status, 503, id)
    assert.equal((await response.json()).reason, 'checkout_gated', id)
    // A static link pasted into env must not bypass the catalog either.
    assert.equal(checkoutUrl(getOffer(id)), null, id)
    const redirect = await GET(new Request(`https://agenticincome.ai/api/checkout?offer=${id}`))
    const location = new URL(redirect.headers.get('location'))
    assert.equal(`${location.pathname}${location.hash}`, `/offers/${id}#request-access`, id)
  }
  assert.equal(calls.length, 0)
})

test('starter-kit is never sold', async () => {
  configureEverything()
  const response = await postCheckout('starter-kit')
  assert.equal(response.status, 400)
  assert.equal((await response.json()).reason, 'free_product')
})

// --- the live path: product page -> session -> success ---------------------

test('a configured for-sale SKU creates a Polar session with the right request', async () => {
  configureBlueprint()
  polarReply = () => Response.json({ id: CHECKOUT_ID, url: POLAR_CHECKOUT_URL })

  assert.equal(isCheckoutLive('blueprint'), true)
  const response = await postCheckout('blueprint')
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true, productId: 'blueprint', url: POLAR_CHECKOUT_URL })

  assert.equal(calls.length, 1)
  const [call] = calls
  assert.equal(call.url, 'https://api.polar.sh/v1/checkouts/')
  assert.equal(call.init.method, 'POST')
  assert.equal(call.init.headers.authorization, 'Bearer polar_oat_test_not_a_real_token')
  const body = JSON.parse(call.init.body)
  assert.deepEqual(body.products, [BLUEPRINT_POLAR_ID])
  assert.deepEqual(body.metadata, { catalog_id: 'blueprint' })
  // Braces must reach Polar literally or it will not substitute the id.
  assert.equal(
    body.success_url,
    'https://agenticincome.ai/checkout/success?product=blueprint&checkout_id={CHECKOUT_ID}',
  )
})

test('provider redirects reach the buyer without sending checkout URLs to analytics', async () => {
  configureBlueprint()
  const telemetry = 'https://analytics.example.test/collect'
  process.env.ANALYTICS_WEBHOOK_URL = telemetry
  const hostedUrl = 'https://buy.polar.sh/checkout/polar_c_test_private'
  polarReply = (url) => url === telemetry ? new Response(null, { status: 204 }) : Response.json({ url: hostedUrl })

  const created = await postCheckout('blueprint')
  assert.equal((await created.json()).url, hostedUrl)
  assert.match(created.headers.get('cache-control'), /no-store/)

  process.env.AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL = 'https://buy.polar.sh/static-blueprint'
  const redirected = await GET(new Request('https://agenticincome.ai/api/checkout?offer=blueprint&ref=private-click'))
  assert.equal(redirected.headers.get('location'), 'https://buy.polar.sh/static-blueprint?ref=private-click')

  const events = calls.filter((call) => call.url === telemetry).map((call) => JSON.parse(call.init.body))
  assert.equal(events.length, 2)
  for (const event of events) {
    assert.equal(event.event, 'checkout_redirect')
    assert.equal(event.offer, 'blueprint')
    assert.equal(event.state, 'provider_checkout')
    assert.doesNotMatch(JSON.stringify(event), /polar\.sh|polar_c_test_private|private-click/)
  }
})

test('POLAR_SUCCESS_URL is required: missing or non-https refuses instead of guessing', async () => {
  configureBlueprint()
  delete process.env.POLAR_SUCCESS_URL
  assert.equal(isCheckoutLive('blueprint'), false)
  assert.equal(await createCheckoutSession('blueprint'), null)
  assert.deepEqual(checkoutReadiness('blueprint').missingEnv, ['POLAR_SUCCESS_URL'])

  process.env.POLAR_SUCCESS_URL = 'http://agenticincome.ai'
  assert.equal(successUrl(catalog.products.find((p) => p.id === 'blueprint')), null)
  assert.equal(isCheckoutLive('blueprint'), false)
  assert.equal(calls.length, 0)
})

test('Polar failures degrade to 502 and never return a fabricated URL', async () => {
  configureBlueprint()
  const replies = [
    () => new Response('nope', { status: 401 }),
    () => new Response('not json', { status: 200 }),
    () => Response.json({ id: CHECKOUT_ID }),
    () => Response.json({ url: 'http://insecure.example/checkout' }),
    () => Response.json({ url: 'not a url' }),
    () => {
      throw new TypeError('network down')
    },
  ]
  for (const reply of replies) {
    polarReply = reply
    const response = await postCheckout('blueprint')
    assert.equal(response.status, 502)
    const body = await response.json()
    assert.equal(body.reason, 'checkout_upstream_failed')
    assert.equal('url' in body, false)
  }
})

test('GET /api/checkout sends buyers to the buy button when only the Polar API path is live', async () => {
  configureBlueprint()
  const response = await GET(new Request('https://agenticincome.ai/api/checkout?offer=blueprint&ref=qa'))
  const location = new URL(response.headers.get('location'))
  assert.equal(location.pathname, '/offers/blueprint')
  assert.equal(location.hash, '')
  assert.equal(location.searchParams.get('ref'), 'qa')
  assert.equal(calls.length, 0, 'GET must not create sessions')
})

test('verifyCheckout reports only what Polar confirms', async () => {
  configureBlueprint()
  const cases = [
    ['succeeded', 'paid', 'blueprint'],
    ['confirmed', 'processing', 'blueprint'],
    ['open', 'open', null],
    ['expired', 'not_completed', null],
    ['failed', 'not_completed', null],
    ['something_new', 'unverifiable', null],
  ]
  for (const [status, state, productId] of cases) {
    polarReply = () => Response.json({ id: CHECKOUT_ID, status, product_id: BLUEPRINT_POLAR_ID })
    const result = await verifyCheckout(CHECKOUT_ID)
    assert.equal(result.state, state, status)
    assert.equal(result.product?.id ?? null, productId, status)
  }
  assert.equal(calls.at(-1).url, `https://api.polar.sh/v1/checkouts/${CHECKOUT_ID}`)
  assert.equal(calls.at(-1).init.headers.authorization, 'Bearer polar_oat_test_not_a_real_token')
})

test('verifyCheckout maps the product from Polar, never from an unknown id', async () => {
  configureBlueprint()
  polarReply = () => Response.json({ status: 'succeeded', product_id: 'prod_someone_else' })
  assert.deepEqual(await verifyCheckout(CHECKOUT_ID), { state: 'paid', product: null })
})

test('verifyCheckout claims nothing without a valid id, a token, or a readable answer', async () => {
  configureBlueprint()
  for (const id of [undefined, null, '', '{CHECKOUT_ID}', '../orders', `${CHECKOUT_ID}/x`]) {
    assert.equal((await verifyCheckout(id)).state, 'unverifiable', String(id))
  }
  assert.equal(calls.length, 0, 'malformed ids never reach Polar')

  polarReply = () => new Response('', { status: 404 })
  assert.equal((await verifyCheckout(CHECKOUT_ID)).state, 'unverifiable')
  polarReply = () => {
    throw new TypeError('network down')
  }
  assert.equal((await verifyCheckout(CHECKOUT_ID)).state, 'unverifiable')

  delete process.env.POLAR_ACCESS_TOKEN
  calls = []
  assert.equal((await verifyCheckout(CHECKOUT_ID)).state, 'unverifiable')
  assert.equal(calls.length, 0)
})

// --- readiness ---------------------------------------------------------------

test('readiness lists every priced SKU and counts the Polar API path', () => {
  const before = getLaunchReadiness()
  const ids = before.items.filter((item) => item.category === 'checkout').map((item) => item.id)
  assert.deepEqual(ids.sort(), pricedCatalogProducts().map((p) => `${p.id.replace(/-/g, '_')}_checkout`).sort())
  const blueprint = () => getLaunchReadiness().items.find((item) => item.id === 'blueprint_checkout')
  assert.equal(blueprint().configured, false)
  assert.equal(blueprint().requiredForFullLaunch, true)
  // Catalog-gated SKUs are reported but do not hold the launch hostage.
  assert.equal(before.items.find((item) => item.id === 'private_intel_checkout').requiredForFullLaunch, false)

  configureBlueprint()
  assert.equal(blueprint().configured, true)
  assert.doesNotMatch(JSON.stringify(getLaunchReadiness()), /polar_oat_|prod_test_/, 'no secret values in readiness')
})

test('readiness is full-launch ready once sale SKUs, capture, and analytics are wired', () => {
  configureBlueprint()
  process.env.SUBSCRIBE_WEBHOOK_URL = 'https://hooks.example/subscribe'
  process.env.ANALYTICS_WEBHOOK_URL = 'https://hooks.example/analytics'
  const readiness = getLaunchReadiness()
  assert.equal(readiness.fullLaunchReady, true)
  assert.equal(readiness.configuredRequired, readiness.requiredTotal)
})

test('new offer copy keeps internal language off the public site (AGENTS.md)', () => {
  const internal = /\b(harness|operators?|queue|swarm|internal tier|environment|coordination)\b/i
  for (const id of ['agent-team-pro', 'claims-guard-pack', 'abos-pack-bundle', 'vibe-os-pack']) {
    assert.doesNotMatch(JSON.stringify(getOffer(id)), internal, id)
  }
})

test('success page asserts no settlement, email, or download facts and gates the desk on paid', () => {
  const page = readFileSync(new URL('../app/checkout/success/page.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(page, /No payment was taken|Nothing was charged|has emailed|is confirmed\./i)
  assert.match(page, /verification\.state === 'paid' && verified \? verified\.delivery\.path : null/)
  assert.doesNotMatch(page, /hinted[^\n]*delivery/, 'the URL hint must never reach the delivery desk link')
})

test('every offer slug is unique', () => {
  const slugs = offers.map((offer) => offer.slug)
  assert.equal(new Set(slugs).size, slugs.length)
})
