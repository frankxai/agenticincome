const nodes = [
  {
    number: '01',
    title: 'Rank for demand',
    body: 'High-intent searches around the tools everyone already compares.',
  },
  {
    number: '02',
    title: 'Tell the truth',
    body: 'The honest pick wins before payout is considered.',
  },
  {
    number: '03',
    title: 'Route to recurring',
    body: 'Adjacent payers get linked only when they fit the recommendation.',
  },
  {
    number: '04',
    title: 'Own the audience',
    body: 'Email and direct products compound beyond one search visit.',
  },
]

export function FlywheelSystem() {
  return (
    <section className="section-band">
      <div className="section-heading motion-reveal">
        <div className="kicker">The system</div>
        <h2>One engine, four compounding loops.</h2>
        <p>
          Each loop makes the next one cheaper: search demand teaches the catalog, the catalog improves the comparison, and the comparison grows an owned audience.
        </p>
      </div>

      <div className="flywheel motion-reveal">
        <svg className="flywheel-map" viewBox="0 0 720 360" role="img" aria-labelledby="flywheel-title">
          <title id="flywheel-title">Agentic Income flywheel from demand to owned audience</title>
          <path
            data-flow-line
            d="M166 94 C265 30 455 30 554 94 C660 166 660 194 554 266 C455 330 265 330 166 266 C60 194 60 166 166 94"
            stroke="url(#flywheel-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M522 80 558 94 532 121"
            stroke="#D6B56D"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M198 280 162 266 188 239"
            stroke="#D6B56D"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="360" cy="180" r="72" fill="#0A0C14" stroke="#1A1F2E" strokeWidth="2" />
          <text x="360" y="168" textAnchor="middle" className="svg-label">
            Agentic
          </text>
          <text x="360" y="195" textAnchor="middle" className="svg-label svg-label-strong">
            Income
          </text>
          <defs>
            <linearGradient id="flywheel-gradient" x1="116" x2="604" y1="52" y2="308" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6EA8FE" />
              <stop offset="0.5" stopColor="#D6B56D" />
              <stop offset="1" stopColor="#34D399" />
            </linearGradient>
          </defs>
        </svg>

        <div className="flywheel-grid">
          {nodes.map((node) => (
            <div key={node.number} className="flywheel-node">
              <div className="node-number">{node.number}</div>
              <h3>{node.title}</h3>
              <p>{node.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
