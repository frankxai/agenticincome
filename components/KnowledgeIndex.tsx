const FILES = [
  ['01', 'The Agent Landscape', 'Claude Code, Codex, OpenClaw (and its security reality), Hermes, MCP — what to use for what, right now.'],
  ['02', 'Income Models', 'Services → products → systems: real economics and the one path through them.'],
  ['03', 'Agent Fulfillment', 'The five delivery patterns, quality floors, and the two-day sprint anatomy.'],
  ['04', 'The Tool Stack', 'Merchant of record, email, web, analytics, agents — the legal-light minimum machine.'],
  ['05', 'Honest Marketing', 'Selling without income claims: the FTC/EU floor and the voice that converts by showing machinery.'],
  ['06', 'Attested Cases', 'Proof with provenance — dated, costed, consent-backed. Fewer, heavier, verifiable.'],
  ['07', 'Field Dossier', 'The raw verified research: runtime states, affiliate terms, MoR fees, market stats — every claim sourced.'],
] as const

export function KnowledgeIndex() {
  return (
    <section className="section-band" id="knowledge">
      <div className="section-heading motion-reveal">
        <div className="kicker text-[color:var(--color-accent-2)]">Knowledge base · education</div>
        <h2 className="display-h2">Factual, dated, <span className="text-[color:var(--color-accent-2)]">re-verified on a loop.</span></h2>
        <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
          These editorial research tracks are maintained as part of the site. The reusable operating
          skill, schema, validator, scaffold, and reference system are public in the MIT repository.
        </p>
      </div>

      <div className="mt-8 motion-reveal">
        {FILES.map(([n, title, desc]) => (
          <div key={n} className="kb-row">
            <span className="kb-n">{n}</span>
            <span>
              <span className="kb-title">{title}</span>
              <span className="kb-desc block">{desc}</span>
            </span>
            <span className="kchip kchip-live">site research</span>
          </div>
        ))}
      </div>

      <a
        href="https://github.com/frankxai/agentic-income-skills"
        target="_blank"
        rel="noopener noreferrer"
        className="cta-secondary mt-6"
      >
        Inspect the public operating system
      </a>
    </section>
  )
}
