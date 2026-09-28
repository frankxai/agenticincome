const PROPERTIES = [
  {
    stage: 'Earn',
    cls: 't-earn',
    pack: '/ai',
    name: 'Agentic Income',
    domain: 'agenticincome.ai',
    href: null,
    body: 'You are here. Capability → offers → revenue systems, with an agent team doing the assembly.',
  },
  {
    stage: 'Automate',
    cls: 't-automate',
    pack: '/api',
    name: 'Agentic Passive Income',
    domain: 'agenticpassiveincome.com',
    href: 'https://www.agenticpassiveincome.com',
    body: 'Streams that run on inspectable loops — content engines, product lines, honest affiliate systems. Every maintenance floor published.',
  },
  {
    stage: 'Compound',
    cls: 't-compound',
    pack: '/dpi',
    name: 'Compound Layer',
    domain: null,
    href: null,
    body: 'The sovereign wealth substrate: income architecture structurally decoupled from hours. A doctrine, not a funnel — lives on this hub, not a separate public brand.',
  },
]

export function TrinityRibbon() {
  return (
    <section className="section-band" id="trinity">
      <div className="section-heading motion-reveal">
        <div className="kicker">The trinity · one journey</div>
        <h2 className="display-h2">Earn. Automate. Compound.</h2>
        <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
          Three properties, three stages of the same discipline — each with its own pack, knowledge
          base, and open repo. Start where your situation says, not where the marketing does.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {PROPERTIES.map((p) => {
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <span className="trinity-stage">{p.stage}</span>
                <span className="trinity-pack">{p.pack}</span>
              </div>
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
              <p className="text-sm leading-relaxed text-[color:var(--color-muted)]">{p.body}</p>
              {p.domain && (
                <span className="mt-1 font-mono text-[0.68rem] uppercase tracking-widest text-[color:var(--color-muted)]">
                  {p.domain}{p.href ? ' →' : ''}
                </span>
              )}
            </>
          )
          return p.href ? (
            <a key={p.stage} href={p.href} rel="noopener" className={`trinity-card motion-reveal ${p.cls}`}>
              {inner}
            </a>
          ) : (
            <div key={p.stage} className={`trinity-card motion-reveal ${p.cls}`} aria-current="true">
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}
