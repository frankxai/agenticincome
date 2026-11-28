'use client'

import Link from 'next/link'
import { useState } from 'react'
import { feeControl, hoursControl, pilotBriefHref, pilotDecision } from '@/lib/pilot-decision'
import { pilot } from '@/lib/quote-review-case'

const money = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})
const decimal = new Intl.NumberFormat('en-IE', { maximumFractionDigits: 1 })

export function HomePilotCalculator() {
  const [fee, setFee] = useState(pilot.price)
  const [hours, setHours] = useState(pilot.reviewHours)
  const result = pilotDecision(fee, hours)

  return (
    <section className="product-calculator" id="pilot-calculator" aria-labelledby="pilot-calculator-title" tabIndex={-1}>
      <header className="product-calculator-header">
        <div>
          <p className="product-label">Worked example</p>
          <h2 id="pilot-calculator-title">Review 10 sales quotes</h2>
        </div>
        <span className="product-example">Illustrative</span>
      </header>
      <noscript>
        <style>{'.product-calculator input{display:none}'}</style>
        <p className="product-label">Enable JavaScript to change the fee and review hours.</p>
      </noscript>
      <div className="product-calculator-inputs">
        <div>
          <label htmlFor="home-pilot-fee">Pilot fee</label>
          <output htmlFor="home-pilot-fee" aria-live="off">{money.format(fee)}</output>
          <input id="home-pilot-fee" type="range" {...feeControl} value={fee} aria-valuetext={money.format(fee)}
            onChange={(event) => setFee(event.currentTarget.valueAsNumber)} />
        </div>
        <div>
          <label htmlFor="home-pilot-hours">Human review</label>
          <output htmlFor="home-pilot-hours" aria-live="off">{decimal.format(hours)} h</output>
          <input id="home-pilot-hours" type="range" {...hoursControl} value={hours} aria-valuetext={decimal.format(hours) + ' hours'}
            onChange={(event) => setHours(event.currentTarget.valueAsNumber)} />
        </div>
      </div>
      <div className="product-calculator-results" aria-live="polite" aria-atomic="true">
        <div>
          <p>Contribution per pilot</p>
          <strong className={result.contribution < 0 ? 'product-result-negative' : undefined}>{money.format(result.contribution)}</strong>
          <small>Before fixed costs</small>
        </div>
        <div>
          <p>After {pilot.reworkHours} extra review hours</p>
          <strong className={result.stressContribution < 0 ? 'product-result-negative' : undefined}>{money.format(result.stressContribution)}</strong>
        </div>
        <div>
          <p>Buyer payback</p>
          <strong>{decimal.format(result.buyerPaybackMonths)} months</strong>
          <small>At the modeled value of time saved</small>
        </div>
      </div>
      <footer className="product-calculator-actions">
        <Link href={pilotBriefHref(fee, hours)} className="product-action">Open editable brief</Link>
        <Link href="/workbench/quote-review">See the full model</Link>
      </footer>
    </section>
  )
}
