import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import { evaluateCheckoutGate, openCheckout } from '../lib/commerce/checkout.ts'
import { commerceProvider, stripeLookupKey } from '../lib/commerce/config.ts'
import { MemoryCommerceStore, UpstashCommerceStore, commerceStoreFromEnv } from '../lib/commerce/store.ts'
import { checkoutSessionParams, STRIPE_API_VERSION } from '../lib/commerce/stripe.ts'
import { stripeSignatureHeader, verifyStripeSignature } from '../lib/commerce/stripe-signature.ts'
import { handleStripeWebhook } from '../lib/commerce/stripe-webhook.ts'
import { normalizeAnalyticsEvent } from '../lib/analytics.ts'
import { getOffer } from '../lib/offers.ts'

const catalog = JSON.parse(readFileSync(path.join(process.cwd(), 'products', 'catalog.json'), 'utf8'))
const SECRET = 'whsec_test_commerce_kit'
const NOW = 1_800_000_000
const LINK = 'https://buy.stripe.com/test_blueprint'

/** Same join as lib/commerce/server.ts, from the real catalog + offers. */
function skuFor(slug, overrides = {}) {
  const product = catalog.products.find((entry) => entry.id === slug)
  const offer = getOffer(slug)
  return {
    site: 'agenticincome',
    sku: product.id,
    name: product.name,
    priceCents: product.price_cents,
    currency: 'usd',
    interval: product.interval === 'month' ? 'month' : null,
    catalogStatus: product.status,
    entitlement: `agenticincome:${product.id}`,
    deliveryPath: product.delivery.path,
    cancelPath: `/offers/${offer.slug}`,
    paymentLinkEnvKey: offer.checkout.envKey,
    ...overrides,
  }
}

const noFetch = async () => {
  throw new Error('network must not be touched')
}

// --- Checkout gate ------------------------------------------------------------

test('gate is closed by default: no env means provider none', async () => {
  const blueprint = skuFor('blueprint')
  assert.equal(commerceProvider({}), 'none')
  assert.deepEqual(evaluateCheckoutGate(blueprint, {}), { open: false, provider: 'none', reason: 'provider_none' })
  const result = await openCheckout(blueprint, { env: {}, fetch: noFetch })
  assert.deepEqual(result, { ok: false, provider: 'none', reason: 'provider_none' })
})

test('a pasted checkout URL alone no longer opens the sale (old single-gate defect)', () => {
  const env = { AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL: LINK }
  assert.equal(evaluateCheckoutGate(skuFor('blueprint'), env).open, false)
  assert.equal(evaluateCheckoutGate(skuFor('blueprint'), env).reason, 'provider_none')
})

test('closed when provider env is set but the catalog status is not "for sale"', () => {
  const env = { COMMERCE_PROVIDER: 'payment_link', AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL: LINK }
  const gate = evaluateCheckoutGate(skuFor('private-intel'), env)
  assert.equal(gate.open, false)
  assert.equal(gate.reason, 'catalog_not_for_sale')
  const flipped = evaluateCheckoutGate(skuFor('blueprint', { catalogStatus: 'paused — not for sale' }), {
    COMMERCE_PROVIDER: 'payment_link',
    AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL: LINK,
  })
  assert.equal(flipped.reason, 'catalog_not_for_sale')
})

test('closed when the catalog says for sale but the provider is not configured', () => {
  assert.equal(evaluateCheckoutGate(skuFor('blueprint'), { COMMERCE_PROVIDER: 'payment_link' }).reason, 'provider_unconfigured')
  assert.equal(evaluateCheckoutGate(skuFor('blueprint'), { COMMERCE_PROVIDER: 'stripe' }).reason, 'provider_unconfigured')
  assert.equal(evaluateCheckoutGate(skuFor('blueprint'), { COMMERCE_PROVIDER: 'bogus', AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL: LINK }).reason, 'provider_none')
  assert.equal(
    evaluateCheckoutGate(skuFor('blueprint'), { COMMERCE_PROVIDER: 'payment_link', AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL: 'http://insecure.example' }).reason,
    'provider_unconfigured',
  )
})

