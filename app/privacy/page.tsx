import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How Agentic Income handles access requests, analytics events, and outbound links.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    ...baseOpenGraph,
    title: 'Privacy',
    description: 'How Agentic Income handles access requests, analytics events, and outbound links.',
    url: '/privacy',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy · Agentic Income',
    description: 'How Agentic Income handles access requests, analytics events, and outbound links.',
  },
}

export default function PrivacyPage() {
  return (
    <div className="py-16">
      <section className="max-w-3xl">
        <div className="kicker">Privacy</div>
        <h1 className="mt-3 text-5xl font-semibold leading-[1.02] text-ink">Data boundaries you can inspect.</h1>
        <p className="mt-5 text-xl leading-8 text-muted">
          Agentic Income uses minimal first-party events to understand which public routes are useful. Access requests are handled according to the runtime state shown below.
        </p>
      </section>

      <section className="section-band max-w-3xl space-y-8 text-sm leading-7 text-muted">
        <div>
          <h2 className="text-2xl font-semibold text-ink">The waitlist</h2>
          <p className="mt-3">
            Joining the waitlist stores your email, your consent, the page you joined from, the referring page, any utm_ tags in the address and the time, in the Agentic Income waitlist database. The optional questions afterwards (expected price, role, how soon, what you are trying to do) are stored only if you answer them. When an email provider is configured for the list, your address is also added there so the launch email can reach you. If the database is not configured, the form says so and nothing is kept.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-ink">Analytics</h2>
          <p className="mt-3">
            Interaction events can include the page, the destination link, offer, source label, and an opaque request ID. Raw email addresses are not placed in analytics events. Page views and these interaction events are measured with Vercel Web Analytics, which does not use third-party cookies: Vercel counts visitors with a hash of the incoming request that it discards after 24 hours, and reports only aggregated statistics. Interaction events sent to Vercel carry at most two labels (for example the tool and source) and never the destination URL, request ID, or email address. Speed Insights measures page performance under Vercel&apos;s own terms.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-ink">External destinations</h2>
          <p className="mt-3">
            GitHub repositories, tool providers, and future payment providers operate under their own privacy terms. A disclosed affiliate route may identify Agentic Income as the referrer; the recommendation standard remains available on the Trust page.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-ink">Current runtime state</h2>
          <p className="mt-3">
            The no-secret readiness page shows whether intake, paid checkout, and analytics forwarding are configured without exposing credentials.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/readiness" className="cta-secondary">Inspect readiness</Link>
            <Link href="/trust" className="cta-secondary">Read trust standard</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
