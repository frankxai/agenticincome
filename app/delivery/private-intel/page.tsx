import type { Metadata } from 'next'
import Link from 'next/link'
import { TrackOnView } from '@/components/TrackOnView'

export const metadata: Metadata = {
  title: 'Operator Evidence Brief Delivery',
  description: 'Prepared post-checkout delivery desk for the Agentic Income Operator Evidence Brief.',
  robots: { index: false, follow: false },
}

const memberSteps = [
  ['Confirm membership', 'Use the provider receipt as proof of active membership when checkout is live.'],
  ['Read the evidence', 'Start with runtime, authority, evaluation, cost, and priority re-verification changes.'],
  ['Pick one move', 'Choose one bounded system change, validation task, or risk decision before the next brief.'],
  ['Use Q&A window', 'Bring narrow operating, evidence, authority, or evaluation questions to the member window.'],
]

export default function PrivateIntelDelivery() {
  return (
    <div className="py-16">
      <TrackOnView event="delivery_view" payload={{ offer: 'private-intel', source: 'delivery-page' }} />
      <section className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div>
          <div className="kicker">Operator Evidence Brief delivery</div>
          <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[1.02] text-ink">Keep a live Outcome Pack current.</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            This is the prepared post-checkout handoff for the Operator Evidence Brief. It defines the verification rhythm before recurring checkout is connected.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/offers/private-intel" className="cta">
              Review membership
            </Link>
            <Link href="/trust" className="cta-secondary">
              Trust standard
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-surface/80 p-5">
          <div className="text-sm font-semibold text-gold">Launch state</div>
          <p className="mt-3 text-sm leading-6 text-muted">
            Recurring checkout must be connected before this membership is sold publicly. Until then, the public CTA routes to request-access.
          </p>
        </aside>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Member rhythm</div>
          <h2>Verify, choose, act, record.</h2>
          <p>The membership is valuable only when it turns market change into a concrete next move.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {memberSteps.map(([title, body], index) => (
            <div key={title} className="card motion-reveal">
              <div className="font-mono text-sm font-semibold text-accent">{String(index + 1).padStart(2, '0')}</div>
              <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band rounded-2xl border border-border bg-surface/70 p-6 sm:p-8">
        <div className="kicker">Current access state</div>
        <h2 className="mt-3 text-3xl font-semibold text-ink">Membership delivery is not live yet.</h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted">
          Recurring checkout and owned-audience intake are not connected, so this page does not
          pretend to retain a request. Current public research and operating contracts remain open.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/blog" className="cta">Read public research</Link>
          <Link href="/proof" className="cta-secondary">Inspect the proof standard</Link>
        </div>
      </section>
    </div>
  )
}
