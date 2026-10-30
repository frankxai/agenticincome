import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EmailCapture } from '@/components/EmailCapture'
import { TrackOnView } from '@/components/TrackOnView'
import { getOffer } from '@/lib/offers'
import { findCatalogProduct, isCheckoutLive } from '@/lib/polar'

/**
 * Delivery desk for priced catalog products that have no bespoke page under
 * app/delivery/. Each catalog entry's `delivery.path` is where the success
 * page hands buyers off, so every priced product needs one. Static routes
 * (blueprint, private-intel, starter-kit) take precedence over this one.
 */
const GENERIC_DELIVERY_SLUGS = ['agent-team-pro', 'claims-guard-pack', 'abos-pack-bundle', 'vibe-os-pack']

export const dynamicParams = false

type DeliveryPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return GENERIC_DELIVERY_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: DeliveryPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = findCatalogProduct(slug)
  return {
    title: product ? `${product.name} Delivery` : 'Delivery',
    description: product ? `Post-checkout delivery desk for ${product.name}.` : undefined,
    robots: { index: false, follow: false },
  }
}

export default async function GenericDelivery({ params }: DeliveryPageProps) {
  const { slug } = await params
  const product = findCatalogProduct(slug)
  const offer = getOffer(slug)
  if (!product || !offer || !GENERIC_DELIVERY_SLUGS.includes(slug)) notFound()

  const checkoutLive = isCheckoutLive(slug)
  const steps = [
    ['Confirm receipt', offer.receiptInstruction],
    ['Install', offer.firstWin],
    ['License', product.license],
    ['Support and refunds', `${offer.support} ${offer.refundPolicy}`],
  ]

  return (
    <div className="py-16">
      <TrackOnView event="delivery_view" payload={{ offer: slug, source: 'delivery-page' }} />
      <section className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div>
          <div className="kicker">{offer.shortTitle} delivery</div>
          <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[1.02] text-ink">{product.name}</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            This is the post-checkout handoff route for {product.name}. Polar.sh, the merchant of record, delivers the files and receipt by email.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/offers/${slug}`} className="cta">
              Review {offer.shortTitle}
            </Link>
            <Link href="/trust" className="cta-secondary">
              Trust standard
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-surface/80 p-5">
          <div className="text-sm font-semibold text-gold">Launch state</div>
          <p className="mt-3 text-sm leading-6 text-muted">
            {checkoutLive
              ? 'Checkout is live. Your Polar receipt email carries the download and is your proof of purchase.'
              : 'Checkout is not open for this product yet, so nothing has been sold. Join the waitlist below to hear when it opens.'}
          </p>
        </aside>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">After purchase</div>
          <h2>What happens next.</h2>
          <p>{product.description}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, body], index) => (
            <div key={title} className="card motion-reveal">
              <div className="font-mono text-sm font-semibold text-accent">{String(index + 1).padStart(2, '0')}</div>
              <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {checkoutLive ? null : (
        <section className="section-band">
          <EmailCapture
            headline={`Join the ${offer.shortTitle} waitlist`}
            sub="One email when checkout opens. Nothing is charged until then."
            source={`delivery-${slug}`}
            buttonLabel="Join waitlist"
            successMessage={`Request received. You are on the ${offer.shortTitle} waitlist.`}
          />
        </section>
      )}
    </div>
  )
}
