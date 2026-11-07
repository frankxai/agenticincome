import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free assets',
  description:
    'The free layer: a revenue loop model with its assumptions, an audit of two production pages, three prompt patterns, and the MIT open-core plugin kernel.',
  alternates: { canonical: '/gifts' },
  openGraph: {
    ...baseOpenGraph,
    title: 'Free assets',
    description:
      'The free layer: a revenue loop model with its assumptions, an audit of two production pages, three prompt patterns, and the MIT open-core plugin kernel.',
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
  state: 'ready' | 'building'
}

const gifts: Gift[] = [
  {
    id: 'revenue-loop',
    name: 'A revenue loop model with its assumptions',
    promise: 'The arithmetic, labelled as assumptions, and the stopping rule.',
    detail:
      'A $67 digital product modelled end to end. Every figure is an assumption, not a result: 300 visits, 2.5% to checkout, 70% completion, 5% refunds, 4% plus $0.40 merchant fee, 12 hours to build. Change any input and the output moves. The model assumes a working merchant account; without one the loop earns nothing, which is the most common real blocker and the one this estate is currently stuck on. Includes the 30-day kill criterion.',
    href: '/offers/blueprint',
    cta: 'Read the blueprint offer',
    state: 'ready',
  },
  {
    id: 'claims-audit',
    name: 'An audit of two production pages',
    promise: 'Seven unsourced claims, named, with the evidence that would fix each.',
    detail:
      'An audit run on 2026-11-07 against two live pages: every numeric and superlative claim, the gate it fails, and what would make it true. Includes the twenty-minute method so you can run it on your own page without buying anything.',
    href: '/proof',
    cta: 'See how proof is handled',
    state: 'ready',
  },
  {
    id: 'business-pack',
    name: 'One pack out of four',
    promise: 'The Claims Guard pack, described file by file.',
    detail:
      'What the pack does, what the skill instructs, and what the manifest declares. The separation of detection from editing is the design decision worth copying: an agent that both finds and fixes a claim will quietly soften it into something it can defend. Not yet a standalone download; it currently ships inside the bundle.',
    href: '/offers/abos-pack-bundle',
    cta: 'Inspect the bundle',
    state: 'building',
  },
  {
    id: 'prompt-patterns',
    name: 'Three prompt patterns',
    promise: 'Each stated with why it survives regeneration.',
    detail:
      'The restraint line, the section contract, and one named instrument doing one thing. Written as patterns rather than examples, so you can apply them to a different genre. No audio is attached yet; the patterns are the claim, not a demonstration.',
    href: '/offers/vibe-os-pack',
    cta: 'Inspect the Vibe OS pack',
    state: 'ready',
  },
  {
    id: 'plugin-kernel',
    name: 'The MIT open-core plugin kernel',
    promise: 'One source compiled for five agent runtimes.',
    detail:
      'The kernel is MIT licensed. The paid tiers add the runtime projections and the eval receipts that say which skills fire on the right request. That is what MIT source cannot carry, and it is the only honest reason to charge for a public kernel. Installability is being verified one runtime at a time; until that is measured, treat it as a promise rather than a fact.',
    href: '/offers',
    cta: 'Compare the tiers',
    state: 'building',
  },
]

function GiftCard({ gift }: { gift: Gift }) {
  const building = gift.state === 'building'
  return (
    <article
      className={
        building
          ? 'flex flex-col justify-between border border-dashed border-border bg-transparent p-6'
          : 'flex flex-col justify-between border border-border p-6'
      }
    >
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-semibold leading-6 text-ink">{gift.name}</h2>
          <span className="shrink-0 text-xs uppercase tracking-wide text-muted">
            {building ? 'Not yet available' : 'Available'}
          </span>
        </div>
        <p className="mt-2 text-base font-medium text-ink">{gift.promise}</p>
        <p className="mt-3 text-sm leading-6 text-muted">{gift.detail}</p>
      </div>
      <Link href={gift.href} className="mt-6 text-sm font-semibold text-ink underline">
        {gift.cta}
      </Link>
    </article>
  )
}

export default function GiftsPage() {
  return (
    <div className="py-16">
      <section className="max-w-4xl border-b border-border pb-14">
        <div className="kicker">Free before you pay</div>
        <h1 className="mt-3 max-w-4xl break-words text-4xl font-semibold leading-[1.04] text-ink sm:text-5xl">
          Three free assets you can use now, and two still being built.
        </h1>
        <p className="mt-5 text-xl leading-8 text-muted">
          Three of these are finished and usable on their own. Two are not finished, they are marked
          &ldquo;not yet available&rdquo;, and the card says exactly what is missing.
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
          <GiftCard key={gift.id} gift={gift} />
        ))}
      </section>

      <section className="mt-16 max-w-3xl border-t border-border pt-10">
        <h2 className="text-2xl font-semibold text-ink">Why give first</h2>
        <p className="mt-4 text-base leading-7 text-muted">
          A paywall in front of a document nobody has read is a bet that the buyer trusts the seller more
          than the work. The free layer removes that bet. If these assets are useful, the paid packs are
          the same thinking with the parts that took longest to build still attached.
        </p>
        <p className="mt-4 text-base leading-7 text-muted">
          Two of the five are marked as unfinished because they are, and the card says what is missing
          rather than leaving you to find out after the click.
        </p>
      </section>
    </div>
  )
}
