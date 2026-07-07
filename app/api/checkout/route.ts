import { NextResponse } from 'next/server'
import { forwardAnalyticsEvent } from '@/lib/analytics'
import { checkoutUrl, getOffer } from '@/lib/offers'
import { appendTrackingParams } from '@/lib/tracking'
import { checkRateLimit, clientKeyFromHeaders } from '@agentic-income/engine'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const { allowed } = checkRateLimit(clientKeyFromHeaders(req.headers, 'checkout'), 30, 60_000)
  if (!allowed) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

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

  const liveCheckout = checkoutUrl(offer)
  if (liveCheckout) {
    const target = appendTrackingParams(new URL(liveCheckout), url.searchParams)
    await forwardAnalyticsEvent({
      event: 'checkout_redirect',
      offer: offer.slug,
      path: url.pathname,
      href: target.toString(),
      state: 'provider_checkout',
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
    state: 'checkout_url_missing',
    ts: new Date().toISOString(),
  })
  return NextResponse.redirect(fallback, 302)
}
