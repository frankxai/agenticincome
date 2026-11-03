import Link from 'next/link'

const MODELS = [
  {
    stage: 'Model 1 · weeks 1–4',
    name: 'Services',
    body: 'Sell one scoped outcome; an agent team carries much of the delivery. Price the outcome, so the hours agents save stay in your margin, not your client’s.',
    econ: [
      ['First dollar', 'days'],
      ['Coupling', 'still your hours'],
      ['Job', 'fund the next model'],
    ],
    href: '/build',
    cta: 'Inspect the build path',
  },
  {
    stage: 'Model 2 · months 2–3',
    name: 'Products',
    body: 'Package the decisions you made in service work — packs, kits, blueprints. Agent-native products do work for the buyer instead of assigning homework.',
    econ: [
      ['Self-serve band', '$19–$149'],
      ['Margin', '~95% via merchant of record'],
      ['The game', 'distribution'],
    ],
    href: '/offers',
    cta: 'Inspect current offers',
  },
  {
    stage: 'Model 3 · months 3–6',
    name: 'Systems',
    body: 'Own a machine that produces with maintenance measured in hours per month. “Passive” means structurally decoupled — never zero. We publish every maintenance floor.',
    econ: [
      ['First dollar', 'weeks–months'],
      ['Ceiling', 'highest of the three'],
      ['Next', '/api streams → /dpi portfolio'],
    ],
    href: '/operate',
    cta: 'Inspect the operating loop',
  },
]

export function PathSection() {
  return (
    <section className="section-band" id="path">
      <div className="section-heading motion-reveal">
        <div className="kicker text-[color:var(--color-accent)]">The path · open machinery</div>
        <h2 className="display-h2">Three models. One order. <span className="text-[color:var(--color-accent)]">Each funds the next.</span></h2>
        <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
          Services buy your runway, products package your judgment, systems decouple your calendar.
          The public operating contract helps choose an entry point from what you already have —
          with acceptance and stop conditions attached.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {MODELS.map((m, i) => (
          <Link key={m.name} href={m.href} className="path-card motion-reveal group">
            <div className="path-stage">{m.stage}</div>
            <h3>
              <span className="mr-2 font-mono text-sm text-[color:var(--color-muted)]">0{i + 1}</span>
              {m.name}
            </h3>
            <p className="text-sm leading-relaxed text-[color:var(--color-muted)]">{m.body}</p>
            <dl className="path-econ">
              {m.econ.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt>{k}</dt>
                  <dd><b>{v}</b></dd>
                </div>
              ))}
            </dl>
            <span className="mt-1 font-mono text-[0.68rem] uppercase tracking-widest text-[color:var(--color-muted)] transition group-hover:text-[color:var(--color-accent)]">
              {m.cta} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
