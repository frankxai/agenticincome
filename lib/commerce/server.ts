import { getOffer } from '@/lib/offers'
import { createCheckoutSession, findCatalogProduct, isPolarConfigured } from '@/lib/polar'
import { BASE_ADAPTERS, evaluateCheckoutGate, openCheckout, type AdapterRegistry } from './checkout.ts'
import { COMMERCE_SITE, processEnv } from './config.ts'
import type { CheckoutResult, CommerceAdapter, CommerceSku } from './types.ts'

/**
 * Next.js wiring for the commerce kit: joins products/catalog.json (status,
 * price) with lib/offers.ts (paths, payment-link env key) into a CommerceSku,
 * and adds the Polar adapter. Import only from route handlers and server
 * components.
 */

const polarAdapter: CommerceAdapter = {
  id: 'polar',
  isConfigured: (sku) => isPolarConfigured(sku.sku),
  createCheckout: (sku) => createCheckoutSession(sku.sku),
}

const ADAPTERS: AdapterRegistry = { ...BASE_ADAPTERS, polar: polarAdapter }

export function commerceSkuFor(slug: string): CommerceSku | null {
  const product = findCatalogProduct(slug)
  const offer = getOffer(slug)
  if (!product || !offer) return null
  return {
    site: COMMERCE_SITE,
    sku: product.id,
    name: product.name,
    priceCents: product.price_cents,
    currency: 'usd',
    interval: product.interval === 'month' ? 'month' : null,
    catalogStatus: product.status,
    entitlement: `${COMMERCE_SITE}:${product.id}`,
    deliveryPath: product.delivery.path,
    cancelPath: `/offers/${offer.slug}`,
    paymentLinkEnvKey: offer.checkout.envKey,
  }
}

/** Render-time truth for CTAs: the same double gate the checkout route enforces. */
export function isCommerceCheckoutOpen(slug: string): boolean {
  return evaluateCheckoutGate(commerceSkuFor(slug), processEnv(), ADAPTERS).open
}

export function openCommerceCheckout(slug: string): Promise<CheckoutResult> {
  return openCheckout(commerceSkuFor(slug), { env: processEnv(), fetch }, ADAPTERS)
}
