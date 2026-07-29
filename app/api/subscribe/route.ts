import { NextResponse } from 'next/server'
import { forwardAnalyticsEvent } from '@/lib/analytics'
import { createSubscribeRequestId } from '@/lib/subscribe-security'
import {
  analyticsClientKey,
  consumeAnalyticsRateLimit,
  hasJsonContentType,
  isSameOriginRequest,
  readBoundedJson,
} from '@/lib/api-security'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PUBLIC_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ROLE_VALUES = new Set(['founder', 'expert', 'creator', 'boutique-team', 'other'])

function conciergeMailto(
  source: string,
  requestId: string,
  application: { role: string; workflow: string; goal: string },
) {
  const contact = process.env.ACCESS_REQUEST_EMAIL
  if (!contact || !PUBLIC_EMAIL_PATTERN.test(contact)) return null

  const subject = encodeURIComponent(`Agentic Income access request ${requestId}`)
  const body = encodeURIComponent(
    [
      `Request ID: ${requestId}`,
      `Source: ${source}`,
      application.role ? `Role: ${application.role}` : '',
      application.workflow ? `Workflow: ${application.workflow}` : '',
      application.goal ? `Desired outcome: ${application.goal}` : '',
      '',
      'Please send this message from the address you want us to use for delivery updates.',
    ].filter(Boolean).join('\n'),
  )

  return `mailto:${contact}?subject=${subject}&body=${body}`
}

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
  const rateLimit = consumeAnalyticsRateLimit(`subscribe:${clientKey}`)
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

  const payload = typeof body.value === 'object' && body.value !== null
    ? body.value as Record<string, unknown>
    : {}
  const { email, source = 'agenticincome', role = '', workflow = '', goal = '' } = payload
  const normalized = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!EMAIL_PATTERN.test(normalized)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  const normalizedSource = typeof source === 'string' && source.trim() ? source.trim().slice(0, 80) : 'agenticincome'
  const normalizedRole = typeof role === 'string' ? role.trim().slice(0, 40) : ''
  const normalizedWorkflow = typeof workflow === 'string' ? workflow.trim().slice(0, 800) : ''
  const normalizedGoal = typeof goal === 'string' ? goal.trim().slice(0, 600) : ''
  const isLabApplication = normalizedSource.includes('outcome-pack-lab')

  if (
    isLabApplication &&
    (
      !ROLE_VALUES.has(normalizedRole) ||
      normalizedWorkflow.length < 20 ||
      normalizedGoal.length < 20
    )
  ) {
    return NextResponse.json({ ok: false, error: 'invalid_application' }, { status: 400 })
  }

  const application = {
    role: normalizedRole,
    workflow: normalizedWorkflow,
    goal: normalizedGoal,
  }
  const requestId = createSubscribeRequestId()
  const webhook = process.env.SUBSCRIBE_WEBHOOK_URL?.trim()
  if (webhook) {
    const response = await fetch(
      webhook,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Idempotency-Key': requestId,
        },
        body: JSON.stringify({
          email: normalized,
          source: normalizedSource,
          requestId,
          application,
          tags: isLabApplication
            ? ['agentic-income', 'outcome-pack-lab', 'founding-cohort']
            : ['agentic-income', 'access-request'],
        }),
        signal: AbortSignal.timeout(5_000),
      },
    ).catch(() => null)

    if (!response?.ok) {
      await forwardAnalyticsEvent({
        event: 'subscribe_error',
        source: normalizedSource,
        state: response ? String(response.status) : 'webhook_unreachable',
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

  const mailto = conciergeMailto(normalizedSource, requestId, application)
  const mode = mailto ? 'manual_email' : 'unwired'

  await forwardAnalyticsEvent({
    event: mode === 'unwired' ? 'subscribe_unwired' : 'subscribe_success',
    source: normalizedSource,
    state: mode,
    requestId,
    ts: new Date().toISOString(),
  })

  if (mode === 'unwired') {
    return NextResponse.json(
      { ok: false, error: 'intake_unavailable' },
      { status: 503, headers: { 'Retry-After': '3600' } },
    )
  }

  return NextResponse.json({
    ok: true,
    mode,
    requestId,
    mailto,
  }, { status: 202 })
}
