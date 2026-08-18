import Link from 'next/link'

const PRODUCTS = [
  {
    name: 'Starter Kit',
    price: 'Free',
    free: true,
    state: 'delivered on-site',
    body: 'The public operating skill, schema, validator, scaffold, reference system, and first-system runbook. No account is required for the repository.',
    href: '/start',
    cta: 'Start free',
  },
  {
    name: 'Income Architecture Blueprint',
    price: '$67',
    state: 'waitlist — opens when ready',
    body: 'Deep business-plan kits per income model: worked economics, fulfillment runbooks, launch sequences. The paid depth behind the public method.',
    href: '/offers',
    cta: 'View the offer',
  },
  {
    name: 'Agent Team Pro',
    price: '$129',
    state: 'waitlist — opens when ready',
    body: 'The premium agent team: extended specialists, delivery loops, QA gates, and 12 months of updates as the landscape shifts.',
    href: '/offers',
    cta: 'View the offer',
  },
  {
    name: 'Private Intel',
    price: '$19/mo',
    state: 'waitlist — opens when ready',
    body: 'Operator briefings: registry alpha, program-term changes, landscape diffs that affect running machines — before the quarterly public pass.',
    href: '/offers',
    cta: 'View the offer',
  },
]

export function ProductLadder() {
  return (
    <section className="section-band" id="products">
      <div className="section-heading motion-reveal">
        <div className="kicker text-[color:var(--color-gold)]">Products · commercial — labeled honestly</div>
        <h2 className="display-h2">The operating contract is public. <span className="text-[color:var(--color-gold)]">Depth is $67.</span></h2>
        <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
          The operating skill, schema, validator, scaffold, and reference system are MIT licensed
          in a public repository. Paid products add implementation depth and updates. Nothing below
          says “buy” until checkout exists; access states render from reality.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        Contract: <a className="underline decoration-[color:var(--color-border)] underline-offset-2 hover:text-[color:var(--color-ink)]" href="https://github.com/frankxai/agentic-income-skills/blob/main/skills/agentic-income/SKILL.md" target="_blank" rel="noopener noreferrer">public Agentic Income skill</a>.
      </p>
    </section>
  )
}
