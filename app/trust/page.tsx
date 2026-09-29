import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import Link from 'next/link'
import { checkoutReadiness, supportPolicies, trustPrinciples } from '@/lib/trust'

export const metadata: Metadata = {
  title: 'Trust Standard',
  description: 'How Agentic Income handles recommendations, affiliate disclosure, checkout readiness, delivery, support, and refunds.',
  alternates: { canonical: '/trust' },
  openGraph: {
    ...baseOpenGraph,
    title: 'Trust Standard',
    description: 'How Agentic Income handles recommendations, affiliate disclosure, checkout readiness, delivery, support, and refunds.',
    url: '/trust',
  },
}

export default function TrustPage() {
  return (
    <div className="py-16">
      <section className="max-w-4xl border-b border-border pb-14">
        <div className="kicker">Trust standard</div>
        <h1 className="mt-3 max-w-4xl break-words text-4xl font-semibold leading-[1.04] text-ink sm:text-5xl">The recommendation is never for sale.</h1>
        <p className="mt-5 text-xl leading-8 text-muted">
          Agentic Income can earn from affiliate links and direct products. The rule is simple: the best fit wins first, the payout route comes second, and the handoff must be clear before anyone clicks.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/tools" className="cta">
            Inspect catalog
          </Link>
          <Link href="/offers" className="cta-secondary">
            Review offers
          </Link>
          <Link href="/readiness" className="cta-secondary">
            Launch readiness
          </Link>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Recommendation policy</div>
          <h2>Useful before monetized.</h2>
          <p>Commercial trust comes from saying how the system behaves when incentives are present.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {trustPrinciples.map((principle) => (
            <div key={principle.title} className="card motion-reveal">
              <div className="text-sm font-semibold text-gold">{principle.title}</div>
              <p className="mt-3 text-sm leading-6 text-muted">{principle.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="section-heading motion-reveal">
            <div className="kicker">Checkout readiness</div>
            <h2>No broken funnel theater.</h2>
            <p>When paid provider links are absent, the site asks for access instead of pretending checkout is live.</p>
          </div>
          <div className="grid gap-3">
            {checkoutReadiness.map((item) => (
              <div key={item} className="rounded-xl border border-border bg-surface/70 p-4 text-sm leading-6 text-muted motion-reveal">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Support and refunds</div>
          <h2>Boundaries are part of the product.</h2>
          <p>Each tier states what is included so the buyer knows whether they are buying a kit, a template system, or recurring intelligence.</p>
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface/80">
          <table className="w-full text-sm">
            <tbody>
              {supportPolicies.map(([label, body]) => (
                <tr key={label} className="border-t border-border first:border-t-0">
                  <th className="w-40 px-5 py-4 text-left font-semibold text-ink">{label}</th>
                  <td className="px-5 py-4 leading-6 text-muted">{body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
