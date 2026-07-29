import { TrackedLink } from '@/components/TrackedLink'

const deliveryStages = [
  {
    number: '01',
    title: 'Discover',
    body: 'Choose one buyer, painful job, and credible advantage worth testing.',
  },
  {
    number: '02',
    title: 'Define',
    body: 'Specify the outcome, acceptance checks, economics, and stop conditions.',
  },
  {
    number: '03',
    title: 'Build',
    body: 'Implement the governed workflow and customer path in an owned repository.',
  },
  {
    number: '04',
    title: 'Prove',
    body: 'Run the checks, record limits, and hand over evidence—not a demo claim.',
  },
]

const proofAssets = [
  {
    label: 'Open contract',
    value: 'Agentic Income skill',
    href: 'https://github.com/frankxai/agentic-income-skills/blob/main/skills/agentic-income/SKILL.md',
  },
  {
    label: 'Typed system',
    value: 'IncomeSystem schema',
    href: 'https://github.com/frankxai/agentic-income-skills/blob/main/schemas/income-system.v1.schema.json',
  },
  {
    label: 'Reference pack',
    value: 'Request-to-Quote desk',
    href: 'https://github.com/frankxai/agentic-income-skills/tree/main/examples/request-to-quote-desk',
  },
  {
    label: 'Executable proof',
    value: 'Scaffold · validate · test',
    href: 'https://github.com/frankxai/agentic-income-skills#verify-before-you-trust-it',
  },
]

export function IncomeDeskHero() {
  return (
    <section className="hero-stage -mx-4 sm:-mx-6" aria-labelledby="home-title">
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-content mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="hero-copy motion-reveal">
          <div className="kicker">Free field guide · open contracts · scope-first builds</div>
          <h1 id="home-title" className="hero-title">
            <span>Turn one valuable workflow</span>
            <span>into an income system you own.</span>
          </h1>
          <p className="hero-subtitle">
            Package a buyer, accepted outcome, governed workflow, and evidence into one Outcome Pack.
            Agents can research, build, and verify. You keep the judgment, customer relationship,
            accounts, repository, and IP.
          </p>
          <div className="hero-actions">
            <TrackedLink
              href="/start"
              className="cta w-full sm:w-auto"
              event="owned_offer_clicked"
              payload={{ source: 'homepage-hero' }}
            >
              Start the free Field Guide
            </TrackedLink>
            <TrackedLink
              href="https://github.com/frankxai/agentic-income-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary w-full sm:w-auto"
              event="open_source_proof_clicked"
              payload={{ source: 'homepage-hero' }}
            >
              Inspect the public method
            </TrackedLink>
          </div>
          <p className="hero-note">
            No income promise. The Field Guide is free and ungated. Any build is scoped around
            acceptance, ownership, authority, evidence, and stop conditions before payment.
          </p>
        </div>

        <aside className="hero-panel" data-hero-panel aria-label="Agentic Income implementation model">
          <div className="desk-header">
            <div>
              <div className="text-xs uppercase text-muted">Outcome Pack</div>
              <div className="mt-1 text-lg font-semibold text-ink">From expertise to accepted service</div>
            </div>
            <div className="status-dot">Principal-owned</div>
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
              <div className="text-xs text-muted">Reviewable system</div>
              <div className="mt-1 text-sm font-semibold text-ink">
                Offer · workflow · authority · evals · runbook · evidence
              </div>
            </div>
          </div>
        </aside>

        <div id="proof" className="hero-proofbar motion-reveal" aria-label="Inspectable Agentic Income proof">
          {proofAssets.map((asset) => (
            <TrackedLink
              key={asset.label}
              href={asset.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-proof hero-proof-action"
              event="open_source_proof_clicked"
              payload={{ source: 'homepage-proof-rail', state: asset.label }}
            >
              <span>{asset.label}</span>
              <strong>{asset.value}</strong>
            </TrackedLink>
          ))}
        </div>
      </div>
    </section>
  )
}
