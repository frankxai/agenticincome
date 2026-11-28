import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import Link from 'next/link'
import { IncomeGraphWorkbench } from '@/components/IncomeGraphWorkbench'
import { EDGE_RULES, NODE_TYPES } from '@/lib/income-graph'

export const metadata: Metadata = {
  title: 'Income system workbench',
  description:
    'Model one income system as an inspectable graph, review it against adversarial checks for hype, fabricated demand, dark patterns, and unauthorized execution, and export the operating tasks. No income claims.',
  alternates: { canonical: '/workbench' },
  openGraph: {
    ...baseOpenGraph,
    title: 'Income system workbench',
    description:
      'Design, review, and operate one income system with agents while keeping the judgment. Runs in your browser and over MCP.',
    url: '/workbench',
  },
}

const CHECKS = [
  {
    code: 'A01',
    name: 'Hype',
    what: 'Money asserted alongside the absence of work, certainty about an outcome you do not control, or a deadline on someone else’s money. Matched on stems and distance, so paraphrasing the genre does not clear it. One accidental phrase warns; two block.',
  },
  {
    code: 'A02',
    name: 'Fabricated demand',
    what: 'Every claim that someone wants this needs an Evidence node whose source a stranger could open — a URL, a file path, or an interview record naming a person and a date — and a finding that records what the source actually said. A price or a volume is a demand claim with a number on it, and demand language in prose is one too. Revenue needs a receipt.',
  },
  {
    code: 'A03',
    name: 'Dark patterns',
    what: 'Scarcity with no basis, recurring charges with no exit, undisclosed buyer-borne costs, confirmshaming, roach motels.',
  },
  {
    code: 'A04',
    name: 'Unauthorized execution',
    what: 'Every step that reaches outside your system is irreversible whether or not it says so, every irreversible step needs a human gate, and that gate’s approver must resolve to a person — a Human node or the named principal, never an agent role. Every agent role denies signing, repricing, moving money, and raising its own budget.',
  },
]

export default function WorkbenchPage() {
  const edgeCount = Object.keys(EDGE_RULES).length

  return (
    <>
      <section className="section-band pt-20">
        <div className="max-w-4xl">
          <div className="kicker">Workbench · IncomeGraph.v1</div>
          <h1 className="mt-3 text-5xl font-semibold leading-[1.02] text-ink">
            One income system, modelled so it can be argued with.
          </h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            Start with the sentence you already believe. The workbench drafts the smallest graph
            that can carry it, then names the claim in your own thesis that nothing supports, the
            evidence that would settle it, and what getting that evidence costs you in hours. The
            full model — problem, customer, offer, workflow, authority, costs, kill criterion — is
            what you graduate into, not the toll gate.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/workbench/offer-brief" className="cta">Build an offer brief <span aria-hidden="true">→</span></Link>
            <Link href="/workbench/quote-review" className="inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4">Price a quote-review pilot</Link>
          </div>
          <p className="mt-5 max-w-3xl leading-8 text-muted">
            It will not tell you what you will earn. It reports what your own document asserts, what
            it cannot support, and what you still owe before a manifest is valid. Activation means a
            validated manifest plus a first real market test. Economic success means observed
            revenue, a qualified lead, or a paid product — never a forecast.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/mcp" className="font-semibold text-accent underline underline-offset-4">
              Run the same checks over MCP
            </Link>
            <a
              href="/schemas/income-graph.v1.schema.json"
              className="font-semibold text-accent-2 underline underline-offset-4"
            >
              Read the schema
            </a>
            <a
              href="https://github.com/frankxai/agentic-income-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent-2 underline underline-offset-4"
            >
              The open-core manifest contract
            </a>
          </div>
        </div>
      </section>

      <IncomeGraphWorkbench />

      <section className="section-band">
        <div className="max-w-4xl">
          <div className="kicker">The four attacks</div>
          <h2 className="mt-2 text-3xl font-semibold text-ink">
            What the review is looking for.
          </h2>
          <dl className="mt-8 space-y-6">
            {CHECKS.map((check) => (
              <div key={check.code} className="border-t border-border pt-5">
                <dt className="flex flex-wrap items-baseline gap-3">
                  <span className="font-mono text-xs font-semibold text-accent">{check.code}</span>
                  <span className="text-lg font-semibold text-ink">{check.name}</span>
                </dt>
                <dd className="mt-2 max-w-3xl leading-7 text-muted">{check.what}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-3xl leading-7 text-muted">
            Structural and completeness rules run alongside them: every node and every edge carries
            an owner, a source, a date, a version, a visibility, and the evaluation rule that would
            prove it wrong. A claim with no test is decoration.
          </p>
        </div>
      </section>

      <section className="section-band">
        <div className="max-w-4xl">
          <div className="kicker">The vocabulary</div>
          <h2 className="mt-2 text-3xl font-semibold text-ink">
            {NODE_TYPES.length} node types, {edgeCount} relationships, nothing else.
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-muted">
            The vocabulary is closed on purpose. If a thing in your business has no node, the graph
            is telling you it is not yet part of the system.
          </p>
          <p className="mt-6 font-mono text-sm leading-7 text-ink">{NODE_TYPES.join(' · ')}</p>
          <p className="mt-8 max-w-3xl leading-7 text-muted">
            A Partner node may only exist when it cites a record in the verified partner registry
            this site already publishes, so a commercial recommendation can never enter a system
            without its disclosure.{' '}
            <Link href="/tools" className="text-accent underline underline-offset-4">
              The registry
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
