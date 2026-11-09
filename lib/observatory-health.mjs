import { createHash } from 'node:crypto'
import { projectCatalog } from './observatory.mjs'

const DAY = 86400000
const CRITICAL = ['outcome_reliability', 'unit_economics', 'retention']
function timestamp(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || Number(value.slice(11, 13)) > 23 || Number(value.slice(14, 16)) > 59 || Number(value.slice(17, 19)) > 59 || !Number.isFinite(Date.parse(value)) || new Date(value.slice(0, 10)).toISOString().slice(0, 10) !== value.slice(0, 10)) throw new Error('Invalid audit time')
  return Date.parse(value)
}
const round = n => Number(n.toFixed(8))
/** Audits only the existing allowlisted projection. No credentials, network or publication grant. */
export function auditObservatory(input, options = {}) {
  const catalog = projectCatalog(input, options.filters)
  const auditAt = options.audit_at ?? catalog.as_of
  const now = timestamp(auditAt)
  if (now < timestamp(catalog.as_of)) throw new Error('Audit precedes snapshot')
  const freshnessDays = options.freshness_days ?? 30
  if (!Number.isInteger(freshnessDays) || freshnessDays < 1 || freshnessDays > 365) throw new Error('Invalid freshness policy')
  const sources = new Map(), observations = new Map()
  const products = catalog.products.map(product => {
    const stale = [], missing = [], incomplete = [], conflicts = [], groups = new Map()
    for (const source of product.sources) {
      sources.set(source.source_id, source)
      if (now - timestamp(source.observed_at) > freshnessDays * DAY) stale.push(source.source_id)
    }
    for (const dim of product.dimensions) if (dim.state === 'unknown') missing.push(dim.dimension)
    for (const row of product.signals) {
      observations.set(row.observation_id, row)
      const start = row.period_start ?? null, end = row.period_end ?? null
      if ((start === null) !== (end === null)) throw new Error('Partial period')
      if (start !== null) {
        const period = value => /^\d{4}-\d{2}-\d{2}$/.test(value) ? timestamp(value + 'T00:00:00Z') : timestamp(value)
        const startTime = period(start), endTime = period(end)
        if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || startTime > endTime || endTime > now) throw new Error('Invalid period')
      }
      // A run-rate is not a realized accounting period. Missing periods stay explicit.
      if (/(?:^|_)(?:arr|mrr|revenue|sales)(?:_|$)/.test(row.signal) && (start === null || end === null)) incomplete.push(row.observation_id)
      if (row.value_numeric !== null && start !== null && end !== null) {
        const key = JSON.stringify([row.signal, row.basis, row.unit, row.currency, start, end])
        const group = groups.get(key) ?? []; group.push(row); groups.set(key, group)
      }
    }
    for (const group of groups.values()) if (new Set(group.map(r => r.value_numeric)).size > 1) conflicts.push(group.map(r => r.observation_id).sort())
    const criticalMissing = CRITICAL.filter(name => !product.dimensions.some(d => d.dimension === name && d.state === 'tested'))
    const rankingEligible = product.scored_coverage >= .7 && !criticalMissing.length && product.sources.length > 0 && !stale.length && !conflicts.length
    const reasons = [!product.sources.length && 'missing_sources', stale.length && 'stale_sources', conflicts.length && 'conflicting_observations', criticalMissing.length && 'critical_dimensions_untested', product.scored_coverage < .7 && 'insufficient_coverage', incomplete.length && 'financial_period_unknown'].filter(Boolean)
    return { ...product, audit: { stale_source_ids: stale, unknown_dimensions: missing, critical_untested: criticalMissing, financial_period_unknown_ids: incomplete, conflicting_observation_ids: conflicts, ranking_eligible: rankingEligible, reasons } }
  })
  const mean = key => products.length ? round(products.reduce((sum, p) => sum + p[key], 0) / products.length) : null
  return { schema_version: 'ProductObservatoryHealth.v1', visibility: 'private_review', publication_approved: false, snapshot_as_of: catalog.as_of, audit_at: auditAt,
    policy: { freshness_days: freshnessDays, minimum_scored_coverage: .7, required_tested_dimensions: CRITICAL, interpretation: 'Editorial triage policy; eligibility is not verified commercial success.' },
    metrics: { products: products.length, sources: sources.size, observations: observations.size, stale_sources: [...sources.values()].filter(s => now - timestamp(s.observed_at) > freshnessDays * DAY).length, mean_scored_coverage: mean('scored_coverage'), mean_tested_coverage: mean('tested_coverage'), ranking_eligible_products: products.filter(p => p.audit.ranking_eligible).length, products_with_conflicts: products.filter(p => p.audit.conflicting_observation_ids.length).length, verified_revenue_minor: null },
    research_queue: products.filter(p => p.audit.reasons.length).map(p => ({ product_id: p.product_id, name: p.name, reasons: p.audit.reasons })).sort((a, b) => b.reasons.includes('conflicting_observations') - a.reasons.includes('conflicting_observations') || b.reasons.includes('stale_sources') - a.reasons.includes('stale_sources') || a.name.localeCompare(b.name, 'en')),
    products }
}
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
/** Accept raw authorized snapshots, never caller-supplied HTML or a prebuilt report. */
export function observatoryDashboard(input, options = {}) {
  const report = auditObservatory(input, options), m = report.metrics
  const script = "const q=document.querySelector('input');q.addEventListener('input',()=>{let n=0;document.querySelectorAll('article').forEach(a=>{a.hidden=!a.textContent.toLowerCase().includes(q.value.toLowerCase());if(!a.hidden)n++});document.querySelector('#matches').textContent=n+' matching products'});"
  const hash = createHash('sha256').update(script).digest('base64')
  const pct = n => n === null ? 'Unknown' : `${Math.round(n * 100)}%`
  const card = (value, label) => `<div class="metric"><strong>${escape(value)}</strong><span>${escape(label)}</span></div>`
  const rows = report.products.map(p => `<article><div class="row"><h2>${escape(p.name)}</h2><span>${escape(p.layer)}</span></div><p>${escape(p.customer_job)}</p><p class="muted">${escape(p.revenue_model)} · Revenue evidence: ${escape(p.revenue_evidence)}</p><div class="row"><label>Scored ${pct(p.scored_coverage)} <meter min="0" max="1" value="${p.scored_coverage}"></meter></label><label>Tested ${pct(p.tested_coverage)} <meter min="0" max="1" value="${p.tested_coverage}"></meter></label></div><p class="status">${p.audit.ranking_eligible ? 'Coverage gate met; commercial validation separate' : 'Research required'} · ${escape(p.audit.reasons.join(' · '))}</p><details><summary>Evidence and assessment gaps</summary><p>Unknown dimensions: ${escape(p.audit.unknown_dimensions.join(', ') || 'None')}</p><ul>${p.sources.map(s => `<li><a href="${escape(s.canonical_url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)}</a> · ${escape(s.source_class)} · observed ${escape(s.observed_at)}${p.audit.stale_source_ids.includes(s.source_id) ? ' · STALE' : ''}</li>`).join('')}</ul><p>${p.signals.length} source-linked observations. Overall quality and verified revenue remain unscored.</p></details></article>`).join('')
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'sha256-${hash}'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>Agentic Income · Evidence Observatory</title><style>*{box-sizing:border-box}body{margin:0;background:#05060a;color:#f1f3f9;font:16px/1.6 system-ui,sans-serif}main{max-width:1120px;margin:auto;padding:48px 24px}header{border-bottom:1px solid #293044;padding-bottom:28px}.eyebrow{color:#10b981;letter-spacing:.15em;font-size:12px}h1{font-size:clamp(32px,6vw,64px);line-height:1.1;max-width:850px;margin:20px 0}h2{font-size:23px;margin:0}.muted,span{color:#a5adc4}a{color:#5eead4}section{margin:28px 0}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.metric{background:#0a0c14;border:1px solid #293044;padding:20px}.metric strong{display:block;font-size:32px}.metric span{font-size:13px}.notice,.status{color:#fbbf24}.row{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}article{border-top:1px solid #293044;padding:24px 0}article[hidden]{display:none}input{width:100%;background:#0a0c14;color:#f1f3f9;border:1px solid #556078;border-radius:6px;padding:14px;font:inherit}meter{display:block;width:180px;height:18px}summary{cursor:pointer;color:#5eead4}details{padding:12px 0}footer{border-top:1px solid #293044;padding-top:20px;color:#a5adc4}input:focus-visible,summary:focus-visible,a:focus-visible{outline:3px solid #10b981;outline-offset:4px}@media(max-width:650px){.metrics{grid-template-columns:repeat(2,1fr)}main{padding:28px 18px}}@media print{body{background:white;color:black}input{display:none}details{display:block}.metric{background:white;color:black}}</style></head><body><main><header><div class="eyebrow">AGENTIC INCOME / PRODUCT INTELLIGENCE</div><h1>Evidence before rankings.</h1><p>Inspect product layers, research coverage and the work required to support stronger decisions.</p><p class="notice">Private review · publication unapproved · Snapshot ${escape(report.snapshot_as_of)} · Audit ${escape(report.audit_at)}</p></header><section class="metrics" aria-label="Evidence metrics">${card(m.products, 'Products in scope')}${card(m.sources, 'Distinct linked sources')}${card(m.observations, 'Observations')}${card(pct(m.mean_tested_coverage), 'Mean tested coverage')}${card(m.stale_sources, `Sources older than ${report.policy.freshness_days} days`)}${card(m.ranking_eligible_products, 'Products meeting ranking gate')}${card(pct(m.mean_scored_coverage), 'Mean scored coverage')}${card('Unknown', 'Verified revenue')}</section><p>Goals: dated source lineage for every product; at least 70% weighted coverage and tested outcomes, economics and retention before ranking. These are operating policies, not success probabilities.</p><section><label for="search">Filter by product, layer, model or evidence</label><input id="search" type="search" placeholder="Search the catalog…"><p id="matches" role="status">${m.products} matching products</p>${rows}</section><footer>No live connection, credentials, external fonts or tracking. Source freshness measures retrieval age; it does not establish truth. Revenue claims, reviews and tested outcomes remain separate.</footer></main><script>${script}</script></body></html>`
}
