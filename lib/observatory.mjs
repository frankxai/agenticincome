/** Private-review catalog projection; never an authorization or publication grant. */
const SOURCE_CLASSES = new Set(['official_documentation', 'vendor_report', 'review_platform', 'estimate_provider', 'research'])
const BASES = new Set(['vendor_reported', 'platform_reported', 'modeled_estimate', 'documentation'])
const pick = (row, keys) => Object.fromEntries(keys.filter(key => row[key] !== undefined).map(key => [key, row[key]]))
function fail() { throw new Error('Invalid observatory snapshot') }
function publicUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) fail()
  let url
  try { url = new URL(value) } catch { fail() }
  const host = url.hostname.toLowerCase()
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash ||
      !host.includes('.') || /^[\d.]+$/.test(host) || host.includes(':') ||
      /(^|\.)(localhost|local|internal|test|invalid|example)$/.test(host) ||
      /\.(local|internal|localhost|test|invalid|example)$/.test(host)) fail()
  return url.href
}
function text(value) { if (typeof value !== 'string' || !value.trim() || value.length > 4096) fail(); return value }
function date(value) { if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value.slice(0, 10) + 'T00:00:00Z').toISOString().slice(0, 10) !== value.slice(0, 10)) fail(); return value }
// Preserve PostgreSQL sub-millisecond revisions instead of collapsing them via Date.parse.
function instant(value) {
  const fraction = value.match(/\.(\d+)(?:Z|[+-]\d{2}:?\d{2})$/)?.[1] ?? ''
  if (fraction.length > 9) fail()
  return BigInt(Date.parse(value)) * 1000000n + BigInt(fraction.slice(3).padEnd(6, '0'))
}
function index(rows, key) {
  if (!Array.isArray(rows) || rows.length > 10000) fail()
  const map = new Map()
  for (const row of rows) { if (!row || typeof row !== 'object' || Array.isArray(row)) fail(); const id = text(row[key]); if (map.has(id)) fail(); map.set(id, row) }
  return map
}

