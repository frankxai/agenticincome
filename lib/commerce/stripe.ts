import {
  commerceSiteUrl,
  httpsUrl,
  skuEnvSuffix,
  stripeLookupKey,
  stripeManagedPaymentsEnabled,
  webhookFulfillmentConfigured,
} from './config.ts'
import type {
  CheckoutContext,
  CommerceAdapter,
  CommerceEnv,
  CommerceSku,
  NormalizedCommerceEvent,
} from './types.ts'

/**
 * Stripe Checkout Session adapter (no SDK; form-encoded REST).
 *
 * Managed Payments (Stripe as merchant of record) is a per-session flag:
 * `managed_payments[enabled]=true`, API version 2025-03-31.basil or later,
 * products need an eligible digital tax code, no Connect. With
 * COMMERCE_STRIPE_MANAGED_PAYMENTS unset this is plain Stripe Checkout.
 * Source: docs.stripe.com/payments/managed-payments/set-up (read 2026-10-23).
 *
 * Price truth: the Stripe price is fetched and must match the catalog's
 * amount, currency, and one-time/recurring shape, or no session is created.
 */

const STRIPE_API = 'https://api.stripe.com/v1'
/** Minimum version that supports `managed_payments`. Pinned so payloads do not drift. */
export const STRIPE_API_VERSION = '2025-03-31.basil'
const REQUEST_TIMEOUT_MS = 10_000

export function stripeSecretKey(env: CommerceEnv): string | null {
  const key = env.STRIPE_SECRET_KEY?.trim()
  // Restricted (rk_) or secret (sk_) keys only; a publishable key never works server-side.
  return key && /^(sk|rk)_(test|live)_/.test(key) ? key : null
}

function priceIdFromEnv(sku: CommerceSku, env: CommerceEnv): string | null {
  const value = env[`STRIPE_PRICE_ID_${skuEnvSuffix(sku.sku)}`]?.trim()
  return value && value.startsWith('price_') ? value : null
}

type StripePrice = {
  id?: unknown
  active?: unknown
  unit_amount?: unknown
  currency?: unknown
  type?: unknown
  recurring?: { interval?: unknown } | null
}

function priceMatchesSku(price: StripePrice, sku: CommerceSku): price is StripePrice & { id: string } {
  if (typeof price.id !== 'string' || price.active !== true) return false
  if (price.unit_amount !== sku.priceCents) return false
  if (typeof price.currency !== 'string' || price.currency.toLowerCase() !== sku.currency.toLowerCase()) return false
  if (sku.interval === null) return price.type === 'one_time'
  return price.type === 'recurring' && price.recurring?.interval === sku.interval
}

