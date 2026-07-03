import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/lib/site'
import { sortedPosts } from '@/lib/posts'
import { brandPillars } from '@/lib/design'
import { EmailCapture } from '@/components/EmailCapture'
import { IncomeDeskHero } from '@/components/IncomeDeskHero'
import { FlywheelSystem } from '@/components/FlywheelSystem'
import { SignalStackSection } from '@/components/SignalStackSection'
import { TransformationSection } from '@/components/TransformationSection'
import { offers as productOffers } from '@/lib/offers'

const featured = sortedPosts.filter((p) => p.featured)

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
}

export default function Home() {
  return (
    <>
      <IncomeDeskHero />
      <SignalStackSection />
      <TransformationSection />

      <section className="section-band">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="section-heading motion-reveal">
            <div className="kicker">Trust architecture</div>
            <h2>The recommendation is the asset.</h2>
            <p>
              Agentic Income monetizes attention without corrupting the answer. Each recommendation has to survive the catalog, the comparison, and the disclosure.
            </p>
          </div>
          <Link href="/trust" className="cta-secondary motion-reveal">
            Read trust standard
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {brandPillars.map((pillar) => (
            <div key={pillar.title} className="card motion-reveal">
              <div className="text-sm font-semibold text-gold">{pillar.title}</div>
              <p className="mt-3 text-sm leading-6 text-muted">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      <FlywheelSystem />

      <section className="section-band">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="section-heading motion-reveal">
            <div className="kicker">Direct revenue</div>
            <h2>Own more than the click.</h2>
            <p>
              Affiliate links fund the floor. The list, templates, and private intelligence turn one search visit into a compounding product relationship.
            </p>
          </div>
          <Link href="/offers" className="cta-secondary motion-reveal">
            View all offers
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {productOffers.map((offer) => (
            <Link key={offer.slug} href={`/offers/${offer.slug}`} className="card group motion-reveal">
              <div className="text-xs font-semibold uppercase text-muted">{offer.price}</div>
              <div className="mt-3 text-2xl font-semibold text-ink group-hover:text-accent">{offer.shortTitle}</div>
              <p className="mt-3 text-sm leading-6 text-muted">{offer.summary}</p>
              <div className="mt-6 text-sm font-semibold text-accent">Inspect product</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="motion-reveal">
            <div className="kicker">Research</div>
            <h2 className="mt-3 text-4xl font-semibold text-ink">Recent comparisons</h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-accent hover:underline">
            All comparisons
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {featured.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card group motion-reveal">
              <div className="text-xs uppercase text-muted">
                <span className="font-semibold text-accent">{post.cluster}</span> / {post.date}
              </div>
              <h3 className="mt-3 text-[21px] font-semibold leading-tight text-ink group-hover:text-accent">{post.title}</h3>
              <p className="mt-3 text-[15px] leading-6 text-muted">{post.dek}</p>
              <div className="mt-5 text-sm font-semibold text-accent">Read breakdown</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Network proof</div>
          <h2>One engine, multiple angles.</h2>
          <p>Agentic Income is the hub. The spokes can speak to different search audiences without duplicating the catalog, components, or operating brain.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {site.network.map((network) => (
            <a key={network.url} href={network.url} className="card group motion-reveal">
              <div className="text-xl font-semibold text-ink group-hover:text-accent">{network.name}</div>
              <p className="mt-2 text-sm leading-6 text-muted">{network.blurb}</p>
            </a>
          ))}
        </div>
      </section>

      <EmailCapture headline="Get the next payer before the crowd" sub="One high-signal note when a tool worth building around becomes available. No noise." />
    </>
  )
}
