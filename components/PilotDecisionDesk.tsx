'use client'

import Link from 'next/link'
import { useId, useState, type CSSProperties } from 'react'
import { buildOfferBrief } from '@/lib/offer-brief'
import { monthlyBuyerValue, pilot } from '@/lib/quote-review-case'
import { feeControl, hoursControl, pilotBriefHref, pilotDecision, pilotDecisionInput, pilotScenarioHref } from '@/lib/pilot-decision'
import { PilotDecisionMemo } from './PilotDecisionMemo'
import './PilotDecisionDesk.css'

const money = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2, minimumFractionDigits: 0 })
const decimal = new Intl.NumberFormat('en-IE', { maximumFractionDigits: 1 })

type DialProps = {
  label: string; unit: 'hours' | 'EUR'; value: number; onChange: (value: number) => void
  control: typeof feeControl
}

function DeskSlider({ label, unit, value, onChange, control }: DialProps) {
  const id = useId()
  const format = unit === 'hours' ? (v: number) => v + ' h' : money.format
  const fill = (value - control.min) / (control.max - control.min) * 100
  return (
    <div className="pd-dial">
      <div className="pd-dial-top"><label htmlFor={id}>{label}</label><span aria-hidden="true">{format(value)}</span></div>
      <input id={id} type="range" min={control.min} max={control.max} step={control.step} value={value}
        aria-valuetext={unit === 'hours' ? value + ' hours' : money.format(value)}
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
        style={{ '--pd-fill': fill + '%' } as CSSProperties} />
      <div className="pd-ends" aria-hidden="true"><span>{format(control.min)}</span><span>{format(control.max)}</span></div>
    </div>
  )
}

function SensitivityPlot({ model }: { model: ReturnType<typeof pilotDecision> }) {
  const chartHours = hoursControl.max + pilot.reworkHours
  const atZero = model.contribution + model.hours * pilot.hourlyCost
  const atEnd = atZero - chartHours * pilot.hourlyCost
  const high = Math.max(atZero, 0)
  const low = Math.min(atEnd, 0)
  const x = (hours: number) => 32 + hours / chartHours * 380
  const y = (contribution: number) => 15 + (high - contribution) / (high - low) * 82
  const selected = x(model.hours)
  const stressed = x(model.hours + pilot.reworkHours)
  const zero = y(0)
  return (
    <svg className="pd-plot" viewBox="0 0 426 126" aria-hidden="true" focusable="false">
      <rect className="pd-window" x={selected} y="9" width={stressed - selected} height="92" />
      <path className="pd-ticks" d="M32 10V101 M222 10V101 M412 10V101" />
      <path className="pd-zero" d={'M32 ' + zero + 'H412'} />
      <text className="pd-zero-text" x="1" y={zero + 3}>€0</text>
      <path className="pd-slope" d={'M32 ' + y(atZero) + 'L412 ' + y(atEnd)} />
      <circle className="pd-dot-now" cx={selected} cy={y(model.contribution)} r="4.9" />
      <circle className="pd-dot-stress" cx={stressed} cy={y(model.stressContribution)} r="4.4" />
      <text x="32" y="120">0 h</text><text x="222" y="120" textAnchor="middle">{chartHours / 2} h</text>
      <text x="412" y="120" textAnchor="end">{chartHours} h</text>
    </svg>
  )
}

