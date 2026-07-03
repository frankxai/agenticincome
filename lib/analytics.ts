export type AnalyticsEvent = {
  event: string
  path?: string
  href?: string
  source?: string
  offer?: string
  tool?: string
  state?: string
  requestId?: string
  ts?: string
}

const ALLOWED_EVENTS = new Set([
  'affiliate_click',
  'checkout_click',
  'checkout_redirect',
  'checkout_fallback_request',
  'delivery_view',
  'offer_view',
  'subscribe_success',
  'subscribe_error',
])

function clean(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.slice(0, 240) || undefined
}

export function normalizeAnalyticsEvent(input: unknown): AnalyticsEvent | null {
  if (!input || typeof input !== 'object') return null
  const source = input as Record<string, unknown>
  const event = clean(source.event)

  if (!event || !ALLOWED_EVENTS.has(event)) return null

  return {
    event,
    path: clean(source.path),
    href: clean(source.href),
    source: clean(source.source),
    offer: clean(source.offer),
    tool: clean(source.tool),
    state: clean(source.state),
    requestId: clean(source.requestId),
    ts: clean(source.ts) ?? new Date().toISOString(),
  }
}

export async function forwardAnalyticsEvent(event: AnalyticsEvent): Promise<boolean> {
  const webhook = process.env.ANALYTICS_WEBHOOK_URL
  if (!webhook || !webhook.startsWith('http')) return false

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 1500)

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...event,
        site: 'agenticincome.ai',
      }),
      signal: controller.signal,
    })
    return response.ok
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}
