import { NextResponse } from 'next/server'
import registry from '@/data/waitlist-products.json'
import { handleJoin, handleState, isWaitlistOpen, type ProductConfig } from '@/lib/demand-capture/handler'
import type { WaitlistState } from '@/lib/demand-capture/types'
import {
  analyticsClientKey,
  consumeAnalyticsRateLimit,
  hasJsonContentType,
  isSameOriginRequest,
  readBoundedJson,
} from '@/lib/api-security'

/**
 * The shared demand-capture waitlist (lib/demand-capture, PROVENANCE.md), one product: agentic-income.
 * Fails closed. With no KV pair, or without waitlist.ownerConfirmed === true, the state endpoint answers open:false and a join answers 503; nothing is
 * ever reported as recorded unless the store confirmed it.
 */

const NO_STORE = { 'Cache-Control': 'no-store' }
const products = registry.products as ProductConfig[]
const find = (id: unknown) => products.find((product) => product.id === id)

const UNAVAILABLE = 'We could not confirm your signup. Please try again later; if you try again, you will not be added twice.'

/**
 * What the browser may see. handleJoin and handleState return the raw count and the founding-seat arithmetic;
 * a count below the product's publicCountThreshold stays server side, so only the threshold-gated publicCount goes out.
 */
function publicView(state: WaitlistState) {
  return {
    productId: state.productId,
    stage: state.stage,
    position: state.position,
    publicCount: state.publicCount,
    foundingSeatsLeft: null,
    open: true as const,
  }
}

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: 'This request did not come from the site.', code: 'origin_not_allowed' }, { status: 403, headers: NO_STORE })
  }
  if (!hasJsonContentType(req)) {
    return NextResponse.json({ error: 'Send JSON.', code: 'unsupported_media_type' }, { status: 415, headers: NO_STORE })
  }
  const clientKey = analyticsClientKey(req)
  if (!clientKey) {
    return NextResponse.json({ error: 'This request could not be identified.', code: 'client_unidentified' }, { status: 403, headers: NO_STORE })
  }
  const rateLimit = consumeAnalyticsRateLimit(`waitlist:${clientKey}`)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a minute and try again.', code: 'rate_limited' },
      { status: 429, headers: { ...NO_STORE, 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    )
  }

  const parsed = await readBoundedJson(req)
  if (!parsed.ok) {
    return NextResponse.json(
      { error: 'That request could not be read.', code: parsed.error },
      { status: parsed.error === 'payload_too_large' ? 413 : 400, headers: NO_STORE },
    )
  }
  const body =
    typeof parsed.value === 'object' && parsed.value !== null && !Array.isArray(parsed.value)
      ? (parsed.value as Record<string, unknown>)
      : {}

  const product = find(body.productId)
  if (!product) return NextResponse.json({ error: 'Unknown product' }, { status: 404, headers: NO_STORE })

  try {
    const { status, body: out } = await handleJoin(product, body, req)
    if (status !== 200) return NextResponse.json(out, { status, headers: NO_STORE })
    return NextResponse.json(publicView(out as WaitlistState), { status, headers: NO_STORE })
  } catch (error) {
    // The store's messages name the command, never the address. The visitor gets a plain refusal, not the cause.
    console.error('waitlist: join failed', error instanceof Error ? error.message : 'unknown')
    return NextResponse.json({ error: UNAVAILABLE, code: 'store_unavailable', open: false }, { status: 503, headers: NO_STORE })
  }
}

export async function GET(req: Request) {
  const product = find(new URL(req.url).searchParams.get('productId'))
  if (!product) return NextResponse.json({ error: 'Unknown product' }, { status: 404, headers: NO_STORE })

  // Closed until a store is configured AND waitlist.ownerConfirmed is true (Frank confirms list ownership).
  if (!isWaitlistOpen(product)) {
    return NextResponse.json({ productId: product.id, open: false, reason: 'not_configured' }, { status: 200, headers: NO_STORE })
  }
  try {
    const { body } = await handleState(product)
    if (!body.open) return NextResponse.json({ productId: product.id, open: false, reason: 'not_configured' }, { status: 200, headers: NO_STORE })
    return NextResponse.json(publicView(body), { status: 200, headers: NO_STORE })
  } catch (error) {
    console.error('waitlist: state failed', error instanceof Error ? error.message : 'unknown')
    return NextResponse.json({ productId: product.id, open: false, reason: 'store_unavailable' }, { status: 503, headers: NO_STORE })
  }
}