function downloadBrief(price: number, hours: number) {
  const brief = buildOfferBrief(pilotDecisionInput(price, hours), pilot.date)
  const blob = new Blob([JSON.stringify(brief, null, 2) + '\n'], { type: 'application/json' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = 'quote-review-' + price + 'eur-' + hours + 'h.offer-brief.json'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(href), 1000)
}

export function PilotDecisionDesk({ headingLevel: Heading = 'h2' }: { headingLevel?: 'h1' | 'h2' }) {
  const [price, setPrice] = useState(pilot.price)
  const [hours, setHours] = useState(pilot.reviewHours)
  const headingId = useId()
  const Subheading = Heading === 'h1' ? 'h2' : 'h3'
  const model = pilotDecision(price, hours)
  const terms = model.pricingWindow
  return (
    <section className="pd-desk" id="unit-economics" aria-labelledby={headingId}>
      <div className="pd-frame">
        <header className="pd-intro">
          <p className="pd-kicker"><span aria-hidden="true" />Sales operations · Decision model</p>
          <Heading id={headingId}>Price a quote-review pilot.</Heading>
          <p>Ten historical quotes. One approved rate card. Set the fee and review time to see what the seller keeps and what the buyer must recover.</p>
        </header>
        <noscript>
          <style>{'.pd-desk .pd-dial input,.pd-desk .pd-ends,.pd-desk .pd-actions{display:none}'}</style>
          <div className="pd-static">
            <p>The published case uses a €1,500 fee and 10 review hours. Enable JavaScript to model a different scope.</p>
            <a href="/api/research/quote-review/brief.json" download>Download the base brief (JSON)</a>
            <a href="/api/research/quote-review/case.md" download>Read the case (Markdown)</a>
          </div>
        </noscript>
        <div className="pd-spread">
          <div className="pd-inputs">
            <Subheading>Set the terms</Subheading>
            <DeskSlider label="Pilot fee" unit="EUR" control={feeControl} value={price} onChange={setPrice} />
            <DeskSlider label="Human review" unit="hours" control={hoursControl} value={hours} onChange={setHours} />
            <p className="pd-input-note">Review costs {money.format(pilot.hourlyCost)} an hour. Each pilot carries {money.format(pilot.compute + pilot.collection + pilot.acquisition + pilot.support)} in other variable costs.</p>
          </div>
          <div className="pd-report">
            <div className="pd-report-top"><span>Seller contribution</span><span className={'pd-verdict' + (model.stressContribution <= 0 ? ' pd-caution' : '')}>{model.verdict}</span></div>
            <div className="pd-figure">{money.format(model.contribution)}</div>
            <p className="pd-denom">per pilot, before fixed costs</p>
            <SensitivityPlot model={model} />
            <div className="pd-legend">
              <span><i aria-hidden="true" />{hours} h <strong>{money.format(model.contribution)}</strong></span>
              <span><i aria-hidden="true" />{hours + pilot.reworkHours} h <strong>{money.format(model.stressContribution)}</strong></span>
            </div>
            <p className="pd-chart-note">Four more review hours cost {money.format(pilot.reworkHours * pilot.hourlyCost)} in contribution.</p>
          </div>
        </div>
        <div className="pd-observations" aria-live="polite" aria-atomic="true">
          <div><span>Seller break-even</span><strong>{model.fixedCostPilots === null ? 'Out of reach' : model.fixedCostPilots + (model.fixedCostPilots === 1 ? ' pilot' : ' pilots')}</strong>
            <p>{model.fixedCostPilots === null ? 'Each sale must contribute before it can cover overhead.' : 'per month to cover ' + money.format(pilot.monthlyFixed) + ' in fixed costs.'}</p></div>
          <div><span>Buyer payback</span><strong>{decimal.format(model.buyerPaybackMonths)} months</strong>
            <p>at {money.format(monthlyBuyerValue)}/month in redeployable time. Verify hours with the buyer.</p></div>
          <span className="pd-sr-only">{model.verdict}. Seller contribution {money.format(model.contribution)} per pilot, or {money.format(model.stressContribution)} with four extra review hours.</span>
        </div>
        <details className="pd-negotiation">
          <summary>Can both sides agree a price?</summary>
          <div>
            <p>A {terms.targetDownsideMarginPercent}% seller margin after rework sets the fee floor at <b>{money.format(terms.sellerFeeFloor)}</b>. A {terms.buyerPaybackLimitMonths}-month payback on the buyer’s modeled time savings caps the fee at <b>{money.format(terms.buyerFeeCeiling)}</b>.</p>
            {terms.feeGap > 0 ? <p>The gap is {money.format(terms.feeGap)}. To close it, remove {money.format(terms.requiredCostReduction)} in delivery cost ({terms.requiredReviewMinutesSaved} minutes of review), or demonstrate another {money.format(terms.requiredExtraMonthlyBuyerValue)} in monthly buyer value.</p>
              : <p>The two targets overlap. An agreed fee from {money.format(terms.sellerFeeFloor)} to {money.format(terms.buyerFeeCeiling)} meets both under these assumptions.</p>}
            <p>These are negotiating targets. The buyer still needs to confirm that the recovered hours have value.</p>
          </div>
        </details>
        <div className="pd-foot">
          <div className="pd-actions">
            <Link className="pd-primary" href={pilotBriefHref(price, hours)}>Edit this brief <span aria-hidden="true">↗</span></Link>
            <PilotDecisionMemo price={price} hours={hours} />
            <button className="pd-export" type="button" onClick={() => downloadBrief(price, hours)}>Export JSON</button>
          </div>
          <details className="pd-method">
            <summary>Assumptions and source</summary>
            <div>
              <p>All amounts are illustrative, in EUR before tax. Variable cost is review hours × {money.format(pilot.hourlyCost)}, plus {money.format(pilot.compute)} compute, {money.format(pilot.collection)} collection, {money.format(pilot.acquisition)} acquisition and {money.format(pilot.support)} support. Collection is held flat for this scenario.</p>
              <p>“Test with a buyer” requires positive contribution after four extra hours. “Tighten the scope” means rework would consume the margin. “Revise the price” means the original scope already breaks even or loses money. Monthly break-even rounds up to a whole pilot.</p>
              <p>Buyer payback divides the fee by six redeployable hours a month at {money.format(pilot.buyerHourlyValue)}/hour, less {money.format(pilot.buyerMonthlyCost)} monthly running cost. The estimate depends on the buyer using the recovered time. Demand and cash savings are unverified.</p>
              <p><a href={pilotScenarioHref(price, hours)}>Open this scenario as JSON <span aria-hidden="true">↗</span></a></p>
              <Link href={'/blog/' + pilot.slug}>Read the worked case <span aria-hidden="true">↗</span></Link>
            </div>
          </details>
        </div>
      </div>
    </section>
  )
}
