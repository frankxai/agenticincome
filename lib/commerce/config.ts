import { COMMERCE_PROVIDERS, type CommerceEnv, type CommerceProviderId } from './types.ts'

/**
 * Environment reading for the commerce kit. Every reader takes the env as an
 * argument (defaulting to process.env) so tests never mutate globals.
 *
 * Defaults are closed: no COMMERCE_PROVIDER -> `none` -> no checkout.
 */

export const COMMERCE_SITE = 'agenticincome'

/** The only catalog `status` prefix that means "this may be sold". */
export const PURCHASABLE_STATUS_PREFIX = 'for sale'

export function processEnv(): CommerceEnv {
  return process.env
}

function read(env: CommerceEnv, key: string): string {
  return env[key]?.trim() ?? ''
}

/** COMMERCE_PROVIDER, normalized. Unset, empty, or unknown -> `none` (closed). */
export function commerceProvider(env: CommerceEnv = processEnv()): CommerceProviderId {
  const value = read(env, 'COMMERCE_PROVIDER').toLowerCase()
  return (COMMERCE_PROVIDERS as readonly string[]).includes(value) ? (value as CommerceProviderId) : 'none'
}

/**
 * COMMERCE_KILL_SWITCH closes every checkout path (GET redirect, Polar POST,
 * and the page CTAs) without a redeploy of code. Any truthy spelling counts;
 * the repo has no feature-flag SDK, so this is a plain env switch.
 */
export function commerceKillSwitchActive(env: CommerceEnv = processEnv()): boolean {
  return ['1', 'true', 'yes', 'on'].includes(read(env, 'COMMERCE_KILL_SWITCH').toLowerCase())
}

export function catalogStatusIsForSale(status: string): boolean {
  return status.trim().toLowerCase().startsWith(PURCHASABLE_STATUS_PREFIX)
}

/** Only `true` enables Stripe Managed Payments; anything else is plain Stripe Checkout. */
export function stripeManagedPaymentsEnabled(env: CommerceEnv = processEnv()): boolean {
  return read(env, 'COMMERCE_STRIPE_MANAGED_PAYMENTS').toLowerCase() === 'true'
}

/** Site origin for success/cancel URLs. https only; anything else is unset. */
export function commerceSiteUrl(env: CommerceEnv = processEnv()): string | null {
  return httpsUrl(read(env, 'COMMERCE_SITE_URL'))
}

export function httpsUrl(value: string | undefined | null): string | null {
  if (!value) return null
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}

/**
 * Upstash/Vercel KV REST credentials. Each pair is read as a unit and the first
 * pair with both values non-empty wins, so blank KV_* placeholders copied from
 * .env.example never shadow a filled UPSTASH_* pair.
 */
export function kvCredentials(env: CommerceEnv = processEnv()): { url: string; token: string } | null {
  for (const [urlKey, tokenKey] of [
    ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
    ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
  ] as const) {
    const url = read(env, urlKey)
    const token = read(env, tokenKey)
    if (url && token && url.startsWith('https://')) return { url, token }
  }
  return null
}

/**
 * Private fulfillment for webhook-fulfilled providers (Stripe): a signed
 * webhook, a durable entitlement store, and a delivery sender must all exist.
 * The public /delivery page is not fulfillment, so without these the SKU stays
 * closed rather than charging a buyer who would receive nothing private.
 */
export function webhookFulfillmentConfigured(env: CommerceEnv = processEnv()): boolean {
  return Boolean(
    read(env, 'STRIPE_WEBHOOK_SECRET').startsWith('whsec_') &&
      kvCredentials(env) &&
      httpsUrl(read(env, 'COMMERCE_DELIVERY_WEBHOOK_URL')),
  )
}

/** `blueprint` -> `BLUEPRINT`, `private-intel` -> `PRIVATE_INTEL`. */
export function skuEnvSuffix(sku: string): string {
  return sku.toUpperCase().replace(/[^A-Z0-9]+/g, '_')
}

/**
 * Stripe price lookup key, per docs/COMMERCE.md:
 * `{site}.{sku}.{onetime|month}.{currency}.v{n}`.
 */
export function stripeLookupKey(
  site: string,
  sku: string,
  interval: 'month' | null,
  currency: string,
  version = 1,
): string {
  return `${site}.${sku}.${interval ?? 'onetime'}.${currency.toLowerCase()}.v${version}`
}
