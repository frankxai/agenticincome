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
import { commerceKillSwitchActive } from '@/lib/commerce/config'
import { openCommerceCheckout } from '@/lib/commerce/server'
import {
  catalogRefusal,
  createCheckoutSession,
  findCatalogProduct,
  isCheckoutLive,
} from '@/lib/polar'
import { appendTrackingParams } from '@/lib/tracking'

/**
 * GET — the provider-neutral checkout path (lib/commerce/, docs/COMMERCE.md).
 * Redirects to a hosted checkout only when the double gate holds: the catalog
 * status starts with "for sale" AND the provider selected by COMMERCE_PROVIDER
 * is configured for the product (and COMMERCE_KILL_SWITCH is not set).
 * Otherwise — including the default, where COMMERCE_PROVIDER is unset — it
 * falls back to the offer's request-access section.
 *
 * POST — the Polar API path (lib/polar.ts). Creates a real checkout session
 * for a catalog product id. products/catalog.json is the server-side authority
 * on what may be sold and refuses everything today per its `_checkoutGate`.
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

  const checkout = await openCommerceCheckout(offer.slug)
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

/**
 * Create a Polar checkout session for a catalog product.
 *
 * Every refusal carries a machine-readable `reason` so the buy button can
 * render the honest state instead of guessing:
 *   404 unknown_product          — no such id in products/catalog.json
 *   400 free_product             — priced at zero; delivered on-site, not sold
 *   503 kill_switch              — COMMERCE_KILL_SWITCH closes every checkout
 *   503 checkout_gated           — catalog status is not a purchasable state
 *   503 checkout_unconfigured    — catalog permits it, Polar is not selected/configured
 *   502 checkout_upstream_failed — Polar refused or answered unusably
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

  const refusal = commerceKillSwitchActive()
    ? 'kill_switch'
    : (catalogRefusal(product) ?? (isCheckoutLive(product.id) ? null : 'checkout_unconfigured'))
  if (refusal) {
    await forwardAnalyticsEvent({
      event: 'checkout_fallback_request',
      offer: product.id,
      state: refusal,
      ts: new Date().toISOString(),
    })
    return NextResponse.json(
      { ok: false, reason: refusal, productId: product.id, status: product.status },
      { status: refusal === 'free_product' ? 400 : 503 },
    )
  }

  const url = await createCheckoutSession(product.id)
  if (!url) {
    await forwardAnalyticsEvent({
      event: 'checkout_fallback_request',
      offer: product.id,
      state: 'checkout_upstream_failed',
      ts: new Date().toISOString(),
    })
    return NextResponse.json(
      { ok: false, reason: 'checkout_upstream_failed', productId: product.id },
      { status: 502 },
    )
  }

  await forwardAnalyticsEvent({
    event: 'checkout_redirect',
    offer: product.id,
    href: url,
    state: 'provider_checkout',
    ts: new Date().toISOString(),
  })
  return NextResponse.json({ ok: true, productId: product.id, url })
}
