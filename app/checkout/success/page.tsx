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
 * The page reports only what Polar confirms server-side. The `product` query
 * parameter is a hint used for links when Polar cannot be reached; it never
 * decides what the page says was paid for.
 */
export default async function CheckoutSuccess({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const verification = await verifyCheckout(firstParam(params.checkout_id))
  const hinted = findCatalogProduct(firstParam(params.product) ?? '')
  const product = verification.product ?? (verification.state === 'unverifiable' ? hinted : undefined) ?? null

  const copy = {
    paid: {
      kicker: 'Payment confirmed',
      title: product ? `${product.name} is confirmed.` : 'Your order is confirmed.',
      body: 'Polar.sh, the merchant of record, has emailed your receipt with the download and any license key. That email is your proof of purchase.',
    },
    processing: {
      kicker: 'Payment processing',
      title: 'Your payment is clearing.',
      body: 'Polar.sh has your order and is confirming the payment. Your receipt and download arrive by email as soon as it clears. No action is needed.',
    },
    not_paid: {
      kicker: 'Checkout not completed',
      title: 'No payment was taken.',
      body: 'This checkout was not completed or has expired. Nothing was charged. You can start a new checkout from the product page.',
    },
    unverifiable: {
      kicker: 'Checkout',
      title: 'This checkout could not be confirmed here.',
      body: 'If you completed a payment, Polar.sh has emailed your receipt with the download, and that email is your proof of purchase. If no email arrives within a few minutes, check your spam folder; the Polar customer portal lists every order placed with your email address.',
    },
  }[verification.state]

  const showDelivery = product && verification.state !== 'not_paid'

  return (
    <div className="py-16">
      <TrackOnView
        event="delivery_view"
        payload={{ offer: product?.id ?? 'unknown', source: `checkout-success-${verification.state}` }}
      />
      <section className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div>
          <div className="kicker">{copy.kicker}</div>
          <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[1.02] text-ink">{copy.title}</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">{copy.body}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {showDelivery ? (
              <Link href={product.delivery.path} className="cta">
                Open the delivery desk
              </Link>
            ) : (
              <Link href={product ? `/offers/${product.id}` : '/offers'} className="cta">
                {product ? 'Back to the product' : 'Browse offers'}
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
