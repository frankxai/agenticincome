'use client'

import { TrackedLink } from '@/components/TrackedLink'

const steps = [
  {
    number: '01',
    role: 'Input',
    title: 'Load request & evidence',
    body: 'Point the agent pipeline at customer repository content and program records. Accepts content paths, catalog data, and traffic context.',
    output: 'Structured content paths + verified catalog records',
  },
  {
    number: '02',
    role: 'Agent Execution',
    title: 'Analyze & draft solution',
    body: 'The agent matches program aliases against site content, calculates gap coverage, and drafts recommendations without executing external calls.',
    output: 'Prioritized gaps & draft recommendations',
  },
  {
    number: '03',
    role: 'Deliverable Output',
    title: 'Generate AUDIT.md artifact',
    body: 'The run outputs an inspectable AUDIT.md deliverable with affected paths, verification status, traffic context, and disclosure text.',
    output: 'A reviewable Markdown deliverable artifact',
  },
  {
    number: '04',
    role: 'Human gate',
    title: 'Approve before publishing',
    body: 'A human principal verifies terms, destination fit, and compliance before any public publishing or external partner commitment.',
    output: 'Explicit approve or reject next action',
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
          The open-source affiliate audit is a concrete reference workflow: known inputs, executable source, a reviewable output, and a human decision before anything becomes public.
        </p>
      </div>

      <div className="workflow-proof motion-reveal">
        <div className="workflow-command" aria-label="Affiliate audit command">
          <div className="workflow-command-topline">
            <span>affiliate-audit / local run</span>
            <strong>MIT · no autonomous publishing</strong>
          </div>
          <code>node scripts/affiliate-audit.mjs --content=&lt;site&gt;/content --write</code>
          <p>
            The command reads files and writes an audit. It does not join a program, change a public page, send a message, or claim revenue.
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
              href="https://github.com/frankxai/agentic-income-skills/blob/main/skills/affiliate-audit/SKILL.md"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary"
              event="workflow_proof_clicked"
              payload={{ source: 'homepage-workflow', state: 'skill-contract' }}
            >
              Inspect the skill contract
            </TrackedLink>
            <TrackedLink
              href="https://github.com/frankxai/agentic-income-skills/blob/main/scripts/affiliate-audit.mjs"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary"
              event="workflow_proof_clicked"
              payload={{ source: 'homepage-workflow', state: 'executable-source' }}
            >
              Inspect executable source
            </TrackedLink>
          </div>
        </div>
      </div>

      <p className="workflow-boundary">
        Reference implementation only. It demonstrates the operating method; it is not customer evidence or a revenue result.
      </p>
    </section>
  )
}
