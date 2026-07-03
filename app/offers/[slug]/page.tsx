import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckoutLink } from '@/components/CheckoutLink'
import { EmailCapture } from '@/components/EmailCapture'
import { checkoutPath, checkoutUrl, getOffer, offers } from '@/lib/offers'

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

  const liveCheckout = checkoutUrl(offer)
  const isFree = offer.checkout.fallback === 'delivery'
  const accessSteps = [
    ['01', 'Click', offer.checkoutOutcome],
    ['02', 'Deliver', `The handoff route is ${offer.deliveryPath}. ${offer.receiptInstruction}`],
    ['03', 'Support', `${offer.support} ${offer.refundPolicy}`],
  ]

  return (
    <div className="py-16">
      <section className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div>
          <div className="kicker">{offer.tier}</div>
          <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[1.02] text-ink">{offer.title}</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">{offer.promise}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <CheckoutLink
              href={checkoutPath(offer)}
              className="cta"
              offer={offer.slug}
              source="offer-detail"
            >
              {offer.cta}
            </CheckoutLink>
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

        <aside className="rounded-2xl border border-border bg-surface/80 p-5">
          <div className="text-sm font-semibold text-gold">Access path</div>
          <div className="mt-3 text-3xl font-semibold text-ink">{offer.price}</div>
          <p className="mt-3 text-sm leading-6 text-muted">
            {isFree
              ? 'Delivered instantly on-site.'
              : liveCheckout
                ? 'Live checkout URL is configured.'
                : 'Checkout is provider-ready; request access until the payment link is connected.'}
          </p>
          <div className="mt-5 rounded-xl border border-border bg-bg/60 p-4 text-xs leading-6 text-muted">
            {isFree
              ? 'Internal free delivery route is live.'
              : liveCheckout
                ? 'Secure payment provider checkout is connected.'
                : 'Secure checkout is being connected. Request access and receive the current checklist now.'}
          </div>
          <Link href="/trust" className="mt-4 inline-flex text-xs font-semibold text-accent">
            Trust, support, and refunds
          </Link>
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
        <section id="request-access" className="section-band">
          <EmailCapture
            headline={`Request ${offer.shortTitle} access`}
            sub="Get notified when the checkout opens and receive the current first-loop checklist immediately."
            source={`offer-${offer.slug}`}
            buttonLabel="Request access"
            successMessage="Request received. You are on the access list."
          />
        </section>
      ) : null}
    </div>
  )
}
