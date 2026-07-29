import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How Agentic Income handles access requests, analytics events, and outbound links.',
  alternates: { canonical: '/privacy' },
  openGraph: {
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
          <h2 className="text-2xl font-semibold text-ink">Access requests</h2>
          <p className="mt-3">
            When an intake webhook is configured, the email address, source, and application fields are sent to that configured service. When a concierge address is configured, the site prepares a mail message for you to review and send. When neither exists, the application form is disabled; no address is submitted or retained.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-ink">Analytics</h2>
          <p className="mt-3">
            Interaction events can include the page, route, offer, source label, and an opaque request ID. Raw email addresses are not placed in analytics events. Vercel Web Analytics and Speed Insights may process technical request and performance data under their own terms.
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
            The no-secret readiness page shows whether the free product, public proof, selective intake, scope-first service, optional paid checkout, and optional custom analytics forwarding are configured without exposing credentials.
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
