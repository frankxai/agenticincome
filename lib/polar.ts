import catalog from '../products/catalog.json' with { type: 'json' }

/**
 * Server-side Polar.sh checkout client. Import only from route handlers and
 * server components — it reads secrets from process.env.
 *
 * This is the API-created-session path. The static checkout-link path in
 * lib/offers.ts (`checkoutUrl`) applies the same catalog gate, so a configured
 * link or token never overrides the catalog's sale state.
 *
 * Fail-closed by construction. Three independent gates must all pass:
 *
 *   1. the catalog entry's `status` must start with "for sale" (see
 *      `_checkoutGate` in products/catalog.json),
 *   2. the product must be mapped to a POLAR_PRODUCT_ID_* env var, and
 *   3. that env var and POLAR_ACCESS_TOKEN must both be set.
 *
 * With none of the env set and today's catalog, every entry point refuses and
 * every surface renders the honest waitlist state.
 *
 * The buy path end to end:
 *   offer page -> POST /api/checkout -> createCheckoutSession() -> Polar hosted
 *   checkout -> /checkout/success?checkout_id=… -> verifyCheckout() -> delivery
 *   desk. Polar, as merchant of record, sends the receipt and delivers the
 *   file/licence benefits; this site never claims a payment it did not verify.
 */

const POLAR_API_BASES = {
  production: 'https://api.polar.sh/v1',
  sandbox: 'https://sandbox-api.polar.sh/v1',
} as const
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

/** Polar substitutes this literal in `success_url` with the checkout id. */
const CHECKOUT_ID_PLACEHOLDER = '{CHECKOUT_ID}'

export const CHECKOUT_SUCCESS_PATH = '/checkout/success'

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

