'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from '@/components/ArrowUpRight'
import { businessStarters, starterBriefHref, starterInput } from '@/lib/business-starters'
import { buildOfferBrief, offerBriefMarkdown, OFFER_TEXT_LIMITS } from '@/lib/offer-brief'

export function BusinessStudio() {
  const [selected, setSelected] = useState(0)
  const [drafts, setDrafts] = useState(() => businessStarters.map(item => ({ buyer: String(item.buyer), offer: String(item.offer) })))
  const { buyer, offer } = drafts[selected]
  const [notice, setNotice] = useState('')
  const starter = businessStarters[selected]
  const ready = buyer.trim().length > 0 && offer.trim().length > 0
  const input = starterInput(selected, buyer, offer)

  function choose(index: number) {
    setSelected(index)
    setNotice('')
  }

  function edit(field: 'buyer' | 'offer', value: string) {
    setDrafts(current => current.map((draft, index) => index === selected ? { ...draft, [field]: value } : draft))
    setNotice('')
  }

  function download() {
    const text = offerBriefMarkdown(buildOfferBrief(input))
    const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'my-' + starter.id + '-brief.md'
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice('Your brief is downloaded. Open it in your AI tool or share it with your team.')
  }

  return (
    <section className="business-studio" id="studio" aria-labelledby="studio-heading">
      <div className="studio-topline"><span className="studio-light" aria-hidden="true" /><span>Your next business</span><span className="studio-local">Free planning tool</span></div>
      <div className="studio-tabs" role="group" aria-label="Choose what to build">
        {businessStarters.map((item, index) => <button type="button" key={item.id} aria-pressed={selected === index} onClick={() => choose(index)}>{item.label}</button>)}
      </div>
      <div className="studio-body">
        <div className="studio-heading"><h2 id="studio-heading">{starter.title}</h2><p>{starter.description}</p></div>
        <div className="studio-fields">
          <label htmlFor="business-buyer">Who is it for?</label>
          <input id="business-buyer" value={buyer} onChange={event => edit('buyer', event.target.value)} maxLength={OFFER_TEXT_LIMITS.buyer} />
          <label htmlFor="business-offer">What will they get?</label>
          <textarea id="business-offer" value={offer} onChange={event => edit('offer', event.target.value)} maxLength={OFFER_TEXT_LIMITS.offer} rows={3} />
        </div>
        <div className="studio-team">
          <h3>A workflow for your AI tools</h3>
          <ol>{starter.roles.map(([role, task]) => <li key={role}><span className="studio-role">{role}</span><span>{task}</span></li>)}</ol>
        </div>
        <p className="studio-budget">Example assumptions · €{starter.price} price · €{starter.cost} delivery cost. Edit both in the full plan.</p>
        <div className="studio-footer">
          {ready ? <Link className="product-button" href={starterBriefHref(input)}>Edit the full plan <ArrowUpRight /></Link> : <span className="studio-help">Add a buyer and deliverable to continue.</span>}
          <button type="button" className="studio-download" onClick={download} disabled={!ready}>Download plan</button>
        </div>
        <p className="studio-note">Editable examples. Set your price, costs and first customer test in the workbench. Your inputs stay in this browser until you choose to share them.</p>
        <p className="studio-notice" role="status">{notice}</p>
        <noscript><p><Link href="/workbench/offer-brief">Open the offer workbench</Link> or <Link href="/delivery/starter-kit">download the free starter kit</Link>.</p></noscript>
      </div>
    </section>
  )
}
