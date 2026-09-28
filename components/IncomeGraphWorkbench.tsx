'use client'

import { useState } from 'react'
import referenceGraph from '@/data/income-graph-request-to-quote.json'
import {
  draftIncomeGraph,
  reviewIncomeGraph,
  projectToIncomeSystem,
  type IncomeGraph,
  type IncomeGraphDraft,
  type WorkbenchReport,
} from '@/lib/income-graph'

type Outcome =
  | { state: 'idle' }
  | { state: 'parse-error'; message: string }
  | { state: 'reviewed'; report: WorkbenchReport; missing: string[]; today: string }

const SEVERITY_LABEL = { error: 'Blocking', warning: 'Watch' } as const

const RAIL_LABEL = {
  'fiat-account': 'Merchant account',
  'signed-receipt': 'Signed receipt',
  'machine-payment': 'Metered agent payment',
  'on-chain-right': 'On-chain right',
  refuse: 'Not for sale',
} as const

export function IncomeGraphWorkbench() {
  const [source, setSource] = useState('')
  const [thesis, setThesis] = useState('')
  const [draft, setDraft] = useState<IncomeGraphDraft | null>(null)
  const [outcome, setOutcome] = useState<Outcome>({ state: 'idle' })

  function review(text: string) {
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch (error) {
      setOutcome({
        state: 'parse-error',
        message: error instanceof Error ? error.message : 'The input is not valid JSON.',
      })
      return
    }
    // The clock is read once, here, and passed in — the review function itself is pure.
    const today = new Date().toISOString().slice(0, 10)
    const graph = parsed as IncomeGraph
    setOutcome({
      state: 'reviewed',
      report: reviewIncomeGraph(graph, today),
      missing: projectToIncomeSystem(graph).missing,
      today,
    })
  }

  function loadReference() {
    const text = JSON.stringify(referenceGraph, null, 2)
    setDraft(null)
    setSource(text)
    review(text)
  }

  function draftFromThesis() {
    const today = new Date().toISOString().slice(0, 10)
    const drafted = draftIncomeGraph(thesis, { today })
    const text = JSON.stringify(drafted.graph, null, 2)
    setDraft(drafted)
    setSource(text)
    review(text)
  }

  return (
    <section className="section-band" aria-labelledby="workbench-title">
      <div className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-8">
        <div className="border-b border-border pb-6">
          <div className="kicker">Workbench · runs in your browser</div>
          <h2 id="workbench-title" className="mt-2 text-3xl font-semibold text-ink">
            Review a graph before a buyer does.
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-muted">
            Paste an IncomeGraph document. Nothing is uploaded, stored, or sent anywhere — the same
            functions the MCP server runs are executing locally in this page. The review never
            predicts revenue; it reports what your graph asserts and what it cannot support.
          </p>
        </div>

        <div className="mt-8">
          <div className="kicker">Step one · start from a sentence</div>
          <h3 className="mt-2 text-xl font-semibold text-ink">
            Write the thesis you already believe.
          </h3>
          <p className="mt-2 max-w-3xl leading-7 text-muted">
            Who has the problem, what you would sell them, and why they would pay. The workbench
            builds the smallest graph that can carry it and then tells you which claim in your own
            sentence nothing supports — before you have filled in a single field.
          </p>
          <label className="mt-5 block text-sm font-semibold text-ink" htmlFor="thesis-source">
            Your thesis
          </label>
          <textarea
            id="thesis-source"
            value={thesis}
            onChange={(event) => setThesis(event.target.value)}
            rows={3}
            placeholder="Small renovation firms lose qualified inbound work because nobody turns a messy request into a scope brief within a day, and they will pay €180 per brief for someone who does."
            className="mt-2 w-full rounded-xl border border-border bg-bg/60 p-4 leading-7 text-ink"
          />
          <button
            type="button"
            className="cta mt-4"
            onClick={draftFromThesis}
            disabled={thesis.trim().length < 12}
          >
            Draft the graph and attack it
          </button>
        </div>

        {draft ? <DraftVerdict draft={draft} /> : null}

        <div className="mt-10 border-t border-border pt-8">
          <div className="kicker">Step two · review a graph</div>
          <p className="mt-2 max-w-3xl leading-7 text-muted">
            The drafted document appears below, and you can paste your own over it. Every change is
            re-reviewed by the same functions, locally.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="cta-secondary" onClick={loadReference}>
            Load the reference graph
          </button>
          <button
            type="button"
            className="cta"
            onClick={() => review(source)}
            disabled={source.trim().length === 0}
          >
            Review
          </button>
        </div>

        <label className="mt-6 block text-sm font-semibold text-ink" htmlFor="graph-source">
          IncomeGraph JSON
        </label>
        <textarea
          id="graph-source"
          value={source}
          onChange={(event) => {
            setSource(event.target.value)
            setDraft(null)
            setOutcome({ state: 'idle' })
          }}
          spellCheck={false}
          rows={12}
          placeholder='{ "apiVersion": "agenticincome.ai/v1", "kind": "IncomeGraph", … }'
          className="mt-2 w-full rounded-xl border border-border bg-bg/60 p-4 font-mono text-xs leading-6 text-ink"
        />

        {outcome.state === 'parse-error' ? (
          <p role="status" className="mt-6 rounded-xl border border-border p-4 text-sm text-muted">
            That is not valid JSON: {outcome.message}
          </p>
        ) : null}

        {outcome.state === 'reviewed' ? <Report outcome={outcome} /> : null}
      </div>
    </section>
  )
}