/** Every catalog product with a non-zero price — the SKUs the buy path covers. */
export function pricedCatalogProducts(): readonly CatalogProduct[] {
  return PRODUCTS.filter((product) => product.price_cents > 0)
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

function polarToken(): string | null {
  return process.env.POLAR_ACCESS_TOKEN?.trim() || null
}

/**
 * POLAR_SERVER=sandbox points every call at Polar's sandbox so a full test
 * purchase can run with test cards. Anything else, including unset, is
 * production — there is no free-form base URL to misconfigure.
 */
function polarApiBase(): string {
  return process.env.POLAR_SERVER?.trim().toLowerCase() === 'sandbox'
    ? POLAR_API_BASES.sandbox
    : POLAR_API_BASES.production
}

/**
 * True when this specific product could reach Polar right now: an access token
 * plus that product's own Polar product id. Per-product on purpose — one
 * configured product must never enable checkout for an unconfigured one.
 */
export function isPolarConfigured(catalogId: string): boolean {
  return Boolean(polarToken()) && Boolean(polarProductId(catalogId))
}

/**
 * True only when the catalog permits the sale AND Polar is configured for it.
 * Public surfaces render from this: false means show the waitlist state.
 */
export function isCheckoutLive(catalogId: string): boolean {
  const product = findCatalogProduct(catalogId)
  if (!product || catalogRefusal(product)) return false
  return isPolarConfigured(catalogId)
}

export type CheckoutReadiness = {
  productId: string
  state: 'live' | CheckoutRefusal
  /**
   * Env var NAMES (never values) still unset for this product. Empty when the
   * blocker is the catalog itself rather than configuration.
   */
  missingEnv: string[]
}

/**
 * Why a product can or cannot be bought right now, for readiness reporting
 * and the activation runbook. Reads env presence only, never values.
 */
export function checkoutReadiness(catalogId: string): CheckoutReadiness {
  const product = findCatalogProduct(catalogId)
  if (!product) return { productId: catalogId, state: 'unknown_product', missingEnv: [] }
  const refusal = catalogRefusal(product)
  if (refusal) return { productId: catalogId, state: refusal, missingEnv: [] }

  const missingEnv: string[] = []
  if (!polarToken()) missingEnv.push('POLAR_ACCESS_TOKEN')
  if (!polarProductId(catalogId)) missingEnv.push(PRODUCT_ID_ENV_KEYS[catalogId])
  if (!successBase()) missingEnv.push('POLAR_SUCCESS_URL')
  // POLAR_SUCCESS_URL is not a hard gate (Polar falls back to its own
  // confirmation page), so a product with only that missing is still live.
  const hardMissing = missingEnv.filter((name) => name !== 'POLAR_SUCCESS_URL')
  return {
    productId: catalogId,
    state: hardMissing.length ? 'checkout_unconfigured' : 'live',
    missingEnv,
  }
}

/** The https site origin buyers return to, or null when unset or not https. */
function successBase(): URL | null {
  const base = process.env.POLAR_SUCCESS_URL?.trim()
  if (!base) return null
  try {
    const url = new URL(base)
    return url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

/**
 * Success URL for a product: POLAR_SUCCESS_URL is the site origin and buyers
 * land on the verifying success page, which then hands off to the catalog's
 * own `delivery.path`. The `{CHECKOUT_ID}` placeholder is appended as a raw
 * string because URL serialisation would percent-encode the braces and Polar
 * would no longer substitute it.
 */
export function successUrl(product: CatalogProduct): string | null {
  const base = successBase()
  if (!base) return null
  const url = new URL(CHECKOUT_SUCCESS_PATH, base)
  url.searchParams.set('product', product.id)
  return `${url.toString()}&checkout_id=${CHECKOUT_ID_PLACEHOLDER}`
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

  const token = polarToken()
  const productId = polarProductId(catalogId)
  if (!token || !productId) return null

  const success = successUrl(product)

  const response = await fetch(`${polarApiBase()}/checkouts/`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    // `products` (array) is the current field; the older singular `product_id`
    // is deprecated. One id per session — this is a single-product checkout.
    // `metadata.catalog_id` lets the success page and Polar's own dashboard
    // tie the order back to the catalog entry.
    body: JSON.stringify({
      products: [productId],
      metadata: { catalog_id: product.id },
      ...(success ? { success_url: success } : {}),
    }),
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

/**
 * What the success page may say about a returning buyer's checkout.
 *
 *   paid          — Polar reports `succeeded`; the order exists.
 *   processing    — Polar reports `confirmed`; payment is still clearing.
 *   not_paid      — `open`, `expired`, or `failed`; no payment was taken.
 *   unverifiable  — no id, malformed id, no token, Polar unreachable, or an
 *                   answer we cannot read. The page then claims nothing.
 */
export type CheckoutVerification =
  | { state: 'paid' | 'processing'; product: CatalogProduct | null }
  | { state: 'not_paid' | 'unverifiable'; product: null }

/** Polar checkout ids are UUIDs; anything else never reaches the API. */
const CHECKOUT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Reverse of PRODUCT_ID_ENV_KEYS for the products configured right now. */
function catalogProductForPolarId(polarId: unknown): CatalogProduct | null {
  if (typeof polarId !== 'string' || !polarId) return null
  for (const catalogId of Object.keys(PRODUCT_ID_ENV_KEYS)) {
    if (polarProductId(catalogId) === polarId) return findCatalogProduct(catalogId) ?? null
  }
  return null
}

/**
 * Look a checkout up on Polar server-side so the success page reports what
 * actually happened rather than trusting query parameters. The product comes
 * from Polar's answer mapped through our own env, never from the URL.
 */
export async function verifyCheckout(checkoutId: string | null | undefined): Promise<CheckoutVerification> {
  const unverifiable = { state: 'unverifiable', product: null } as const
  const id = checkoutId?.trim() ?? ''
  if (!CHECKOUT_ID_PATTERN.test(id)) return unverifiable

  const token = polarToken()
  if (!token) return unverifiable

  const response = await fetch(`${polarApiBase()}/checkouts/${id}`, {
    headers: { authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: 'no-store',
  }).catch(() => null)
  if (!response || !response.ok) return unverifiable

  const session = (await response.json().catch(() => null)) as {
    status?: unknown
    product_id?: unknown
  } | null
  if (!session) return unverifiable

  switch (session.status) {
    case 'succeeded':
      return { state: 'paid', product: catalogProductForPolarId(session.product_id) }
    case 'confirmed':
      return { state: 'processing', product: catalogProductForPolarId(session.product_id) }
    case 'open':
    case 'expired':
    case 'failed':
      return { state: 'not_paid', product: null }
    default:
      return unverifiable
  }
}
