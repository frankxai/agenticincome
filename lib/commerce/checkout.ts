import { catalogStatusIsForSale, commerceKillSwitchActive, commerceProvider } from './config.ts'
import { paymentLinkAdapter } from './payment-link.ts'
import { stripeAdapter } from './stripe.ts'
import type {
  CheckoutClosedReason,
  CheckoutContext,
  CheckoutResult,
  CommerceAdapter,
  CommerceEnv,
  CommerceProviderId,
  CommerceSku,
} from './types.ts'

/**
 * The checkout gate. Fail-closed by construction — ALL must hold:
 *
 *   1. COMMERCE_KILL_SWITCH is not set,
 *   2. the SKU exists and is not free,
 *   3. the catalog `status` starts with "for sale"       (catalog gate),
 *   4. COMMERCE_PROVIDER names a provider (default none)  (provider gate),
 *   5. that provider's adapter is configured for this SKU (config gate).
 *
 * An env var alone (e.g. a pasted checkout URL) never opens a sale, and a
 * catalog flip alone never does either. Owner release approval is the act of
 * setting COMMERCE_PROVIDER in production.
 */

export type AdapterRegistry = Partial<Record<Exclude<CommerceProviderId, 'none'>, CommerceAdapter>>

/** Adapters that need nothing Next.js-specific. Polar is added in server.ts. */
export const BASE_ADAPTERS: AdapterRegistry = {
  stripe: stripeAdapter,
  payment_link: paymentLinkAdapter,
}

export type GateDecision =
  | { open: true; provider: Exclude<CommerceProviderId, 'none'>; adapter: CommerceAdapter }
  | { open: false; provider: CommerceProviderId; reason: CheckoutClosedReason }

export function evaluateCheckoutGate(
  sku: CommerceSku | null | undefined,
  env: CommerceEnv,
  adapters: AdapterRegistry = BASE_ADAPTERS,
): GateDecision {
  const provider = commerceProvider(env)
  if (commerceKillSwitchActive(env)) return { open: false, provider, reason: 'kill_switch' }
  if (!sku) return { open: false, provider, reason: 'unknown_product' }
  if (sku.priceCents <= 0) return { open: false, provider, reason: 'free_product' }
  if (!catalogStatusIsForSale(sku.catalogStatus)) return { open: false, provider, reason: 'catalog_not_for_sale' }
  if (provider === 'none') return { open: false, provider, reason: 'provider_none' }
  const adapter = adapters[provider]
  if (!adapter || !adapter.isConfigured(sku, env)) return { open: false, provider, reason: 'provider_unconfigured' }
  return { open: true, provider, adapter }
}

/** Gate, then ask the adapter for a hosted checkout URL. Never returns a guessed URL. */
export async function openCheckout(
  sku: CommerceSku | null | undefined,
  ctx: CheckoutContext,
  adapters: AdapterRegistry = BASE_ADAPTERS,
): Promise<CheckoutResult> {
  const gate = evaluateCheckoutGate(sku, ctx.env, adapters)
  if (!gate.open || !sku) return { ok: false, provider: gate.provider, reason: gate.open ? 'unknown_product' : gate.reason }
  const url = await gate.adapter.createCheckout(sku, ctx).catch(() => null)
  if (!url) return { ok: false, provider: gate.provider, reason: 'checkout_upstream_failed' }
  return { ok: true, provider: gate.provider, url }
}
