import { NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { forwardAnalyticsEvent } from '@/lib/analytics'
import { checkRateLimit, clientKeyFromHeaders } from '@agentic-income/engine'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PUBLIC_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function requestIdFor(email: string, source: string) {
  const day = new Date().toISOString().slice(0, 10)
  return createHash('sha256').update(`${day}:${source}:${email}`).digest('hex').slice(0, 12).toUpperCase()
}

function conciergeMailto(email: string, source: string, requestId: string) {
  const contact = process.env.ACCESS_REQUEST_EMAIL
  if (!contact || !PUBLIC_EMAIL_PATTERN.test(contact)) return null

  const subject = encodeURIComponent(`Agentic Income access request ${requestId}`)
  const body = encodeURIComponent(
    [
      `Request ID: ${requestId}`,
      `Source: ${source}`,
      `Email: ${email}`,
      '',
      'I want access to the Agentic Income offer above. Please send the next available checkout or onboarding path.',
    ].join('\n'),
  )

  return `mailto:${contact}?subject=${subject}&body=${body}`
}

export async function POST(req: Request) {
  const { allowed } = checkRateLimit(clientKeyFromHeaders(req.headers, 'subscribe'), 5, 60_000)
  if (!allowed) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  const { email, source = 'agenticincome' } = await req.json().catch(() => ({}))
  const normalized = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!EMAIL_PATTERN.test(normalized)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  const normalizedSource = typeof source === 'string' && source.trim() ? source.trim().slice(0, 80) : 'agenticincome'
  const requestId = requestIdFor(normalized, normalizedSource)
  const webhook = process.env.SUBSCRIBE_WEBHOOK_URL
  if (webhook) {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
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

  const mailto = conciergeMailto(normalized, normalizedSource, requestId)
  const mode = mailto ? 'manual_email' : 'unwired'

  await forwardAnalyticsEvent({
    event: 'subscribe_success',
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
