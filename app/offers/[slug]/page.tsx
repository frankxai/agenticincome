import type { Metadata } from 'next'
import Image from 'next/image'
import { baseOpenGraph } from '@/lib/open-graph'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckoutLink } from '@/components/CheckoutLink'
import { EmailCapture } from '@/components/EmailCapture'
import { PackInspector } from '@/components/PackInspector'
import { PolarCheckoutButton } from '@/components/PolarCheckoutButton'
import { checkoutPath, checkoutUrl, getOffer, offers } from '@/lib/offers'
import { PACK_MANIFESTS } from '@/lib/pack-manifests'
import { isCheckoutLive } from '@/lib/polar'

type OfferPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return offers.map((offer) => ({ slug: offer.slug }))
}

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { slug } = await params
  const offer = getOffer(slug)

  if (!offer) {
    return { title: 'Offer Not Found' }
  }

  return {
    title: offer.shortTitle,
    description: offer.summary,
    alternates: { canonical: `/offers/${offer.slug}` },
    openGraph: {
      ...baseOpenGraph,
      title: offer.shortTitle,
      description: offer.summary,
      url: `/offers/${offer.slug}`,
    },
  }
}

export default async function OfferDetail({ params }: OfferPageProps) {
  const { slug } = await params
  const offer = getOffer(slug)

  if (!offer) notFound()

  const manifest = PACK_MANIFESTS[offer.slug]
  const liveCheckout = checkoutUrl(offer)
  // Server-side truth: the Polar API path is live only when the catalog permits
  // the sale AND the Polar env is set for this product. False until then, which
  // keeps the existing request-access CTA exactly as it is.
  const polarCheckoutLive = isCheckoutLive(offer.slug)
  const anyLiveCheckout = Boolean(liveCheckout || polarCheckoutLive)
  const isFree = offer.checkout.fallback === 'delivery'
  const isScoped = offer.accessMode === 'scope-first'
  const accessSteps = [
    ['01', 'Click', offer.checkoutOutcome],
    ['02', 'Deliver', `The handoff route is ${offer.deliveryPath}. ${offer.receiptInstruction}`],
    ['03', 'Support', `${offer.support} ${offer.refundPolicy}`],
  ]

  return (
    <div className="py-16">
      <section className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
        <div>
          <div className="kicker">{offer.tier}</div>
          <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[1.02] text-ink">{offer.title}</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">{offer.promise}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {isScoped ? (
              <a href="https://www.frankx.ai/contact" className="cta">Discuss your scope with Frank</a>
            ) : polarCheckoutLive ? (
              <PolarCheckoutButton
                productId={offer.slug}
                source="offer-detail"
                gatedHref={`/offers/${offer.slug}#request-access`}
                gatedCta={offer.cta}
                buyLabel={offer.checkout.buyLabel ?? offer.cta}
              />
            ) : (
              <CheckoutLink
                href={checkoutPath(offer)}
                className="cta"
                offer={offer.slug}
                source="offer-detail"
              >
                {isFree || anyLiveCheckout ? offer.cta : 'Check access options'}
              </CheckoutLink>
            )}
            {manifest ? (
              <a href="#inspect-files" className="cta-secondary">
                Inspect package files
              </a>
            ) : null}
            {isFree ? (
              <Link href={offer.deliveryPath} className="cta-secondary">
                View delivery path
              </Link>
            ) : null}
            <Link href="/offers" className="cta-secondary">
              Compare offers
            </Link>
          </div>
        </div>

        <aside className="space-y-4">
          {manifest ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-bg/90">
              <Image
                src={manifest.plateSvg}
                alt={`${offer.title} schematic plate`}
                width={640}
                height={360}
                unoptimized
                priority
                className="aspect-video h-auto w-full"
              />
            </div>
          ) : null}

          <div className="rounded-2xl border border-border bg-surface/80 p-5">
            <div className="text-sm font-semibold text-gold">Access path</div>
            <div className="mt-3 font-mono text-3xl font-semibold text-ink">{offer.price}</div>
            <p className="mt-3 text-sm leading-6 text-muted">
              {isFree
                ? 'Delivered immediately on-site.'
                : isScoped
                  ? 'Scope, acceptance checks, and commercial terms are agreed before implementation.'
                : polarCheckoutLive
                  ? 'Checkout is live. Polar.sh is the merchant of record and handles VAT and sales tax.'
                : liveCheckout
                  ? 'Live checkout URL is configured.'
                  : 'Purchases are currently closed.'}
            </p>
            <div className="mt-5 rounded-xl border border-border bg-bg/60 p-4 text-xs leading-6 text-muted">
              {isFree
                ? 'Internal free delivery route is live.'
                : isScoped
                  ? 'Bring one workflow, an example input and the decision owner to the scoping conversation.'
                : anyLiveCheckout
                  ? 'Secure payment provider checkout is connected.'
                  : 'Explore the preview below. Current access options are at the end of this page.'}
            </div>
            <Link href="/trust" className="mt-4 inline-flex text-xs font-semibold text-accent">
              Trust, support, and refunds
            </Link>
          </div>
        </aside>
      </section>

      <section className="section-band">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['Audience', offer.audience],
            ['First win', offer.firstWin],
            ['Support', offer.support],
          ].map(([title, body]) => (
            <div key={title} className="card motion-reveal">
              <div className="text-sm font-semibold text-gold">{title}</div>
              <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {manifest ? (
        <section id="inspect-files" className="section-band scroll-mt-24">
          <div className="section-heading motion-reveal">
            <div className="kicker">
              {manifest.previewMode === 'deliverable-files'
                ? 'Package inspection'
                : manifest.previewMode === 'sample-issue'
                  ? 'Sample briefing'
                  : 'Product specification'}
            </div>
            <h2>
              {manifest.previewMode === 'deliverable-files'
                ? 'Inspect the delivered files before you decide.'
                : manifest.previewMode === 'sample-issue'
                  ? 'Inspect a sample brief before you decide.'
                  : 'Inspect the scope specification before you decide.'}
            </h2>
            <p>
              {manifest.previewMode === 'deliverable-files'
                ? 'Browse the delivered package files (Markdown, CSV, and JSON), read verbatim excerpts, and check the fit boundaries before starting.'
                : manifest.previewMode === 'sample-issue'
                  ? 'Read a real sample monthly briefing and check the fit boundaries before requesting member access.'
                  : 'Read the in-repository PRODUCT.md specification and check the fit boundaries before requesting access.'}
            </p>
          </div>
          <div className="mt-8">
            <PackInspector manifest={manifest} />
          </div>
        </section>
      ) : null}

      <section className="section-band">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="kicker">Inside</div>
            <h2 className="mt-3 text-4xl font-semibold text-ink">What you get.</h2>
            <div className="mt-6 grid gap-3">
              {offer.deliverables.map((item) => (
                <div key={item} className="rounded-xl border border-border bg-surface/70 p-4 text-sm font-semibold text-ink motion-reveal">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="kicker">Outcome</div>
            <h2 className="mt-3 text-4xl font-semibold text-ink">Why it exists.</h2>
            <div className="mt-6 grid gap-3">
              {offer.outcomes.map((item) => (
                <div key={item} className="rounded-xl border border-border bg-bg/50 p-4 text-sm leading-6 text-muted motion-reveal">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">After the click</div>
          <h2>The handoff is already designed.</h2>
          <p>Each product has a buyer-facing destination, receipt expectation, support boundary, and fallback state before promotion.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {accessSteps.map(([number, title, body]) => (
            <div key={number} className="card motion-reveal">
              <div className="font-mono text-sm font-semibold text-accent">{number}</div>
              <h3 className="mt-3 text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Proof</div>
          <h2>Built from the real operating system.</h2>
          <p>{offer.upgradePath}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {offer.proof.map((item) => (
            <div key={item} className="card motion-reveal">
              <p className="text-sm leading-6 text-muted">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {!isFree && !liveCheckout ? (
        <section id="request-access" className="section-band scroll-mt-24">
          {isScoped ? (
            <>
              <h2 className="text-3xl font-semibold">Bring a brief to Frank.</h2>
              <p className="mt-3 max-w-2xl text-muted">Open the founder’s contact page and select Implementation sprint. Describe the workflow and what an accepted delivery would look like. You choose what to share.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="https://www.frankx.ai/contact" className="cta">Discuss your scope</a>
                <Link href="/workbench/offer-brief" className="cta-secondary">Prepare an offer brief</Link>
              </div>
            </>
          ) : (
            <EmailCapture
              headline={polarCheckoutLive ? `Backup access request for ${offer.shortTitle}` : `Request ${offer.shortTitle} access`}
              sub={polarCheckoutLive
                ? 'Use the checkout button above for instant Polar delivery. If checkout fails or is unavailable in your browser, leave your email here as a fallback.'
                : 'Get notified when checkout opens and receive updates on the first-loop checklist.'}
              source={`offer-${offer.slug}`}
              buttonLabel="Request access"
              successMessage="Request received. You are on the access list."
            />
          )}
        </section>
      ) : null}
    </div>
  )
}
