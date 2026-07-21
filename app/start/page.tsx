import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Find Your First Agentic Income System',
  description: 'Choose the right starting path for one valuable workflow: a governed service, a self-serve product, or reader-first research.',
  alternates: { canonical: '/start' },
  openGraph: {
    title: 'Find Your First Agentic Income System',
    description: 'A practical path from expertise to one principal-owned Outcome Pack.',
    url: '/start',
  },
}

const startingPaths = [
  {
    label: 'Fastest path to a real buyer',
    title: 'Turn a service workflow into an Outcome Pack',
    fit: 'You know a painful business process, can reach the buyer, and can judge the quality of the result.',
    first: 'Capture one real customer request, success condition, constraint, and human approval boundary.',
    artifact: 'A governed service contract and Request-to-Quote reference system.',
    href: '/build',
    cta: 'Build the service path',
  },
  {
    label: 'Best for an existing method or audience',
    title: 'Package a repeatable method as a product',
    fit: 'People already ask you the same question, use your framework, or want your templates and operating process.',
    first: 'Prove the manual method, define what the buyer receives, and make the first useful delivery self-serve.',
    artifact: 'A product brief, delivery path, support boundary, and honest upgrade decision.',
    href: '/offers',
    cta: 'Inspect product paths',
  },
  {
    label: 'Best for trusted research and distribution',
    title: 'Build recommendation-led media carefully',
    fit: 'You have real experience with a category and can publish better decisions than a generic tool directory.',
    first: 'Choose one decision, state the criteria, date the evidence, disclose incentives, and preserve unpaid alternatives.',
    artifact: 'A citable comparison with a reader-first route and an owned next step.',
    href: '/trust',
    cta: 'Read the trust standard',
  },
] as const

const outcomePack = [
  ['Buyer and problem', 'Who has the job, why it matters now, and what the current process costs.'],
  ['Outcome and acceptance', 'What “done” means, how it will be checked, and which claims are explicitly out of scope.'],
  ['Offer and principal', 'The legal or human account owner, pricing decision, terms, support, and customer relationship.'],
  ['Workflow and interfaces', 'Agent steps, tools, inputs, outputs, handoffs, failure paths, and versioned artifacts.'],
  ['Authority and budgets', 'What may run automatically, what requires approval, and how access can be revoked.'],
  ['Evals and operations', 'Quality checks, evidence, economics, runbook, incident path, and the next operating decision.'],
] as const

export default function Start() {
  return (
    <>
      <section className="section-band pt-20">
        <div className="kicker">Free capability map</div>
        <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[1.02] text-ink sm:text-6xl">
          Find the first income system your experience can actually support.
        </h1>
        <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
          Begin with a buyer, a useful outcome, and evidence you can judge—not an agent persona or
          a passive-income claim. Choose the path that matches the assets you already have.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://github.com/frankxai/agentic-income-skills/blob/main/skills/agentic-income/SKILL.md"
            target="_blank"
            rel="noopener noreferrer"
            className="cta"
          >
            Open the free operating skill
          </a>
          <Link href="/build/request-to-quote" className="cta-secondary">
            Try the local Request-to-Quote desk
          </Link>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
          No email gate. No income prediction. The reference desk runs in your browser and sends
          nothing. The open skill is designed for humans and coding agents to inspect together.
        </p>
      </section>

      <section className="section-band" aria-labelledby="starting-path-title">
        <div className="section-heading motion-reveal">
          <div className="kicker">Choose by starting advantage</div>
          <h2 id="starting-path-title">Three paths. One honest order of operations.</h2>
          <p>Services usually validate fastest. Products follow repeated demand. Research compounds distribution when you have earned a point of view.</p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {startingPaths.map((path, index) => (
            <article key={path.title} className="card motion-reveal flex h-full flex-col">
              <div className="font-mono text-sm font-semibold text-accent">0{index + 1}</div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-gold">{path.label}</div>
              <h3 className="mt-3 text-2xl font-semibold leading-tight text-ink">{path.title}</h3>
              <dl className="mt-5 grid gap-4 text-sm leading-6">
                <div>
                  <dt className="font-semibold text-ink">Choose this when</dt>
                  <dd className="mt-1 text-muted">{path.fit}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">First move</dt>
                  <dd className="mt-1 text-muted">{path.first}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">First artifact</dt>
                  <dd className="mt-1 text-muted">{path.artifact}</dd>
                </div>
              </dl>
              <Link href={path.href} className="mt-6 inline-flex text-sm font-semibold text-accent underline underline-offset-4">
                {path.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band" aria-labelledby="outcome-pack-map-title">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="section-heading motion-reveal">
            <div className="kicker">Minimum viable Outcome Pack</div>
            <h2 id="outcome-pack-map-title">The six things the system must make inspectable.</h2>
            <p>If one is missing, the agent may still look impressive while the business remains fragile.</p>
          </div>
          <dl className="grid gap-3">
            {outcomePack.map(([term, description], index) => (
              <div key={term} className="grid gap-2 rounded-xl border border-border bg-surface/70 p-5 sm:grid-cols-[2.5rem_11rem_1fr]">
                <span className="font-mono text-sm font-semibold text-accent">0{index + 1}</span>
                <dt className="font-semibold text-ink">{term}</dt>
                <dd className="text-sm leading-6 text-muted">{description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="conversion-band motion-reveal">
        <div>
          <div className="kicker text-gold">Need implementation depth?</div>
          <h2 className="display-h2">Bring one credible workflow.</h2>
          <p className="mt-3 max-w-xl text-muted">
            The implementation sprint defines the buyer, scope, authority, acceptance checks, and
            evidence before commercial terms are agreed. No payment is taken on this site.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link href="/offers/implementation-sprint" className="cta">Inspect the sprint</Link>
          <Link href="/build" className="cta-secondary">See the build method</Link>
        </div>
      </section>
    </>
  )
}
