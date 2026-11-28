import type { Metadata } from 'next'
import Link from 'next/link'
import { PilotDecisionDesk } from '@/components/PilotDecisionDesk'
import { baseOpenGraph } from '@/lib/open-graph'
import './quote-review.css'

const path = '/workbench/quote-review'
const title = 'Quote-review pilot calculator'
const description = 'Price a ten-quote review pilot. Change the fee and reviewer hours to see delivery contribution, break-even volume and buyer payback.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { ...baseOpenGraph, title, description, url: path },
}

export default function QuoteReviewWorkbenchPage() {
  return (
    <div className="quote-review-workspace">
      <nav aria-label="Breadcrumb" className="flex items-center gap-3 pt-5 text-sm text-muted">
        <Link href="/workbench" className="inline-flex min-h-11 items-center underline underline-offset-4">Workbench</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Quote review</span>
      </nav>
      <PilotDecisionDesk headingLevel="h1" />
      <Link href="/?ask=pricing#income-chat" className="my-6 inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4">Talk through your own offer in the studio</Link>
    </div>
  )
}
