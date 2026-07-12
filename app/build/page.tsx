import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Build an Agentic Income System',
  description:
    'Turn one valuable customer request into a governed agent workflow, a reviewable offer, and a delivery system you own.',
  alternates: { canonical: '/build' },
  openGraph: {
    title: 'Build an Agentic Income System',
    description:
      'A practical path from customer request to governed workflow, reviewable quote, verified delivery, and owned operating system.',
    url: '/build',
  },
}

const buildStages = [
  {
    number: '01',
    title: 'Define the request',
    body: 'Capture the customer job, current process, success condition, constraints, and authority boundary before choosing tools.',
    artifact: 'Request brief',
  },
  {
    number: '02',
    title: 'Design the system',
    body: 'Map the agent work, human decisions, evidence, failure path, and customer handoff as one bounded outcome pack.',
    artifact: 'Income system contract',
  },
  {
    number: '03',
    title: 'Implement the path',
    body: 'Build the workflow and customer surface in a repository the principal owns. Keep production actions behind approval.',
    artifact: 'Git-backed preview',
  },
  {
    number: '04',
    title: 'Verify the outcome',
    body: 'Run acceptance checks, record limitations, and hand over the operating decision instead of declaring success from a demo.',
    artifact: 'Evidence bundle',
  },
] as const

const outcomePack = [
  ['Customer input', 'A structured request with explicit success and non-goals.'],
  ['Agent work', 'Triage, missing-information detection, scope draft, and quote brief.'],
  ['Human decision', 'Approve scope, pricing, contractual language, and any customer-facing send.'],
  ['Evidence', 'Inputs, versions, checks, decision log, preview, and delivery receipt.'],
] as const

export default function BuildPage() {
  return (
    <>
      <section className="section-band pt-20">
        <div className="max-w-4xl">
          <div className="kicker">Build · active agentic income</div>
          <h1 className="mt-3 text-5xl font-semibold leading-[1.02] text-ink sm:text-6xl">
            Turn one customer request into a governed delivery system.
          </h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            Start with a valuable job, not an autonomous-agent promise. Define the authority,
            build the workflow, verify the result, and keep the repository and operating knowledge.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/build/request-to-quote" className="cta">
              Open the Request-to-Quote desk
            </Link>
            <Link href="/offers/implementation-sprint" className="cta-secondary">
              Inspect the implementation sprint
            </Link>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
            The reference desk runs in your browser and sends nothing. It produces a scoping artifact,
            not a price, contract, customer message, or income prediction.
          </p>
        </div>
      </section>

      <section className="section-band" aria-labelledby="build-path-title">
        <div className="section-heading">
          <div className="kicker">The build path</div>
          <h2 id="build-path-title">Four stages. Four reviewable artifacts.</h2>
          <p>Each stage makes the next decision easier to inspect, repeat, and improve.</p>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {buildStages.map((stage) => (
            <li key={stage.number} className="card">
              <div className="font-mono text-sm font-semibold text-accent">{stage.number}</div>
              <h3 className="mt-4 text-2xl font-semibold text-ink">{stage.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{stage.body}</p>
              <div className="mt-5 border-t border-border pt-4 text-xs font-semibold uppercase tracking-[0.12em] text-gold">
                Artifact · {stage.artifact}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-band" aria-labelledby="outcome-pack-title">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="section-heading">
            <div className="kicker">Reference Outcome Pack</div>
            <h2 id="outcome-pack-title">Request-to-Quote Desk.</h2>
            <p>
              A local-service or B2B request becomes a complete brief before an agent is allowed to
              propose customer-facing scope.
            </p>
            <a
              href="https://github.com/frankxai/agentic-income-skills/tree/main/examples/request-to-quote-desk"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex text-sm font-semibold text-accent underline underline-offset-4"
            >
              Inspect the open reference contract
            </a>
          </div>
          <dl className="grid gap-3">
            {outcomePack.map(([term, description]) => (
              <div key={term} className="grid gap-2 rounded-xl border border-border bg-surface/70 p-5 sm:grid-cols-[10rem_1fr]">
                <dt className="font-semibold text-ink">{term}</dt>
                <dd className="text-sm leading-6 text-muted">{description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-band">
        <div className="rounded-2xl border border-gold/30 bg-surface p-6 sm:p-8">
          <div className="kicker text-gold">Authority boundary</div>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Agents prepare. An authorized principal commits.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-muted">
            Research, triage, drafts, tests, and evidence gathering can run automatically. Pricing,
            contracts, public income claims, production promotion, customer sends, credential grants,
            and movement of money require explicit authority and an auditable approval.
          </p>
        </div>
      </section>
    </>
  )
}
