import Link from 'next/link'

const PRODUCTS = [
  {
    name: 'Starter Kit',
    price: 'Free',
    free: true,
    state: 'delivered on-site',
    body: 'The capability map, public operating contract, local Request-to-Quote desk, and first-system worksheet. No email gate.',
    href: '/start',
    cta: 'Start free',
  },
  {
    name: 'Outcome Pack Blueprint',
    price: '$67',
    state: 'request access — checkout arriving',
    body: 'The complete design desk: buyer, offer, acceptance, authority, evals, economics, evidence, and operating runbook.',
    href: '/offers/blueprint',
    cta: 'View the offer',
  },
  {
    name: 'Operator Evidence Brief',
    price: '$19/mo',
    state: 'request access — checkout arriving',
    body: 'Monthly runtime, authority, evaluation, cost, and re-verification notes for people operating live Outcome Packs.',
    href: '/offers/private-intel',
    cta: 'View the offer',
  },
]

export function ProductLadder() {
  return (
    <section className="section-band" id="products">
      <div className="section-heading motion-reveal">
        <div className="kicker text-[color:var(--color-gold)]">Products · commercial — labeled honestly</div>
        <h2 className="display-h2">Everything important is free. <span className="text-[color:var(--color-gold)]">Depth is $67.</span></h2>
        <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
          The packs, the knowledge, the manifesto — free forever, MIT. What we sell is depth and
          updates: complete business-plan kits, premium agent teams, operator intel. Self-serve
          through a merchant of record, no calls, no funnels, 30-day refunds. And nothing below
          says “buy” until checkout actually exists — access states render from reality.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {PRODUCTS.map((p) => (
          <div key={p.name} className={`price-card motion-reveal ${p.free ? '' : 'is-commercial'}`}>
            <div className={`price-tag ${p.free ? 'free' : ''}`}>{p.price}</div>
            <h3 className="font-display text-lg font-bold">{p.name}</h3>
            <p className="text-sm leading-relaxed text-[color:var(--color-muted)]">{p.body}</p>
            <div className="price-state">{p.state}</div>
            <Link href={p.href} className="cta-secondary mt-2 !min-h-0 !px-4 !py-2 text-sm">
              {p.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className="motion-reveal mt-6 max-w-3xl font-mono text-[0.7rem] leading-relaxed text-[color:var(--color-muted)]">
        NO INCOME PROMISES — we sell machinery and education, never outcomes. Some research links
        are commission links, always disclosed inline, with a non-affiliate alternative named.
        Operating contract: <a className="underline decoration-[color:var(--color-border)] underline-offset-2 hover:text-[color:var(--color-ink)]" href="https://github.com/frankxai/agentic-income-skills/blob/main/skills/agentic-income/SKILL.md" target="_blank" rel="noopener noreferrer">public Agentic Income skill</a>.
      </p>
    </section>
  )
}
