import Image from 'next/image'
import Link from 'next/link'
import { payingPrograms } from '@/lib/affiliate'
import { posts } from '@/lib/posts'

const proofRows = [
  ['Search intent', 'Faceless YouTube stack', 'Creator demand'],
  ['Honest pick', 'ElevenLabs + CapCut', 'Best fit wins'],
  ['Revenue route', 'Recurring payer links', 'Disclosure safe'],
]

export function IncomeDeskHero() {
  const programs = payingPrograms()
  const payers = programs.slice(0, 4)
  const recurringPrograms = programs.filter((program) => program.recurring && !program.recurring.toLowerCase().includes('one-time')).length
  const heroStats = [
    [`${programs.length}`, 'payer records'],
    [`${posts.length}`, 'live loops'],
    [`${recurringPrograms}`, 'recurring routes'],
  ]

  return (
    <section className="hero-stage -mx-6" aria-label="Agentic Income homepage hero">
      <Image
        src="/brand/income-desk-hero-poster.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-media"
        aria-hidden="true"
      />
      <div className="hero-shade" aria-hidden="true" />

      <svg className="hero-trace" viewBox="0 0 1200 620" aria-hidden="true">
        <path
          data-hero-trace
          d="M92 420 C270 292 426 358 568 258 C708 160 872 172 1100 80"
          fill="none"
          stroke="url(#hero-trace-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          data-hero-trace
          d="M166 500 C330 424 436 434 590 350 C722 278 842 324 1030 252"
          fill="none"
          stroke="#D6B56D"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.72"
        />
        {[180, 420, 642, 880, 1072].map((x, index) => (
          <circle
            key={x}
            data-hero-node
            cx={x}
            cy={[354, 318, 210, 164, 96][index]}
            r="5"
            fill={index === 4 ? '#34D399' : '#F1F3F9'}
          />
        ))}
        <defs>
          <linearGradient id="hero-trace-gradient" x1="92" x2="1100" y1="420" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6EA8FE" stopOpacity="0" />
            <stop offset="0.25" stopColor="#6EA8FE" />
            <stop offset="0.64" stopColor="#D6B56D" />
            <stop offset="1" stopColor="#34D399" />
          </linearGradient>
        </defs>
      </svg>

      <div className="hero-content mx-auto max-w-6xl px-6">
        <div className="hero-copy motion-reveal">
          <div className="kicker">Agentic income network</div>
          <h1 className="hero-title">Agentic Income</h1>
          <p className="hero-subtitle">
            Build the first AI-tool income loop: one honest comparison, one recurring payer route, one owned-audience capture, and one direct product path.
          </p>
          <div className="hero-actions">
            <Link href="/start" className="cta">
              Open starter kit
            </Link>
            <Link href="/tools" className="cta-secondary">
              Inspect the payer catalog
            </Link>
          </div>
        </div>

        <aside className="hero-panel" data-hero-panel aria-label="Live Agentic Income routing preview">
          <div className="desk-header">
            <div>
              <div className="text-xs uppercase text-muted">Income desk</div>
              <div className="mt-1 text-lg font-semibold text-ink">Comparison engine</div>
            </div>
            <div className="status-dot">Live</div>
          </div>

          <div className="mt-3 space-y-3">
            {proofRows.map(([label, value, note]) => (
              <div key={label} className="route-row">
                <div>
                  <div className="text-xs text-muted">{label}</div>
                  <div className="font-medium text-ink">{value}</div>
                </div>
                <div className="text-right text-xs text-muted">{note}</div>
              </div>
            ))}
          </div>

          <div className="hero-ledger">
            <div className="panel-label">Recurring ledger</div>
            <div className="mt-3 space-y-2">
              {payers.map((program) => (
                <div key={program.tool} className="ledger-row">
                  <span>{program.tool}</span>
                  <span>{program.recurring ?? 'verify'}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="hero-proofbar motion-reveal" aria-label="Agentic Income operating proof">
          {heroStats.map(([value, label]) => (
            <div key={label} className="hero-proof">
              <span className="proof-value">{value}</span>
              <span>{label}</span>
            </div>
          ))}
          <Link href="/offers" className="hero-proof hero-proof-action">
            <span>Next move</span>
            <strong>View product ladder</strong>
          </Link>
        </div>
      </div>
    </section>
  )
}
