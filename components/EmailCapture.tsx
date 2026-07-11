'use client'

import { useState } from 'react'
import { trackClientEvent } from '@/lib/client-analytics'

type SubscribeResult = {
  mode?: 'webhook' | 'manual_email' | 'unwired'
  requestId?: string
  mailto?: string | null
}

/**
 * Email capture: owned-audience asset. The API route can forward to an ESP
 * through SUBSCRIBE_WEBHOOK_URL without logging raw email addresses. When no
 * capture endpoint exists, it returns a request ID and an honest manual state.
 */
export function EmailCapture({
  headline = 'Get the stack that earns',
  sub = 'One high-signal email when a tool that compounds is available. No noise.',
  source = 'email-capture',
  buttonLabel = 'Subscribe',
  successMessage = 'You are in. Check your inbox for the latest payer brief.',
}: {
  headline?: string
  sub?: string
  source?: string
  buttonLabel?: string
  successMessage?: string
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<SubscribeResult | null>(null)

  const doneMessage =
    result?.mode === 'unwired'
      ? 'This site cannot retain the request yet. Save the reference below and return when online intake is connected.'
      : successMessage

  return (
    <div className="my-10 card text-center">
      <h3 className="text-2xl font-semibold">{headline}</h3>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">{sub}</p>

      {status === 'done' ? (
        <div className="mx-auto mt-5 max-w-md">
          <p className="text-accent font-medium">{doneMessage}</p>
          {result?.requestId ? (
            <div className="mt-4 rounded-xl border border-border bg-bg/70 p-4 text-left">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Access request</div>
              <div className="mt-2 font-mono text-sm text-ink">{result.requestId}</div>
              <p className="mt-2 text-xs leading-5 text-muted">
                Save this ID. It lets the concierge connect your request to the source and offer without exposing your email in analytics.
              </p>
            </div>
          ) : null}
          {result?.mailto ? (
            <a href={result.mailto} className="cta-secondary mt-4 inline-flex">
              Send concierge note
            </a>
          ) : null}
        </div>
      ) : (
        <form
          className="mx-auto mt-5 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget
            const email = (form.elements.namedItem('email') as HTMLInputElement).value
            setStatus('loading')
            try {
              const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, source }),
              })
              const data = await response.json().catch(() => null)
              if (response.ok && data?.ok) {
                setResult({
                  mode: data.mode,
                  requestId: data.requestId,
                  mailto: data.mailto,
                })
                setStatus('done')
              } else {
                trackClientEvent('subscribe_error', { source, state: String(response.status) })
                setStatus('error')
              }
            } catch {
              trackClientEvent('subscribe_error', { source, state: 'network_error' })
              setStatus('error')
            }
          }}
        >
          <input
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            aria-label="Email address"
            autoComplete="email"
            className="flex-1 rounded-xl border border-border bg-bg px-5 py-3 text-sm outline-none focus:border-accent"
          />
          <button type="submit" className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-bg" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending' : buttonLabel}
          </button>
        </form>
      )}

      {status === 'error' ? (
        <p className="mt-3 text-sm text-gold">That did not send. Check the email and try once more.</p>
      ) : null}

      <div className="mt-4 text-[11px] text-muted">
        Your address is sent only to the configured intake service. It is never included in analytics events.
      </div>
    </div>
  )
}
