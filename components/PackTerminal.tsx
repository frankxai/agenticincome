'use client'

import { useState } from 'react'
import Link from 'next/link'

const INSTALL = [
  '/plugin marketplace add frankxai/agenticincome',
  '/plugin install ai-pack@agenticincome',
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
          <div className="kicker text-[color:var(--color-accent)]">The pack · open machinery</div>
          <h2 className="display-h2">
            <span className="font-mono text-[0.85em] text-[color:var(--color-accent)]">/ai</span> — an income
            architect in your terminal.
          </h2>
          <p className="mt-4 text-[color:var(--color-muted)]">
            Five staged commands, four specialist agents, four skills — installable in Claude Code,
            portable to Codex, Gemini CLI, Cursor, and OpenCode. Every stage ends with a written
            artifact in <em className="not-italic text-[color:var(--color-ink)]">your</em> repo. Advice that
            lives only in a chat doesn’t exist.
          </p>
          <div className="mt-6 grid gap-2">
            {INSTALL.map((cmd) => (
              <CopyLine key={cmd} text={cmd} />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/pack" className="cta-secondary">Pack details</Link>
            <a href="https://github.com/frankxai/agenticincome" rel="noopener" className="cta-secondary">
              Read the source — it’s MIT
            </a>
          </div>
        </div>

        <div className="terminal motion-reveal" role="img" aria-label="Example /ai session: assess produces a capability inventory, architect produces an income architecture with a kill criterion">
          <div className="terminal-bar">
            <i /><i /><i />
            <span className="ml-2">claude — /ai session</span>
          </div>
          <div className="terminal-body">
            <div className="t-cmd">/ai assess</div>
            <div className="t-out">Reading surfaces… <span className="t-accent">newsletter (1.4k)</span> · <span className="t-accent">github (37 repos)</span> · <span className="t-accent">yt (2.1k)</span></div>
            <div className="t-out">Leverage read: 2 candidates where proof × distribution already overlap.</div>
            <div className="t-out">→ wrote <span className="t-artifact">income/00-capability-inventory.md</span></div>
            <div className="t-cmd mt-3">/ai architect</div>
            <div className="t-out">Entry model: <span className="t-accent">services</span> — cash horizon 30d, strong payment evidence.</div>
            <div className="t-out">The one play: “agent workflow implementation for boutique studios.”</div>
            <div className="t-out">Economics: ranges + assumptions only. Scenario, not forecast.</div>
            <div className="t-out">Kill criterion: 2 paid engagements by <span className="t-accent">Aug 22</span> — or stop.</div>
            <div className="t-out">→ wrote <span className="t-artifact">income/01-income-architecture.md</span></div>
            <div className="t-cmd mt-3">/ai offer<span className="t-caret ml-2" /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
