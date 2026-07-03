'use client'

import type { AnalyticsEvent } from '@/lib/analytics'

export function trackClientEvent(event: AnalyticsEvent['event'], payload: Omit<AnalyticsEvent, 'event' | 'ts'> = {}) {
  if (typeof window === 'undefined') return

  const body = JSON.stringify({
    ...payload,
    event,
    path: payload.path ?? window.location.pathname,
    ts: new Date().toISOString(),
  })

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
