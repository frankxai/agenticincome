import Image from 'next/image'
import Link from 'next/link'

const states = [
  {
    label: 'Before',
    title: 'A pile of disconnected AI-tool opinions.',
    body: 'Clicks scatter across tools, payouts, notes, and half-finished reviews. The operator is busy, but the asset is weak.',
    points: ['Unowned search visits', 'One-off recommendations', 'Commission chasing', 'No durable memory'],
  },
  {
    label: 'After',
    title: 'A controlled income desk with trust at the center.',
    body: 'Every comparison, payer, disclosure, and product ladder routes through one operating model that can be reused across the network.',
    points: ['Citable comparisons', 'Recurring-payer routing', 'Owned audience capture', 'Direct product ladder'],
  },
]

const moves = [
  ['Question', 'Turn high-intent searches into a direct answer, not a meandering blog post.'],
  ['Proof', 'Show the tradeoffs, disclose the incentives, and let the best-fit tool win.'],
  ['Route', 'Send qualified demand to recurring programs or a direct product only when it belongs.'],
  ['Asset', 'Capture the relationship so the next launch starts with trust instead of rented attention.'],
]

export function TransformationSection() {
  return (
    <section className="section-band transformation-section">
      <div className="section-heading motion-reveal">
        <div className="kicker">Transformation</div>
        <h2>From tool noise to a compounding income desk.</h2>
        <p>
          Agentic Income is built to make the upgrade visible: scattered demand becomes one honest recommendation system, then one owned product relationship.
        </p>
      </div>

      <div className="transformation-layout">
        <figure className="transformation-media motion-reveal" data-transform-media>
          <Image
            src="/brand/transformation-system-poster.webp"
            alt="Fragmented AI tool panels routing into a precise income desk with owned-audience vault"
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="transformation-image"
          />
          <figcaption>
            Fragmented recommendations converge into a routed, disclosure-safe income system.
          </figcaption>
        </figure>

        <div className="transformation-states">
          {states.map((state) => (
            <article key={state.label} className="transformation-state motion-reveal">
              <div className="state-label">{state.label}</div>
              <h3>{state.title}</h3>
              <p>{state.body}</p>
              <ul>
                {state.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div className="transformation-moves" aria-label="Agentic Income transformation path">
        {moves.map(([title, body], index) => (
          <div key={title} className="transformation-move motion-reveal">
            <div className="node-number">{String(index + 1).padStart(2, '0')}</div>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
        <Link href="/offers" className="transformation-move transformation-action motion-reveal">
          <span>Next</span>
          <strong>Package the system</strong>
        </Link>
      </div>
    </section>
  )
}
