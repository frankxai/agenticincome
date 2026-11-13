'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { WaitlistForm, type WaitlistCopy } from '@/lib/demand-capture/WaitlistForm'
import type { WaitlistState } from '@/lib/demand-capture/types'

const PRODUCT_ID = 'agentic-income'

const COPY: Partial<WaitlistCopy> = {
  join: 'Join the waitlist',
  quiet: 'One email when new packs open. Nothing else.',
  consent: 'Email me when new Agentic Income packs open. I can unsubscribe from any email.',
  intro: 'Three optional questions. They help decide what gets built first.',
  doneText: 'You are on the list. Your next step is below: the fit check gives you its answer in your browser before it asks for an address.',
  doneNoPosition: 'You are on the list.',
  done: 'You are on the list.',
  entered: 'You are on the list.',
  enteredNoPosition: 'You are on the list.',
}

/** The handler reads utm_* from the API request URL, so the landing page's campaign parameters ride along on it. */
function waitlistEndpoint() {
  const utm = new URLSearchParams()
  for (const [key, value] of new URLSearchParams(window.location.search)) {
    if (key.startsWith('utm_') && utm.size < 8) utm.set(key, value.slice(0, 100))
  }
  const query = utm.toString()
  return query ? `/api/waitlist?${query}` : '/api/waitlist'
}

type Status =
  | { kind: 'checking' }
  | { kind: 'open'; state: WaitlistState; endpoint: string }
  | { kind: 'closed' }

/**
 * Capture block for the homepage. It asks the server whether the list can record an address before it shows a form,
 * and treats every failure to answer as closed: a form that takes an address nobody stores is worse than no form.
 */
export function HomeWaitlist() {
  const [status, setStatus] = useState<Status>({ kind: 'checking' })

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/waitlist?productId=${PRODUCT_ID}`, { signal: controller.signal, cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: WaitlistState & { open?: boolean }) => {
        setStatus(data.open === true ? { kind: 'open', state: data, endpoint: waitlistEndpoint() } : { kind: 'closed' })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStatus({ kind: 'closed' })
      })
    return () => controller.abort()
  }, [])

  return (
    <section className="home-waitlist section-band" id="waitlist" aria-labelledby="waitlist-title" data-waitlist-state={status.kind}>
      <div className="home-waitlist-inner">
        <div className="home-waitlist-copy">
          <p className="kicker">Waitlist</p>
          <h2 id="waitlist-title">Hear when the next pack opens</h2>
          <p>
            Some packs are still being built and are not on sale. Leave an address and you get one email when new access
            opens. Joining charges nothing.
          </p>
        </div>

        <div className="home-waitlist-form" aria-live="polite">
          {status.kind === 'checking' ? (
            <p className="wl-note" role="status">Checking whether the list is open.</p>
          ) : null}

          {status.kind === 'open' ? (
            <WaitlistForm
              productId={PRODUCT_ID}
              productName="Agentic Income"
              initialState={status.state}
              endpoint={status.endpoint}
              placeholder="you@example.com"
              copy={COPY}
            />
          ) : null}

          {status.kind === 'closed' ? (
            <div className="wl-panel" role="status">
              <p className="wl-panel-title">The waitlist is closed right now.</p>
              <p className="wl-panel-text">
                It cannot record an address at the moment, so there is no form. Nothing you type here would be saved.
              </p>
            </div>
          ) : null}

          <noscript>
            <p className="wl-note">The waitlist form needs JavaScript.</p>
          </noscript>

          <p className="wl-next">
            <span className="wl-label">Next step</span>
            <Link href="/start" className="wl-link">Run the fit check</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
