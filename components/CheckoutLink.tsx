'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { appendTrackingParamsToPath } from '@/lib/tracking'
import { TrackedLink } from '@agentic-income/engine/react.js'

type CheckoutLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  offer: string
  source: string
  children: ReactNode
}

export function CheckoutLink({ href, offer, source, children, ...props }: CheckoutLinkProps) {
  const [trackedHref, setTrackedHref] = useState(href)

  useEffect(() => {
    setTrackedHref(appendTrackingParamsToPath(href, new URLSearchParams(window.location.search)))
  }, [href])

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
