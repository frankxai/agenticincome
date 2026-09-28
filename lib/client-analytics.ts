'use client'

import { track } from '@vercel/analytics'
import { toVercelEventProperties, type AnalyticsEvent } from '@/lib/analytics'

export function trackClientEvent(event: AnalyticsEvent['event'], payload: Omit<AnalyticsEvent, 'event' | 'ts'> = {}) {
  if (typeof window === 'undefined') return

  const fullEvent: AnalyticsEvent = {
    ...payload,
    event,
    path: payload.path ?? window.location.pathname,
    ts: new Date().toISOString(),
  }

  // Vercel Web Analytics custom event (collected once Web Analytics is enabled
  // on the Vercel project and the team is on Pro). Never let it break the UI.
  try {
    track(event, toVercelEventProperties(fullEvent))
  } catch {
    // ignore
  }

  // First-party event, forwarded to ANALYTICS_WEBHOOK_URL when configured.
  const body = JSON.stringify(fullEvent)

  if ('sendBeacon' in navigator) {
    const sent = navigator.sendBeacon('/api/analytics', new Blob([body], { type: 'application/json' }))
    if (sent) return
  }

  void fetch('/api/analytics', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => undefined)
}
