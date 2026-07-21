const EVENT_PROPERTIES = {
  affiliate_click: ['path', 'href', 'source', 'tool', 'ts'],
  checkout_click: ['path', 'href', 'source', 'offer', 'ts'],
  checkout_redirect: ['path', 'href', 'offer', 'state', 'ts'],
  checkout_fallback_request: ['path', 'href', 'offer', 'state', 'ts'],
  'start_path_clicked': ['path', 'href', 'source', 'ts'],
  'implementation_request_clicked': ['path', 'href', 'source', 'ts'],
  'open_source_proof_clicked': ['path', 'href', 'source', 'ts'],
  'workflow_proof_clicked': ['path', 'href', 'source', 'ts'],
  delivery_view: ['path', 'offer', 'source', 'ts'],
  offer_view: ['path', 'offer', 'source', 'ts'],
  subscribe_success: ['path', 'source', 'state', 'requestId', 'ts'],
  subscribe_error: ['path', 'source', 'state', 'requestId', 'ts'],
  'subscribe_unwired': ['path', 'source', 'state', 'requestId', 'ts'],
  comparison_criteria_opened: ['path', 'source', 'tool', 'state', 'ts'],
  disclosure_seen: ['path', 'source', 'state', 'ts'],
  affiliate_route_clicked: ['path', 'href', 'source', 'tool', 'state', 'ts'],
  owned_offer_clicked: ['path', 'href', 'source', 'tool', 'state', 'ts'],
  unpaid_route_clicked: ['path', 'href', 'source', 'tool', 'state', 'ts'],
  null_link_rendered: ['path', 'source', 'tool', 'state', 'ts'],
  stale_route_seen: ['path', 'source', 'tool', 'state', 'ts'],
  last_verified_visible: ['path', 'source', 'tool', 'state', 'ts'],
  trust_standard_clicked: ['path', 'href', 'source', 'ts'],
} as const

export type AnalyticsEventName = keyof typeof EVENT_PROPERTIES

export type AnalyticsEvent = {
  event: AnalyticsEventName
  path?: string
  href?: string
  source?: string
  offer?: string
  tool?: string
  state?: string
  requestId?: string
  ts?: string
}

type AnalyticsProperty = Exclude<keyof AnalyticsEvent, 'event'>

const PROPERTY_LIMITS: Record<AnalyticsProperty, number> = {
  path: 512,
  href: 512,
  source: 96,
  offer: 96,
  tool: 96,
  state: 96,
  requestId: 80,
  ts: 40,
}

function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return Object.prototype.hasOwnProperty.call(EVENT_PROPERTIES, value)
}

export function normalizeAnalyticsEvent(input: unknown): AnalyticsEvent | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null
  const record = input as Record<string, unknown>
  if (typeof record.event !== 'string' || !isAnalyticsEventName(record.event)) return null

  const allowedProperties = new Set<string>(['event', ...EVENT_PROPERTIES[record.event]])
  if (Object.keys(record).some((key) => !allowedProperties.has(key))) return null

  const normalized: AnalyticsEvent = { event: record.event }
  for (const property of EVENT_PROPERTIES[record.event] as readonly AnalyticsProperty[]) {
    const value = record[property]
    if (value === undefined) continue
    if (
      typeof value !== 'string' ||
      value !== value.trim() ||
      !value ||
      value.length > PROPERTY_LIMITS[property]
    ) return null
    normalized[property] = value
  }

  if (normalized.ts && Number.isNaN(Date.parse(normalized.ts))) return null
  return normalized
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
      body: JSON.stringify({ ...event, site: 'agenticincome.ai' }),
      signal: controller.signal,
    })
    return response.ok
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}