test('open with both gates: catalog for sale AND provider configured', async () => {
  const env = { COMMERCE_PROVIDER: 'payment_link', AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL: LINK }
  const result = await openCheckout(skuFor('blueprint'), { env, fetch: noFetch })
  assert.deepEqual(result, { ok: true, provider: 'payment_link', url: LINK })
})

test('free and unknown products never open', () => {
  const env = { COMMERCE_PROVIDER: 'payment_link' }
  assert.equal(evaluateCheckoutGate(skuFor('starter-kit'), env).reason, 'free_product')
  assert.equal(evaluateCheckoutGate(null, env).reason, 'unknown_product')
})

test('kill switch closes an otherwise open checkout', async () => {
  for (const value of ['1', 'true', 'on']) {
    const env = { COMMERCE_PROVIDER: 'payment_link', AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL: LINK, COMMERCE_KILL_SWITCH: value }
    assert.equal(evaluateCheckoutGate(skuFor('blueprint'), env).reason, 'kill_switch')
    assert.equal((await openCheckout(skuFor('blueprint'), { env, fetch: noFetch })).ok, false)
  }
  const off = { COMMERCE_PROVIDER: 'payment_link', AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL: LINK, COMMERCE_KILL_SWITCH: '0' }
  assert.equal(evaluateCheckoutGate(skuFor('blueprint'), off).open, true)
})

// --- Stripe adapter -----------------------------------------------------------

function fakeStripe({ price = {}, sessionUrl = 'https://checkout.stripe.com/c/pay/cs_test_1' } = {}) {
  const calls = []
  const fetcher = async (url, init = {}) => {
    calls.push({ url: String(url), init })
    if (String(url).includes('/v1/prices')) {
      const data = [{ id: 'price_bp', active: true, unit_amount: 6700, currency: 'usd', type: 'one_time', recurring: null, ...price }]
      return new Response(JSON.stringify({ data }), { status: 200 })
    }
    return new Response(JSON.stringify({ id: 'cs_test_1', url: sessionUrl }), { status: 200 })
  }
  return { calls, fetcher }
}

const STRIPE_ENV = {
  COMMERCE_PROVIDER: 'stripe',
  STRIPE_SECRET_KEY: 'sk_test_123',
  COMMERCE_SITE_URL: 'https://www.agenticincome.ai',
}

test('stripe adapter creates a Managed Payments session only when the flag is true', async () => {
  for (const [flag, expected] of [['true', 'true'], [undefined, null], ['1', null]]) {
    const { calls, fetcher } = fakeStripe()
    const env = { ...STRIPE_ENV, COMMERCE_STRIPE_MANAGED_PAYMENTS: flag }
    const result = await openCheckout(skuFor('blueprint'), { env, fetch: fetcher })
    assert.deepEqual(result, { ok: true, provider: 'stripe', url: 'https://checkout.stripe.com/c/pay/cs_test_1' })
    assert.match(calls[0].url, /lookup_keys%5B%5D=agenticincome\.blueprint\.onetime\.usd\.v1/)
    const session = calls.find((call) => call.url.endsWith('/v1/checkout/sessions'))
    assert.equal(session.init.headers['stripe-version'], STRIPE_API_VERSION)
    const body = new URLSearchParams(session.init.body)
    assert.equal(body.get('managed_payments[enabled]'), expected)
    assert.equal(body.get('mode'), 'payment')
    assert.equal(body.get('line_items[0][price]'), 'price_bp')
    assert.equal(body.get('metadata[sku]'), 'blueprint')
    assert.equal(body.get('payment_intent_data[metadata][entitlement]'), 'agenticincome:blueprint')
    assert.equal(body.get('success_url'), 'https://www.agenticincome.ai/delivery/blueprint?session_id={CHECKOUT_SESSION_ID}')
    // Parameters Managed Payments rejects are never sent.
    for (const forbidden of ['automatic_tax[enabled]', 'payment_method_types[0]', 'tax_id_collection[enabled]', 'invoice_creation[enabled]']) {
      assert.equal(body.has(forbidden), false)
    }
  }
})

test('stripe adapter refuses when the Stripe price disagrees with the catalog', async () => {
  const { fetcher } = fakeStripe({ price: { unit_amount: 4900 } })
  const result = await openCheckout(skuFor('blueprint'), { env: STRIPE_ENV, fetch: fetcher })
  assert.deepEqual(result, { ok: false, provider: 'stripe', reason: 'checkout_upstream_failed' })
})

