import { NextResponse } from 'next/server'
import { forwardAnalyticsEvent, normalizeAnalyticsEvent } from '@/lib/analytics'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const event = normalizeAnalyticsEvent(body)

  if (!event) {
    return NextResponse.json({ ok: false, error: 'invalid_event' }, { status: 400 })
  }

  const forwarded = await forwardAnalyticsEvent(event)
  return NextResponse.json({ ok: true, forwarded })
}
