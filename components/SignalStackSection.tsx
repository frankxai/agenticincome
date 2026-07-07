import Link from 'next/link'
import { payingPrograms } from '@/lib/affiliate'

const signalSteps = [
  {
    number: '01',
    title: 'Demand enters',
    body: 'Searches expose where creators and operators already feel tool friction.',
    metric: 'intent',
  },
  {
    number: '02',
    title: 'Comparison sets the verdict',
    body: 'The ranking is fixed on fit before payout enters the math.',
    metric: 'proof',
  },
  {
    number: '03',
    title: 'Payer route opens',
    body: 'Recurring programs only enter when they fit the recommendation.',
    metric: 'route',
  },
  {
    number: '04',
    title: 'Audience compounds',
    body: 'Email and products turn one visit into a durable relationship.',
    metric: 'owned',
  },
]

export function SignalStackSection() {
  const payers = payingPrograms().slice(0, 5)

  return (
    <section className="section-band signal-section">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="section-heading motion-reveal">
          <div className="kicker">Live signal model</div>
          <h2>
            <span>One search in,</span>
            <span>one routed click out.</span>
          </h2>
          <p>
            Search intent enters, the comparison ranks it on fit, and the click routes to the winner — a recurring payer when one fits the verdict, an owned product when none does.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/tools" className="cta-secondary">
              Inspect catalog
            </Link>
            <Link href="/blog" className="cta-secondary">
              Read comparisons
            </Link>
          </div>
        </div>

        <div className="signal-board motion-reveal" aria-label="Agentic Income demand routing model">
          <div className="signal-header">
            <div>
              <div className="panel-label">Demand route</div>
              <div className="mt-1 text-xl font-semibold text-ink">Search to owned asset</div>
            </div>
            <div className="signal-badge">Disclosure safe</div>
          </div>

          <svg className="signal-graph" viewBox="0 0 760 260" role="img" aria-labelledby="signal-title">
            <title id="signal-title">Demand signal moving through comparison, payer route, and owned audience</title>
            <path
              data-signal-wave
              d="M42 192 C142 94 242 224 342 118 C450 6 548 154 718 54"
              fill="none"
              stroke="url(#signal-wave-gradient)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              data-signal-wave
              d="M48 210 C188 158 264 170 366 132 C504 80 604 110 718 92"
              fill="none"
              stroke="#D6B56D"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.75"
            />
            {signalSteps.map((step, index) => {
              const points = [
                [72, 176],
                [288, 142],
                [486, 84],
                [690, 60],
              ]
              const [cx, cy] = points[index]
              return (
                <g key={step.number} className="signal-node" data-signal-node>
                  <circle cx={cx} cy={cy} r="18" fill="#0A0C14" stroke="#1A1F2E" strokeWidth="2" />
                  <circle cx={cx} cy={cy} r="5" fill={index === 3 ? '#34D399' : '#6EA8FE'} />
                </g>
              )
            })}
            <defs>
              <linearGradient id="signal-wave-gradient" x1="42" x2="718" y1="192" y2="54" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6EA8FE" />
                <stop offset="0.54" stopColor="#D6B56D" />
                <stop offset="1" stopColor="#34D399" />
              </linearGradient>
            </defs>
          </svg>

          <div className="signal-grid">
            {signalSteps.map((step) => (
              <div key={step.number} className="signal-route">
                <div className="node-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <div className="signal-metric">{step.metric}</div>
              </div>
            ))}
          </div>

          <div className="signal-payers">
            <div className="panel-label">Current payer shortlist</div>
            <div className="payer-strip">
              {payers.map((program) => (
                <div key={program.tool} className="payer-pill">
                  <span>{program.tool}</span>
                  <small>{program.recurring ?? program.commission ?? 'verify'}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
