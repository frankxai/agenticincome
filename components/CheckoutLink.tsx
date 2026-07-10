'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { useMemo, useSyncExternalStore } from 'react'
import { appendTrackingParamsToPath } from '@/lib/tracking'
import { TrackedLink } from '@/components/TrackedLink'

type CheckoutLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  offer: string
  source: string
  children: ReactNode
}

export function CheckoutLink({ href, offer, source, children, ...props }: CheckoutLinkProps) {
  const search = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('popstate', onStoreChange)
      return () => window.removeEventListener('popstate', onStoreChange)
    },
    () => window.location.search,
    () => '',
  )
  const trackedHref = useMemo(
    () => appendTrackingParamsToPath(href, new URLSearchParams(search)),
    [href, search],
  )

  return (
    <TrackedLink
      {...props}
      href={trackedHref}
      event="checkout_click"
      payload={{ offer, source }}
    >
      {children}
    </TrackedLink>
  )
}
