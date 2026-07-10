import type { Metadata } from 'next'
import Link from 'next/link'
import { IncomeDeskHero } from '@/components/IncomeDeskHero'
import { RevenueCapabilitySection } from '@/components/RevenueCapabilitySection'
import { FlywheelSystem } from '@/components/FlywheelSystem'
import { TrustComparisonDesk } from '@/components/TrustComparisonDesk'
import { sortedPosts } from '@/lib/posts'
import { offers } from '@/lib/offers'

const featured = sortedPosts.filter((post) => post.featured)

export const metadata: Metadata = {
  title: 'Revenue systems built with agents, delivered with proof',
  description:
    'Agent-as-a-Service implementation, open-source revenue-system skills, practical digital products, and reader-first AI tool research.',
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
}

export default function Home() {
  return (
    <>
      <IncomeDeskHero />
      <RevenueCapabilitySection />
      <FlywheelSystem />

      <section className="section-band">
        <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
          <div className="section-heading motion-reveal">
            <div className="kicker">Ways to start</div>
            <h2>Choose the depth of help you need.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-muted motion-reveal">
            Start free, install the system yourself, keep the market map current, or request a scoped implementation. Every route states what is live before asking for commitment.
          </p>
        </div>

        <div className="offer-rail">
          {offers.map((offer) => (
            <Link key={offer.slug} href={`/offers/${offer.slug}`} className="offer-row motion-reveal">
              <div>
                <span>{offer.tier}</span>
                <h3>{offer.shortTitle}</h3>
              </div>
              <p>{offer.summary}</p>
              <strong>{offer.price}</strong>
            </Link>
          ))}
        </div>

        <div className="mt-6">
          <Link href="/offers" className="cta-secondary">Compare every route</Link>
        </div>
      </section>

      <TrustComparisonDesk />

      <section className="section-band">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="section-heading motion-reveal">
            <div className="kicker">Reader-first research</div>
            <h2>Decisions before incentives.</h2>
            <p>Comparisons show the tradeoff, the evidence date, and the material incentive so the reader can judge the recommendation.</p>
          </div>
          <Link href="/blog" className="cta-secondary">All comparisons</Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {featured.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card group motion-reveal">
              <div className="text-xs text-muted">
                <span className="font-semibold text-accent">{post.cluster}</span> · {post.date}
              </div>
              <h3 className="mt-3 text-[21px] font-semibold leading-tight text-ink group-hover:text-accent">{post.title}</h3>
              <p className="mt-3 text-[15px] leading-6 text-muted">{post.dek}</p>
              <div className="mt-5 text-sm font-semibold text-accent">Read the evidence</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="conversion-band motion-reveal">
        <div>
          <div className="kicker">Implementation</div>
          <h2>Bring one valuable workflow.</h2>
          <p>We will define the customer job, delivery boundary, evidence, and build plan before any implementation commitment.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link href="/offers/implementation-sprint" className="cta">Request a scoped plan</Link>
          <a href="https://github.com/frankxai/agentic-income-skills" target="_blank" rel="noopener noreferrer" className="cta-secondary">
            Inspect the method
          </a>
        </div>
      </section>
    </>
  )
}
