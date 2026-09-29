import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Agentic Income Proof Standard',
  description:
    'Separate inspectable system evidence, accepted delivery evidence, and settled economic evidence before publishing income claims.',
  alternates: { canonical: '/proof' },
  openGraph: {
    ...baseOpenGraph,
    title: 'Agentic Income Proof Standard',
    description:
      'A three-layer evidence standard for systems, delivery, and settled economics.',
    url: '/proof',
  },
}

const evidenceLayers = [
  {
    level: '01',
    title: 'System evidence',
    status: 'Available now',
    body: 'Source, schemas, policies, tests, version, and a reproducible reference run show how the machinery is designed to behave.',
    examples: ['Open skill contract', 'Income-system schema', 'Request-to-Quote reference pack'],
  },
  {
    level: '02',
    title: 'Delivery evidence',
    status: 'Per accepted engagement',
    body: 'Approved scope, acceptance checks, preview, decision log, handoff, and customer consent show what was delivered and accepted.',
    examples: ['Approved scope', 'Verification bundle', 'Accepted handoff'],
  },
  {
    level: '03',
    title: 'Economic evidence',
    status: 'Only after settlement',
    body: 'Settled receipts minus refunds, chargebacks, direct costs, tool costs, and attributed human time support an economic claim.',
    examples: ['Settled receipt', 'Cost allocation', 'Measurement window and denominator'],
  },
] as const

const proofAssets = [
  {
    label: 'Open income-system contract',
    href: 'https://github.com/frankxai/agentic-income-skills/blob/main/schemas/income-system.v1.schema.json',
    state: 'System evidence',
  },
  {
    label: 'Request-to-Quote reference pack',
    href: 'https://github.com/frankxai/agentic-income-skills/tree/main/examples/request-to-quote-desk',
    state: 'System evidence',
  },
  {
    label: 'Deployable income template',
    href: 'https://github.com/frankxai/agentic-income-template',
    state: 'System evidence',
  },
  {
    label: 'Program routing directory',
    href: 'https://go.agenticincome.ai/programs',
    state: 'Live system surface',
  },
] as const

const milestones = [
  ['€1K Builder', '€1,000 cumulative settled net receipts'],
  ['€10K Builder', '€10,000 cumulative settled net receipts'],
  ['€100K System', '€100,000 cumulative settled net receipts'],
  ['€1M Portfolio', '€1,000,000 cumulative settled net receipts'],
] as const

export default function ProofPage() {
  return (
    <>
      <section className="section-band pt-20">
        <div className="max-w-4xl">
          <div className="kicker">Proof · evidence before status</div>
          <h1 className="mt-3 text-5xl font-semibold leading-[1.02] text-ink sm:text-6xl">
            Show the machinery. Verify delivery. Count economics after settlement.
          </h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            Code proves a system exists. Acceptance proves work was delivered. Settled, cost-adjusted
            evidence is required before an income result becomes a public claim.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/build" className="cta">Build a governed system</Link>
            <Link href="/trust" className="cta-secondary">Read the trust standard</Link>
          </div>
        </div>
      </section>

      <section className="section-band" aria-labelledby="evidence-layers-title">
        <div className="section-heading">
          <div className="kicker">Three evidence layers</div>
          <h2 id="evidence-layers-title">A demo is not a delivery. Revenue is not net income.</h2>
          <p>Each layer answers a different question and cannot substitute for the next.</p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {evidenceLayers.map((layer) => (
            <article key={layer.level} className="card">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm font-semibold text-accent">{layer.level}</span>
                <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted">{layer.status}</span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-ink">{layer.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{layer.body}</p>
              <ul className="mt-5 grid gap-2 border-t border-border pt-4 text-xs leading-5 text-muted">
                {layer.examples.map((example) => <li key={example}>— {example}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band" aria-labelledby="current-proof-title">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="section-heading">
            <div className="kicker">Current public evidence</div>
            <h2 id="current-proof-title">System evidence—not customer income evidence.</h2>
            <p>
              These artifacts are inspectable now. No customer result or economic milestone is implied
              until the required delivery and settlement evidence exists and publication is approved.
            </p>
          </div>
          <div className="grid gap-3">
            {proofAssets.map((asset) => (
              <a
                key={asset.href}
                href={asset.href}
                target="_blank"
                rel="noopener noreferrer"
                className="grid gap-2 rounded-xl border border-border bg-surface/70 p-5 hover:border-accent sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <span className="font-semibold text-ink">{asset.label}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">{asset.state}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band" aria-labelledby="milestones-title">
        <div className="section-heading">
          <div className="kicker">Proof Guild milestones</div>
          <h2 id="milestones-title">Status earned from settled net evidence.</h2>
          <p>
            A milestone also publishes the measurement window, direct costs, refunds, attributed human
            time, evidence level, system version, and participant consent.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map(([name, threshold]) => (
            <div key={name} className="card">
              <div className="text-lg font-semibold text-gold">{name}</div>
              <p className="mt-3 text-sm leading-6 text-muted">{threshold}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-6 text-muted">
          Milestone names define the future evidence standard. They do not state that a current member,
          customer, or system has reached them.
        </p>
      </section>
    </>
  )
}
