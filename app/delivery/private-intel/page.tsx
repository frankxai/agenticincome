import type { Metadata } from 'next'
import Link from 'next/link'
import { EmailCapture } from '@/components/EmailCapture'
import { TrackOnView } from '@/components/TrackOnView'

export const metadata: Metadata = {
  title: 'Private Intel Delivery',
  description: 'Post-checkout delivery desk for the Agentic Income Private Intel membership.',
  robots: { index: false, follow: false },
}

const memberSteps = [
  ['Confirm membership', 'Use the provider receipt as proof of active membership when checkout is live.'],
  ['Read the brief', 'Start with the current payer brief, catalog changes, and priority watchlist.'],
  ['Pick one move', 'Choose one stack opportunity or content route to act on before the next brief arrives.'],
  ['Use Q&A window', 'Bring narrow payer, stack, or route questions to the private Q&A window.'],
]

export default function PrivateIntelDelivery() {
  return (
    <div className="py-16">
      <TrackOnView event="delivery_view" payload={{ offer: 'private-intel', source: 'delivery-page' }} />
      <section className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div>
          <div className="kicker">Private Intel delivery</div>
          <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[1.02] text-ink">Keep the payer map current.</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            This is the post-checkout handoff route for Private Intel. It defines the membership rhythm before the payment provider is connected.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/offers/private-intel" className="cta">
              Review membership
            </Link>
            <Link href="/trust" className="cta-secondary">
              Trust standard
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-surface/80 p-5">
          <div className="text-sm font-semibold text-gold">Launch state</div>
          <p className="mt-3 text-sm leading-6 text-muted">
            Recurring checkout must be connected before this membership is sold publicly. Until then, the public CTA routes to request-access.
          </p>
        </aside>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Member rhythm</div>
          <h2>Brief, choose, act, update.</h2>
          <p>The membership is valuable only when it turns market change into a concrete next move.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {memberSteps.map(([title, body], index) => (
            <div key={title} className="card motion-reveal">
              <div className="font-mono text-sm font-semibold text-accent">{String(index + 1).padStart(2, '0')}</div>
              <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <EmailCapture
          headline="Request Private Intel access"
          sub="Get the membership launch notification and the current first-loop checklist while checkout is being connected."
          source="delivery-private-intel"
          buttonLabel="Request access"
          successMessage="Request received. You are on the Private Intel access list."
        />
      </section>
    </div>
  )
}
