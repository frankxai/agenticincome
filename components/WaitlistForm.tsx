'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trackClientEvent } from '@/lib/client-analytics'

export type CaptureMode = 'webhook' | 'manual_email' | 'unwired'

type WaitlistResult = {
  mode?: CaptureMode
  requestId?: string
  mailto?: string | null
}

export function WaitlistForm({
  captureMode,
  source = 'outcome-pack-lab',
}: {
  captureMode: CaptureMode
  source?: string
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<WaitlistResult | null>(null)
  const [error, setError] = useState('')
  const intakeAvailable = captureMode !== 'unwired'

  if (!intakeAvailable) {
    return (
      <div className="waitlist-unavailable" role="status">
        <div className="waitlist-state">Online intake is being connected</div>
        <p>
          No form is shown because this deployment cannot retain a request yet. The free Field Guide
          and public system remain available now; this page will open applications only when the
          intake destination is verified.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/start" className="cta">Start free instead</Link>
          <a
            href="https://github.com/frankxai/agentic-income-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-secondary"
          >
            Watch the public method
          </a>
        </div>
      </div>
    )
  }

  if (status === 'done') {
    return (
      <div className="waitlist-success" role="status" aria-live="polite">
        <div className="waitlist-state">
          {result?.mode === 'manual_email' ? 'One final step' : 'Application received'}
        </div>
        <p>
          {result?.mode === 'manual_email'
            ? 'Open the prepared email below to send the application. It is not received until you send it.'
            : 'Your application reached the configured intake. We will reply only when the workflow and cohort are a credible fit.'}
        </p>
        {result?.requestId ? (
          <p className="mt-4 font-mono text-xs text-muted">Reference: {result.requestId}</p>
        ) : null}
        {result?.mailto ? (
          <a href={result.mailto} className="cta mt-5 inline-flex">Send the prepared application</a>
        ) : null}
      </div>
    )
  }

  return (
    <form
      className="waitlist-form"
      onSubmit={async (event) => {
        event.preventDefault()
        setStatus('loading')
        setError('')

        const form = new FormData(event.currentTarget)
        const payload = {
          email: String(form.get('email') ?? ''),
          role: String(form.get('role') ?? ''),
          workflow: String(form.get('workflow') ?? ''),
          goal: String(form.get('goal') ?? ''),
          source,
        }

        try {
          const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
          })
          const data = await response.json().catch(() => null)

          if (response.ok && data?.ok) {
            setResult({ mode: data.mode, requestId: data.requestId, mailto: data.mailto })
            setStatus('done')
            return
          }

          trackClientEvent('subscribe_error', { source, state: String(response.status) })
          setError(
            data?.error === 'intake_unavailable'
              ? 'Intake is not connected. Nothing was stored.'
              : 'The application did not send. Review the fields and try once more.',
          )
          setStatus('error')
        } catch {
          trackClientEvent('subscribe_error', { source, state: 'network_error' })
          setError('The network request failed. Nothing was stored; please try again.')
          setStatus('error')
        }
      }}
    >
      <div className="waitlist-field">
        <label htmlFor="waitlist-email">Email <span aria-hidden="true">*</span></label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@company.com"
        />
        <p>Used only for this application and cohort updates.</p>
      </div>

      <div className="waitlist-field">
        <label htmlFor="waitlist-role">Which best describes you? <span aria-hidden="true">*</span></label>
        <select id="waitlist-role" name="role" required defaultValue="">
          <option value="" disabled>Select one</option>
          <option value="founder">Founder or owner</option>
          <option value="expert">Domain expert or consultant</option>
          <option value="creator">Creator or educator</option>
          <option value="boutique-team">Boutique team or agency</option>
          <option value="other">Another accountable operator</option>
        </select>
      </div>

      <div className="waitlist-field">
        <label htmlFor="waitlist-workflow">What real workflow can you judge? <span aria-hidden="true">*</span></label>
        <textarea
          id="waitlist-workflow"
          name="workflow"
          required
          minLength={20}
          maxLength={800}
          rows={4}
          placeholder="Describe the buyer, the job, the current process, and why you understand good work here."
        />
      </div>

      <div className="waitlist-field">
        <label htmlFor="waitlist-goal">What should be true after the Lab? <span aria-hidden="true">*</span></label>
        <textarea
          id="waitlist-goal"
          name="goal"
          required
          minLength={20}
          maxLength={600}
          rows={3}
          placeholder="Name the accepted outcome or operating decision you want to reach."
        />
      </div>

      <button type="submit" className="cta w-full sm:w-auto" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting application…' : 'Apply to the founding Lab'}
      </button>

      <div aria-live="polite" role={status === 'error' ? 'alert' : 'status'}>
        {status === 'error' ? <p className="waitlist-error">{error}</p> : null}
      </div>

      <p className="waitlist-privacy">
        No payment. No guaranteed place. No income promise. Read the <Link href="/privacy">privacy note</Link>.
      </p>
    </form>
  )
}
