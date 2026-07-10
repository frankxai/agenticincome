import { NextResponse } from 'next/server'
import { forwardAnalyticsEvent } from '@/lib/analytics'
import { createSubscribeRequestId } from '@/lib/subscribe-security'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PUBLIC_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function conciergeMailto(source: string, requestId: string) {
  const contact = process.env.ACCESS_REQUEST_EMAIL
  if (!contact || !PUBLIC_EMAIL_PATTERN.test(contact)) return null

  const subject = encodeURIComponent(`Agentic Income access request ${requestId}`)
  const body = encodeURIComponent(
    [
      `Request ID: ${requestId}`,
      `Source: ${source}`,
      'Please send this message from the address you want us to use for delivery updates.',
      '',
      'I want access to the Agentic Income offer above. Please send the next available checkout or onboarding path.',
    ].join('\n'),
  )

  return `mailto:${contact}?subject=${subject}&body=${body}`
}

export async function POST(req: Request) {
  const { email, source = 'agenticincome' } = await req.json().catch(() => ({}))
  const normalized = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!EMAIL_PATTERN.test(normalized)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  const normalizedSource = typeof source === 'string' && source.trim() ? source.trim().slice(0, 80) : 'agenticincome'
  const requestId = createSubscribeRequestId()
  const webhook = process.env.SUBSCRIBE_WEBHOOK_URL
  if (webhook) {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Idempotency-Key': requestId,
      },
      body: JSON.stringify({
        email: normalized,
        source: normalizedSource,
        requestId,
        tags: ['agentic-income', 'payer-brief'],
      }),
    })

    if (!response.ok) {
      await forwardAnalyticsEvent({
        event: 'subscribe_error',
        source: normalizedSource,
        state: String(response.status),
        requestId,
        ts: new Date().toISOString(),
      })
      return NextResponse.json({ ok: false, error: 'subscribe_failed' }, { status: 502 })
    }

    await forwardAnalyticsEvent({
      event: 'subscribe_success',
      source: normalizedSource,
      state: 'webhook',
      requestId,
      ts: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true, mode: 'webhook', requestId })
  }

  const mailto = conciergeMailto(normalizedSource, requestId)
  const mode = mailto ? 'manual_email' : 'unwired'

  await forwardAnalyticsEvent({
    event: mode === 'unwired' ? 'subscribe_unwired' : 'subscribe_success',
    source: normalizedSource,
    state: mode,
    requestId,
    ts: new Date().toISOString(),
  })

  return NextResponse.json({
    ok: true,
    mode,
    requestId,
    mailto,
  }, { status: 202 })
}
