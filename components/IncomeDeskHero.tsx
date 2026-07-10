import Link from 'next/link'

const deliveryStages = [
  {
    number: '01',
    title: 'Audit',
    body: 'Choose one customer job, revenue path, and constraint worth solving.',
  },
  {
    number: '02',
    title: 'Architect',
    body: 'Define the offer, agent workflow, product surface, and evidence plan.',
  },
  {
    number: '03',
    title: 'Implement',
    body: 'Build the workflow and customer-facing surface in a Git-backed system.',
  },
  {
    number: '04',
    title: 'Verify',
    body: 'Prove the build, preview, handoff, and next operating decision.',
  },
]

const proofAssets = [
  {
    label: 'Open-source skills',
    value: 'Installable operating brain',
    href: 'https://github.com/frankxai/agentic-income-skills',
  },
  {
    label: 'Shared catalog',
    value: 'Auditable recommendation data',
    href: 'https://github.com/frankxai/affiliate-agent-skills',
  },
  {
    label: 'Deployable template',
    value: 'Next.js reference implementation',
    href: 'https://github.com/frankxai/agentic-income-template',
  },
  {
    label: 'Live routing layer',
    value: 'Inspectable program directory',
    href: 'https://go.agenticincome.ai/programs',
  },
]

export function IncomeDeskHero() {
  return (
    <section className="hero-stage -mx-4 sm:-mx-6" aria-labelledby="home-title">
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-content mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="hero-copy motion-reveal">
          <div className="kicker">Agent-as-a-Service · open systems · digital products</div>
          <h1 id="home-title" className="hero-title">
            <span>Build the revenue engine.</span>
            <span>Keep the leverage.</span>
          </h1>
          <p className="hero-subtitle">
            Agentic Income turns one valuable workflow into a trustworthy offer, a working product surface, and an operating system your team can continue after handoff.
          </p>
          <div className="hero-actions">
            <Link href="/offers/implementation-sprint" className="cta w-full sm:w-auto">
              Request an implementation plan
            </Link>
            <a
              href="https://github.com/frankxai/agentic-income-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary w-full sm:w-auto"
            >
              Inspect the open-source system
            </a>
          </div>
          <p className="hero-note">
            No revenue promises. Scope, evidence, delivery, and acceptance checks are agreed before implementation begins.
          </p>
        </div>

        <aside className="hero-panel" data-hero-panel aria-label="Agentic Income implementation model">
          <div className="desk-header">
            <div>
              <div className="text-xs uppercase text-muted">Revenue system build</div>
              <div className="mt-1 text-lg font-semibold text-ink">From workflow to verified preview</div>
            </div>
            <div className="status-dot">Git-backed</div>
          </div>

          <div className="engine-stage-list">
            {deliveryStages.map((stage) => (
              <div key={stage.number} className="engine-stage" data-engine-stage>
                <span>{stage.number}</span>
                <div>
                  <strong>{stage.title}</strong>
                  <p>{stage.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="desk-footer">
            <div>
              <div className="text-xs text-muted">Delivery evidence</div>
              <div className="mt-1 text-sm font-semibold text-ink">Repository · checks · Vercel preview · handoff</div>
            </div>
          </div>
        </aside>

        <div id="proof" className="hero-proofbar motion-reveal" aria-label="Inspectable Agentic Income proof">
          {proofAssets.map((asset) => (
            <a
              key={asset.label}
              href={asset.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-proof hero-proof-action"
            >
              <span>{asset.label}</span>
              <strong>{asset.value}</strong>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
