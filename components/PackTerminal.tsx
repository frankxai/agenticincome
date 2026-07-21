'use client'

import { useState } from 'react'
import Link from 'next/link'

const INSTALL = [
  'git clone https://github.com/frankxai/agentic-income-skills.git',
  'cd agentic-income-skills && npm install && npm test',
  'npm run income:init -- --output=../my-income-system',
]

function CopyLine({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="copy-line">
      <span className="truncate">{text}</span>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 1600)
          } catch {
            /* clipboard unavailable — text remains selectable */
          }
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

export function PackTerminal() {
  return (
    <section className="section-band" id="pack">
      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="section-heading motion-reveal">
          <div className="kicker text-[color:var(--color-accent)]">Open operating contract · MIT</div>
          <h2 className="display-h2">
            <span className="font-mono text-[0.78em] text-[color:var(--color-accent)]">/agentic-income</span>
            {' '}— build an Outcome Pack in your own repo.
          </h2>
          <p className="mt-4 text-lg font-semibold text-[color:var(--color-ink)]">
            An inspectable contract for humans and coding agents.
          </p>
          <p className="mt-3 text-[color:var(--color-muted)]">
            The public repository ships the operating skill, JSON Schema, validator, scaffold, and
            Request-to-Quote reference system. It is runtime-portable because the intelligence and
            authority rules live in readable files—not in a private plugin.
          </p>
          <div className="mt-6 grid gap-2">
            {INSTALL.map((cmd) => (
              <CopyLine key={cmd} text={cmd} />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/pack" className="cta-secondary">Pack details</Link>
            <a href="https://github.com/frankxai/agentic-income-skills" target="_blank" rel="noopener noreferrer" className="cta-secondary">
              Read the source — it’s MIT
            </a>
          </div>
        </div>

        <div className="terminal motion-reveal" role="img" aria-label="Example agentic-income session: build produces a principal-owned Outcome Pack with human approval gates">
          <div className="terminal-bar">
            <i /><i /><i />
            <span className="ml-2">agent — /agentic-income session</span>
          </div>
          <div className="terminal-body">
            <div className="t-cmd">/agentic-income build a request-to-quote desk</div>
            <div className="t-out">Principal: <span className="t-accent">Amsterdam renovation business</span></div>
            <div className="t-out">Buyer job: turn an incomplete project request into a reviewable scope brief.</div>
            <div className="t-out">Authority: agent may triage and draft; pricing and outbound commitments require approval.</div>
            <div className="t-out">→ wrote <span className="t-artifact">income-system.json</span></div>
            <div className="t-out">→ wrote <span className="t-artifact">agent-card.json</span></div>
            <div className="t-cmd mt-3">npm run income:validate -- income-system.json</div>
            <div className="t-out"><span className="t-accent">PASS</span> · schema · authority · evals · economics · evidence</div>
            <div className="t-out">Next gate: principal approves scope language before any customer-facing send.</div>
            <div className="t-cmd mt-3">/agentic-income prove<span className="t-caret ml-2" /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
