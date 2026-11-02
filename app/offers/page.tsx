import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { baseOpenGraph } from '@/lib/open-graph'
import { checkoutPath, checkoutUrl, offers, type OfferStage } from '@/lib/offers'
import { PACK_MANIFESTS } from '@/lib/pack-manifests'
import { CheckoutLink } from '@/components/CheckoutLink'
import { OperatorFitCheck } from '@/components/OperatorFitCheck'
import { isCheckoutLive } from '@/lib/polar'

export const metadata: Metadata = {
  title: 'Offers',
  description: 'Inspectable skill packs, operating blueprints, monthly payer intelligence, and scoped implementation from Agentic Income.',
  alternates: { canonical: '/offers' },
  openGraph: {
    ...baseOpenGraph,
    title: 'Offers',
    description: 'Inspectable digital packs, blueprints, and scoped implementation from Agentic Income.',
    url: '/offers',
  },
}

const STAGE_BANDS: {
  stage: OfferStage
  index: string
  title: string
  subtitle: string
}[] = [
  {
    stage: 'entry',
    index: '01',
    title: 'Free entry loop',
    subtitle: 'Prove one category, one honest comparison, and one email capture in 30 minutes before spending a cent.',
  },
  {
    stage: 'pack',
    index: '02',
    title: 'Focused skill packs ($24 to $39)',
    subtitle: 'Single-purpose packaged editions built from public MIT repositories. Inspect every file path before checkout opens.',
  },
  {
    stage: 'system',
    index: '03',
    title: 'Operating systems and crews ($67 to $129)',
    subtitle: 'Complete business-plan kits, 4-pack governance bundles, and multi-agent verification workflows.',
  },
  {
    stage: 'continuity',
    index: '04',
    title: 'Continuity and scoped delivery',
    subtitle: 'Monthly partner-term diffs for active operators, or a scope-first implementation sprint in your own repo.',
  },
]

export default function Offers() {
  return (
    <div className="py-16">
      <section className="max-w-4xl">
        <div className="kicker">Digital packs and scoped systems</div>
        <h1 className="mt-3 text-5xl font-semibold text-ink">Choose the right depth.</h1>
        <p className="mt-4 text-xl leading-8 text-muted">
          Start with the free 30-minute kit, run the 60-second fit check to match your weekly hours, or inspect every file inside our packaged kits and scoped sprint.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#fit-check" className="cta">
            Run 60-second fit check
          </a>
          <a href="#pack-ladder" className="cta-secondary">
            Browse all {offers.length} offers
          </a>
        </div>
      </section>

      <section className="mt-8 grid gap-4 rounded-2xl border border-border bg-surface/70 p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="text-sm font-semibold text-gold">Before you buy</div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Free Starter Kit delivery is live on-site. Every paid pack exposes its exact file tree and real excerpts before purchase. Where Polar checkout is still gated, the button routes cleanly to an access waitlist rather than a dead cart.
          </p>
        </div>
        <Link href="/trust" className="cta-secondary">
          Read trust standard
        </Link>
      </section>

      <section id="fit-check" className="mt-12 scroll-mt-24">
        <OperatorFitCheck />
      </section>

      <div id="pack-ladder" className="mt-16 space-y-16 scroll-mt-24">
        {STAGE_BANDS.map((band) => {
          const bandOffers = offers.filter((offer) => offer.ladderStage === band.stage)
          return (
            <section key={band.stage} aria-labelledby={`stage-${band.stage}`}>
              <div className="border-b border-border pb-4">
                <div className="font-mono text-xs font-semibold text-accent">
                  Stage {band.index}
                </div>
                <h2 id={`stage-${band.stage}`} className="mt-1 text-3xl font-semibold text-ink">
                  {band.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{band.subtitle}</p>
              </div>

              <div className="mt-6 grid gap-6">
                {bandOffers.map((offer) => {
                  const isFree = offer.checkout.fallback === 'delivery'
                  const isScoped = offer.accessMode === 'scope-first'
                  const polarLive = isCheckoutLive(offer.slug)
                  const staticLive = checkoutUrl(offer)
                  const checkoutReady = polarLive || staticLive
                  const manifest = PACK_MANIFESTS[offer.slug]

                  return (
                    <article
                      key={offer.slug}
                      className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-6 motion-reveal"
                    >
                      <div className="grid gap-6 lg:grid-cols-[15rem_1fr_16rem] lg:items-center">
                        {manifest ? (
                          <Link
                            href={`/offers/${offer.slug}`}
                            className="group block overflow-hidden rounded-xl border border-border bg-bg/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                          >
                            <Image
                              src={manifest.plateSvg}
                              alt={`${offer.title} schematic plate`}
                              width={640}
                              height={360}
                              unoptimized
                              className="aspect-video h-auto w-full transition-transform duration-150 group-hover:scale-[1.015]"
                            />
                          </Link>
                        ) : null}

                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-mono text-xs font-semibold text-accent">{offer.tier}</span>
                            {manifest ? (
                              <span className="rounded-full border border-border bg-bg/60 px-2.5 py-0.5 font-mono text-[11px] text-muted">
                                {manifest.totalFilesLabel} · {manifest.totalSizeLabel}
                              </span>
                            ) : null}
                          </div>
                          <h3 className="mt-1.5 text-2xl font-semibold text-ink sm:text-3xl">{offer.title}</h3>
                          <div className="mt-1 font-mono text-xl font-semibold text-gold">{offer.price}</div>
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{offer.summary}</p>
                          <ul className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
                            {offer.deliverables.slice(0, 4).map((item) => (
                              <li key={item} className="flex gap-2">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid gap-3">
                          <CheckoutLink
                            href={checkoutPath(offer)}
                            className="cta text-center"
                            offer={offer.slug}
                            source="offers-index"
                          >
                            {offer.cta}
                          </CheckoutLink>
                          <Link href={`/offers/${offer.slug}#inspect-files`} className="cta-secondary text-center">
                            Inspect files
                          </Link>
                          <div className="text-center font-mono text-[11px] leading-5 text-muted">
                            {isFree
                              ? 'Instant on-site delivery'
                              : isScoped
                                ? 'No on-site payment · scope first'
                                : checkoutReady
                                  ? 'Checkout connected'
                                  : 'Waitlist · inspect files now'}
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      <section className="mt-16 max-w-4xl border-t border-border pt-8 text-sm leading-6 text-muted">
        Every offer follows one standard: concrete scope, inspectable file trees before checkout, honest access state, and zero unsupported income claims.
        <div className="mt-3">
          <Link href="/start" className="text-accent">
            Return to the free playbook
          </Link>
        </div>
      </section>
    </div>
  )
}