/**
 * The refusal, first. A buyer's first paste should meet judgment about their own
 * sentence, not twenty structural findings about semver strings.
 */
function DraftVerdict({ draft }: { draft: IncomeGraphDraft }) {
  const hours = draft.unsupported.reduce((sum, claim) => sum + claim.costInFounderHours, 0)

  return (
    <div className="mt-8 rounded-xl border border-border bg-bg/40 p-5 sm:p-6" role="status">
      <div className="kicker">What your thesis cannot support</div>
      <p className="mt-3 max-w-3xl text-lg leading-8 text-ink">{draft.headline}</p>

      {draft.unsupported.length > 0 ? (
        <ol className="mt-6 space-y-5">
          {draft.unsupported.map((claim) => (
            <li key={`${claim.path}${claim.claim}`} className="border-l-2 border-accent pl-4">
              <p className="leading-7 text-ink">“{claim.claim}”</p>
              <p className="mt-1 leading-7 text-muted">{claim.why}</p>
              <p className="mt-1 leading-7 text-muted">
                <span className="font-semibold text-ink">What would settle it: </span>
                {claim.evidenceThatWouldSettleIt}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                About {claim.costInFounderHours} founder hour
                {claim.costInFounderHours === 1 ? '' : 's'} · {claim.path}
              </p>
            </li>
          ))}
        </ol>
      ) : null}

      {draft.unsupported.length > 0 ? (
        <p className="mt-6 max-w-3xl leading-7 text-muted">
          Total: about {hours} founder hours of evidence gathering. Everything else in the graph can
          wait until you know whether this part is true.
        </p>
      ) : null}

      <h4 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted">
        What the draft had to assume
      </h4>
      <ul className="mt-3 space-y-2">
        {draft.assumptions.map((assumption) => (
          <li key={assumption} className="leading-7 text-muted">
            {assumption}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Report({ outcome }: { outcome: Extract<Outcome, { state: 'reviewed' }> }) {
  const { report, missing, today } = outcome
  const { economics } = report

  return (
    <div className="mt-8 border-t border-border pt-8" role="status">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Figure
          label="Activation"
          value={
            report.activation === 'blocked'
              ? 'Blocked'
              : report.activation === 'ready-to-test'
                ? 'Ready to test'
                : 'Activated'
          }
          note={
            report.activation === 'ready-to-test'
              ? 'Coherent enough to put in front of a real buyer. Not a claim that anyone will pay.'
              : report.activation === 'activated'
                ? 'A validated graph plus attested revenue.'
                : `${report.counts.errors} blocking finding${report.counts.errors === 1 ? '' : 's'} to clear first.`
          }
        />
        <Figure
          label="Money cost"
          value={`${economics.currency} ${economics.monthlyCostFloor} / month`}
          note={economics.oneOffCost > 0 ? `Plus ${economics.currency} ${economics.oneOffCost} one-off.` : 'Recorded costs only.'}
        />
        <Figure
          label="Founder time"
          value={`${economics.founderHoursPerMonth} hours / month`}
          note="The cost most systems hide from themselves."
        />
        <Figure
          label="Observed revenue"
          value={`${economics.currency} ${economics.observedRevenue}`}
          note={
            report.economicEvent
              ? `${economics.observedUnits} attested unit${economics.observedUnits === 1 ? '' : 's'}.`
              : 'Only revenue with a receipt is counted. Forecasts are not revenue.'
          }
        />
      </div>

      {economics.breakEvenUnitsPerMonth !== null ? (
        <p className="mt-6 max-w-3xl leading-7 text-muted">
          Break-even is{' '}
          <strong className="text-ink">
            {economics.breakEvenUnitsPerMonth} unit
            {economics.breakEvenUnitsPerMonth === 1 ? '' : 's'} a month
          </strong>{' '}
          at the lowest price in the graph. That is arithmetic on your own numbers, not a
          projection that anyone buys.
        </p>
      ) : null}

      <h3 className="mt-10 text-xl font-semibold text-ink">Where the payment clears</h3>
      <p className="mt-2 max-w-3xl leading-7 text-muted">
        Each offer gets one rail. A file, a seat, or a month clears in a merchant account. A signed
        receipt proves what happened. An agent call can clear in USDC or EURC, per request or per
        session, inside a spend cap a person raises. A chain is admitted for a license, a royalty
        split, or access a stranger has to enforce after the seller is gone.
      </p>
      {report.settlements.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {report.settlements.map((verdict) => (
            <li key={verdict.offerId} className="border-l-2 border-border pl-4">
              <div className="flex flex-wrap items-baseline gap-x-3 text-xs font-semibold uppercase tracking-wide text-muted">
                <span className={verdict.admitted ? '' : 'text-accent'}>{RAIL_LABEL[verdict.rail]}</span>
                <span className="font-mono normal-case tracking-normal">{verdict.offerId}</span>
              </div>
              <p className="mt-1 leading-7 text-ink">{verdict.label}</p>
              <p className="mt-1 leading-7 text-muted">{verdict.because}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 leading-7 text-muted">This graph has no offer, so there is nothing to clear.</p>
      )}

      <h3 className="mt-10 text-xl font-semibold text-ink">
        {report.findings.length === 0
          ? 'No findings.'
          : `${report.counts.errors} blocking, ${report.counts.warnings} to watch`}
      </h3>

      {report.findings.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {report.findings.map((finding) => (
            <li key={`${finding.code}${finding.path}${finding.message}`} className="border-l-2 border-border pl-4">
              <div className="flex flex-wrap items-baseline gap-x-3 text-xs font-semibold uppercase tracking-wide text-muted">
                <span className={finding.severity === 'error' ? 'text-accent' : ''}>
                  {SEVERITY_LABEL[finding.severity]}
                </span>
                <span className="font-mono normal-case tracking-normal">{finding.code}</span>
                <span className="font-mono normal-case tracking-normal">{finding.path}</span>
              </div>
              <p className="mt-1 leading-7 text-ink">{finding.message}</p>
              <p className="mt-1 leading-7 text-muted">{finding.remedy}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {report.nextDecisions.length > 0 ? (
        <>
          <h3 className="mt-10 text-xl font-semibold text-ink">Next decisions</h3>
          <ul className="mt-3 space-y-2">
            {report.nextDecisions.map((decision) => (
              <li key={decision} className="leading-7 text-muted">
                {decision}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h3 className="mt-10 text-xl font-semibold text-ink">Manifest fields you still owe</h3>
      <p className="mt-2 max-w-3xl leading-7 text-muted">
        A graph cannot know your legal entity, your runtime, or your budget ceiling. These{' '}
        {missing.length} fields are required by the IncomeSystem.v1 contract and must be filled by
        you before the open-core validator will pass the manifest.
      </p>
      <p className="mt-3 font-mono text-xs leading-6 text-muted">{missing.join(' · ')}</p>

      <p className="mt-8 text-sm text-muted">
        Reviewed against {today}. Re-run after any change; the result depends only on the document
        and that date.
      </p>
    </div>
  )
}

function Figure({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="border-t border-border pt-4">
      <div className="kicker">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-ink">{value}</div>
      <p className="mt-2 text-sm leading-6 text-muted">{note}</p>
    </div>
  )
}
