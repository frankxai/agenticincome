'use client'

import { useState } from 'react'
import Link from 'next/link'

const INSTALL = [
  'git clone https://github.com/frankxai/agentic-income-skills.git',
  'cd agentic-income-skills && npm install',
  'npm run income:init -- --output=../my-income-system',
  'npm run income:validate -- examples/request-to-quote-desk/income-system.json',
  'npm test',
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
          <div className="kicker text-[color:var(--color-accent)]">Public system · open machinery · MIT</div>
          <h2 className="display-h2">
            Clone the contract. Create an Outcome Pack you own.
          </h2>
          <p className="mt-4 text-lg font-semibold text-[color:var(--color-ink)]">
            No marketplace claim. No private-repository dependency.
          </p>
          <p className="mt-3 text-[color:var(--color-muted)]">
            The public repository contains the operating skill, machine-readable schema, validator,
            scaffold, and a governed Request-to-Quote reference system. It requires Node.js 20 or
            newer and works with any capable coding agent that can read the skill contract.
          </p>
          <div className="mt-6 grid gap-2">
            {INSTALL.map((cmd) => (
              <CopyLine key={cmd} text={cmd} />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/pack" className="cta-secondary">See what ships</Link>
            <a
              href="https://github.com/frankxai/agentic-income-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary"
            >
              Inspect the public MIT source
            </a>
          </div>
        </div>

        <div
          className="terminal motion-reveal"
          role="img"
          aria-label="Public Agentic Income repository commands for scaffolding, validating, and testing an owned Outcome Pack"
        >
          <div className="terminal-bar">
            <i /><i /><i />
            <span className="ml-2">shell — public source workflow</span>
          </div>
          <div className="terminal-body">
            <div className="t-cmd">npm run income:init -- --output=../my-income-system</div>
            <div className="t-out">Creates an owned copy of the Request-to-Quote reference system.</div>
            <div className="t-out">→ writes <span className="t-artifact">../my-income-system/income-system.json</span></div>
            <div className="t-cmd mt-3">npm run income:validate -- ../my-income-system/income-system.json</div>
            <div className="t-out">Checks schema, deny-by-default authority, approval gates, budgets, and secret-bearing fields.</div>
            <div className="t-cmd mt-3">npm test<span className="t-caret ml-2" /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
