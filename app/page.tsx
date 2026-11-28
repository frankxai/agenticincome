import type { Metadata } from 'next'
import Link from 'next/link'
import { HomePilotCalculator } from '@/components/HomePilotCalculator'
import { baseOpenGraph } from '@/lib/open-graph'
import './home-product.css'

const title = 'Can this AI workflow pay for itself?'
const description = 'Model the cost of an AI pilot. Change the fee and human review time, check the downside, and see what a buyer would need to recover.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: { ...baseOpenGraph, title, description, url: '/' },
}

export default function Home() {
  return (
    <div className="product-home">
      <section className="product-opening" aria-labelledby="product-title">
        <div className="product-opening-layout">
          <header className="product-opening-copy">
            <h1 id="product-title">Can this AI workflow <em>pay for itself?</em></h1>
            <p>Price one pilot. See how much human review it can afford and what the buyer needs to get back.</p>
            <a className="product-jump" href="#pilot-calculator">Try the calculator <span aria-hidden="true">↓</span></a>
          </header>
          <HomePilotCalculator />
        </div>
      </section>
      <section className="product-research" aria-labelledby="research-title">
        <div>
          <p className="product-label">Research</p>
          <h2 id="research-title">What does the buyer get back?</h2>
          <p>Use the pricing study to separate a seller’s margin from a buyer’s payback, then see how both change in the worked quote-review case.</p>
        </div>
        <div className="product-links">
          <Link href="/blog/pricing-ai-work">How to price AI work</Link>
          <Link href="/blog/quote-review-pilot">The quote-review case</Link>
        </div>
      </section>
      <section className="product-research" aria-labelledby="implementation-title">
        <div>
          <p className="product-label">Implementation</p>
          <h2 id="implementation-title">Bring one workflow.</h2>
          <p>Bring a process you can sample and a person who can judge the results. We’ll define what to test, what it costs to deliver, and who signs off.</p>
        </div>
        <div className="product-links">
          <Link href="/offers/implementation-sprint">See what an implementation includes</Link>
          <Link href="/delivery/starter-kit">Open the free starter kit</Link>
          <Link href="/proof">Inspect the reference implementation</Link>
        </div>
      </section>
    </div>
  )
}
