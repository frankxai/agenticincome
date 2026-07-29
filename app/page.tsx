import type { Metadata } from 'next'
import Link from 'next/link'
import { IncomeDeskHero } from '@/components/IncomeDeskHero'
import { MarketEvidence } from '@/components/MarketEvidence'
import { OutcomePackBlueprint } from '@/components/OutcomePackBlueprint'
import { AgentWorkflowProof } from '@/components/AgentWorkflowProof'
import { sortedPosts } from '@/lib/posts'

const featured = sortedPosts.filter((post) => post.featured).slice(0, 2)

export const metadata: Metadata = {
  title: 'Turn one valuable workflow into an income system you own',
  description:
    'Start with the free Agentic Income Field Guide. Package one buyer, accepted outcome, governed workflow, and evidence into a principal-owned Outcome Pack.',
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
}

const freeValue = [
  ['01', 'Opportunity map', 'Name the buyer, costly job, accepted outcome, and smallest useful proof in thirty minutes.'],
  ['02', 'Path decision', 'Choose service, product, or evidence-led research based on assets you already possess.'],
  ['03', 'Outcome Pack anatomy', 'Define offer, workflow, authority, evals, economics, runbook, and evidence.'],
  ['04', 'Executable system', 'Run the public scaffold, validator, tests, and governed Request-to-Quote reference pack.'],
] as const

const productPaths = [
  {
    state: 'Free · live',
    title: 'Learn and map',
    body: 'Use the full Field Guide without an email gate. Leave with one testable buyer and outcome.',
    href: '/start',
    cta: 'Start the Field Guide',
  },
  {
    state: 'Selective · coming soon',
    title: 'Build in the Lab',
    body: 'Apply with one real workflow you can judge. No fake scarcity, guaranteed place, or income promise.',
    href: '/waitlist',
    cta: 'Inspect the founding waitlist',
  },
  {
    state: 'Commercial · scope first',
    title: 'Commission the build',
    body: 'Define one accepted outcome, ownership, authority, delivery, support, and terms before payment.',
    href: '/offers/implementation-sprint',
    cta: 'Inspect the Build Sprint',
  },
] as const

export default function Home() {
  return (
    <>
      <IncomeDeskHero />

      <section className="section-band" aria-labelledby="free-value-title">
        <div className="free-value-layout">
          <div className="section-heading">
            <div className="kicker">Useful before the ask</div>
            <h2 id="free-value-title">The first product is the map—not your email address.</h2>
            <p>
              Learn enough to reject a weak idea, choose a credible path, and inspect the operating
              contract before deciding whether Agentic Income should help.
            </p>
            <Link href="/start" className="cta">Use the free Field Guide</Link>
          </div>
          <ol className="free-value-list">
            {freeValue.map(([number, title, body]) => (
              <li key={number}>
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <MarketEvidence />

      <OutcomePackBlueprint />

      <section className="section-band" aria-labelledby="paths-title">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div className="section-heading">
            <div className="kicker">One method · three depths</div>
            <h2 id="paths-title">Take only the help the workflow has earned.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-muted">
            Most visitors should start free. The Lab is for a small, accountable cohort. The Build
            Sprint is for a specific customer outcome that warrants implementation.
          </p>
        </div>
        <div className="product-paths">
          {productPaths.map((path, index) => (
            <article key={path.title}>
              <div className="product-path-number">0{index + 1}</div>
              <div className="panel-label">{path.state}</div>
              <h3>{path.title}</h3>
              <p>{path.body}</p>
              <Link href={path.href}>{path.cta} <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <AgentWorkflowProof />

      <section className="section-band">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="section-heading">
            <div className="kicker text-[color:var(--color-accent-2)]">Research · secondary layer</div>
            <h2>Useful research earns attention. It does not define the product.</h2>
            <p>
              Tool comparisons remain dated, disclosed, and recommendation-first. They help people
              make decisions without turning Agentic Income into another giant directory.
            </p>
          </div>
          <Link href="/blog" className="cta-secondary">All research</Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {featured.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card group">
              <div className="text-xs text-muted">
                <span className="font-semibold text-accent">{post.cluster}</span> · {post.date}
              </div>
              <h3 className="mt-3 text-[21px] font-semibold leading-tight text-ink group-hover:text-accent">
                {post.title}
              </h3>
              <p className="mt-3 text-[15px] leading-6 text-muted">{post.dek}</p>
              <div className="mt-5 text-sm font-semibold text-accent">Read the evidence</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="conversion-band">
        <div>
          <div className="kicker">Start with a real customer job</div>
          <h2>Map the first system before you buy anything.</h2>
          <p>
            The public method is available now. If the map survives contact with a real buyer, the
            selective Lab and scope-first Build Sprint are the next possible steps.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link href="/start" className="cta">Start free</Link>
          <Link href="/waitlist" className="cta-secondary">Inspect the Lab</Link>
        </div>
      </section>
    </>
  )
}
