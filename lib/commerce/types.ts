/**
 * Provider-neutral commerce contract. Every adapter (Stripe, static payment
 * link, Polar) speaks these types, so the checkout route and the webhook
 * handler never branch on a provider's wire format.
 *
 * Pure types only: no env, no fetch, no Next.js imports. Safe to import from
 * `node --test` suites.
 */

export const COMMERCE_PROVIDERS = ['stripe', 'payment_link', 'polar', 'none'] as const
export type CommerceProviderId = (typeof COMMERCE_PROVIDERS)[number]

/** One sellable thing, assembled from products/catalog.json + lib/offers.ts. */
export type CommerceSku = {
  /** Site slug used in metadata and lookup keys, e.g. `agenticincome`. */
  site: string
  /** Catalog id, e.g. `blueprint`. */
  sku: string
  name: string
  priceCents: number
  /** ISO currency, lowercase (`usd`). */
  currency: string
  /** null = one-time purchase; `month` = subscription. */
  interval: 'month' | null
  /** Raw catalog `status`. Only a value starting with "for sale" can open checkout. */
  catalogStatus: string
  /** Entitlement granted on a paid purchase, e.g. `agenticincome:blueprint`. */
  entitlement: string
  /** Site-relative delivery path, e.g. `/delivery/blueprint`. */
  deliveryPath: string
  /** Site-relative cancel path, e.g. `/offers/blueprint`. */
  cancelPath: string
  /** Env var holding a static https checkout link (payment_link adapter). */
  paymentLinkEnvKey?: string
}

export type CommerceEnv = Readonly<Record<string, string | undefined>>

export type CheckoutContext = {
  env: CommerceEnv
  fetch: typeof fetch
}

/** Why checkout is closed. Machine-readable; safe to send to analytics. */
export type CheckoutClosedReason =
  | 'unknown_product'
  | 'free_product'
  | 'kill_switch'
  | 'catalog_not_for_sale'
  | 'provider_none'
  | 'provider_unconfigured'
  | 'checkout_upstream_failed'

export type CheckoutResult =
  | { ok: true; provider: CommerceProviderId; url: string }
  | { ok: false; reason: CheckoutClosedReason; provider: CommerceProviderId }

export type NormalizedEventType = 'purchase' | 'refund' | 'dispute' | 'payment_failed'

/**
 * A provider event reduced to what fulfillment needs. `transactionId` is the
 * provider's payment id (Stripe: the PaymentIntent) — the one key a purchase,
 * its refund, and its dispute all share.
 */
export type NormalizedCommerceEvent = {
  type: NormalizedEventType
  eventId: string
  sku: string | null
  site: string | null
  entitlement: string | null
  transactionId: string
  email: string | null
  /** Minor units (cents). */
  amount: number
  currency: string
  /** For refunds: true only when the payment is fully refunded. */
  full: boolean
}

export type CommerceAdapter = {
  id: CommerceProviderId
  /**
   * True when createCheckout mutates provider state (creates a session). Such
   * adapters are only reachable through the same-origin, rate-limited POST,
   * never from a crawlable GET link.
   */
  createsSession: boolean
  /** True when the env carries everything this adapter needs for `sku`. No network. */
  isConfigured(sku: CommerceSku, env: CommerceEnv): boolean
  /** A hosted checkout https URL, or null — never a guessed or placeholder URL. */
  createCheckout(sku: CommerceSku, ctx: CheckoutContext): Promise<string | null>
  /**
   * Reduce a verified provider event. Returns null for events that need no
   * action (and `pending` for a completed-but-unpaid session).
   */
  normalizeWebhook?(event: unknown): NormalizedCommerceEvent | 'pending' | null
}
