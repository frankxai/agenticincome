import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Six free assets',
  description:
    'The free layer: a worked revenue loop with its arithmetic, a live claims audit, three prompt patterns that survive regeneration, one complete pack, and the MIT open-core kernel.',
  alternates: { canonical: '/gifts' },
  openGraph: {
    ...baseOpenGraph,
    title: 'Six free assets',
    description:
      'The free layer: a worked revenue loop with its arithmetic, a live claims audit, three prompt patterns that survive regeneration, one complete pack, and the MIT open-core kernel.',
    url: '/gifts',
  },
}

type Gift = {
  id: string
  name: string
  promise: string
  detail: string
  href: string
  cta: string
  state: 'ready' | 'soon'
}

const gifts: Gift[] = [
  {
    id: 'revenue-loop',
    name: 'One complete, working revenue loop',
    promise: 'The spec, the arithmetic, and the stopping rule.',
    detail:
      'A $67 digital product modelled end to end: 300 visits, 2.5% to checkout, 70% completion, 5% refunds, 4% plus $0.40 merchant fee. Net $317.99 a month on 12 hours of build. Includes the 30-day kill criterion and the order in which to change things when it fails.',
    href: '/offers/blueprint',
    cta: 'Read the blueprint offer',
    state: 'ready',
  },
  {
    id: 'claims-audit',
    name: 'The five-gate copy audit, run on a real page',
    promise: 'Seven unsourced claims, named, with the evidence that would fix each.',
    detail:
      'A live audit of two production pages: every numeric and superlative claim, the gate it fails, and what would make it true. Includes the twenty-minute method so you can run it on your own page without buying anything.',
    href: '/proof',
    cta: 'See how proof is handled',
    state: 'ready',
  },
  {
    id: 'business-pack',
    name: 'One complete pack out of four',
    promise: 'The Claims Guard pack, described completely enough to rebuild.',
    detail:
      'Three files and what each one refuses to do. The separation of detection from editing is the whole design: an agent that both finds and fixes a claim will quietly soften it into something it can defend.',
    href: '/offers/abos-pack-bundle',
    cta: 'Inspect the bundle',
    state: 'ready',
  },
  {
    id: 'prompt-patterns',
    name: 'Three prompt patterns that hold up',
    promise: 'Change one input, get a predictable change in the output.',
    detail:
      'The restraint line, the section contract, and one named instrument doing one thing. Each pattern is stated with why it survives regeneration, and what it will not do.',
    href: '/offers/vibe-os-pack',
    cta: 'Inspect the Vibe OS pack',
    state: 'ready',
  },
  {
    id: 'intel-brief',
    name: 'The most recent brief, free',
    promise: 'One complete brief with its sources, so the depth is inspectable.',
    detail:
      'The newest brief on disk is dated June 2026, five months before the monthly promise. It ships as-is, with the commitment written down: one brief per month with sources, or the subscription stops billing.',
    href: '/offers/private-intel',
    cta: 'Read the terms',
    state: 'soon',
  },
  {
    id: 'plugin-kernel',
    name: 'The MIT open-core plugin kernel',
    promise: 'Fourteen plugins, forty-two tools, one source, every harness.',
    detail:
      'MIT licensed and free forever. The paid tiers add the harness projections and the eval receipts that say which skills fire on the right request. That is what MIT code cannot carry, and it is the only honest reason to charge for a public source.',
    href: '/offers',
    cta: 'Compare the tiers',
    state: 'ready',
  },
]

export default function GiftsPage() {
  return (
    <div className="py-16">
      <section className="max-w-4xl border-b border-border pb-14">
        <div className="kicker">Free before you pay</div>
        <h1 className="mt-3 max-w-4xl break-words text-4xl font-semibold leading-[1.04] text-ink sm:text-5xl">
          Six things you can use before spending anything.
        </h1>
        <p className="mt-5 text-xl leading-8 text-muted">
          None of these is a teaser. Each one is a carved-out slice of a paid product, complete enough to
          use on its own. Take one, decide later whether the paid version is worth anything to you.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/offers" className="cta">
            Compare the paid offers
          </Link>
          <Link href="/trust" className="cta cta-secondary">
            Read the refund terms
          </Link>
        </div>
      </section>

      <section className="mt-14 grid gap-6 sm:grid-cols-2">
        {gifts.map((gift) => (
          <article key={gift.id} className="flex flex-col justify-between border border-border p-6">
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-xl font-semibold leading-6 text-ink">{gift.name}</h2>
                <span className="shrink-0 text-xs uppercase tracking-wide text-muted">
                  {gift.state === 'ready' ? 'Available' : 'Terms only'}
                </span>
              </div>
              <p className="mt-2 text-base font-medium text-ink">{gift.promise}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{gift.detail}</p>
            </div>
            <Link href={gift.href} className="mt-6 text-sm font-semibold text-ink underline">
              {gift.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-16 max-w-3xl border-t border-border pt-10">
        <h2 className="text-2xl font-semibold text-ink">Why give first</h2>
        <p className="mt-4 text-base leading-7 text-muted">
          A paywall in front of a document nobody has read is a bet that the buyer trusts the seller more
          than the work. The free layer removes that bet. If the six assets are useful, the paid packs
          are the same thinking with the parts that took longest to build still attached.
        </p>
        <p className="mt-4 text-base leading-7 text-muted">
          If they are not useful, you have lost nothing and we have learned something. That trade is worth
          making every time.
        </p>
      </section>
    </div>
  )
}
