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
