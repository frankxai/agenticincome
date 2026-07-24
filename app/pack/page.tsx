import type { Metadata } from 'next'
import Link from 'next/link'
import { PackTerminal } from '@/components/PackTerminal'

export const metadata: Metadata = {
  title: 'Agentic Income Skills — public contracts, scaffold, and validator',
  description:
    'Clone the public MIT Agentic Income system, create an owned Outcome Pack, validate its authority policy, and inspect the Request-to-Quote reference implementation.',
  alternates: { canonical: '/pack' },
  openGraph: { url: '/pack' },
}

const STAGES = [
  [
    'income:init',
    'Creates an owned copy of the governed Request-to-Quote reference system without overwriting an existing destination.',
    'income-system.json',
  ],
  [
    'income:validate',
    'Checks the IncomeSystem v1 schema plus required authority denials, human approval gates, budgets, verified domains, and forbidden secret fields.',
    'validation result',
  ],
  [
    'npm test',
    'Runs the public repository test suite against the schema, validator, scaffold, and reference system.',
    'test report',
  ],
] as const

const SYSTEM_PARTS = [
  ['skills/agentic-income/SKILL.md', 'The portable operating contract for discover, validate, build, sell, deliver, operate, prove, and improve modes.'],
  ['schemas/income-system.v1.schema.json', 'The machine-readable contract for principal, outcome, authority, evaluation, economics, operations, and evidence.'],
  ['scripts/*.mjs', 'Executable scaffold and validation scripts backed by the package commands shown above.'],
  ['examples/request-to-quote-desk', 'A narrow governed reference system with human approval before prices, quotes, contracts, or financial actions.'],
] as const

export default function PackPage() {
  return (
    <>
      <section className="section-band pt-20">
        <div className="section-heading motion-reveal">
          <div className="kicker text-[color:var(--color-accent)]">Public source · MIT · no account required</div>
          <h1 className="display-h2 !text-[clamp(2.2rem,4.5vw,3.4rem)]">
            Agentic Income Skills
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--color-muted)]">
            An inspectable operating skill, schema, validator, scaffold, and reference system for
            principal-owned agent services. Clone it, test it, and keep the resulting Outcome Pack
            in your own repository.
          </p>
        </div>
      </section>

      <PackTerminal />

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">The executable path</div>
          <h2 className="display-h2">Scaffold. Validate. Test.</h2>
        </div>
        <div className="mt-8 motion-reveal">
          {STAGES.map(([cmd, desc, artifact]) => (
            <div key={cmd} className="kb-row !grid-cols-[8.5rem_1fr] sm:!grid-cols-[8.5rem_1fr_auto]">
              <span className="font-mono text-sm text-[color:var(--color-accent)]">{cmd}</span>
              <span>
                <span className="kb-desc !mt-0 !text-[0.95rem] !text-[color:var(--color-ink)]">{desc}</span>
              </span>
              <span className="kchip hidden sm:inline-block">{artifact}</span>
            </div>
          ))}
        </div>
        <p className="motion-reveal mt-6 max-w-3xl text-sm leading-relaxed text-[color:var(--color-muted)]">
          The scripts do not create demand, approve a quote, sign a contract, move money, or grant
          production authority. They create and check a system contract. An authorized human or
          legal entity remains the principal.
        </p>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">What ships</div>
          <h2 className="display-h2">Four public artifacts. One authority model.</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SYSTEM_PARTS.map(([name, desc]) => (
            <div key={name} className="card motion-reveal">
              <div className="font-mono text-sm text-[color:var(--color-accent-2)]">{name}</div>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Runtimes</div>
          <h2 className="display-h2">Runtime-neutral. Node-verified.</h2>
          <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
            The operating skill is plain Markdown. Claude Code, Codex, Gemini CLI, Cursor, OpenCode,
            and other capable agents can read it directly. The executable scaffold and validator use
            the public package scripts on Node.js 20 or newer; no Claude marketplace installation is
            advertised or required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://github.com/frankxai/agentic-income-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="cta"
            >
              Open the public repository
            </a>
            <a
              href="https://github.com/frankxai/agentic-income-skills/blob/main/skills/agentic-income/SKILL.md"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary"
            >
              Read the operating skill
            </a>
            <Link href="/start" className="cta-secondary">
              Map the first system
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