export function projectCatalog(input, filters = {}) {
  if (!input || typeof input !== 'object') fail()
  const asOf = date(input.as_of)
  const products = index(input.products, 'product_id')
  const sources = index(input.sources, 'source_id')
  const observations = index(input.observations, 'observation_id')
  const assessments = index(input.assessments, 'assessment_id')
  const publicSources = new Map()
  for (const [id, source] of sources) {
    if (!SOURCE_CLASSES.has(source.source_class)) continue
    const url = publicUrl(source.canonical_url)
    date(source.observed_at)
    if (source.published_at !== null && source.published_at !== undefined) { date(source.published_at); if (instant(source.published_at) > instant(asOf)) fail() }
    if (instant(source.observed_at) > instant(asOf) || !/^[a-f0-9]{64}$/.test(source.content_sha256)) fail()
    publicSources.set(id, { ...pick(source, ['source_id', 'title', 'observed_at', 'published_at', 'source_class', 'content_sha256']), canonical_url: url })
  }
  const byProduct = new Map([...products.keys()].map(id => [id, []]))
  for (const row of observations.values()) {
    if (!products.has(row.product_id) || !sources.has(row.source_id)) fail()
    if (!publicSources.has(row.source_id) || !BASES.has(row.basis)) continue
    if (row.value_numeric !== null && (typeof row.value_numeric !== 'number' || !Number.isFinite(row.value_numeric) || row.value_numeric < 0)) fail()
    if (row.unit === 'currency_minor' && (!/^[A-Z]{3}$/.test(row.currency) || (row.value_numeric !== null && !Number.isSafeInteger(row.value_numeric)))) fail()
    if (row.unit !== 'currency_minor' && row.currency !== null && row.currency !== undefined) fail()
    date(row.observed_at)
    if (instant(row.observed_at) > instant(asOf)) fail()
    byProduct.get(row.product_id).push(pick(row, ['observation_id', 'source_id', 'signal', 'basis', 'value_numeric', 'unit', 'currency', 'period_start', 'period_end', 'period_label', 'observed_at']))
  }
  const dimensionMaps = new Map([...products.keys()].map(id => [id, new Map()]))
  const rubricVersion = filters.rubric_version ?? 'v1'
  for (const row of assessments.values()) {
    if (!products.has(row.product_id)) fail()
    if (row.rubric_version !== rubricVersion) continue
    const dimensions = dimensionMaps.get(row.product_id)
    if (!Number.isFinite(row.weight) || row.weight <= 0 || row.weight > 1 || !['unknown', 'editorial', 'tested'].includes(row.state)) fail()
    if (row.source_id !== null && row.source_id !== undefined && !publicSources.has(row.source_id)) fail()
    if (row.state === 'unknown' ? row.score !== null : !Number.isFinite(row.score) || row.score < 0 || row.score > 5 || !publicSources.has(row.source_id)) fail()
    date(row.assessed_at)
    if (instant(row.assessed_at) > instant(asOf)) fail()
    // A dimension is a revisioned observation. Latest dated revision wins; ties fail.
    const old = dimensions.get(row.dimension)
    if (old && instant(old.assessed_at) === instant(row.assessed_at)) fail()
    if (!old || instant(row.assessed_at) > instant(old.assessed_at)) dimensions.set(row.dimension, row)
  }
  const result = []
  for (const product of products.values()) {
    if (product.review_state === 'archived') continue
    const canonicalUrl = publicUrl(product.canonical_url)
    const name = text(product.name), layer = text(product.layer), model = text(product.revenue_model)
    const job = text(product.customer_job)
    if (filters.layer && filters.layer !== layer) continue
    if (filters.model && filters.model !== model) continue
    if (filters.search && ![name, job, layer, model].join(' ').toLowerCase().includes(String(filters.search).toLowerCase())) continue
    const signals = byProduct.get(product.product_id)
    const dimensions = [...dimensionMaps.get(product.product_id).values()]
    const totalWeight = dimensions.reduce((sum, row) => sum + row.weight, 0)
    if (dimensions.length && Math.abs(totalWeight - 1) > 1e-8) fail()
    const coverage = dimensions.reduce((sum, row) => sum + (row.state !== 'unknown' ? row.weight : 0), 0)
    const tested = dimensions.reduce((sum, row) => sum + (row.state === 'tested' ? row.weight : 0), 0)
    const ids = new Set(signals.map(row => row.source_id))
    dimensions.filter(row => row.source_id).forEach(row => ids.add(row.source_id))
    const revenueClaim = signals.some(row => /(?:^|_)(?:arr|mrr|revenue|sales)(?:_|$)/.test(row.signal) && row.basis === 'vendor_reported')
    result.push({ product_id: product.product_id, name, canonical_url: canonicalUrl, layer, revenue_model: model, model_basis: 'editorial_classification_pending_pricing_audit', customer_job: job,
      revenue_evidence: revenueClaim ? 'vendor_reported' : 'unknown', verified_revenue_minor: null,
      rubric_version: rubricVersion, scored_coverage: Number(coverage.toFixed(8)), tested_coverage: Number(tested.toFixed(8)), overall_quality_score: null,
      dimensions: dimensions.map(row => pick(row, ['dimension', 'weight', 'score', 'state', 'source_id', 'assessed_at'])),
      signals, sources: [...ids].sort().map(id => publicSources.get(id)),
    })
  }
  result.sort((a, b) => a.name.localeCompare(b.name, 'en') || a.product_id.localeCompare(b.product_id))
  return { schema_version: 'ProductCatalogReview.v1', as_of: asOf, visibility: 'private_review', publication_approved: false,
    scope: 'Filtered external-product research; no customer records, portfolio goals or verified-sales claim.',
    total_products: products.size, matched_products: result.length, products: result }
}

export function catalogCsv(catalog) {
  const columns = ['visibility', 'publication_approved', 'product_id', 'name', 'canonical_url', 'layer', 'revenue_model', 'model_basis', 'customer_job', 'revenue_evidence', 'verified_revenue_minor', 'scored_coverage', 'tested_coverage', 'overall_quality_score', 'source_urls']
  const cell = value => { let s = value === null || value === undefined ? '' : String(value); if (/^[\s]*[=+\-@]/.test(s) || /^[\t\r\n]/.test(s)) s = "'" + s; return '"' + s.replaceAll('"', '""') + '"' }
  return columns.map(cell).join(',') + '\r\n' + catalog.products.map(p => columns.map(c => cell(c === 'source_urls' ? p.sources.map(s => s.canonical_url).join(' | ') : ['visibility', 'publication_approved'].includes(c) ? catalog[c] : p[c])).join(',')).join('\r\n') + '\r\n'
}
