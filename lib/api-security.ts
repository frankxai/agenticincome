import { createHash } from 'node:crypto'

export const ANALYTICS_MAX_BODY_BYTES = 4096
export const ANALYTICS_RATE_LIMIT = 30
export const ANALYTICS_RATE_WINDOW_MS = 60_000
const ANALYTICS_MAX_RATE_BUCKETS = 10_000

type RateBucket = { count: number; startedAt: number }
const rateBuckets = new Map<string, RateBucket>()

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

export function hasJsonContentType(request: Request) {
  return request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() === 'application/json'
}

export function analyticsClientKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',', 1)[0].trim()
  if (!forwarded || forwarded.length > 128) return null
  return createHash('sha256').update(forwarded).digest('hex').slice(0, 32)
}

export function consumeAnalyticsRateLimit(clientKey: string, now = Date.now()) {
  for (const [key, bucket] of rateBuckets) {
    if (now - bucket.startedAt >= ANALYTICS_RATE_WINDOW_MS) rateBuckets.delete(key)
  }

  const current = rateBuckets.get(clientKey)
  if (!current) {
    if (rateBuckets.size >= ANALYTICS_MAX_RATE_BUCKETS) {
      const oldestKey = rateBuckets.keys().next().value
      if (oldestKey) rateBuckets.delete(oldestKey)
    }
    rateBuckets.set(clientKey, { count: 1, startedAt: now })
    return { allowed: true, retryAfterSeconds: 0 }
  }
  if (current.count >= ANALYTICS_RATE_LIMIT) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((ANALYTICS_RATE_WINDOW_MS - (now - current.startedAt)) / 1000),
      ),
    }
  }
  current.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}

export function resetAnalyticsRateLimitForTests() {
  rateBuckets.clear()
}

export async function readBoundedJson(request: Request): Promise<
  | { ok: true; value: unknown }
  | { ok: false; error: 'payload_too_large' | 'invalid_json' }
> {
  const declaredLength = request.headers.get('content-length')
  if (declaredLength !== null) {
    const parsedLength = Number(declaredLength)
    if (!Number.isInteger(parsedLength) || parsedLength < 0) return { ok: false, error: 'invalid_json' }
    if (parsedLength > ANALYTICS_MAX_BODY_BYTES) return { ok: false, error: 'payload_too_large' }
  }

  const text = await request.text()
  if (new TextEncoder().encode(text).byteLength > ANALYTICS_MAX_BODY_BYTES) {
    return { ok: false, error: 'payload_too_large' }
  }
  try {
    return { ok: true, value: JSON.parse(text) }
  } catch {
    return { ok: false, error: 'invalid_json' }
  }
}
