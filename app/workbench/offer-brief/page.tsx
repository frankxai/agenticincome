import type { Metadata } from 'next'
import Link from 'next/link'
import { OfferBriefWorkbench } from '@/components/OfferBriefWorkbench'
import { baseOpenGraph } from '@/lib/open-graph'
import './offer-brief.css'

const description = 'Turn a source excerpt into a costed offer hypothesis and a bounded buyer test. Keep the editable brief on your device.'

export const metadata: Metadata = {
  title: 'Offer evidence brief',
  description,
  alternates: { canonical: '/workbench/offer-brief' },
  openGraph: { ...baseOpenGraph, title: 'Offer evidence brief', description, url: '/workbench/offer-brief' },
}

export default function OfferBriefPage() {
  return (
    <div className="ob-workspace">
      <nav aria-label="Breadcrumb" className="ob-breadcrumb">
        <Link href="/workbench">Workbench</Link><span aria-hidden="true">/</span><span aria-current="page">Offer brief</span>
      </nav>
      <header className="ob-header">
        <h1>Build an offer brief.</h1>
        <p>Start with a buyer’s own words. Price one deliverable and decide what evidence would make it worth pursuing.</p>
      </header>
      <OfferBriefWorkbench />
      <noscript><p className="ob-note">Enable JavaScript to edit or export the example shown here.</p></noscript>
    </div>
  )
}
