'use client'

import { useEffect, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { pilotDecision } from '@/lib/pilot-decision'
import { monthlyBuyerValue, pilot } from '@/lib/quote-review-case'
import { breakEvenUnits } from '@/lib/revenue-scenario'
import { site } from '@/lib/site'
import './PilotDecisionMemo.css'

const euro = new Intl.NumberFormat('en-IE', {
  style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2,
})
const number = new Intl.NumberFormat('en-IE', { maximumFractionDigits: 1 })

export function PilotDecisionMemo({ price, hours }: { price: number; hours: number }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('afterprint', close)
    return () => window.removeEventListener('afterprint', close)
  }, [])

  const print = () => {
    flushSync(() => setOpen(true))
    window.print()
  }

  const model = pilotDecision(price, hours)
  const downsideVolume = breakEvenUnits(pilot.monthlyFixed, model.stressContribution)
  const volume = (count: number | null) => count === null ? 'Uncovered' : count + (count === 1 ? ' pilot' : ' pilots')
  const rows = [
    ['Pilot fee', euro.format(price)],
    ['Human review · ' + number.format(hours) + ' h × ' + euro.format(pilot.hourlyCost), euro.format(hours * pilot.hourlyCost)],
    ['Compute and retries', euro.format(pilot.compute)],
    ['Collection fees', euro.format(pilot.collection)],
    ['Acquisition', euro.format(pilot.acquisition)],
    ['Support reserve', euro.format(pilot.support)],
    ['Total variable cost', euro.format(model.unitCost)],
  ]
  return <>
    <button className="pd-export" type="button" onClick={print}>Print decision memo</button>
    {open && createPortal(
      <article className="pilot-memo-page" aria-label="Quote-review decision memo">
        <header className="pm-mast"><b>Agentic Income</b><span>Sales operations / Finance</span></header>
        <div className="pm-intro"><span>Decision memo</span><h1>Quote-review pilot</h1>
          <p>Ten redacted quotes, one approved rate card and an exception report. Each flagged discrepancy needs a source the reviewer can inspect.</p>
        </div>
        <section className="pm-figures" aria-label="Scenario result">
          <div><span>Seller contribution per pilot</span><strong>{euro.format(model.contribution)}</strong><small>{number.format(model.marginPercent ?? 0)}% of the fee · before fixed costs</small></div>
          <div><span>After {pilot.reworkHours} extra review hours</span><strong>{euro.format(model.stressContribution)}</strong><small>{number.format(hours + pilot.reworkHours)} h of review in total</small></div>
        </section>
        <div className="pm-columns">
          <section><h2>Delivery economics</h2><dl>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
          <section><h2>What the buyer must recover</h2>
            <p>{pilot.monthlyHoursRecovered} redeployable hours a month at {euro.format(pilot.buyerHourlyValue)}/h, less {euro.format(pilot.buyerMonthlyCost)} in running costs, yields {euro.format(monthlyBuyerValue)}/month in potential capacity value.</p>
            <p><b>{number.format(model.buyerPaybackMonths)} months</b> to recover the fee at that rate. Cash savings require separate evidence.</p>
            <h2>Monthly seller break-even</h2>
            <p><b>{volume(model.fixedCostPilots)}</b> at the chosen scope. <b>{volume(downsideVolume)}</b> with rework. Monthly fixed costs are {euro.format(pilot.monthlyFixed)}.</p>
          </section>
        </div>
        <section className="pm-decision"><span>Decision at these terms</span><h2>{model.verdict}</h2>
          <p>Before authorizing spend, name a budget owner, time the manual review and agree which discrepancies are critical. On the ten-quote sample, record misses, false positives and actual review hours.</p>
        </section>
        <footer><span>Illustrative assumptions · EUR excluding tax · Case dated {pilot.date}</span><span>{site.url.replace(/^https?:\/\//, '')}/blog/{pilot.slug}</span></footer>
      </article>, document.body)}
  </>
}
