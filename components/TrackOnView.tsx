'use client'

import { useEffect } from 'react'
import type { AnalyticsEvent } from '@/lib/analytics'
import { trackClientEvent } from '@/lib/client-analytics'

export function TrackOnView({
  event,
  payload = {},
}: {
  event: AnalyticsEvent['event']
  payload?: Omit<AnalyticsEvent, 'event' | 'ts'>
}) {
  useEffect(() => {
    trackClientEvent(event, payload)
  }, [event, payload])

  return null
}
