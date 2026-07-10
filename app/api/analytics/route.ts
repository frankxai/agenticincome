import { NextResponse } from 'next/server'
import { forwardAnalyticsEvent, normalizeAnalyticsEvent } from '@/lib/analytics'
import {
  analyticsClientKey,
  consumeAnalyticsRateLimit,
  hasJsonContentType,
  isSameOriginRequest,
  readBoundedJson,
} from '@/lib/api-security'

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ ok: false, error: 'origin_not_allowed' }, { status: 403 })
  }
  if (!hasJsonContentType(req)) {
    return NextResponse.json({ ok: false, error: 'unsupported_media_type' }, { status: 415 })
  }

  const clientKey = analyticsClientKey(req)
  if (!clientKey) {
    return NextResponse.json({ ok: false, error: 'client_unidentified' }, { status: 403 })
  }
  const rateLimit = consumeAnalyticsRateLimit(clientKey)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    )
  }

  const body = await readBoundedJson(req)
  if (!body.ok) {
    return NextResponse.json(
      { ok: false, error: body.error },
      { status: body.error === 'payload_too_large' ? 413 : 400 },
    )
  }
  const event = normalizeAnalyticsEvent(body.value)
  if (!event) {
    return NextResponse.json({ ok: false, error: 'invalid_event' }, { status: 400 })
  }

  const forwarded = await forwardAnalyticsEvent(event)
  if (!forwarded) {
    return NextResponse.json({ ok: false, error: 'analytics_unavailable' }, { status: 503 })
  }
  return NextResponse.json({ ok: true })
}
