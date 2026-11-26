'use client'

import Link from 'next/link'
import { useState } from 'react'

export function OfferAgentConnection() {
  const [message, setMessage] = useState('')
  async function copyAddress() {
    const address = new URL('/api/mcp', window.location.origin).href
    try {
      await navigator.clipboard.writeText(address)
      setMessage('MCP address copied.')
    } catch {
      setMessage(address)
    }
  }
  return (
    <section id="offer-agent" className="mt-12 scroll-mt-24 rounded-2xl border border-border bg-surface p-6" aria-labelledby="offer-agent-heading">
      <h2 id="offer-agent-heading" className="text-2xl font-semibold text-ink">Draft an offer with your assistant</h2>
      <p className="mt-3 max-w-3xl leading-7 text-muted">
        Connect this Streamable HTTP address in your MCP client and select <code className="text-ink">source_to_offer</code>.
        Give your assistant a public or redacted excerpt, its title and date, and your proposed price and cost.
        It checks the thesis and prepares a costed experiment.
      </p>
      <p className="mt-2 max-w-3xl leading-7 text-muted">
        Save the JSON result from <code className="text-ink">draft_offer_experiment</code> and open it in the workbench
        to edit the brief. The Markdown version is ready to share after your review.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="cta-secondary min-h-11" type="button" onClick={copyAddress}>Copy MCP address</button>
        <a className="cta-secondary min-h-11" href="/downloads/offer-brief-agent-example.json" download>Download synthetic example</a>
        <Link className="cta-secondary min-h-11" href="/workbench/offer-brief">Open the offer workbench</Link>
      </div>
      <p className="mt-2 break-all text-sm text-muted" role="status">{message}</p>
    </section>
  )
}
