import Link from 'next/link'

const PRODUCTS = [
  {
    name: 'Starter Kit',
    price: 'Free',
    free: true,
    state: 'Delivered on-site',
    body: 'The public operating skill, schema, validator, scaffold, reference system, and 30-minute first-loop checklist. No account required.',
    href: '/start',
    cta: 'Start free',
  },
  {
    name: 'Agentic Income Blueprint',
    price: '$67',
    state: '7-file operating desk · Polar ready',
    body: 'Complete 7-file operating desk: workspace and cadence, dated coding-tool comparison matrix, 12-row recurring-payer CSV, 4-stage offer ladder, and Polar.sh gate checklist.',
    href: '/offers/blueprint',
    cta: 'Inspect Blueprint',
  },
  {
    name: 'Private Intel',
    price: '$19/mo',
    state: 'Waitlist · monthly briefs',
    body: 'Dated monthly briefings tracking commission-rate diffs, partner-term changes, and researched comparison niches before quarterly public passes.',
    href: '/offers/private-intel',
    cta: 'Inspect briefing',
  },
]

const FOCUSED_PACKS = [
  { name: 'Vibe OS Pack', price: '$24', href: '/offers/vibe-os-pack', note: '3 Suno skills + 4 Python tools' },
  { name: 'Claims Guard Pack', price: '$39', href: '/offers/claims-guard-pack', note: '5-gate pre-publish copy audit' },
  { name: 'ABOS Pack Bundle', price: '$99', href: '/offers/abos-pack-bundle', note: '4-pack founder governance archive' },
]

export function ProductLadder() {
  return (
    <section className="section-band" id="products">
      <div className="section-heading motion-reveal">
        <div className="kicker text-[color:var(--color-gold)]">Products · commercial · labeled honestly</div>
        <h2 className="display-h2">The operating contract is public. <span className="text-[color:var(--color-gold)]">Depth is $67.</span></h2>
        <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
          The operating skill, schema, validator, scaffold, and reference system are MIT licensed
          in a public repository. Paid products add packaged templates, file-tree previews, and updates.
          Access states render directly from catalog truth.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <div key={p.name} className={`price-card motion-reveal ${p.free ? '' : 'is-commercial'}`}>
            <div className={`price-tag ${p.free ? 'free' : ''}`}>{p.price}</div>
            <h3 className="font-display text-lg font-bold">{p.name}</h3>
            <p className="text-sm leading-relaxed text-[color:var(--color-muted)]">{p.body}</p>
            <div className="price-state">{p.state}</div>
            <Link href={p.href} className="cta-secondary mt-2 text-sm">
              {p.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="motion-reveal mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface/60 p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[color:var(--color-muted)]">
          <span className="font-mono font-semibold text-[color:var(--color-ink)]">Focused skill packs:</span>
          {FOCUSED_PACKS.map((pack) => (
            <Link
              key={pack.href}
              href={pack.href}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-border bg-bg/60 px-3.5 py-1.5 font-mono text-xs text-[color:var(--color-ink)] transition-colors hover:border-accent"
            >
              <span>{pack.name}</span>
              <span className="text-[color:var(--color-gold)]">{pack.price}</span>
              <span className="hidden text-[color:var(--color-muted)] sm:inline">· {pack.note}</span>
            </Link>
          ))}
        </div>
        <Link href="/offers#fit-check" className="font-mono text-xs font-semibold text-accent hover:underline">
          Run 60-second fit check →
        </Link>
      </div>

      <p className="motion-reveal mt-6 max-w-3xl font-mono text-[0.7rem] leading-relaxed text-[color:var(--color-muted)]">
        No income promises: we sell workflow machinery and templates, never financial outcomes. Some research links
        carry disclosed partner commissions alongside a named non-affiliate alternative.
        Contract: <a className="underline decoration-[color:var(--color-border)] underline-offset-2 hover:text-[color:var(--color-ink)]" href="https://github.com/frankxai/agentic-income-skills/blob/main/skills/agentic-income/SKILL.md" target="_blank" rel="noopener noreferrer">public Agentic Income skill</a>.
      </p>
    </section>
  )
}
