'use client'

import { type FormEvent, useMemo, useState } from 'react'

type RequestState = {
  organization: string
  request: string
  currentProcess: string
  success: string
  constraints: string
  urgency: string
}

const initialState: RequestState = {
  organization: '',
  request: '',
  currentProcess: '',
  success: '',
  constraints: '',
  urgency: 'This month',
}

function answered(value: string, fallback: string) {
  const normalized = value.trim().replace(/\s+/g, ' ')
  return normalized || fallback
}

export function RequestToQuoteDesk() {
  const [request, setRequest] = useState<RequestState>(initialState)
  const [artifactId, setArtifactId] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const artifact = useMemo(() => {
    if (!artifactId) return ''

    return [
      `# Request-to-Quote Brief · ${artifactId}`,
      '',
      `Organization: ${answered(request.organization, 'Not provided')}`,
      `Requested outcome: ${answered(request.request, 'Needs discovery')}`,
      `Current process: ${answered(request.currentProcess, 'Needs discovery')}`,
      `Acceptance signal: ${answered(request.success, 'Must be agreed before implementation')}`,
      `Constraints and non-goals: ${answered(request.constraints, 'Must be agreed before implementation')}`,
      `Requested timing: ${request.urgency}`,
      '',
      '## Proposed next decision',
      'Run a human-led scope review. Confirm data access, authority, failure handling, acceptance checks, support, and commercial terms before implementation.',
      '',
      '## Agent authority',
      'Allowed now: clarify missing information, draft workflow options, prepare acceptance checks, and estimate implementation effort.',
      'Not allowed: send a quote, promise an outcome, sign terms, access production credentials, or move money.',
      '',
      '## Required evidence',
      '- Approved request and non-goals',
      '- Named principal and customer-facing sender',
      '- Test data or sandbox path',
      '- Acceptance checks and failure path',
      '- Scope, price, support, and cancellation terms',
    ].join('\n')
  }, [artifactId, request])

  function update<K extends keyof RequestState>(key: K, value: RequestState[K]) {
    setRequest((current) => ({ ...current, [key]: value }))
    setArtifactId(null)
    setCopyState('idle')
  }

  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setArtifactId(`RTQ-${Date.now().toString(36).toUpperCase()}`)
    setCopyState('idle')
  }

  async function copyArtifact() {
    try {
      await navigator.clipboard.writeText(artifact)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <section className="section-band" aria-labelledby="rtq-desk-title">
      <div className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-8">
        <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="kicker">Outcome Pack · RTQ-001</div>
            <h2 id="rtq-desk-title" className="mt-2 text-3xl font-semibold text-ink">Create the review artifact.</h2>
          </div>
          <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent">
            No network request
          </div>
        </div>

        <div className="mt-7 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <form onSubmit={generate} className="grid content-start gap-5">
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Organization or customer
              <input
                value={request.organization}
                onChange={(event) => update('organization', event.target.value)}
                maxLength={120}
                autoComplete="organization"
                className="min-h-12 rounded-lg border border-border bg-bg/70 px-4 py-3 font-normal text-ink outline-none focus:border-accent"
                placeholder="Example: North Shore Heating"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-ink">
              What should change for the customer?
              <textarea
                required
                value={request.request}
                onChange={(event) => update('request', event.target.value)}
                maxLength={800}
                rows={4}
                className="rounded-lg border border-border bg-bg/70 px-4 py-3 font-normal text-ink outline-none focus:border-accent"
                placeholder="Example: Respond to qualified service requests within ten minutes with a complete appointment-ready brief."
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-ink">
              How does the work happen today?
              <textarea
                value={request.currentProcess}
                onChange={(event) => update('currentProcess', event.target.value)}
                maxLength={800}
                rows={3}
                className="rounded-lg border border-border bg-bg/70 px-4 py-3 font-normal text-ink outline-none focus:border-accent"
                placeholder="People, inboxes, spreadsheets, delays, and existing tools."
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-ink">
              What would count as accepted delivery?
              <textarea
                required
                value={request.success}
                onChange={(event) => update('success', event.target.value)}
                maxLength={600}
                rows={3}
                className="rounded-lg border border-border bg-bg/70 px-4 py-3 font-normal text-ink outline-none focus:border-accent"
                placeholder="A measurable behavior or reviewable artifact—not a revenue promise."
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-ink">
              Constraints and non-goals
              <textarea
                value={request.constraints}
                onChange={(event) => update('constraints', event.target.value)}
                maxLength={600}
                rows={3}
                className="rounded-lg border border-border bg-bg/70 px-4 py-3 font-normal text-ink outline-none focus:border-accent"
                placeholder="Sensitive data, tools that must remain, actions that require approval, and work outside scope."
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-ink">
              Requested timing
              <select
                value={request.urgency}
                onChange={(event) => update('urgency', event.target.value)}
                className="min-h-12 rounded-lg border border-border bg-bg/70 px-4 py-3 font-normal text-ink outline-none focus:border-accent"
              >
                <option>This week</option>
                <option>This month</option>
                <option>This quarter</option>
                <option>Exploration only</option>
              </select>
            </label>

            <button type="submit" className="cta justify-self-start">
              Generate local brief
            </button>
          </form>

          <div className="min-h-[32rem] rounded-xl border border-border bg-bg/70 p-5" aria-live="polite">
            {artifact ? (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-muted">Review artifact</div>
                    <div className="mt-1 font-mono text-sm font-semibold text-accent">{artifactId}</div>
                  </div>
                  <button type="button" onClick={copyArtifact} className="cta-secondary !min-h-10 !px-4 !py-2 text-xs">
                    {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Select and copy' : 'Copy Markdown'}
                  </button>
                </div>
                <pre className="mt-5 whitespace-pre-wrap break-words font-mono text-xs leading-6 text-muted">{artifact}</pre>
              </div>
            ) : (
              <div className="grid min-h-[28rem] place-items-center text-center">
                <div className="max-w-sm">
                  <div className="text-sm font-semibold text-ink">No brief generated yet.</div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    Required fields stay in this browser tab. Generate a Markdown artifact when the
                    request and acceptance signal are clear enough to review.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