test('lookup key and params follow docs/COMMERCE.md', () => {
  assert.equal(stripeLookupKey('agenticincome', 'private-intel', 'month', 'USD', 2), 'agenticincome.private-intel.month.usd.v2')
  const params = checkoutSessionParams(skuFor('private-intel'), 'price_pi', 'https://www.agenticincome.ai', true)
  assert.equal(params.get('mode'), 'subscription')
  assert.equal(params.get('subscription_data[metadata][sku]'), 'private-intel')
  assert.equal(params.has('payment_intent_data[metadata][sku]'), false)
})

// --- Webhook --------------------------------------------------------------------

function stripeEvent(id, type, object) {
  return JSON.stringify({ id, object: 'event', type, data: { object } })
}

function paidSession(overrides = {}) {
  return {
    id: 'cs_test_1',
    object: 'checkout.session',
    payment_intent: 'pi_1',
    payment_status: 'paid',
    amount_total: 6700,
    currency: 'usd',
    customer_details: { email: 'buyer@example.com' },
    metadata: { site: 'agenticincome', sku: 'blueprint', entitlement: 'agenticincome:blueprint' },
    ...overrides,
  }
}

function refundedCharge(overrides = {}) {
  return {
    id: 'ch_1',
    object: 'charge',
    payment_intent: 'pi_1',
    amount: 6700,
    amount_refunded: 6700,
    refunded: true,
    currency: 'usd',
    billing_details: { email: 'buyer@example.com' },
    metadata: { site: 'agenticincome', sku: 'blueprint', entitlement: 'agenticincome:blueprint' },
    ...overrides,
  }
}

function deliver(store, rawBody, extra = {}) {
  return handleStripeWebhook({
    rawBody,
    signature: stripeSignatureHeader(rawBody, SECRET, NOW),
    secret: SECRET,
    store,
    nowSeconds: NOW,
    ...extra,
  })
}

test('signature: valid passes; tampered, stale, wrong secret, v0-only, or missing -> 400', async () => {
  const body = stripeEvent('evt_sig', 'checkout.session.completed', paidSession())
  assert.equal(verifyStripeSignature(body, stripeSignatureHeader(body, SECRET, NOW), SECRET, { nowSeconds: NOW }).ok, true)

  const store = new MemoryCommerceStore()
  const cases = [
    stripeSignatureHeader(`${body} `, SECRET, NOW),
    stripeSignatureHeader(body, SECRET, NOW - 301),
    stripeSignatureHeader(body, 'whsec_wrong', NOW),
    stripeSignatureHeader(body, SECRET, NOW).replace('v1=', 'v0='),
    null,
  ]
  for (const signature of cases) {
    const result = await handleStripeWebhook({ rawBody: body, signature, secret: SECRET, store, nowSeconds: NOW })
    assert.equal(result.status, 400)
    assert.equal(result.body.reason, 'signature_invalid')
  }
  assert.equal(store.entitlements.size, 0)
  assert.equal(store.events.size, 0)
})

test('duplicate event id never double-grants or double-delivers', async () => {
  const store = new MemoryCommerceStore()
  const sent = []
  const notifier = async (request) => {
    sent.push(request)
  }
  const body = stripeEvent('evt_paid', 'checkout.session.completed', paidSession())
  const first = await deliver(store, body, { deliver: notifier })
  const second = await deliver(store, body, { deliver: notifier })
  assert.equal(first.status, 200)
  assert.equal(first.body.outcome, 'granted')
  assert.equal(first.body.delivery, 'delivered')
  assert.equal(second.status, 200)
  assert.equal(second.body.outcome, 'duplicate')
  assert.equal(second.body.delivery, 'already_delivered')
  assert.equal(store.entitlements.size, 1)
  assert.equal(sent.length, 1)
  assert.equal(sent[0].idempotencyKey, 'delivery:pi_1')
  assert.equal(sent[0].entitlement.email, 'buyer@example.com')

  // A second event for the same payment (e.g. async success after completed) is not a second grant.
  const again = await deliver(store, stripeEvent('evt_async', 'checkout.session.async_payment_succeeded', paidSession()), { deliver: notifier })
  assert.equal(again.body.outcome, 'already_granted')
  assert.equal(sent.length, 1)
})

