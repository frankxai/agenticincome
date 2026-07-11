import type { Metadata } from 'next'
import Link from 'next/link'
import { AssemblyHero } from '@/components/AssemblyHero'
import { ShiftSection } from '@/components/ShiftSection'
import { PathSection } from '@/components/PathSection'
import { PackTerminal } from '@/components/PackTerminal'
import { KnowledgeIndex } from '@/components/KnowledgeIndex'
import { ProductLadder } from '@/components/ProductLadder'
import { AgentWorkflowProof } from '@/components/AgentWorkflowProof'
import { TrinityRibbon } from '@/components/TrinityRibbon'
import { EmailCapture } from '@/components/EmailCapture'
import { sortedPosts } from '@/lib/posts'

const featured = sortedPosts.filter((post) => post.featured).slice(0, 2)

export const metadata: Metadata = {
  title: 'Build income with AI agents — machinery you can inspect',
  description:
    'Income is becoming an engineering discipline. A dated, re-verified knowledge base, the installable /ai Income Architect pack, self-serve products, and attested proof. No income promises — machinery and education.',
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
}

export default function Home() {
  return (
    <>
      <AssemblyHero />

      <ShiftSection />

      <PathSection />

      <PackTerminal />

      <KnowledgeIndex />

      <ProductLadder />

      <AgentWorkflowProof />

      <section className="section-band">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="section-heading motion-reveal">
            <div className="kicker text-[color:var(--color-accent-2)]">Research · education</div>
            <h2 className="display-h2">Decisions before incentives.</h2>
            <p className="mt-3 max-w-xl text-[color:var(--color-muted)]">
              Comparisons show the tradeoff, the evidence date, and the material incentive —
              so you can judge the recommendation, not just receive it.
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

      <TrinityRibbon />

      <section className="section-band">
        <EmailCapture
          headline="The Agentic Income Brief"
          sub="Weekly: what changed in the agent landscape, one stream teardown, pack updates. Factual, dated, unsubscribe in one click."
          source="home-brief"
          buttonLabel="Get the Brief"
          successMessage="You're in. The next Brief ships this week."
        />
      </section>

      <section className="conversion-band motion-reveal">
        <div>
          <div className="kicker text-[color:var(--color-gold)]">Implementation · apex — 2/month</div>
          <h2 className="display-h2">Bring one valuable workflow.</h2>
          <p className="mt-3 max-w-xl text-[color:var(--color-muted)]">
            The only human-gated product in the trinity: a scoped agent-team build with verification
            evidence and a Git-backed handover. Scope first — no payment on this site.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link href="/offers/implementation-sprint" className="cta">Request a scoped plan</Link>
          <a href="https://github.com/frankxai/agenticincome" target="_blank" rel="noopener noreferrer" className="cta-secondary">
            Audit us on GitHub
          </a>
        </div>
      </section>
    </>
  )
}
