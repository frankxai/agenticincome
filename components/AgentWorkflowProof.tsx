'use client'

import { TrackedLink } from '@/components/TrackedLink'

const steps = [
  {
    number: '01',
    role: 'Buyer signal',
    title: 'Capture the request',
    body: 'Record the customer job, current process, success condition, constraints, non-goals, and missing information before proposing a solution.',
    output: 'Structured request brief',
  },
  {
    number: '02',
    role: 'Agent',
    title: 'Prepare the scope',
    body: 'Research the workflow, surface ambiguity, draft the bounded outcome, map authority, and propose acceptance checks.',
    output: 'Non-binding scope draft',
  },
  {
    number: '03',
    role: 'Artifact',
    title: 'Assemble the Outcome Pack',
    body: 'Package the offer, interfaces, workflow, authority, budgets, evals, economics, runbooks, evidence, and failure paths as one inspectable system.',
    output: 'Versioned Outcome Pack',
  },
  {
    number: '04',
    role: 'Human gate',
    title: 'Approve the commitment',
    body: 'An authorized principal approves pricing, contractual language, customer-facing sends, production promotion, credentials, and money movement.',
    output: 'Explicit approve, revise, or reject decision',
  },
]

export function AgentWorkflowProof() {
  return (
    <section id="workflow-proof" className="section-band" aria-labelledby="workflow-proof-title">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <div className="section-heading motion-reveal">
          <div className="kicker">Inspectable agent workflow</div>
          <h2 id="workflow-proof-title">One real run. Every boundary visible.</h2>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-muted motion-reveal">
          The public Request-to-Quote desk is a concrete reference system: known inputs, a bounded
          agent role, a reviewable scope artifact, and an authorized human decision before a customer
          receives any commitment.
        </p>
      </div>

      <div className="workflow-proof motion-reveal">
        <div className="workflow-command" aria-label="Outcome Pack scaffold command">
          <div className="workflow-command-topline">
            <span>agentic-income / local scaffold</span>
            <strong>MIT · no autonomous commitments</strong>
          </div>
          <code>npm run income:init -- --output=../my-income-system</code>
          <p>
            The command scaffolds a reviewable income-system workspace. It does not price the work,
            sign a contract, contact a buyer, deploy to production, receive money, or claim revenue.
          </p>
        </div>

        <ol className="workflow-steps" aria-label="Outcome Pack workflow stages">
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
            <p>Inspect the skill contract and the complete reference system directly on GitHub. These artifacts are the proof; the diagram is only the explanation.</p>
          </div>
          <div className="workflow-actions">
            <TrackedLink
              href="https://github.com/frankxai/agentic-income-skills/blob/main/skills/agentic-income/SKILL.md"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary"
              event="workflow_proof_clicked"
              payload={{ source: 'homepage-workflow', state: 'skill-contract' }}
            >
              Inspect the operating contract
            </TrackedLink>
            <TrackedLink
              href="https://github.com/frankxai/agentic-income-skills/tree/main/examples/request-to-quote-desk"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary"
              event="workflow_proof_clicked"
              payload={{ source: 'homepage-workflow', state: 'executable-source' }}
            >
              Inspect the reference system
            </TrackedLink>
          </div>
        </div>
      </div>

      <p className="workflow-boundary">
        Reference implementation only. It demonstrates the contract and authority model; it is not customer evidence, legal advice, or a revenue result.
      </p>
    </section>
  )
}
