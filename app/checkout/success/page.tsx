import type { Metadata } from 'next'
import Link from 'next/link'
import { TrackOnView } from '@/components/TrackOnView'
import { findCatalogProduct, verifyCheckout } from '@/lib/polar'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Post-checkout confirmation for Agentic Income products sold through Polar.sh.',
  robots: { index: false, follow: false },
}

// Every visit asks Polar what actually happened; nothing here may be cached.
export const dynamic = 'force-dynamic'

type SuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

/**
 * Polar returns buyers here with `checkout_id` (see successUrl in lib/polar.ts).
 * The page reports only Polar's own checkout state, worded conservatively: it
 * never asserts that money did or did not move, nor that an email or download
 * arrived. Only a checkout Polar reports as completed links the delivery desk.
 * The `product` query parameter is an unverified hint: it can only link back
 * to the public product page, never decide what was paid for.
 */
export default async function CheckoutSuccess({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const verification = await verifyCheckout(firstParam(params.checkout_id))
  const verified = verification.product
  const hinted = findCatalogProduct(firstParam(params.product) ?? '') ?? null
  const productForLinks = verified ?? hinted

  const copy = {
    paid: {
      kicker: 'Checkout complete',
      title: verified ? `${verified.name}: checkout complete.` : 'Checkout complete.',
      body: 'Polar.sh, the merchant of record, reports this checkout as completed. Polar sends the receipt, and the download or license key where the product includes one, to the email used at checkout. If nothing has arrived within a few minutes, check your spam folder or the Polar customer portal, which lists orders by email address.',
    },
    processing: {
      kicker: 'Payment processing',
      title: 'Polar is still processing this payment.',
      body: 'The checkout was submitted and Polar has not finished processing the payment. Polar emails a receipt once it completes. Please do not start a second checkout in the meantime.',
    },
    open: {
      kicker: 'Checkout open',
      title: 'This checkout is not complete yet.',
      body: 'Polar has not recorded a completed payment for this checkout. If you just paid, wait a minute and reload this page before trying again, so you are not charged twice.',
    },
    not_completed: {
      kicker: 'Checkout not completed',
      title: 'Polar did not complete this checkout.',
      body: 'Polar reports this checkout as expired or failed. If your bank shows a pending charge anyway, look for a Polar receipt email or check the Polar customer portal before starting a new checkout.',
    },
    unverifiable: {
      kicker: 'Checkout',
      title: 'This checkout could not be confirmed here.',
      body: 'This page could not check the order with Polar. If you completed a payment, Polar sends the receipt to the email used at checkout, and the Polar customer portal lists orders by email address. Check there before starting a new checkout.',
    },
  }[verification.state]

  // Delivery desks hold no paid files (Polar delivers those), but the link is
  // still reserved for a checkout Polar itself reports as completed.
  const deliveryPath = verification.state === 'paid' && verified ? verified.delivery.path : null

  return (
    <div className="py-16">
      <TrackOnView
        event="delivery_view"
        payload={{ offer: verified?.id ?? 'unknown', source: `checkout-success-${verification.state}` }}
      />
      <section className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div>
          <div className="kicker">{copy.kicker}</div>
          <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[1.02] text-ink">{copy.title}</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">{copy.body}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {deliveryPath ? (
              <Link href={deliveryPath} className="cta">
                Open the delivery desk
              </Link>
            ) : (
              <Link href={productForLinks ? `/offers/${productForLinks.id}` : '/offers'} className="cta">
                {productForLinks ? 'Back to the product' : 'Browse offers'}
              </Link>
            )}
            <Link href="/trust" className="cta-secondary">
              Support and refunds
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-surface/80 p-5">
          <div className="text-sm font-semibold text-gold">Receipt and delivery</div>
          <p className="mt-3 text-sm leading-6 text-muted">
            Polar.sh handles payment, tax, the receipt, and file delivery. Refunds follow the policy on each product page and are processed by Polar back to your original payment method.
          </p>
        </aside>
      </section>
    </div>
  )
}
