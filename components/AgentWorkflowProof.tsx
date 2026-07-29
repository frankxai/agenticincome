import { TrackedLink } from '@/components/TrackedLink'

const steps = [
  {
    number: '01',
    role: 'Input',
    title: 'Capture the request',
    body: 'Accept one supported B2B service request, preserve its source, and ask for required information when the record is incomplete.',
    output: 'Traceable qualification record',
  },
  {
    number: '02',
    role: 'Agent',
    title: 'Prepare the work',
    body: 'Classify the request, propose schedule options, update one idempotent CRM record, and draft from the approved service catalog.',
    output: 'Reviewable quote draft',
  },
  {
    number: '03',
    role: 'Human gate',
    title: 'Approve the commitment',
    body: 'A commercial owner approves the price and send. Contracts, price changes, financial actions, and ambiguous commitments remain denied by default.',
    output: 'Explicit approve or reject decision',
  },
  {
    number: '04',
    role: 'Evidence',
    title: 'Measure and operate',
    body: 'Acceptance checks verify required fields, unapproved-price prevention, CRM traceability, and human-rated draft quality before any public claim.',
    output: 'Eval record + runbook decision',
  },
]

export function AgentWorkflowProof() {
  return (
    <section id="workflow-proof" className="section-band" aria-labelledby="workflow-proof-title">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <div className="section-heading motion-reveal">
          <div className="kicker">Inspectable reference Outcome Pack</div>
          <h2 id="workflow-proof-title">One governed service. Every boundary visible.</h2>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-muted motion-reveal">
          The public Request-to-Quote desk is deliberately narrow: supported B2B service requests,
          known actions, explicit denials, acceptance checks, budgets, rollback, and a human decision
          before any binding commercial commitment.
        </p>
      </div>

      <div className="workflow-proof motion-reveal">
        <div className="workflow-command" aria-label="Request-to-Quote validation command">
          <div className="workflow-command-topline">
            <span>request-to-quote-desk / local validation</span>
            <strong>Verified 29 Jul 2026 · MIT</strong>
          </div>
          <code>npm run income:validate -- examples/request-to-quote-desk/income-system.json</code>
          <p>
            The validator checks the system contract. It does not connect credentials, send a quote,
            change a price, sign a contract, move money, or prove customer demand.
          </p>
        </div>

        <ol className="workflow-steps" aria-label="Affiliate audit workflow stages">
          {steps.map((step) => (
            <li key={step.number} className="workflow-step">
              <div className="workflow-step-meta">
                <span>{step.number}</span>
                <strong>{step.role}</strong>
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <div className="workflow-output">Output · {step.output}</div>
            </li>
          ))}
        </ol>

        <div className="workflow-evidence">
          <div>
            <span className="panel-label">Source evidence</span>
            <p>Inspect the skill contract and executable script directly on GitHub. These links are the proof; the diagram is only the explanation.</p>
          </div>
          <div className="workflow-actions">
            <TrackedLink
              href="https://github.com/frankxai/agentic-income-skills/tree/main/examples/request-to-quote-desk"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary"
              event="workflow_proof_clicked"
              payload={{ source: 'homepage-workflow', state: 'reference-pack' }}
            >
              Inspect the reference pack
            </TrackedLink>
            <TrackedLink
              href="https://github.com/frankxai/agentic-income-skills/blob/main/schemas/income-system.v1.schema.json"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary"
              event="workflow_proof_clicked"
              payload={{ source: 'homepage-workflow', state: 'income-system-schema' }}
            >
              Inspect the system schema
            </TrackedLink>
          </div>
        </div>
      </div>

      <p className="workflow-boundary">
        Reference implementation only. Replace the example principal, domains, providers, terms,
        budgets, evals, system hash, and evidence before production use. This is not customer proof or an income result.
      </p>
    </section>
  )
}
