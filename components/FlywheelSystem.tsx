const nodes = [
  {
    number: '01',
    title: 'Audit the workflow',
    body: 'Name the customer job, evidence, constraints, and viable revenue route.',
  },
  {
    number: '02',
    title: 'Design the system',
    body: 'Connect the offer, agent workflow, product surface, and operating handoff.',
  },
  {
    number: '03',
    title: 'Build the proof',
    body: 'Implement the smallest complete customer path in a reviewable repository.',
  },
  {
    number: '04',
    title: 'Verify and hand over',
    body: 'Run the checks, inspect the preview, record risks, and define the next decision.',
  },
]

export function FlywheelSystem() {
  return (
    <section className="section-band">
      <div className="section-heading motion-reveal">
        <div className="kicker">Delivery system</div>
        <h2>One implementation loop, four verifiable stages.</h2>
        <p>
          Strategy is useful only when it survives implementation. Each stage produces evidence the next person can inspect, operate, and improve.
        </p>
      </div>

      <div className="flywheel motion-reveal">
        <svg className="flywheel-map" viewBox="0 0 720 360" role="img" aria-labelledby="flywheel-title">
          <title id="flywheel-title">Agentic Income delivery loop from audit through verified handoff</title>
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
              <stop stopColor="#10B981" />
              <stop offset="0.5" stopColor="#F59E0B" />
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
