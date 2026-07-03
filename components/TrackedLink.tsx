'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import type { AnalyticsEvent } from '@/lib/analytics'
import { trackClientEvent } from '@/lib/client-analytics'

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: AnalyticsEvent['event']
  payload?: Omit<AnalyticsEvent, 'event' | 'ts'>
  children: ReactNode
}

export function TrackedLink({ event, payload, onClick, children, ...props }: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(clickEvent) => {
        trackClientEvent(event, { ...payload, href: props.href })
        onClick?.(clickEvent)
      }}
    >
      {children}
    </a>
  )
}
