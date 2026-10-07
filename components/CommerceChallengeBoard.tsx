import Link from 'next/link'
import source from '@/data/commerce-challenge.json'
import { parseChallengeLedger, submissionScore } from '@/lib/challenge-ledger'

const ledger = parseChallengeLedger(source)

const states = {
  planned: 'Planned',
  in_progress: 'In progress',
  verified: 'Verified',
  blocked: 'Blocked',
  unverified: 'Unverified',
  not_run: 'Not run',
  submitted: 'Submitted',
  reviewed: 'Reviewed',
  review: 'Under review',
  completed: 'Completed',
  stopped: 'Stopped',
} as const

function EvidenceLinks({ items }: { items: { label: string; href: string }[] }) {
  if (items.length === 0) return <p className="mt-3 text-sm leading-6 text-muted">No verified artifact attached yet.</p>
  return (
    <ul className="mt-3 space-y-2 text-sm">
      {items.map((item) => (
        <li key={item.href}>
          <a href={item.href} className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function CommerceChallengeBoard() {
  const reviewed = ledger.submissions.filter((item) => item.status === 'reviewed' && item.score !== null).length

  return (
    <>
      <section id="experiments" className="section-band scroll-mt-24" aria-labelledby="experiment-title" data-testid="commerce-challenge">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-accent">The AI shop experiment</p>
            <h2 id="experiment-title" className="mt-3 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.06] text-ink">
              Build something worth buying.<br />
              <span className="text-accent">Make the evidence visible.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">{ledger.round.hypothesis}</p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              One real proposition, five review windows and the same task for every model.
              A working sample earns attention; dependable delivery earns trust.
            </p>
            <a href="/downloads/ai-shop-challenge/brief.md" download className="cta mt-6">
              Download the shared brief
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gold">{states[ledger.round.status]}</p>
              <p className="font-mono text-xs text-muted">Updated {ledger.updatedAt}</p>
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-ink">{ledger.round.offer}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{ledger.round.buyer}</p>
            <dl className="mt-5 divide-y divide-border border-y border-border text-sm">
              <div className="flex flex-wrap justify-between gap-2 py-3">
                <dt className="text-muted">Proposed price</dt>
                <dd className="font-semibold text-ink">€{ledger.round.proposedPriceEur} one-off</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2 py-3">
                <dt className="text-muted">Observed outcome</dt>
                <dd className="font-semibold text-ink">{ledger.round.primaryMetricValue === null ? 'Not measured' : ledger.round.primaryMetricValue}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2 py-3">
                <dt className="text-muted">Experiment clock</dt>
                <dd className="font-semibold text-ink">{ledger.startAt === null ? 'Not started' : 'Start recorded'}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-5 text-muted">Measure: {ledger.round.primaryMetric}.</p>
            <ul className="mt-5 space-y-3">
              {ledger.round.readiness.map((item) => (
                <li key={item.label} className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs leading-5">
                  <span className="text-muted">{item.label}</span>
                  <span className={item.state === 'verified' ? 'text-accent' : 'text-gold'}>{states[item.state]}</span>
                </li>
              ))}
            </ul>
            <EvidenceLinks items={ledger.round.evidence} />
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-6 text-muted">
          {ledger.round.status === 'planned' && ledger.submissions.every((item) => item.status === 'not_run') && ledger.round.primaryMetricValue === null
            ? 'This is a proposed experiment. No model run, purchase or customer outcome is recorded here.'
            : 'This record separates proposed work from reviewed artifacts and observed outcomes.'}
          {' '}Review windows begin when the accepted baseline and start time exist.
        </p>
      </section>

      <section className="section-band" aria-labelledby="checkpoint-title">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-accent">The review windows</p>
          <h2 id="checkpoint-title" className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">From a useful sample to a decision.</h2>
          <p className="mt-4 text-base leading-7 text-muted">Each checkpoint has an artifact and an acceptance test. Plans become verified only when the evidence is attached.</p>
        </div>
        <ol className="mt-8 divide-y divide-border border-y border-border">
          {ledger.checkpoints.map((item) => (
            <li key={item.id} className="grid gap-4 py-6 sm:grid-cols-[7rem_1fr] lg:grid-cols-[8rem_1fr]">
              <div>
                <p className="font-mono text-lg font-semibold text-accent">{item.label}</p>
                <p className="mt-1 text-xs text-gold">{states[item.state]}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{item.deliverable}</p>
                <details className="mt-2 max-w-3xl">
                  <summary className="cursor-pointer py-3 text-sm font-semibold text-ink">Acceptance and evidence</summary>
                  <p className="mt-1 text-sm leading-6 text-muted">{item.acceptance}</p>
                  <EvidenceLinks items={item.evidence} />
                </details>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="model-challenge" className="section-band scroll-mt-24" aria-labelledby="models-title">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-accent">The model challenge</p>
            <h2 id="models-title" className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">Same brief. Same budget. Show the work.</h2>
            <p className="mt-4 text-base leading-7 text-muted">
              {ledger.round.timeBudgetMinutes} minutes per implementation round, a €{ledger.round.runtimeBudgetEur} runtime ceiling
              and one shared rubric. The ceiling grants no spending permission.
              Exact model versions and tool access are recorded before each run.
            </p>
          </div>
          <p className="shrink-0 font-mono text-sm text-muted">{reviewed}/{ledger.submissions.length} reviewed</p>
        </div>

        <ul className="mt-8 divide-y divide-border border-y border-border" aria-label="Model submissions">
          {ledger.submissions.map((item) => {
            const value = submissionScore(item, ledger.rubric)
            return (
              <li key={item.id} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3 py-5 sm:grid-cols-[1.2fr_0.7fr_0.7fr_auto] sm:items-center">
                <div>
                  <h3 className="text-base font-semibold text-ink">{item.family}</h3>
                  <p className="mt-1 break-words text-xs leading-5 text-muted">{item.modelVersion ?? 'Version not recorded'}</p>
                </div>
                <p className="text-sm text-muted">{states[item.status]}</p>
                <p className="text-sm font-semibold text-muted">{value === null ? 'Unscored' : `${value}/100`}</p>
                <a href={item.promptPath} download className="inline-flex min-h-11 items-center justify-end text-sm font-semibold text-accent underline underline-offset-4">
                  {item.family} prompt
                </a>
                {item.evidence.length > 0 ? <div className="col-span-full"><EvidenceLinks items={item.evidence} /></div> : null}
              </li>
            )
          })}
        </ul>
        <p className="mt-5 max-w-3xl text-sm leading-6 text-muted">
          Every prompt contains the identical protocol. No model is ranked before an independently reviewed run.
          A result describes this task, version and tool access; it does not establish general provider performance.
        </p>

        <details className="mt-7 rounded-xl border border-border bg-surface p-5">
          <summary className="cursor-pointer py-2 text-base font-semibold text-ink">The shared 100-point review</summary>
          <dl className="mt-5 divide-y divide-border">
            {ledger.rubric.map((item) => (
              <div key={item.id} className="grid gap-2 py-4 sm:grid-cols-[13rem_1fr]">
                <dt className="text-sm font-semibold text-ink">{item.label} <span className="font-mono text-accent">{item.weight}%</span></dt>
                <dd className="text-sm leading-6 text-muted">{item.evidence}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm leading-6 text-muted">Evidence, actual time and cost, the accepted baseline and an independent ethics review are required. Unknown results remain unscored.</p>
        </details>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/workbench" className="cta-secondary">Model the business test</Link>
          <Link href="/proof" className="cta-secondary">Read the evidence standard</Link>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-6 text-muted">
          The record is versioned with this site. It publishes reviewed updates; it does not run models, process payments or store customer data.
        </p>
      </section>
    </>
  )
}
