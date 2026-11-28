'use client'

import Link from 'next/link'
import { ArrowUpRight } from '@/components/ArrowUpRight'
import { useState } from 'react'
import { offerUnitEconomics, OFFER_UNIT_LIMIT } from '@/lib/offer-brief'
import { breakEvenUnits, scenarioAmount, studioExample } from '@/lib/revenue-scenario'

const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2, minimumFractionDigits: 0 })
const fields = [
  { key: 'price', label: 'Price per sale', initial: String(studioExample.unitPrice) },
  { key: 'cost', label: 'Variable cost per sale', initial: String(studioExample.unitCost) },
  { key: 'fixed', label: 'Monthly fixed costs', initial: '360' },
] as const

export function RevenueScenario({ id = 'unit-economics' }: { id?: string }) {
  const [values, setValues] = useState({ price: fields[0].initial, cost: fields[1].initial, fixed: fields[2].initial })
  const price = scenarioAmount(values.price)
  const cost = scenarioAmount(values.cost)
  const fixed = scenarioAmount(values.fixed)
  const result = price === null || cost === null ? null : offerUnitEconomics('EUR', price, cost)
  const valid = result !== null && fixed !== null
  const units = valid ? breakEvenUnits(fixed, result.contribution) : null
  return (
    <section className="desk-model" id={id} aria-labelledby="desk-model-title">
      <div className="desk-model-intro">
        <p className="desk-eyebrow"><span aria-hidden="true" /> Unit economics</p>
        <h2 id="desk-model-title">Test the margin.</h2>
        <p>Take a studio that sells a website handover review. Change the price, count the human review time, and see how many sales cover a month of overhead.</p>
        <p className="desk-assumption">Fictional scenario · EUR, before tax</p>
      </div>
      <div className="desk-model-sheet">
        <div className="desk-inputs">
          {fields.map(({ key, label }) => (
            <label key={key} htmlFor={'desk-' + key}>{label}
              <span className="desk-money-input"><span aria-hidden="true">€</span>
                <input id={'desk-' + key} type="number" min="0" max={OFFER_UNIT_LIMIT} step="0.01"
                  inputMode="decimal" value={values[key]} aria-invalid={scenarioAmount(values[key]) === null}
                  onChange={event => setValues(current => ({ ...current, [key]: event.target.value }))} />
              </span>
            </label>
          ))}
        </div>
        <p className="desk-input-note">Include labour, model usage, transaction fees and acquisition in variable cost.</p>
        <dl className="desk-results" aria-live="polite" aria-atomic="true">
          <div><dt>Contribution per sale</dt><dd>{result ? euro.format(result.contribution) : '—'}</dd></div>
          <div><dt>Contribution margin</dt><dd>{result?.marginPercent != null ? result.marginPercent + '%' : '—'}</dd></div>
          <div><dt>Sales to cover overhead</dt><dd>{!valid ? '—' : units === null ? 'Unreachable' : units.toLocaleString('en-GB')}</dd></div>
        </dl>
        {valid ? (
          <div className="desk-transfer">
            <Link className="desk-inline-link" href={'/workbench/offer-brief#studio-review/' + price + '/' + cost}>
              Edit this offer brief <ArrowUpRight />
            </Link>
            <span>Opens with your price and variable cost.</span>
          </div>
        ) : <p className="desk-input-error" role="status">Use amounts from €0 to €1,000,000 with up to two decimal places.</p>}
        <noscript><p>Enable JavaScript to change the illustrative amounts.</p></noscript>
      </div>
    </section>
  )
}
