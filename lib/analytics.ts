const EVENT_PROPERTIES = {
  affiliate_click: ['path', 'href', 'source', 'tool', 'ts'],
  checkout_click: ['path', 'href', 'source', 'offer', 'ts'],
  checkout_redirect: ['path', 'href', 'offer', 'state', 'ts'],
  checkout_fallback_request: ['path', 'href', 'offer', 'state', 'ts'],
  'implementation_request_clicked': ['path', 'href', 'source', 'ts'],
  'open_source_proof_clicked': ['path', 'href', 'source', 'ts'],
  'workflow_proof_clicked': ['path', 'href', 'source', 'ts'],
  delivery_view: ['path', 'offer', 'source', 'ts'],
  offer_view: ['path', 'offer', 'source', 'ts'],
  subscribe_success: ['path', 'source', 'state', 'requestId', 'ts'],
  subscribe_error: ['path', 'source', 'state', 'requestId', 'ts'],
  'subscribe_unwired': ['path', 'source', 'state', 'requestId', 'ts'],
  'subscribe_manual': ['path', 'source', 'state', 'requestId', 'ts'],
  comparison_criteria_opened: ['path', 'source', 'tool', 'state', 'ts'],
  disclosure_seen: ['path', 'source', 'state', 'ts'],
  affiliate_route_clicked: ['path', 'href', 'source', 'tool', 'state', 'ts'],
  owned_offer_clicked: ['path', 'href', 'source', 'tool', 'state', 'ts'],
  unpaid_route_clicked: ['path', 'href', 'source', 'tool', 'state', 'ts'],
  null_link_rendered: ['path', 'source', 'tool', 'state', 'ts'],
  stale_route_seen: ['path', 'source', 'tool', 'state', 'ts'],
  last_verified_visible: ['path', 'source', 'tool', 'state', 'ts'],
  trust_standard_clicked: ['path', 'href', 'source', 'ts'],
  // Server-only: emitted by the verified payment webhook, never accepted from a browser.
  purchase: ['offer', 'state', 'ts'],
  refund: ['offer', 'state', 'ts'],
} as const

export type AnalyticsEventName = keyof typeof EVENT_PROPERTIES

/** Events only the server may emit (after a signed provider webhook). */
const SERVER_ONLY_EVENTS: ReadonlySet<string> = new Set<AnalyticsEventName>(['purchase', 'refund'])

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

/** Validates a client-submitted event. Server-only events are always rejected here. */
export function normalizeAnalyticsEvent(input: unknown): AnalyticsEvent | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null
  const record = input as Record<string, unknown>
  if (typeof record.event !== 'string' || !isAnalyticsEventName(record.event)) return null
  if (SERVER_ONLY_EVENTS.has(record.event)) return null

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

// Vercel Web Analytics custom events accept only 2 properties per event on
// the Pro plan (8 with Web Analytics Plus) and are not collected on Hobby.
// Keep the payload to the two most useful low-cardinality labels. Never send
// href, requestId, or timestamps: Vercel records the page and time itself,
// and hrefs can carry query data.
const VERCEL_PROPERTY_PRIORITY = ['tool', 'offer', 'source', 'state'] as const
export const VERCEL_MAX_EVENT_PROPERTIES = 2

export function toVercelEventProperties(event: AnalyticsEvent): Record<string, string> {
  const properties: Record<string, string> = {}
  for (const key of VERCEL_PROPERTY_PRIORITY) {
    if (Object.keys(properties).length >= VERCEL_MAX_EVENT_PROPERTIES) break
    const value = event[key]
    if (typeof value === 'string' && value) properties[key] = value.slice(0, 96)
  }
  return properties
}
