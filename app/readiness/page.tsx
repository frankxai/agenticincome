import type { Metadata } from 'next'
import Link from 'next/link'
import { getLaunchReadiness } from '@/lib/readiness'

export const metadata: Metadata = {
  title: 'Launch Readiness',
  description: 'Evidence-gated production readiness for Agentic Income checkout and fulfilment.',
  robots: { index: false, follow: false },
}

export default function ReadinessPage() {
  const readiness = getLaunchReadiness()
  const statusText = readiness.fullLaunchReady ? 'Full launch ready' : 'Paid launch blocked'

  return (
    <div className="py-16">
      <section className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div>
          <div className="kicker">Launch readiness</div>
          <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[1.02] text-ink">A configured checkout is not a fulfilled order.</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            This page separates runtime configuration from reviewed commercial evidence. Paid launch waits for merchant eligibility, owned rights, complete terms and an independently tested payment-to-delivery-and-recovery path.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/trust" className="cta">Trust standard</Link>
            <Link href="/offers" className="cta-secondary">Review offers</Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-surface/80 p-5">
          <div className="text-sm font-semibold text-gold">{statusText}</div>
          <div className="mt-3 text-4xl font-semibold text-ink">
            {readiness.configuredRequired}/{readiness.requiredTotal}
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">
            Required gates satisfied. Commercial evidence across {readiness.evidenceOfferTotal} offers: {readiness.verifiedEvidenceGates}/{readiness.evidenceGateTotal}. Current capture mode: {readiness.captureMode.replace('_', ' ')}.
          </p>
        </aside>
      </section>

      <section className="section-band">
        <div className="grid gap-4 md:grid-cols-2">
          {readiness.items.map((item) => {
            const badge = item.requirement === 'evidence'
              ? item.configured ? 'Verified' : 'Unverified'
              : item.configured ? 'Configured' : 'Missing'
            return (
              <article key={item.id} className="card motion-reveal">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-gold">{item.category}</div>
                  <div className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${item.configured ? 'border-accent/50 text-accent' : 'border-gold/40 text-gold'}`}>
                    {badge}
                  </div>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-ink">{item.label}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{item.detail}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="section-band max-w-4xl border-t border-border pt-8 text-sm leading-6 text-muted">
        <p>
          The machine-readable gate is available at <code>/api/readiness</code>. It returns <code>503</code> until every required configuration and evidence gate is satisfied, and <code>200</code> only when the complete paid-launch contract is verified.
        </p>
      </section>
    </div>
  )
}

