import type { Metadata } from 'next'
import Link from 'next/link'
import { TrackOnView } from '@/components/TrackOnView'

export const metadata: Metadata = {
  title: 'Starter Kit Delivery',
  description: 'The Agentic Income Outcome Pack starter: choose one buyer, define an accepted outcome, map authority, and make a reasoned first-system decision.',
  robots: { index: false, follow: false },
}

const sprint = [
  ['00-05', 'Choose the buyer', 'Name a person or team you understand and can realistically reach.'],
  ['05-12', 'Capture the job', 'Write the current workflow, pain, urgency, constraints, and evidence that the problem exists.'],
  ['12-20', 'Define acceptance', 'State the smallest valuable outcome, how it will be checked, and what is explicitly out of scope.'],
  ['20-25', 'Map authority', 'Separate agent preparation from human approval for price, contracts, sends, credentials, production, and money.'],
  ['25-30', 'Make the decision', 'Choose one next validation action and a clear revise-or-stop condition before building.'],
]

const packParts = [
  ['Buyer and problem', 'Who has the job, why it matters, and what the current process costs.'],
  ['Outcome and acceptance', 'What done means and which checks decide whether it was achieved.'],
  ['Offer and principal', 'Who owns the obligation, accounts, commercial terms, and relationship.'],
  ['Workflow and interfaces', 'Inputs, outputs, tools, handoffs, failures, and versioned artifacts.'],
  ['Authority and budgets', 'Automatic actions, approvals, revocation, credentials, and spend limits.'],
  ['Evals and operations', 'Quality, economics, evidence, runbook, incidents, and next decisions.'],
] as const

export default function StarterKitDelivery() {
  return (
    <div className="py-16">
      <TrackOnView event="delivery_view" payload={{ offer: 'starter-kit', source: 'delivery-page' }} />
      <section className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div>
          <div className="kicker">Delivery</div>
          <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[1.02] text-ink">Outcome Pack Starter</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            Use this to shape the first serious business test: one buyer, one valuable workflow, one
            accepted outcome, one authority model, and one evidence-backed next decision.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/downloads/agentic-income-starter-kit.md" className="cta" download>
              Download markdown kit
            </a>
            <Link href="/offers/blueprint" className="cta-secondary">
              Upgrade to Blueprint
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-surface/80 p-5">
          <div className="text-sm font-semibold text-gold">First win</div>
          <p className="mt-3 text-sm leading-6 text-muted">
            By the end of this kit, you should know whether a workflow deserves validation, what the
            agent may prepare, what an authorized principal must approve, and what artifact comes next.
          </p>
        </aside>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">30-minute sprint</div>
          <h2>Turn experience into a business test.</h2>
          <p>Do the smallest complete reasoning loop before adding more agents, tools, products, or automation.</p>
        </div>
        <div className="mt-8 grid gap-3">
          {sprint.map(([time, title, body]) => (
            <div key={time} className="rounded-xl border border-border bg-surface/70 p-4 motion-reveal">
              <div className="grid gap-4 md:grid-cols-[5rem_14rem_1fr] md:items-start">
                <div className="font-mono text-sm font-semibold text-accent">{time}</div>
                <div className="font-semibold text-ink">{title}</div>
                <p className="text-sm leading-6 text-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Minimum viable Outcome Pack</div>
          <h2>Six parts make the system inspectable.</h2>
          <p>A polished agent demo is not a business system until these contracts exist.</p>
        </div>
        <dl className="mt-8 grid gap-3">
          {packParts.map(([term, description], index) => (
            <div key={term} className="grid gap-2 rounded-xl border border-border bg-surface/70 p-5 sm:grid-cols-[2.5rem_11rem_1fr]">
              <span className="font-mono text-sm font-semibold text-accent">0{index + 1}</span>
              <dt className="font-semibold text-ink">{term}</dt>
              <dd className="text-sm leading-6 text-muted">{description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section-band">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['Authority rule', 'Agents prepare. An authorized person or legal entity approves commitments, credentials, production, and money.'],
            ['Evidence rule', 'Reference systems prove the method. Only accepted, permissioned delivery evidence can support a customer claim.'],
            ['Upgrade path', 'When the business test is credible, use the Blueprint or implementation sprint to complete the full Outcome Pack.'],
          ].map(([title, body]) => (
            <div key={title} className="card motion-reveal">
              <div className="text-sm font-semibold text-gold">{title}</div>
              <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
