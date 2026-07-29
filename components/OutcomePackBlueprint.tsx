import Link from 'next/link'

const anatomy = [
  ['01', 'Buyer + job', 'Who has the problem, why it matters now, and what the current process costs.'],
  ['02', 'Accepted outcome', 'What done means, how it is checked, and which claims stay out of scope.'],
  ['03', 'Offer + principal', 'Who owns the terms, customer relationship, accounts, pricing, support, and IP.'],
  ['04', 'Workflow + interfaces', 'Agent steps, inputs, tools, handoffs, failure paths, and versioned artifacts.'],
  ['05', 'Authority + budgets', 'What can run, what needs approval, what is denied, and how access is revoked.'],
  ['06', 'Evals + operations', 'Quality checks, economics, runbook, incidents, evidence, and the next decision.'],
] as const

export function OutcomePackBlueprint() {
  return (
    <section className="section-band" aria-labelledby="outcome-pack-title">
      <div className="outcome-pack-shell">
        <div className="outcome-pack-intro">
          <div className="kicker">The product</div>
          <h2 id="outcome-pack-title">An Outcome Pack is a service contract agents can help execute.</h2>
          <p>
            It is more than a prompt, automation, or course module. It binds a real buyer and accepted
            outcome to a governed workflow, an accountable principal, operating economics, and evidence.
          </p>
          <Link href="/pack" className="cta-secondary">
            Inspect the full public contract
          </Link>
        </div>

        <ol className="outcome-pack-anatomy" aria-label="Six parts of an Outcome Pack">
          {anatomy.map(([number, title, body]) => (
            <li key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="principal-boundary">
        <div>
          <span className="panel-label">Agent capability</span>
          <p>Research · structure · classify · draft · build · test · document · monitor</p>
        </div>
        <div className="principal-diamond" aria-label="Human or legal principal approval boundary">
          <span>Human gate</span>
          <strong>Principal</strong>
        </div>
        <div>
          <span className="panel-label">Principal authority</span>
          <p>Price · contract · credentials · customer send · production · money · acceptance</p>
        </div>
      </div>
    </section>
  )
}
