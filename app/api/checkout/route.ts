import { NextResponse } from 'next/server'
import { forwardAnalyticsEvent } from '@/lib/analytics'
import { getOffer } from '@/lib/offers'
import {
  analyticsClientKey,
  consumeAnalyticsRateLimit,
  hasJsonContentType,
  isSameOriginRequest,
  readBoundedJson,
} from '@/lib/api-security'
import { checkoutMode } from '@/lib/commerce/checkout'
import { commerceGate, openCommerceCheckout } from '@/lib/commerce/server'
import type { CheckoutClosedReason } from '@/lib/commerce/types'
import { findCatalogProduct } from '@/lib/polar'
import { appendTrackingParams } from '@/lib/tracking'

/**
 * Both methods go through the provider-neutral commerce gate (lib/commerce/,
 * docs/COMMERCE.md): the catalog status starts with "for sale" AND the
 * provider selected by COMMERCE_PROVIDER is configured for the product (and
 * COMMERCE_KILL_SWITCH is not set). Default — COMMERCE_PROVIDER unset — is
 * closed.
 *
 * GET — the crawlable CTA link. It never creates provider state: it redirects
 * to a static checkout link (`payment_link`), to the offer page when checkout
 * needs a session (`stripe`, `polar` — the page renders the POST buy button),
 * or to the offer's request-access section when closed.
 *
 * POST — creates a provider checkout session for a catalog product id, behind
 * same-origin, content-type, and rate-limit checks.
 */

export async function GET(req: Request) {
  const url = new URL(req.url)
  const slug = url.searchParams.get('offer') ?? ''
  const offer = getOffer(slug)

  if (!offer) {
    await forwardAnalyticsEvent({
      event: 'checkout_redirect',
      offer: slug,
      path: url.pathname,
      state: 'unknown_offer',
      ts: new Date().toISOString(),
    })
    return NextResponse.redirect(new URL('/offers', req.url), 302)
  }

  if (offer.checkout.fallback === 'delivery') {
    const target = appendTrackingParams(new URL('/delivery/starter-kit', req.url), url.searchParams)
    await forwardAnalyticsEvent({
      event: 'checkout_redirect',
      offer: offer.slug,
      path: url.pathname,
      href: `${target.pathname}${target.search}`,
      state: 'internal_delivery',
      ts: new Date().toISOString(),
    })
    return NextResponse.redirect(target, 302)
  }

  const gate = commerceGate(offer.slug)
  const mode = checkoutMode(gate)
  if (mode === 'session') {
    // Sessions are created only by the guarded POST; send the buyer to the
    // offer page, which renders the buy button.
    const target = appendTrackingParams(new URL(`/offers/${offer.slug}`, req.url), url.searchParams)
    await forwardAnalyticsEvent({
      event: 'checkout_redirect',
      offer: offer.slug,
      path: url.pathname,
      href: `${target.pathname}${target.search}`,
      state: 'session_checkout_page',
      ts: new Date().toISOString(),
    })
    return NextResponse.redirect(target, 302)
  }

  const checkout = gate.open
    ? await openCommerceCheckout(offer.slug)
    : ({ ok: false, reason: gate.reason } as const)
  if (checkout.ok) {
    const target = appendTrackingParams(new URL(checkout.url), url.searchParams)
    await forwardAnalyticsEvent({
      event: 'checkout_redirect',
      offer: offer.slug,
      path: url.pathname,
      href: target.toString(),
      state: `provider_checkout:${checkout.provider}`,
      ts: new Date().toISOString(),
    })
    return NextResponse.redirect(target, 302)
  }

  const fallback = appendTrackingParams(new URL(`/offers/${offer.slug}`, req.url), url.searchParams)
  fallback.hash = 'request-access'

  await forwardAnalyticsEvent({
    event: 'checkout_fallback_request',
    offer: offer.slug,
    path: url.pathname,
    href: `${fallback.pathname}${fallback.search}${fallback.hash}`,
    state: checkout.reason,
    ts: new Date().toISOString(),
  })
  return NextResponse.redirect(fallback, 302)
}

/** Public refusal names (kept from the Polar-only POST contract). */
function postRefusal(reason: CheckoutClosedReason): { reason: string; status: number } {
  switch (reason) {
    case 'unknown_product':
      return { reason, status: 404 }
    case 'free_product':
      return { reason, status: 400 }
    case 'kill_switch':
      return { reason, status: 503 }
    case 'catalog_not_for_sale':
      return { reason: 'checkout_gated', status: 503 }
    case 'checkout_upstream_failed':
      return { reason, status: 502 }
    default:
      return { reason: 'checkout_unconfigured', status: 503 }
  }
}

/**
 * Create a provider checkout session for a catalog product.
 *
 * Every refusal carries a machine-readable `reason` so the buy button can
 * render the honest state instead of guessing:
 *   404 unknown_product          — no such id in products/catalog.json
 *   400 free_product             — priced at zero; delivered on-site, not sold
 *   503 kill_switch              — COMMERCE_KILL_SWITCH closes every checkout
 *   503 checkout_gated           — catalog status is not a purchasable state
 *   503 checkout_unconfigured    — no COMMERCE_PROVIDER, or it is not configured
 *   502 checkout_upstream_failed — the provider refused or answered unusably
 *
 * No path returns a fabricated session, price, or availability.
 */
export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ ok: false, reason: 'origin_not_allowed' }, { status: 403 })
  }
  if (!hasJsonContentType(req)) {
    return NextResponse.json({ ok: false, reason: 'unsupported_media_type' }, { status: 415 })
  }

  const clientKey = analyticsClientKey(req)
  if (!clientKey) {
    return NextResponse.json({ ok: false, reason: 'client_unidentified' }, { status: 403 })
  }
  const rateLimit = consumeAnalyticsRateLimit(`checkout:${clientKey}`)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, reason: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    )
  }

  const body = await readBoundedJson(req)
  if (!body.ok) {
    return NextResponse.json(
      { ok: false, reason: body.error },
      { status: body.error === 'payload_too_large' ? 413 : 400 },
    )
  }

  const payload = (typeof body.value === 'object' && body.value !== null ? body.value : {}) as Record<
    string,
    unknown
  >
  const productId = typeof payload.productId === 'string' ? payload.productId.trim() : ''
  const product = productId ? findCatalogProduct(productId) : undefined

  if (!product) {
    await forwardAnalyticsEvent({
      event: 'checkout_fallback_request',
      offer: productId,
      state: 'unknown_product',
      ts: new Date().toISOString(),
    })
    return NextResponse.json({ ok: false, reason: 'unknown_product' }, { status: 404 })
  }

  const checkout = await openCommerceCheckout(product.id)
  if (!checkout.ok) {
    const refusal = postRefusal(checkout.reason)
    await forwardAnalyticsEvent({
      event: 'checkout_fallback_request',
      offer: product.id,
      state: checkout.reason,
      ts: new Date().toISOString(),
    })
    return NextResponse.json(
      { ok: false, reason: refusal.reason, productId: product.id, status: product.status },
      { status: refusal.status },
    )
  }

  await forwardAnalyticsEvent({
    event: 'checkout_redirect',
    offer: product.id,
    href: checkout.url,
    state: `provider_checkout:${checkout.provider}`,
    ts: new Date().toISOString(),
  })
  return NextResponse.json({ ok: true, productId: product.id, url: checkout.url })
}
