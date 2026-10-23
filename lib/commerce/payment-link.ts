import { httpsUrl } from './config.ts'
import type { CommerceAdapter, CommerceEnv, CommerceSku } from './types.ts'

/**
 * Static checkout link adapter — the pre-kit behavior of lib/offers.ts
 * `checkoutUrl()`: an https URL pasted into the offer's `*_CHECKOUT_URL` env
 * var (a Stripe Payment Link, a Polar link, ...). Opening it still requires
 * the catalog gate in checkout.ts; the env var alone never sells anything.
 */

function linkFor(sku: CommerceSku, env: CommerceEnv): string | null {
  return sku.paymentLinkEnvKey ? httpsUrl(env[sku.paymentLinkEnvKey]) : null
}

export const paymentLinkAdapter: CommerceAdapter = {
  id: 'payment_link',
  // A static URL: following it creates nothing, so the GET redirect may use it.
  createsSession: false,
  isConfigured(sku, env) {
    return linkFor(sku, env) !== null
  },
  async createCheckout(sku, ctx) {
    return linkFor(sku, ctx.env)
  },
}
