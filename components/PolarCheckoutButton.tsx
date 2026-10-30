'use client'

import Link from 'next/link'
import { useState } from 'react'
import { trackClientEvent } from '@/lib/client-analytics'

/**
 * Buy control for the Polar API checkout path (POST /api/checkout).
 *
 * Callers must mount it only when `isCheckoutLive()` from lib/polar.ts says so
 * on the server. While checkout is gated the caller keeps rendering the
 * existing request-access CTA, so a gated page ships no purchase affordance
 * and no purchase copy at all — not even in the serialized payload.
 *
 * Second gate: if the API still refuses on click (env pulled, catalog flipped
 * back, Polar down), this says plainly that checkout could not be opened and
 * that nothing was charged, offers a retry, and links `gatedHref` (support).
 * It never asserts availability the server did not confirm, and never invents
 * urgency while waiting.
 */

export function PolarCheckoutButton({
  productId,
  source,
  gatedHref,
  gatedCta,
  buyLabel,
  className = 'cta',
}: {
  productId: string
  source: string
  gatedHref: string
  gatedCta: string
  buyLabel: string
  className?: string
}) {
  const [state, setState] = useState<'idle' | 'loading' | 'refused'>('idle')

  async function startCheckout() {
    setState('loading')
    trackClientEvent('checkout_click', { offer: productId, source })
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const data = await response.json().catch(() => null)
      if (response.ok && data?.ok && typeof data.url === 'string') {
        window.location.assign(data.url)
        return
      }
    } catch {
      // fall through to the honest refusal below
    }
    setState('refused')
  }

  if (state === 'refused') {
    return (
      <div role="status">
        <div className="flex flex-wrap gap-3">
          <button type="button" className={className} onClick={startCheckout}>
            Try checkout again
          </button>
          <Link href={gatedHref} className="cta-secondary">
            {gatedCta}
          </Link>
        </div>
        <p className="mt-2 text-xs leading-6 text-muted">
          Checkout could not be opened just now. Nothing was charged.
        </p>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={className}
      disabled={state === 'loading'}
      onClick={startCheckout}
    >
      {state === 'loading' ? 'Opening checkout…' : buyLabel}
    </button>
  )
}