test('grant only when paid: unpaid completion waits for async success; async failure never grants', async () => {
  const store = new MemoryCommerceStore()
  const pending = await deliver(store, stripeEvent('evt_c', 'checkout.session.completed', paidSession({ payment_status: 'unpaid' })))
  assert.equal(pending.status, 200)
  assert.equal(pending.body.outcome, 'pending_payment')
  assert.equal(store.entitlements.size, 0)

  const failed = await deliver(store, stripeEvent('evt_f', 'checkout.session.async_payment_failed', paidSession({ payment_status: 'unpaid', payment_intent: 'pi_2' })))
  assert.equal(failed.body.outcome, 'recorded')
  assert.equal(store.entitlements.size, 0)

  const ok = await deliver(store, stripeEvent('evt_s', 'checkout.session.async_payment_succeeded', paidSession()))
  assert.equal(ok.body.outcome, 'granted')
  assert.equal((await store.getEntitlement('pi_1')).status, 'active')
})

test('refund before paid writes a tombstone and blocks the late grant', async () => {
  const store = new MemoryCommerceStore()
  const refund = await deliver(store, stripeEvent('evt_r', 'charge.refunded', refundedCharge()))
  assert.equal(refund.status, 200)
  assert.equal(refund.body.outcome, 'tombstoned')
  assert.ok(store.tombstones.has('pi_1'))

  const sent = []
  const late = await deliver(store, stripeEvent('evt_late', 'checkout.session.completed', paidSession()), {
    deliver: async (request) => sent.push(request),
  })
  assert.equal(late.status, 200)
  assert.equal(late.body.outcome, 'blocked_by_tombstone')
  assert.equal(await store.getEntitlement('pi_1'), null)
  assert.equal(sent.length, 0)
})

test('refund or dispute after a grant revokes it; a partial refund does not', async () => {
  const store = new MemoryCommerceStore()
  await deliver(store, stripeEvent('evt_p1', 'checkout.session.completed', paidSession()))
  const partial = await deliver(store, stripeEvent('evt_pr', 'charge.refunded', refundedCharge({ refunded: false, amount_refunded: 1000 })))
  assert.equal(partial.body.outcome, 'recorded')
  assert.equal((await store.getEntitlement('pi_1')).status, 'active')

  const dispute = await deliver(
    store,
    stripeEvent('evt_d', 'charge.dispute.created', { id: 'dp_1', object: 'dispute', charge: 'ch_1', payment_intent: 'pi_1', amount: 6700, currency: 'usd', metadata: {} }),
  )
  assert.equal(dispute.body.outcome, 'revoked')
  assert.equal((await store.getEntitlement('pi_1')).status, 'revoked')
})

test('processing errors return 5xx so Stripe retries; a failed delivery is retried on redelivery', async () => {
  const broken = new MemoryCommerceStore()
  broken.applyEvent = async () => {
    throw new Error('kv down')
  }
  const body = stripeEvent('evt_err', 'checkout.session.completed', paidSession())
  const result = await deliver(broken, body)
  assert.equal(result.status, 500)
  assert.equal(result.body.reason, 'processing_failed')

  const store = new MemoryCommerceStore()
  let attempts = 0
  const flaky = async () => {
    attempts += 1
    if (attempts === 1) throw new Error('email provider down')
  }
  assert.equal((await deliver(store, body, { deliver: flaky })).status, 500)
  const retry = await deliver(store, body, { deliver: flaky })
  assert.equal(retry.status, 200)
  assert.equal(retry.body.outcome, 'duplicate')
  assert.equal(retry.body.delivery, 'delivered')
  assert.equal(store.entitlements.size, 1)
})

