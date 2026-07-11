const BASE = 'https://github.com/frankxai/agenticincome/blob/main/knowledge'

const FILES = [
  ['01', 'The Agent Landscape', 'Claude Code, Codex, OpenClaw (and its security reality), Hermes, MCP — what to use for what, right now.', '01-landscape.md'],
  ['02', 'Income Models', 'Services → products → systems: real economics and the one path through them.', '02-income-models.md'],
  ['03', 'Agent Fulfillment', 'The five delivery patterns, quality floors, and the two-day sprint anatomy.', '03-agent-fulfillment.md'],
  ['04', 'The Tool Stack', 'Merchant of record, email, web, analytics, agents — the legal-light minimum machine.', '04-tool-stack.md'],
  ['05', 'Honest Marketing', 'Selling without income claims: the FTC/EU floor and the voice that converts by showing machinery.', '05-honest-marketing.md'],
  ['06', 'Attested Cases', 'Proof with provenance — dated, costed, consent-backed. Fewer, heavier, verifiable.', '06-cases.md'],
  ['07', 'Field Dossier', 'The raw verified research: runtime states, affiliate terms, MoR fees, market stats — every claim sourced.', '07-field-dossier.md'],
] as const

export function KnowledgeIndex() {
  return (
    <section className="section-band" id="knowledge">
      <div className="section-heading motion-reveal">
        <div className="kicker text-[color:var(--color-accent-2)]">Knowledge base · education</div>
        <h2 className="display-h2">Factual, dated, <span className="text-[color:var(--color-accent-2)]">re-verified on a loop.</span></h2>
        <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
          Every file carries <code className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-1.5 py-0.5 font-mono text-[0.8em]">last_verified</code> frontmatter
          and a quarterly review cycle. Stale facts are bugs; the refresh loop files them. Free on GitHub, forever.
        </p>
      </div>

      <div className="mt-8 motion-reveal">
        {FILES.map(([n, title, desc, file]) => (
          <a key={n} href={`${BASE}/${file}`} rel="noopener" className="kb-row">
            <span className="kb-n">{n}</span>
            <span>
              <span className="kb-title">{title}</span>
              <span className="kb-desc block">{desc}</span>
            </span>
            <span className="kchip kchip-live">verified 2026-07-11</span>
          </a>
        ))}
      </div>
    </section>
  )
}
