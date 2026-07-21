import type { Metadata } from 'next'
import Link from 'next/link'
import { IncomeDeskHero } from '@/components/IncomeDeskHero'
import { RevenueCapabilitySection } from '@/components/RevenueCapabilitySection'
import { AgentWorkflowProof } from '@/components/AgentWorkflowProof'
import { sortedPosts } from '@/lib/posts'

const featured = sortedPosts.filter((post) => post.featured).slice(0, 2)

export const metadata: Metadata = {
  title: 'Turn one valuable workflow into an income system you own',
  description:
    'For founders, experts, and operators: package one valuable workflow into a governed agent service with a clear offer, acceptance checks, public proof, and a system you own.',
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
}

export default function Home() {
  return (
    <>
      <IncomeDeskHero />

      <RevenueCapabilitySection />

      <section className="section-band" aria-labelledby="human-principal-title">
        <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
          <div className="section-heading motion-reveal">
            <div className="kicker">Human judgment · agent leverage</div>
            <h2 id="human-principal-title">The agent does more. You remain the principal.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-muted motion-reveal">
            Agents can research, structure, draft, build, test, and document. A person or legal
            entity still owns the customer relationship, approves commitments, controls accounts,
            and decides what is good enough to ship.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['You bring the signal', 'A buyer you understand, a painful workflow, real constraints, and judgment earned in the field.'],
            ['Agents build the evidence', 'Research, workflow design, implementation, tests, documentation, and a reviewable decision trail.'],
            ['You keep the compounding assets', 'The offer, repository, customer trust, operating knowledge, accounts, and intellectual property.'],
          ].map(([title, body]) => (
            <div key={title} className="card motion-reveal">
              <h3 className="text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <AgentWorkflowProof />

      <section className="section-band">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="section-heading motion-reveal">
            <div className="kicker text-[color:var(--color-accent-2)]">Research · secondary layer</div>
            <h2 className="display-h2">Useful research earns attention. It does not define the product.</h2>
            <p className="mt-3 max-w-xl text-[color:var(--color-muted)]">
              Tool comparisons remain dated, disclosed, and recommendation-first. They help people
              make decisions and discover the operating system without turning Agentic Income into
              another giant directory.
            </p>
          </div>
          <Link href="/blog" className="cta-secondary">All research</Link>
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
          <div className="kicker text-[color:var(--color-gold)]">Start with a real customer job</div>
          <h2 className="display-h2">Map the first system before you buy anything.</h2>
          <p className="mt-3 max-w-xl text-[color:var(--color-muted)]">
            Choose the right starting path, inspect the public method, or bring a credible workflow
            into a scope-first implementation. No income promise and no payment before the work and
            acceptance checks are defined.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link href="/start" className="cta">Map my first system</Link>
          <a href="https://github.com/frankxai/agentic-income-skills" target="_blank" rel="noopener noreferrer" className="cta-secondary">
            Inspect the public method
          </a>
        </div>
      </section>
    </>
  )
}
