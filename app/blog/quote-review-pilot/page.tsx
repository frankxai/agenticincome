import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleJsonLd } from '@/components/ArticleJsonLd'
import { baseOpenGraph } from '@/lib/open-graph'
import { pilot, deliveryCost, contribution, downside, monthlyBuyerValue, quoteReviewBrief } from '@/lib/quote-review-case'

const path = '/blog/' + pilot.slug
const money = (amount: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
export const metadata: Metadata = {
  title: pilot.title, description: pilot.description, alternates: { canonical: path },
  openGraph: { ...baseOpenGraph, title: pilot.title, description: pilot.description, url: path, type: 'article' },
}

export default function QuoteReviewCase() {
  const brief = quoteReviewBrief()
  const items = [
    ['Human delivery and review', pilot.reviewHours * pilot.hourlyCost, 'Ten hours at €75 fully loaded'],
    ['Inference and retries', pilot.compute, 'Budget per accepted delivery'],
    ['Payment fees', pilot.collection, 'Modeled fee, replace with your contract'],
    ['Sales acquisition', pilot.acquisition, 'Include time spent closing the pilot'],
    ['Support reserve', pilot.support, 'Expected follow-up after acceptance'],
  ] as const
  return (
    <article className="prose-ai mx-auto py-12">
      <ArticleJsonLd title={pilot.title} description={pilot.description} slug={pilot.slug} date={pilot.date} />
      <p><Link href="/blog">Research</Link> · Modeled case · <time dateTime={pilot.date}>27 November 2026</time></p>
      <h1>{pilot.title}</h1>
      <p>A sales lead wants ten historical quotes checked against an approved rate card. At {money(pilot.price)} per pilot, the supplier could keep <strong>{money(contribution)} before fixed costs</strong>. Four extra hours of review cut that to {money(downside)}. That difference decides whether this is a repeatable service.</p>
      <p>These figures are illustrative, in euros excluding tax. Replace them with a buyer’s baseline and your costs before quoting.</p>
      <h2>What the buyer takes home</h2>
      <p>One exception report with a source reference for each discrepancy, the reviewer’s decisions and a handover file the sales team can use on its next quote. The finance owner keeps control of rates and discounts. The assistant can flag a price difference. Sending a revised quote stays with sales.</p>
      <h2>Where the first €1,500 goes</h2>
      <dl>{items.map(([name, amount, note]) => <div key={name} className="border-b border-border py-3"><dt className="flex justify-between gap-3 font-semibold"><span>{name}</span><span>{money(amount)}</span></dt><dd className="text-sm text-muted">{note}</dd></div>)}</dl>
      <p>Total variable cost is {money(deliveryCost)}. The remaining {money(contribution)} gives a {brief.economics.marginPercent}% contribution margin. At {money(pilot.monthlyFixed)} monthly overhead, the supplier needs <strong>{Math.ceil(pilot.monthlyFixed / contribution)} accepted and collected pilots</strong>. Four extra hours on every delivery raise that to {Math.ceil(pilot.monthlyFixed / downside)}.</p>
      <h2>When the buyer recovers the fee</h2>
      <p>Six hours recovered each month at €75 per hour represent €450 of capacity. Allow €75 a month for review and operation. The remaining {money(monthlyBuyerValue)} per month implies {pilot.price / monthlyBuyerValue} months to recover the fee when those hours are redeployed at the assumed value. Record the capacity benefit and any cash saving separately. An unchanged payroll produces no immediate cash saving.</p>
      <h2>What would change the decision</h2>
      <p>Before scoping a pilot, time a manual review and have the buyer mark the critical discrepancies in ten redacted quotes. Agree to catch every marked critical item in that sample, then count false positives and reviewer minutes. One missed critical discrepancy reopens the design. A clean sample justifies a larger trial. The finance owner still decides whether to fund it.</p>
      <h2>Run it with your own numbers</h2>
      <p>Download the case for a finance review, or open the JSON in the offer workbench with <strong>Open saved JSON</strong>. The workbench recalculates the margin when you change the inputs.</p>
      <p><a href="/api/research/quote-review/brief.json" download>Download the editable brief (JSON)</a> · <a href="/api/research/quote-review/case.md" download>Download the case (Markdown)</a></p>
      <p><Link href="/workbench/offer-brief">Open the offer workbench</Link> · <Link href="/mcp">Connect your agent</Link></p>
    </article>
  )
}
