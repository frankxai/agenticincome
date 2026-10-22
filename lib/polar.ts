import catalog from '@/products/catalog.json'

/**
 * Server-side Polar.sh checkout client. Import only from route handlers and
 * server components — it reads secrets from process.env.
 *
 * This is the API-created-session path. It is separate from, and does not
 * replace, the static checkout-link path in lib/offers.ts (`checkoutUrl`) that
 * the GET handler in app/api/checkout/route.ts uses. That path also reads the
 * catalog status below, so neither can open a sale the catalog refuses.
 *
 * Fail-closed by construction. Three independent gates must all pass:
 *
 *   1. the catalog entry's `status` must start with "for sale" (see
 *      `_checkoutGate` in products/catalog.json),
 *   2. the product must be mapped to a POLAR_PRODUCT_ID_* env var, and
 *   3. that env var and POLAR_ACCESS_TOKEN must both be set.
 *
 * With none of the env set and today's catalog, every entry point refuses and
 * every surface renders the honest "not connected" state it renders now.
 */

const POLAR_CHECKOUT_ENDPOINT = 'https://api.polar.sh/v1/checkouts/'
const REQUEST_TIMEOUT_MS = 10_000

/**
 * Catalog id -> the env var holding that product's Polar product id. An
 * explicit map rather than a derived string: an unmapped or misspelled id
 * fails closed instead of resolving to some other product's checkout.
 * `starter-kit` is deliberately absent — it is free and delivered on-site.
 */
const PRODUCT_ID_ENV_KEYS: Record<string, string> = {
  blueprint: 'POLAR_PRODUCT_ID_BLUEPRINT',
  'agent-team-pro': 'POLAR_PRODUCT_ID_AGENT_TEAM_PRO',
  'private-intel': 'POLAR_PRODUCT_ID_PRIVATE_INTEL',
  // Cross-repo packs (payloads live in sibling repos — see each catalog
  // entry's delivery.files). Mapped like agent-team-pro: the row makes
  // activation possible later; the env var stays unset and the catalog
  // status stays gated until the packaged zip exists on Polar.
  'claims-guard-pack': 'POLAR_PRODUCT_ID_CLAIMS_GUARD_PACK',
  'abos-pack-bundle': 'POLAR_PRODUCT_ID_ABOS_PACK_BUNDLE',
  'vibe-os-pack': 'POLAR_PRODUCT_ID_VIBE_OS_PACK',
}

/** The only catalog `status` prefix that means "this may be sold". */
const PURCHASABLE_STATUS_PREFIX = 'for sale'

export type CatalogProduct = {
  id: string
  name: string
  price_cents: number
  interval: string | null
  status: string
  description: string
  delivery: { type: string; path: string; files: string[] }
  license: string
}

/** Why a checkout was refused. Machine-readable; safe to return to a client. */
export type CheckoutRefusal =
  | 'unknown_product'
  | 'free_product'
  | 'checkout_gated'
  | 'checkout_unconfigured'

const PRODUCTS = catalog.products as readonly CatalogProduct[]

export function findCatalogProduct(id: string): CatalogProduct | undefined {
  return PRODUCTS.find((product) => product.id === id)
}

/**
 * The catalog-level refusal for a product, or null when the catalog permits a
 * sale. Pure — it reads the catalog only, never the environment.
 */
export function catalogRefusal(product: CatalogProduct): CheckoutRefusal | null {
  if (product.price_cents === 0) return 'free_product'
  if (!product.status.trim().toLowerCase().startsWith(PURCHASABLE_STATUS_PREFIX)) {
    return 'checkout_gated'
  }
  if (!PRODUCT_ID_ENV_KEYS[product.id]) return 'checkout_gated'
  return null
}

function polarProductId(catalogId: string): string | null {
  const envKey = PRODUCT_ID_ENV_KEYS[catalogId]
  if (!envKey) return null
  return process.env[envKey]?.trim() || null
}

/**
 * True when this specific product could reach Polar right now: an access token
 * plus that product's own Polar product id. Per-product on purpose — one
 * configured product must never enable checkout for an unconfigured one.
 */
export function isPolarConfigured(catalogId: string): boolean {
  return Boolean(process.env.POLAR_ACCESS_TOKEN?.trim()) && Boolean(polarProductId(catalogId))
}

/**
 * True only when the catalog permits the sale AND Polar is configured for it.
 * Public surfaces render from this: false means show the existing
 * request-access state. It is false until ops/POLAR-SETUP.md is completed.
 */
export function isCheckoutLive(catalogId: string): boolean {
  const product = findCatalogProduct(catalogId)
  if (!product || catalogRefusal(product)) return false
  return isPolarConfigured(catalogId)
}

/**
 * Per-product success URL: POLAR_SUCCESS_URL is the site origin, and the path
 * comes from the catalog's own `delivery.path`, so buyers land on the delivery
 * desk for the thing they actually bought. Null when unset or not https.
 */
function successUrl(product: CatalogProduct): string | null {
  const base = process.env.POLAR_SUCCESS_URL?.trim()
  if (!base) return null
  try {
    const url = new URL(product.delivery.path, base)
    return url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}

/**
 * Create a Polar checkout session and return its hosted checkout URL.
 *
 * Returns null — never a placeholder or a guessed URL — when the catalog gate
 * refuses, when config is missing, when Polar errors, or when the response
 * does not carry a usable https URL. Callers translate null into an honest
 * refusal for the buyer.
 */
export async function createCheckoutSession(catalogId: string): Promise<string | null> {
  const product = findCatalogProduct(catalogId)
  if (!product || catalogRefusal(product)) return null

  const token = process.env.POLAR_ACCESS_TOKEN?.trim()
  const productId = polarProductId(catalogId)
  if (!token || !productId) return null

  const success = successUrl(product)

  const response = await fetch(POLAR_CHECKOUT_ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    // `products` (array) is the current field; the older singular `product_id`
    // is deprecated. One id per session — this is a single-product checkout.
    body: JSON.stringify(
      success ? { products: [productId], success_url: success } : { products: [productId] },
    ),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  }).catch(() => null)

  if (!response || !response.ok) return null

  const session = (await response.json().catch(() => null)) as { url?: unknown } | null
  if (!session || typeof session.url !== 'string') return null

  try {
    const url = new URL(session.url)
    return url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}
