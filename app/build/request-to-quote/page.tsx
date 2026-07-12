import type { Metadata } from 'next'
import Link from 'next/link'
import { RequestToQuoteDesk } from '@/components/RequestToQuoteDesk'

export const metadata: Metadata = {
  title: 'Request-to-Quote Reference Desk',
  description:
    'Create a browser-local request and scope brief for a governed agent delivery system. Nothing is submitted or priced automatically.',
  alternates: { canonical: '/build/request-to-quote' },
  openGraph: {
    title: 'Request-to-Quote Reference Desk',
    description:
      'A browser-local reference utility for turning a customer request into a reviewable scope brief.',
    url: '/build/request-to-quote',
  },
}

export default function RequestToQuotePage() {
  return (
    <>
      <section className="section-band pt-20">
        <div className="max-w-4xl">
          <div className="kicker">Reference utility · browser-local</div>
          <h1 className="mt-3 text-5xl font-semibold leading-[1.02] text-ink">
            Request-to-Quote Desk
          </h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            Turn an unstructured customer request into a scope artifact an authorized person can review.
            This demonstration does not submit data, contact anyone, calculate a price, or create an agreement.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/build" className="font-semibold text-accent underline underline-offset-4">
              Return to the build path
            </Link>
            <a
              href="https://github.com/frankxai/agentic-income-skills/tree/main/examples/request-to-quote-desk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent-2 underline underline-offset-4"
            >
              Inspect schemas and authority policy
            </a>
          </div>
        </div>
      </section>

      <RequestToQuoteDesk />
    </>
  )
}