test('fail-closed configuration: no secret or no store -> 503; other sites and unmapped purchases are ignored', async () => {
  const body = stripeEvent('evt_cfg', 'checkout.session.completed', paidSession())
  const signature = stripeSignatureHeader(body, SECRET, NOW)
  assert.equal((await handleStripeWebhook({ rawBody: body, signature, secret: '', store: new MemoryCommerceStore(), nowSeconds: NOW })).status, 503)
  assert.equal((await handleStripeWebhook({ rawBody: body, signature, secret: SECRET, store: null, nowSeconds: NOW })).status, 503)
  assert.equal(commerceStoreFromEnv({}), null)

  const store = new MemoryCommerceStore()
  const other = await deliver(store, stripeEvent('evt_o', 'checkout.session.completed', paidSession({ metadata: { site: 'othersite', sku: 'x', entitlement: 'othersite:x' } })))
  assert.equal(other.body.outcome, 'other_site')
  const unmapped = await deliver(store, stripeEvent('evt_u', 'checkout.session.completed', paidSession({ metadata: {} })))
  assert.equal(unmapped.body.outcome, 'unmapped_purchase')
  const ignored = await deliver(store, stripeEvent('evt_i', 'customer.created', { id: 'cus_1' }))
  assert.equal(ignored.body.outcome, 'ignored')
  assert.equal(store.entitlements.size, 0)
})

test('Upstash store applies each event in one atomic EVAL', async () => {
  const commands = []
  const fetcher = async (_url, init) => {
    commands.push(JSON.parse(init.body))
    return new Response(JSON.stringify({ result: 'granted' }), { status: 200 })
  }
  const store = new UpstashCommerceStore('https://kv.example.upstash.io', 'token', fetcher)
  const outcome = await store.applyEvent('evt_1', {
    op: 'grant',
    transactionId: 'pi_1',
    entitlement: { transactionId: 'pi_1', sku: 'blueprint', entitlement: 'agenticincome:blueprint', email: null, amount: 6700, currency: 'usd', grantedBy: 'evt_1' },
  })
  assert.equal(outcome, 'granted')
  assert.equal(commands.length, 1)
  const [verb, script, keyCount, eventKey, entitlementKey, tombstoneKey, op] = commands[0]
  assert.equal(verb, 'EVAL')
  assert.match(script, /EXISTS', KEYS\[1\]\) == 1 then return 'duplicate'/)
  assert.equal(keyCount, 3)
  assert.deepEqual([eventKey, entitlementKey, tombstoneKey, op], [
    'commerce:v1:event:evt_1',
    'commerce:v1:entitlement:pi_1',
    'commerce:v1:tombstone:pi_1',
    'grant',
  ])
  const failing = new UpstashCommerceStore('https://kv.example.upstash.io', 'token', async () => new Response('{"error":"x"}', { status: 500 }))
  await assert.rejects(failing.applyEvent('evt_2', { op: 'record', transactionId: 'pi_2' }))
})

// --- Wiring ---------------------------------------------------------------------

test('routes and pages use the commerce gate; refund copy is provider-accurate', () => {
  const read = (file) => readFileSync(path.join(process.cwd(), file), 'utf8')
  const checkout = read('app/api/checkout/route.ts')
  assert.match(checkout, /openCommerceCheckout\(offer\.slug\)/)
  assert.doesNotMatch(checkout, /checkoutUrl\(/)
  assert.match(checkout, /commerceKillSwitchActive\(\)/)
  for (const page of ['app/offers/page.tsx', 'app/offers/[slug]/page.tsx']) {
    assert.match(read(page), /isCommerceCheckoutOpen\(offer\.slug\)/)
    assert.doesNotMatch(read(page), /checkoutUrl\(/)
  }
  const webhook = read('app/api/webhooks/stripe/route.ts')
  assert.match(webhook, /await req\.text\(\)/)
  assert.doesNotMatch(webhook, /req\.json\(\)/)
  const blueprint = getOffer('blueprint')
  assert.doesNotMatch(blueprint.refundPolicy, /merchant of record/i)
  assert.match(blueprint.refundPolicy, /handled by the payment provider shown on your receipt/)
})

test('purchase and refund analytics are server-only', () => {
  assert.equal(normalizeAnalyticsEvent({ event: 'purchase', offer: 'blueprint' }), null)
  assert.equal(normalizeAnalyticsEvent({ event: 'refund', offer: 'blueprint' }), null)
  assert.deepEqual(normalizeAnalyticsEvent({ event: 'offer_view', offer: 'blueprint' }), { event: 'offer_view', offer: 'blueprint' })
})
