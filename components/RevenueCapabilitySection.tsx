import Link from 'next/link'

const models = [
  {
    label: 'Primary model',
    title: 'Agent-as-a-Service',
    body: 'A scoped implementation engagement for founders who need one revenue workflow designed, built, instrumented, and handed over.',
    proof: 'Outcome: a Git-backed system and verified preview, not a strategy deck.',
    href: '/offers/implementation-sprint',
    cta: 'Inspect the implementation sprint',
  },
  {
    label: 'Product layer',
    title: 'Digital products',
    body: 'Self-serve playbooks, templates, and private intelligence package the same operating method at lower commitment.',
    proof: 'Starter Kit is delivered on-site; paid access stays clearly marked until checkout is connected.',
    href: '/offers',
    cta: 'Compare products',
  },
  {
    label: 'Distribution layer',
    title: 'Open-source proof',
    body: 'Public skills, catalog logic, and a deployable template make the system inspectable before anyone buys implementation.',
    proof: 'MIT repositories expose the method; private delivery adds scope, integration, and accountability.',
    href: 'https://github.com/frankxai/agentic-income-skills',
    cta: 'Open the skills repository',
    external: true,
  },
  {
    label: 'Authority layer',
    title: 'Editorial and affiliate',
    body: 'Reader-first comparisons earn attention and may monetize through disclosed links only when the recommendation still holds without the incentive.',
    proof: 'The methodology, freshness, alternatives, and material incentive remain visible.',
    href: '/trust',
    cta: 'Read the trust standard',
  },
]

export function RevenueCapabilitySection() {
  return (
    <section id="capabilities" className="section-band">
      <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
        <div className="section-heading motion-reveal">
          <div className="kicker">Business model</div>
          <h2>One engine. Four ways to create value.</h2>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-muted motion-reveal">
          Implementation is the premium service. Products make the method accessible. Open source proves the engineering. Editorial research compounds authority without becoming the product itself.
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
