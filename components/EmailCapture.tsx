'use client'

import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'
import { trackClientEvent } from '@/lib/client-analytics'

type CaptureMode = 'webhook' | 'manual_email' | 'unwired'
type Receipt = { mode: 'webhook' | 'manual_email'; requestId: string; mailto?: string }

export function EmailCapture({
  headline = 'Get the stack that earns',
  sub = 'One email when a new tool is available.',
  source = 'email-capture',
  buttonLabel = 'Subscribe',
  successMessage = 'Your email was received.',
}: {
  headline?: string
  sub?: string
  source?: string
  buttonLabel?: string
  successMessage?: string
}) {
  const [mode, setMode] = useState<CaptureMode | 'checking' | 'unavailable'>('checking')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [receipt, setReceipt] = useState<Receipt | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    async function check() {
      try {
        const res = await fetch('/api/subscribe', {
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]),
          cache: 'no-store',
        })
        const data = res.ok ? await res.json() : null
        const next = data?.mode
        if (!controller.signal.aborted) {
          setMode(next === 'webhook' || next === 'manual_email' || next === 'unwired' ? next : 'unavailable')
        }
      } catch {
        if (!controller.signal.aborted) setMode('unavailable')
      }
    }
    void check()
    return () => controller.abort()
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'loading') return
    const address = new FormData(event.currentTarget).get('email')
    setStatus('loading')
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(mode === 'webhook' ? { email: address, source } : { source }),
      })
      const data = await response.json()
      if (data?.mode === 'unwired') {
        setMode('unwired')
        setStatus('idle')
        return
      }
      if (!response.ok || data?.ok !== true || typeof data.requestId !== 'string' ||
        (data.mode !== 'webhook' && !(data.mode === 'manual_email' && typeof data.mailto === 'string' && data.mailto.startsWith('mailto:')))) {
        throw new Error('intake_unconfirmed')
      }
      setReceipt(data)
      setStatus('idle')
    } catch {
      trackClientEvent('subscribe_error', { source, state: 'unconfirmed' })
      setStatus('error')
    }
  }

  const closed = mode === 'unwired' || mode === 'unavailable'
  return (
    <div className="my-10 card text-center">
      <h3 className="text-2xl font-semibold">{closed ? 'Access requests are paused' : headline}</h3>
      <div className="mx-auto mt-3 max-w-md" aria-live="polite">
        {closed ? (
          <>
            <p className="text-muted">{mode === 'unwired' ? 'Online requests are closed. The free Starter Kit is available now.' : 'Intake availability could not be confirmed. You can still open the free Starter Kit.'}</p>
            <Link href="/delivery/starter-kit" className="cta-secondary mt-4 inline-flex">Open the free Starter Kit</Link>
          </>
        ) : receipt ? (
          <>
            <p>{receipt.mode === 'manual_email' ? 'Send the prepared message from your email app to complete your request.' : successMessage}</p>
            {receipt.mailto && <a href={receipt.mailto} className="cta-secondary mt-4 inline-flex">Open email draft</a>}
            <p className="mt-3 break-all font-mono text-xs text-muted">Reference {receipt.requestId}</p>
          </>
        ) : mode === 'checking' ? (
          <p className="text-muted">Checking access availability…</p>
        ) : (
          <>
            <p className="text-muted">{mode === 'manual_email' ? 'Prepare an email to the team. You choose when to send it.' : sub}</p>
            <form className="mt-5 flex flex-col justify-center gap-3 sm:flex-row" onSubmit={submit}>
              {mode === 'webhook' && (
                <input name="email" type="email" required placeholder="you@email.com" aria-label="Email address"
                  autoComplete="email" className="min-w-0 flex-1 rounded-xl border border-border bg-bg px-5 py-3 text-sm outline-none focus:border-accent" />
              )}
              <button type="submit" className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-bg" disabled={status === 'loading'}>
                {status === 'loading' ? 'Working…' : mode === 'manual_email' ? 'Prepare email request' : buttonLabel}
              </button>
            </form>
            {status === 'error' && <p role="alert" className="mt-3 text-sm text-gold">Your request could not be confirmed. Please try again.</p>}
          </>
        )}
      </div>
      <noscript><Link className="cta-secondary mt-4 inline-flex" href="/delivery/starter-kit">Open the free Starter Kit</Link></noscript>
    </div>
  )
}
