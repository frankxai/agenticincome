import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Operate Agentic Income Systems',
  description:
    'Run a supervised weekly loop for research, delivery, verification, maintenance, and improvement without granting agents unlimited authority.',
  alternates: { canonical: '/operate' },
  openGraph: {
    title: 'Operate Agentic Income Systems',
    description:
      'A supervised operating loop with explicit automatic, review, and principal-approval boundaries.',
    url: '/operate',
  },
}

const loop = [
  ['Observe', 'Collect customer, delivery, reliability, cost, and market signals.'],
  ['Score', 'Rank exceptions and opportunities against explicit criteria.'],
  ['Propose', 'Write the next action, expected evidence, and stop condition.'],
  ['Validate', 'Run policy, source, test, and authority checks before action.'],
  ['Execute', 'Perform only the actions permitted for the current lane.'],
  ['Verify', 'Record the output, acceptance evidence, cost, and residual risk.'],
  ['Learn', 'Update the system contract, knowledge, or experiment decision.'],
] as const

const lanes = [
  {
    title: 'Automatic',
    color: 'text-accent',
    items: ['Research diffs and freshness checks', 'Drafts and test execution', 'Evidence collection and internal reports'],
  },
  {
    title: 'Review before action',
    color: 'text-gold',
    items: ['Customer-facing deliverables', 'Partner destinations and disclosures', 'Material scope or workflow changes'],
  },
  {
    title: 'Principal approval',
    color: 'text-red-300',
    items: ['Contracts, pricing, and public income claims', 'Production promotion and credential grants', 'Payments, transfers, wallets, and bank actions'],
  },
] as const

export default function OperatePage() {
  return (
    <>
      <section className="section-band pt-20">
        <div className="max-w-4xl">
          <div className="kicker">Operate · supervised autonomy</div>
          <h1 className="mt-3 text-5xl font-semibold leading-[1.02] text-ink sm:text-6xl">
            Let agents run the routine. Keep authority explicit.
          </h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            One recurring loop observes the system, prepares changes, verifies evidence, and escalates
            only the decisions that require a responsible person.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/pack" className="cta">Install the /ai pack</Link>
            <Link href="/proof" className="cta-secondary">Inspect the proof standard</Link>
          </div>
        </div>
      </section>

      <section className="section-band" aria-labelledby="weekly-loop-title">
        <div className="section-heading">
          <div className="kicker">Weekly system loop</div>
          <h2 id="weekly-loop-title">Observe → decide → verify → learn.</h2>
          <p>The output is a decision record and one bounded experiment, not another stream of chat.</p>
        </div>
        <ol className="mt-8 grid gap-3 md:grid-cols-2">
          {loop.map(([title, body], index) => (
            <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-4 rounded-xl border border-border bg-surface/70 p-5">
              <span className="font-mono text-sm font-semibold text-accent">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-band" aria-labelledby="authority-lanes-title">
        <div className="section-heading">
          <div className="kicker">Authority lanes</div>
          <h2 id="authority-lanes-title">Autonomy increases only with evidence.</h2>
          <p>Every capability belongs to a visible lane. Higher financial, legal, privacy, or reputation impact means stronger approval.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {lanes.map((lane) => (
            <article key={lane.title} className="card">
              <h3 className={`text-xl font-semibold ${lane.color}`}>{lane.title}</h3>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
                {lane.items.map((item) => (
                  <li key={item} className="border-t border-border pt-3 first:border-0 first:pt-0">{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="grid gap-5 rounded-2xl border border-border bg-surface p-6 md:grid-cols-3">
          {[
            ['Run artifact', 'income/weekly/YYYY-WW.md'],
            ['Decision budget', 'One accepted experiment per loop'],
            ['Escalation rule', 'Only authority, exception, or material-risk decisions'],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</div>
              <div className="mt-3 font-mono text-sm font-semibold text-ink">{value}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