async function stripeRequest(
  ctx: CheckoutContext,
  key: string,
  path: string,
  init: { method: 'GET' | 'POST'; body?: URLSearchParams },
): Promise<unknown | null> {
  const response = await ctx
    .fetch(`${STRIPE_API}${path}`, {
      method: init.method,
      headers: {
        authorization: `Bearer ${key}`,
        'stripe-version': STRIPE_API_VERSION,
        ...(init.body ? { 'content-type': 'application/x-www-form-urlencoded' } : {}),
      },
      body: init.body?.toString(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    .catch(() => null)
  if (!response || !response.ok) return null
  return response.json().catch(() => null)
}

/** Price id from STRIPE_PRICE_ID_<SKU>, else by lookup key; verified against the catalog. */
async function resolvePrice(sku: CommerceSku, ctx: CheckoutContext, key: string): Promise<string | null> {
  const explicit = priceIdFromEnv(sku, ctx.env)
  if (explicit) {
    const price = (await stripeRequest(ctx, key, `/prices/${encodeURIComponent(explicit)}`, { method: 'GET' })) as StripePrice | null
    return price && priceMatchesSku(price, sku) ? price.id : null
  }
  const lookupKey = stripeLookupKey(sku.site, sku.sku, sku.interval, sku.currency)
  const query = new URLSearchParams({ 'lookup_keys[]': lookupKey, active: 'true', limit: '2' })
  const list = (await stripeRequest(ctx, key, `/prices?${query}`, { method: 'GET' })) as { data?: unknown } | null
  const data = list?.data
  const prices = Array.isArray(data) ? (data as StripePrice[]) : []
  // Exactly one active price per lookup key; ambiguity fails closed.
  const [price] = prices
  if (prices.length !== 1 || !price) return null
  return priceMatchesSku(price, sku) ? price.id : null
}

/** Form body for POST /v1/checkout/sessions. Exported for tests. */
export function checkoutSessionParams(
  sku: CommerceSku,
  priceId: string,
  siteUrl: string,
  managedPayments: boolean,
): URLSearchParams {
  const success = new URL(sku.deliveryPath, siteUrl)
  const cancel = new URL(sku.cancelPath, siteUrl)
  const params = new URLSearchParams()
  params.set('mode', sku.interval ? 'subscription' : 'payment')
  params.set('line_items[0][price]', priceId)
  params.set('line_items[0][quantity]', '1')
  // Stripe substitutes {CHECKOUT_SESSION_ID}; form encoding is decoded server-side.
  params.set('success_url', `${success.toString()}?session_id={CHECKOUT_SESSION_ID}`)
  params.set('cancel_url', cancel.toString())
  params.set('client_reference_id', `${sku.site}.${sku.sku}`)
  const metadata = { site: sku.site, sku: sku.sku, entitlement: sku.entitlement }
  for (const [name, value] of Object.entries(metadata)) {
    params.set(`metadata[${name}]`, value)
    // Copied onto the PaymentIntent (and its charge) so refunds and disputes carry the SKU.
    if (!sku.interval) params.set(`payment_intent_data[metadata][${name}]`, value)
    else params.set(`subscription_data[metadata][${name}]`, value)
  }
  // Managed Payments sessions must not send automatic_tax, tax_id_collection,
  // payment_method_types, invoice_creation, or receipt_email; none are sent.
  if (managedPayments) params.set('managed_payments[enabled]', 'true')
  return params
}

async function createCheckout(sku: CommerceSku, ctx: CheckoutContext): Promise<string | null> {
  const key = stripeSecretKey(ctx.env)
  const siteUrl = commerceSiteUrl(ctx.env)
  if (!key || !siteUrl) return null

  const priceId = await resolvePrice(sku, ctx, key)
  if (!priceId) return null

  const body = checkoutSessionParams(sku, priceId, siteUrl, stripeManagedPaymentsEnabled(ctx.env))
  const session = (await stripeRequest(ctx, key, '/checkout/sessions', { method: 'POST', body })) as { url?: unknown } | null
  return typeof session?.url === 'string' ? httpsUrl(session.url) : null
}

// --- Webhook normalization ---------------------------------------------------

type StripeObject = Record<string, unknown>

function str(value: unknown): string | null {
  return typeof value === 'string' && value ? value : null
}

function num(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function idOf(value: unknown): string | null {
  if (typeof value === 'string' && value) return value
  if (value && typeof value === 'object') return str((value as StripeObject).id)
  return null
}

function metadataOf(object: StripeObject): Record<string, string> {
  const metadata = object.metadata
  if (!metadata || typeof metadata !== 'object') return {}
  return Object.fromEntries(
    Object.entries(metadata as Record<string, unknown>).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  )
}

function base(eventId: string, object: StripeObject) {
  const metadata = metadataOf(object)
  return {
    eventId,
    site: metadata.site ?? null,
    sku: metadata.sku ?? null,
    entitlement: metadata.entitlement ?? null,
    currency: (str(object.currency) ?? '').toLowerCase(),
  }
}

/**
 * Reduce a verified Stripe event:
 *   checkout.session.completed            -> purchase when payment_status=paid, else 'pending'
 *   checkout.session.async_payment_succeeded -> purchase (still requires paid)
 *   checkout.session.async_payment_failed -> payment_failed (no grant)
 *   charge.refunded                       -> refund (full=true only when fully refunded)
 *   charge.dispute.created                -> dispute
 * Everything else -> null (acknowledged, no action).
 */
export function normalizeStripeEvent(event: unknown): NormalizedCommerceEvent | 'pending' | null {
  if (!event || typeof event !== 'object') return null
  const record = event as StripeObject
  const eventId = str(record.id)
  const type = str(record.type)
  const object = (record.data as StripeObject | undefined)?.object as StripeObject | undefined
  if (!eventId || !type || !object || typeof object !== 'object') return null

  switch (type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      // Subscription sessions carry no PaymentIntent, so their refunds could not
      // be matched to the grant. Recurring SKUs stay closed (see isConfigured);
      // a stray subscription event is acknowledged without granting.
      if (object.mode === 'subscription') return null
      if (object.payment_status !== 'paid') return 'pending'
      const details = (object.customer_details ?? {}) as StripeObject
      return {
        ...base(eventId, object),
        type: 'purchase',
        transactionId: idOf(object.payment_intent) ?? str(object.id) ?? eventId,
        email: str(details.email) ?? str(object.customer_email),
        amount: num(object.amount_total),
        full: true,
      }
    }
    case 'checkout.session.async_payment_failed':
      return {
        ...base(eventId, object),
        type: 'payment_failed',
        transactionId: idOf(object.payment_intent) ?? str(object.id) ?? eventId,
        email: null,
        amount: num(object.amount_total),
        full: false,
      }
    case 'charge.refunded': {
      const billing = (object.billing_details ?? {}) as StripeObject
      return {
        ...base(eventId, object),
        type: 'refund',
        transactionId: idOf(object.payment_intent) ?? str(object.id) ?? eventId,
        email: str(billing.email) ?? str(object.receipt_email),
        amount: num(object.amount_refunded),
        full: object.refunded === true,
      }
    }
    case 'charge.dispute.created':
      return {
        ...base(eventId, object),
        type: 'dispute',
        transactionId: idOf(object.payment_intent) ?? idOf(object.charge) ?? eventId,
        email: null,
        amount: num(object.amount),
        full: true,
      }
    default:
      return null
  }
}

export const stripeAdapter: CommerceAdapter = {
  id: 'stripe',
  createsSession: true,
  isConfigured(sku, env) {
    return Boolean(
      // One-time only until subscription fulfillment (invoice ids) exists.
      sku.interval === null &&
        stripeSecretKey(env) &&
        commerceSiteUrl(env) &&
        // Never charge without private fulfillment behind the webhook.
        webhookFulfillmentConfigured(env),
    )
  },
  createCheckout,
  normalizeWebhook: normalizeStripeEvent,
}
