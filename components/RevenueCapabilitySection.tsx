import Link from 'next/link'

const models = [
  {
    label: 'Primary model',
    title: 'Outcome Pack implementation',
    body: 'A scope-first engagement for teams with one valuable workflow that should become a governed, repeatable customer service.',
    proof: 'Outcome: offer, authority model, working workflow, acceptance tests, runbook, evidence, and owned repository.',
    href: '/offers/implementation-sprint',
    cta: 'Inspect implementation',
  },
  {
    label: 'Product layer',
    title: 'Self-serve systems',
    body: 'The free skill, reference system, templates, and future paid playbooks package the same method for independent builders.',
    proof: 'Public delivery is available now. Paid access remains clearly marked until secure checkout is actually connected.',
    href: '/offers',
    cta: 'Compare products',
  },
  {
    label: 'Distribution layer',
    title: 'Open proof',
    body: 'Public contracts, schemas, examples, and a deployable template let humans and agents inspect the method before anyone buys.',
    proof: 'Open source exposes the method. Private delivery adds context, integration, judgment, and accountability.',
    href: 'https://github.com/frankxai/agentic-income-skills',
    cta: 'Open the skills repository',
    external: true,
  },
  {
    label: 'Distribution layer',
    title: 'Reader-first research',
    body: 'Dated comparisons earn attention and may use disclosed affiliate routes only when the recommendation survives without the incentive.',
    proof: 'Criteria, freshness, alternatives, and material incentives stay visible. Research supports the product; it is not the product.',
    href: '/trust',
    cta: 'Read the trust standard',
  },
]

export function RevenueCapabilitySection() {
  return (
    <section id="capabilities" className="section-band">
      <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
        <div className="section-heading motion-reveal">
          <div className="kicker">The business architecture</div>
          <h2>The product is a working system—not an agent-shaped promise.</h2>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-muted motion-reveal">
          Implementation is the commercial core. Self-serve systems make the method accessible.
          Open source proves the contracts. Research compounds reach without confusing the category.
        </p>
      </div>

      <div className="capability-grid">
        {models.map((model, index) => {
          const content = (
            <>
              <div className="capability-index">0{index + 1}</div>
              <div className="panel-label">{model.label}</div>
              <h3>{model.title}</h3>
              <p>{model.body}</p>
              <div className="capability-proof">{model.proof}</div>
              <span className="capability-link">{model.cta} <span aria-hidden="true">↗</span></span>
            </>
          )

          return model.external ? (
            <a
              key={model.title}
              href={model.href}
              target="_blank"
              rel="noopener noreferrer"
              className="capability-card motion-reveal"
            >
              {content}
            </a>
          ) : (
            <Link key={model.title} href={model.href} className="capability-card motion-reveal">
              {content}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
