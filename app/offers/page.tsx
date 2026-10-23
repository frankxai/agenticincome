import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import Link from 'next/link'
import { checkoutPath, offers } from '@/lib/offers'
import { CheckoutLink } from '@/components/CheckoutLink'
import { isCommerceCheckoutOpen } from '@/lib/commerce/server'

export const metadata: Metadata = {
  title: 'Offers',
  description: 'Scoped Agent-as-a-Service implementation, practical digital products, and transparent access states from Agentic Income.',
  alternates: { canonical: '/offers' },
  openGraph: {
    ...baseOpenGraph,
    title: 'Offers',
    description: 'Direct products and memberships from the Agentic Income network. Own your outcome beyond affiliate.',
    url: '/offers',
  },
}

const promiseStrip = [
  ['Implementation', 'Scope and build one revenue system with repository and preview evidence.'],
  ['Free', 'Learn the first loop without buying another tool.'],
  ['Blueprint', 'Install the operating desk and content architecture.'],
  ['Intel', 'Keep the payer map current as the market moves.'],
]

export default function Offers() {
  return (
    <div className="py-16">
      <section className="max-w-4xl">
        <div className="kicker">Implementation and products</div>
        <h1 className="mt-3 text-5xl font-semibold text-ink">Choose the right depth.</h1>
        <p className="mt-4 text-xl leading-8 text-muted">
          Request a scoped implementation, start with the free operating path, install the Blueprint yourself, or keep the opportunity map current with Private Intel.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-4" aria-label="Agentic Income offer ladder">
        {promiseStrip.map(([title, body]) => (
          <div key={title} className="card motion-reveal">
            <div className="text-sm font-semibold text-gold">{title}</div>
            <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-4 rounded-2xl border border-border bg-surface/70 p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="text-sm font-semibold text-gold">Before you buy</div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Free delivery is live. The implementation sprint is scope-first and does not take payment here. Digital-product checkout is not yet open — request access to be notified when it launches.
          </p>
        </div>
        <Link href="/trust" className="cta-secondary">
          Read trust standard
        </Link>
      </section>

      <section className="mt-12 grid gap-6">
        {offers.map((offer) => {
          const isFree = offer.checkout.fallback === 'delivery'
          const isScoped = offer.accessMode === 'scope-first'
          // Same gate as /api/checkout (covers Stripe, payment links, and Polar).
          const checkoutReady = isCommerceCheckoutOpen(offer.slug)

          return (
            <article key={offer.slug} className="rounded-2xl border border-border bg-surface/80 p-6 motion-reveal">
              <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-center">
                <div>
                  <div className="uppercase text-[10px] text-accent">{offer.tier}</div>
                  <h2 className="mt-1 text-3xl font-semibold">{offer.title}</h2>
                  <div className="mt-1 text-2xl font-medium text-ink/90">{offer.price}</div>
                  <p className="mt-3 max-w-2xl text-muted">{offer.summary}</p>
                  <ul className="mt-5 grid gap-2 text-sm text-muted sm:grid-cols-2">
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
                  <Link href={`/offers/${offer.slug}`} className="cta-secondary text-center">
                    Inspect product
                  </Link>
                  <div className="text-center text-[11px] leading-5 text-muted">
                    {isFree
                      ? 'Instant on-site delivery.'
                      : isScoped
                        ? 'No payment on this site — scope first.'
                        : checkoutReady
                          ? 'Checkout is connected.'
                          : 'Waitlist — opens when ready.'}
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <section className="mt-16 max-w-4xl border-t border-border pt-8 text-sm leading-6 text-muted">
        Every route uses the same evidence standard: concrete scope, inspectable delivery, honest access state, and no outcome claims that cannot be supported.
        <div className="mt-3">
          <Link href="/start" className="text-accent">
            Return to the free playbook
          </Link>
        </div>
      </section>
    </div>
  )
}
