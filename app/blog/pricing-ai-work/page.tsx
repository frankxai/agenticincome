import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleJsonLd } from '@/components/ArticleJsonLd'
import { baseOpenGraph } from '@/lib/open-graph'
import data from '@/public/research/pricing-ai-work.json'
import { getPost } from '@/lib/posts'

const slug = 'pricing-ai-work'
const post = getPost(slug)!
const path = '/blog/' + slug
const dataset = '/research/pricing-ai-work.json'

export const metadata: Metadata = {
  title: post.title,
  description: post.dek,
  alternates: { canonical: path, types: { 'application/json': dataset } },
  openGraph: { ...baseOpenGraph, type: 'article', title: post.title, description: post.dek, url: path },
}

const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2 })
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 })
const m = data.scenario
const extraCosts = Object.values(m.otherVariableCosts).reduce((sum, item) => sum + item, 0)
const variableCost = m.reviewHours * m.costPerReviewHour + extraCosts
const priceFloor = variableCost / (1 - m.targetContributionMargin)
const buyerValue = m.buyerMonthlyHoursRecovered * m.buyerValuePerHour - m.buyerMonthlyRunningCost
const priceCeiling = buyerValue * m.maximumPaybackMonths
const costGap = variableCost - priceCeiling * (1 - m.targetContributionMargin)
const minutesToRecover = costGap / m.costPerReviewHour * 60
const extraBuyerValue = (priceFloor - priceCeiling) / m.maximumPaybackMonths

export default function PricingAIWork() {
  return (
    <article className="prose-ai mx-auto px-0 py-12 sm:py-20">
      <ArticleJsonLd title={post.title} description={post.dek} slug={slug} date={post.date} />
      <p className="text-sm"><Link href="/blog">Revenue research</Link> · <time dateTime={data.checkedOn}>28 November 2026</time></p>
      <h1>{post.title}</h1>
      <p>Suppose a buyer needs a four-month payback on a quote-review pilot. That puts the modeled fee ceiling at {eur.format(priceCeiling)}. Finance estimates that delivering it at the agreed margin requires {eur.format(priceFloor)}. A discount could meet the buyer’s payback target and leave the seller short of its margin. Which assumption can the team change?</p>

      <h2>What four companies actually sell</h2>
      <p>The unit on the invoice tells you what the customer expects to keep. These public offers illustrate four different units. Prices below are in US dollars, checked on 28 November 2026.</p>
      <div className="divide-y divide-border border-y border-border">
        {data.offers.map(offer => (
          <section key={offer.name} className="py-4" aria-label={offer.name}>
            <h3 className="m-0">{offer.name}</h3>
            <p><strong>{offer.unit}.</strong> {offer.observation}</p>
            {offer.prices.length > 0 && (
              <ul aria-label={offer.name + ' published prices'}>{offer.prices.map(price =>
                <li key={price.item}>{price.item} · {usd.format(price.amount)} per {price.per}</li>,
              )}</ul>
            )}
            <p className="text-sm">{offer.sources.map((source, i) => <span key={source.url}>{i > 0 ? ' · ' : ''}<a href={source.url}>{source.title}</a></span>)}</p>
          </section>
        ))}
      </div>
      <p>In a quote-review engagement, the useful unit is one accepted exception report. The seller can rerun a model three times and still owe the buyer one report. An ongoing fee starts to make sense when a changing rate card or a new batch of quotes creates another decision. For a research subscription, the equivalent is a dated change that causes the reader to revise an assumption.</p>

      <h2>Two limits on the same quote</h2>
      <p>Assume a seller reviews ten historical quotes. In the downside case, review takes {m.reviewHours} hours at {eur.format(m.costPerReviewHour)} per hour. Compute, collection, sales acquisition and support add {eur.format(extraCosts)} per accepted pilot. All figures here are modeled, in euros before tax.</p>
      <dl className="divide-y divide-border border-y border-border">
        {[
          ['Delivery cost', m.reviewHours + ' × ' + eur.format(m.costPerReviewHour) + ' + ' + eur.format(extraCosts), eur.format(variableCost)],
          ['Seller’s minimum fee', eur.format(variableCost) + ' ÷ (1 − ' + (m.targetContributionMargin * 100) + '% contribution margin)', eur.format(priceFloor)],
          ['Buyer’s monthly capacity value', m.buyerMonthlyHoursRecovered + ' hours × ' + eur.format(m.buyerValuePerHour) + ' − ' + eur.format(m.buyerMonthlyRunningCost) + ' running cost', eur.format(buyerValue)],
          ['Buyer’s maximum fee', m.maximumPaybackMonths + ' months × ' + eur.format(buyerValue) + ' monthly value', eur.format(priceCeiling)],
        ].map(([name, calculation, amount]) => <div key={name} className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 py-3"><dt className="font-semibold">{name}</dt><dd className="font-mono text-lg">{amount}</dd><dd className="col-span-2 text-sm text-muted">{calculation}</dd></div>)}
      </dl>
      <p>The seller needs {eur.format(priceFloor - priceCeiling)} more than the buyer’s four-month ceiling. The buyer’s six hours count only when someone can put them to productive use. A shorter queue alone does not reduce payroll.</p>
      <h2>The smallest change that clears the gap</h2>
      <p><strong>On the delivery side, recover {minutesToRecover} minutes.</strong> At the buyer’s {eur.format(priceCeiling)} ceiling, variable cost can reach {eur.format(priceCeiling - priceCeiling * m.targetContributionMargin)} and still leave the seller’s target margin. Removing {eur.format(costGap)} of work closes the cost gap. Time a second batch of comparable quotes and preserve the same acceptance criteria.</p>
      <p><strong>On the buyer side, establish another {eur.format(extraBuyerValue)} of monthly value.</strong> A fee of {eur.format(priceFloor)} needs {eur.format(priceFloor / m.maximumPaybackMonths)} per month to pay back in four months. At the assumed hourly value, that is {extraBuyerValue / m.buyerValuePerHour * 60} additional redeployable minutes per month. Ask the buyer what work those minutes would actually replace.</p>
      <p>Either change would reconcile the quote on paper. Keep the engagement in discovery until a timed trial or a named buyer provides the missing evidence.</p>
      <p><Link href="/?ask=pricing#income-chat">Ask about your own price and costs</Link> · <Link href="/workbench/quote-review">Test a different fee and review time</Link> · <Link href="/blog/quote-review-pilot">Read the quote-review case</Link> · <a href={dataset} download>Download the sources and model inputs (JSON)</a></p>
    </article>
  )
}
