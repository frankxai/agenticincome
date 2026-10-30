import type { Metadata } from 'next'
import Link from 'next/link'
import { EmailCapture } from '@/components/EmailCapture'
import { TrackOnView } from '@/components/TrackOnView'
import { isCheckoutLive } from '@/lib/polar'

export const metadata: Metadata = {
  title: 'Blueprint Delivery',
  description: 'Post-checkout delivery desk for the Agentic Income Blueprint.',
  robots: { index: false, follow: false },
}

const installSteps = [
  ['Confirm receipt', 'Use the payment-provider receipt as the access proof when checkout is live.'],
  ['Install the desk', 'Set up the catalog, comparison template, offer ladder, and disclosure language in that order.'],
  ['Publish one loop', 'Ship one citable comparison with the payer route, email capture, and product upgrade path connected.'],
  ['Review support boundary', 'Template-level support is included. Private implementation work is reserved for future partner packages.'],
]

export default function BlueprintDelivery() {
  const checkoutLive = isCheckoutLive('blueprint')

  return (
    <div className="py-16">
      <TrackOnView event="delivery_view" payload={{ offer: 'blueprint', source: 'delivery-page' }} />
      <section className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div>
          <div className="kicker">Blueprint delivery</div>
          <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[1.02] text-ink">Install the Agentic Income operating desk.</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            This is the post-checkout handoff route for the Blueprint. It is ready for the payment provider success redirect once the checkout URL is configured.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/offers/blueprint" className="cta">
              Review Blueprint
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
              ? 'Checkout is live through Polar.sh, the merchant of record. Your Polar receipt email carries the download and license key, and is your proof of purchase.'
              : 'Secure checkout must be connected before this product is sold publicly. Until then, the public CTA routes to request-access.'}
          </p>
        </aside>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Install order</div>
          <h2>Do the desk in sequence.</h2>
          <p>The Blueprint works because each layer makes the next one clearer.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {installSteps.map(([title, body], index) => (
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
            headline="Request Blueprint access"
            sub="Get the launch notification and the current first-loop checklist while checkout is being connected."
            source="delivery-blueprint"
            buttonLabel="Request access"
            successMessage="Request received. You are on the Blueprint access list."
          />
        </section>
      )}
    </div>
  )
}
