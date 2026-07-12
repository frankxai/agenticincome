import type { Metadata } from 'next'
import Link from 'next/link'
import { DISCLOSURE, payingPrograms } from '@/lib/affiliate'
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure'
import { FaqSection } from '@/components/FaqSection'
import { trustPrinciples } from '@/lib/trust'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description:
    'Agentic Income’s full affiliate disclosure: which links pay us, how much that changes the recommendation (never), and how to verify it yourself.',
  alternates: { canonical: '/disclosure' },
  openGraph: {
    title: 'Affiliate Disclosure',
    description:
      'Agentic Income’s full affiliate disclosure: which links pay us, how much that changes the recommendation (never), and how to verify it yourself.',
    url: '/disclosure',
  },
}

const LAST_UPDATED = '2026-07-12'

const faqs = [
  {
    q: 'Do I pay more because a link is an affiliate link?',
    a: 'No. Affiliate pricing is identical to going direct — in almost every case it is the exact same checkout, same price, same terms. The only difference is the tool’s program credits Agentic Income for the referral.',
  },
  {
    q: 'Does Agentic Income get paid for recommending a tool?',
    a: 'For the tools marked "paid route" or "Some links on this page are affiliate links," yes — the site can earn a commission, and for several programs that commission recurs monthly for as long as you stay subscribed. That is disclosed on every page carrying that link, not buried in a footer.',
  },
  {
    q: 'Does the commission change which tool wins the recommendation?',
    a: 'No. The rule, stated plainly on the /trust page, is: the recommendation has to work without the payout. If the honest answer is a tool with no affiliate program — or a competitor’s tool — that is what gets recommended, and the /trust comparison desk shows unpaid picks winning for exactly this reason.',
  },
  {
    q: 'How do I know which specific links are affiliate links?',
    a: 'Every article that contains an affiliate link carries the disclosure notice above or below the intro, in plain language, before you reach the first link. Affiliate links themselves also carry rel="sponsored" so search engines and browsers can identify them as compensated, per FTC and Google guidance.',
  },
  {
    q: 'Which programs is Agentic Income actually enrolled in right now?',
    a: 'The list below is generated from the same catalog that powers every comparison and the /tools page — it is not a marketing claim, it is the literal data file the site runs on.',
  },
  {
    q: 'How do I raise a concern about a recommendation or this disclosure?',
    a: 'Use the request-access form on any offer page — it reaches the same inbox that handles product and delivery questions. There is no separate compliance address to keep track of.',
  },
]

export default function DisclosurePage() {
  const active = payingPrograms()

  return (
    <div className="py-16">
      <section className="max-w-4xl border-b border-border pb-14">
        <div className="kicker">Affiliate disclosure</div>
        <h1 className="mt-3 max-w-4xl break-words text-4xl font-semibold leading-[1.04] text-ink sm:text-5xl">
          The full, honest disclosure — not the minimum one.
        </h1>
        <p className="mt-5 text-xl leading-8 text-muted">
          This page states, in plain language, exactly how Agentic Income makes money from the links on this site,
          which recommendations are affected by that (none, by design), and how to verify any of it yourself.
        </p>
        <p className="mt-2 text-sm text-muted">Last updated {LAST_UPDATED}.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/trust" className="cta">
            Read the trust standard
          </Link>
          <Link href="/tools" className="cta-secondary">
            Inspect the live catalog
          </Link>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">The disclosure itself</div>
          <h2>Word for word, everywhere it applies.</h2>
          <p>This is the exact sentence that appears on every page carrying an affiliate link — nothing softer runs anywhere else on the site.</p>
        </div>
        <AffiliateDisclosure />
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">What "affiliate link" means here</div>
          <h2>A material connection, stated plainly.</h2>
        </div>
        <div className="mt-6 grid gap-4 text-[15px] leading-7 text-muted md:grid-cols-2">
          <div className="card motion-reveal">
            <div className="text-sm font-semibold text-gold">What it is</div>
            <p className="mt-3">
              Some tools linked from this site are ones Agentic Income has joined an affiliate or referral program
              for. If you click through and buy, the tool’s program may pay Agentic Income a commission —
              sometimes a one-time bounty, sometimes a share of your subscription for as long as you stay a customer.
              This is a real business relationship (a &quot;material connection&quot; in FTC terms) and it is disclosed
              wherever it applies, in the sentence above, before the link.
            </p>
          </div>
          <div className="card motion-reveal">
            <div className="text-sm font-semibold text-gold">What it is not</div>
            <p className="mt-3">
              It is never a paid placement, a sponsored post written to order, or a review swapped for free access.
              Agentic Income does not accept payment to write a positive review, does not hide the existence of
              better unpaid alternatives, and labels its own products (Starter Kit, Blueprint, Private Intel)
              separately from third-party tool recommendations — see the &quot;Owned&quot; status on the
              <Link href="/trust" className="text-accent"> trust comparison desk</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">The one rule that governs all of it</div>
          <h2>Best fit first. Payout second. Always in that order.</h2>
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
        <div className="section-heading motion-reveal">
          <div className="kicker">Verify it yourself</div>
          <h2>The current, real program list.</h2>
          <p>
            No curated highlight reel — this is every active program in the catalog file the site actually runs
            on, the same one that drives every &quot;Try&quot; button and payout label across the network.
          </p>
        </div>
        <div className="mt-6 overflow-x-auto rounded-xl border border-border glass">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted">
                <th className="px-4 py-3">Tool</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Recurring</th>
              </tr>
            </thead>
            <tbody>
              {active.map((program) => (
                <tr key={program.tool} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-ink">{program.tool}</td>
                  <td className="px-4 py-3 text-muted">{program.status ?? 'active'}</td>
                  <td className="px-4 py-3 text-muted">{program.recurring ?? 'one-time'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
          A program appearing here means Agentic Income can legally earn from that tool today. It does not mean
          every mention of that tool on the site is a paid link — check the disclosure notice on the specific
          page for that.
        </p>
      </section>

      <FaqSection items={faqs} />

      <section className="section-band max-w-4xl border-t border-border pt-8 text-sm leading-6 text-muted">
        <p>
          This disclosure exists because the honesty of the recommendation is the entire product here — not a
          legal formality bolted on after the fact. See <Link href="/trust" className="text-accent">the trust standard</Link> for
          how recommendations get made, or <Link href="/tools" className="text-accent">the tool catalog</Link> for
          the underlying data.
        </p>
      </section>
    </div>
  )
}
