import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { calculateEconomics } from './economics.mjs'

export const catalog = JSON.parse(readFileSync(new URL('../studio/catalog.json', import.meta.url), 'utf8'))
const controlNames = catalog.architectures.at(-1).requiredControls
const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)
const fail = (message) => { throw new Error(message) }
const object = (value, keys, label) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be an object`)
  for (const key of Object.keys(value)) if (!keys.includes(key)) fail(`Unknown ${label} field: ${key}`)
}
const integer = (value, min, max, label) => {
  if (!Number.isSafeInteger(value) || value < min || value > max) fail(`${label} must be an integer from ${min} to ${max}`)
}
const text = (value, label) => {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,159}$/.test(value)) fail(`${label} must be an opaque identifier (no names or free text)`)
}
const date = (value, label) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) fail(`${label} must be a real YYYY-MM-DD date`)
  return Date.parse(value)
}
const money = n => Math.round((n + Number.EPSILON) * 100) / 100
const lookup = (items, id, label) => items.find(item => item.id === id) ?? fail(`Unknown ${label}: ${id}`)

// This checks submitted evidence consistency. It does not authenticate evidence or award certification.
export function assessQuality(input) {
  object(input, ['version', 'scopeId', 'workflowVersion', 'asOf', 'evidence'], 'quality')
  if (input.version !== '0.2.0') fail('Unsupported quality version')
  text(input.scopeId, 'scopeId'); text(input.workflowVersion, 'workflowVersion')
  const today = date(input.asOf, 'asOf')
  if (!Array.isArray(input.evidence) || input.evidence.length > 200) fail('evidence must contain at most 200 records')
  const seen = new Set()
  const records = input.evidence.map(e => {
    object(e, ['id', 'scopeId', 'workflowVersion', 'kind', 'reviewerRef', 'independent', 'synthetic', 'checkedAt', 'sampleSize', 'accepted', 'materialErrors', 'criticalIncidents', 'evidenceRef'], 'evidence')
    for (const key of ['id', 'scopeId', 'workflowVersion', 'reviewerRef', 'evidenceRef']) text(e[key], key)
    if (seen.has(e.id)) fail(`Duplicate evidence id: ${e.id}`)
    seen.add(e.id)
    if (!['review', 'benchmark', 'live'].includes(e.kind)) fail('Unknown evidence kind')
    if (typeof e.independent !== 'boolean' || typeof e.synthetic !== 'boolean') fail('Evidence flags must be booleans')
    for (const key of ['sampleSize', 'accepted', 'materialErrors', 'criticalIncidents']) integer(e[key], 0, 1000000, key)
    if (e.accepted > e.sampleSize || e.materialErrors > e.sampleSize) fail('Evidence counts exceed sample size')
    if (e.accepted + e.materialErrors > e.sampleSize) fail('Accepted and materially incorrect cases must be disjoint')
    const checked = date(e.checkedAt, 'checkedAt')
    if (checked > today) fail('Evidence cannot come from the future')
    return { ...e, ageDays: (today - checked) / 86400000,
      relevant: e.scopeId === input.scopeId && e.workflowVersion === input.workflowVersion }
  })
  const matching = records.filter(e => e.relevant)
  const current = matching.filter(e => e.ageDays <= 30)
  const reasons = []
  let rank = 'Q0'
  const critical = matching.some(e => e.criticalIncidents > 0)
  // An unresolved historical incident must not disappear merely because the record aged out.
  if (critical) reasons.push('A matching record reports a critical incident; specialist closure and a new workflow version are required.')
  if (!critical && current.some(e => e.sampleSize >= 1 && e.accepted === e.sampleSize && e.materialErrors === 0)) rank = 'Q1'
  const benchmark = current.filter(e => e.kind === 'benchmark' && e.independent && e.sampleSize >= 20 && e.accepted / e.sampleSize >= 0.95 && e.materialErrors === 0)
  if (!critical && benchmark.length) rank = 'Q2'
  const live = current.filter(e => e.kind === 'live' && !e.synthetic && e.independent && e.sampleSize >= 30 && e.accepted / e.sampleSize >= 0.95 && e.materialErrors === 0)
  if (rank === 'Q2' && live.length) rank = 'Q3'
  if (!current.length) reasons.push('No current evidence matches this exact scope and workflow version.')
  if (current.some(e => e.materialErrors > 0)) {
    rank = 'Q0'
    reasons.push('Current material errors need correction and a fresh evaluation before a quality level is assigned.')
  }
  return { rank, scopeId: input.scopeId, workflowVersion: input.workflowVersion, asOf: input.asOf,
    meaning: { Q0: 'Unverified', Q1: 'Reviewed sample', Q2: 'Independently benchmarked sample', Q3: 'Benchmark plus monitored live sample' }[rank],
    evidenceStatus: 'Self-supplied records; authenticity and reviewer independence are not verified by this tool.',
    currentEvidenceIds: current.map(e => e.id), excludedEvidenceIds: records.filter(e => !e.relevant || e.ageDays > 30).map(e => e.id),
    syntheticOnly: !current.some(e => !e.synthetic), criticalIncident: critical, reasons }
}

export function configureAgency(input) {
  object(input, ['version', 'engagementId', 'serviceId', 'architectureId', 'humanLevel', 'requestedAutonomy', 'qualityTarget', 'asOf', 'controls', 'quality', 'economics'], 'configuration')
  if (input.version !== '0.2.0') fail('Unsupported configuration version')
  if (typeof input.engagementId !== 'string' || !/^[a-z0-9-]{1,80}$/.test(input.engagementId)) fail('engagementId must be 1–80 lowercase letters, digits or hyphens')
  date(input.asOf, 'asOf')
  const service = lookup(catalog.services, input.serviceId, 'service')
  const architecture = lookup(catalog.architectures, input.architectureId, 'architecture')
  const human = lookup(catalog.humanLevels, input.humanLevel, 'human level')
  integer(input.requestedAutonomy, 0, 4, 'requestedAutonomy')
  if (!['Q1', 'Q2', 'Q3'].includes(input.qualityTarget)) fail('qualityTarget must be Q1, Q2 or Q3')
  object(input.controls, controlNames, 'controls')
  for (const [name, value] of Object.entries(input.controls)) {
    object(value, ['status', 'evidenceRef', 'checkedAt'], `control ${name}`)
    if (!['verified', 'unknown', 'failed'].includes(value.status)) fail('Unknown control status')
    if (own(value, 'evidenceRef')) text(value.evidenceRef, 'evidenceRef')
    if (own(value, 'checkedAt') && date(value.checkedAt, 'checkedAt') > date(input.asOf, 'asOf')) fail('Control check cannot come from the future')
    if (value.status === 'verified' && (!value.evidenceRef || !value.checkedAt)) fail('Verified controls require evidenceRef and checkedAt')
  }
  const quality = assessQuality(input.quality)
  if (quality.scopeId !== input.serviceId || quality.asOf !== input.asOf) fail('Quality scope and asOf must match configuration')
  const missingControls = architecture.requiredControls.filter(name => {
    const c = input.controls[name]
    return !c || c.status !== 'verified' || (date(input.asOf, 'asOf') - date(c.checkedAt, 'checkedAt')) / 86400000 > 30
  })
  const warnings = []
  let effective = Math.min(input.requestedAutonomy, architecture.maxAutonomy)
  if (effective >= 2 && (missingControls.length || quality.rank === 'Q0')) effective = 1
  if (effective >= 3 && !['Q2', 'Q3'].includes(quality.rank)) effective = 2
  if (effective === 4 && quality.rank !== 'Q3') effective = 3
  if (quality.criticalIncident) effective = 0
  if (missingControls.length) warnings.push(`Unverified or stale architecture controls: ${missingControls.join(', ')}`)
  if (effective < input.requestedAutonomy) warnings.push(`Requested A${input.requestedAutonomy}; evidence and architecture currently support at most proposed A${effective}.`)
  if (quality.rank < input.qualityTarget) warnings.push(`Target ${input.qualityTarget} is not yet supported; current submitted evidence is ${quality.rank}.`)
  object(input.economics, ['engagements', 'hourlyCost', 'fixedMonthlyCost', 'acquisitionCost', 'allocatedSetupCost', 'availableHours', 'deliveryFraction', 'refundFraction', 'processingFraction', 'qualityReviewHours', 'contingencyFraction'], 'economics')
  integer(input.economics.engagements, 1, 10000, 'engagements')
  for (const [key, value] of Object.entries(input.economics)) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100000000) fail(`Invalid economics ${key}`)
  }
  for (const key of ['hourlyCost', 'fixedMonthlyCost', 'acquisitionCost', 'allocatedSetupCost', 'availableHours', 'deliveryFraction', 'refundFraction', 'processingFraction', 'qualityReviewHours', 'contingencyFraction']) {
    if (!own(input.economics, key)) fail(`Missing economics ${key}`)
  }
  for (const key of ['deliveryFraction', 'refundFraction', 'processingFraction', 'contingencyFraction']) if (input.economics[key] > 1) fail(`${key} must be at most one`)
  if (input.economics.refundFraction + input.economics.processingFraction >= 1) fail('Refund and processing fractions leave no revenue for delivery')
  const idx = human.index
  const humanHours = service.hours[idx] + input.economics.qualityReviewHours
  const model = {
    id: input.engagementId, currency: 'USD', clients: input.economics.engagements,
    feePerClient: service.fees[idx], humanHoursPerClient: humanHours,
    hourlyCost: input.economics.hourlyCost, variableToolCostPerClient: service.tools,
    fixedToolCost: input.economics.fixedMonthlyCost, acquisitionCost: input.economics.acquisitionCost,
    allocatedSetupCost: input.economics.allocatedSetupCost,
    refundFraction: input.economics.refundFraction, processingFraction: input.economics.processingFraction,
    availableHours: input.economics.availableHours, deliveryFraction: input.economics.deliveryFraction,
  }
  const base = calculateEconomics(model)
  const stress = calculateEconomics({ ...model, humanHoursPerClient: humanHours * 2 })
  const reserve = money((base.laborCost + base.variableToolCost + base.fixedAndAcquisitionAndSetup) * input.economics.contingencyFraction)
  const net = money(base.contribution - reserve)
  warnings.push(...base.warnings)
  if (net < 0) warnings.push('The stated fee does not cover the entered costs and reserve; rescope or reprice before proposing it.')
  const workflowPlan = service.workflowIds.map(id => {
    const w = lookup(catalog.workflows, id, 'workflow')
    const level = Math.min(effective, w.maxAutonomy)
    const humanRequired = ['financial', 'employment-decision', 'human-practice'].includes(w.kind)
    return { ...w, proposedAutonomy: `A${level}`,
      mode: humanRequired ? 'human-led decision; preparation only' : level === 0 ? 'manual' : level === 1 ? 'draft or read only' : level === 2 ? 'approve each external change' : 'bounded preauthorization; exceptions require review',
      approval: w.kind === 'external-message' ? 'Exact audience and message approval, consent/objection check, send cap and expiry; new content reopens review.' : humanRequired ? 'Named human retains the decision.' : 'Agency policy, resource scope and budget must be authenticated outside this tool.',
      executionEnabled: false }
  })
  return { productId: catalog.productId, version: catalog.version, engagementId: input.engagementId,
    service: { id: service.id, name: service.name, unit: service.unit, cap: service.cap, outcomes: service.outcomes, humanWork: service.humanExtras[idx], qualityReview: service.qualityReview },
    architecture, humanLevel: human.id, requestedAutonomy: `A${input.requestedAutonomy}`, proposedAutonomy: `A${effective}`,
    authorityStatus: 'Planning assessment only. No authenticated permission, live connection or execution is created.',
    quality, qualityTarget: input.qualityTarget, missingControls, workflowPlan,
    price: { currency: 'USD', feeHypothesis: service.fees[idx], basis: service.unit, tax: 'Excluded', thirdPartyCosts: 'Travel, venue, specialist subscriptions and unscoped human delivery excluded.', humanHoursPerEngagement: humanHours },
    economics: { base, doubleHumanTime: stress, contingencyReserve: reserve, contributionAfterReserve: net,
      notice: 'Synthetic scenario, not a quote, earnings forecast or vendor cost. Autonomy does not automatically reduce human hours.' }, warnings }
}

export function renderOffer(plan) {
  const s = plan.service
  return `# ${s.name}\n\nReview draft · ${plan.engagementId} · Product ${plan.version}\n\n` +
    `## Scope and fee\n\n${s.cap}\n\nFee hypothesis: USD ${plan.price.feeHypothesis.toLocaleString('en-US')} before tax per ${s.unit}. ${plan.price.thirdPartyCosts}\n\n` +
    `## Included outcomes\n\n${s.outcomes.map(x => `- ${x}`).join('\n')}\n\n` +
    `## Human service\n\n${s.humanWork}\n\nBudget: ${plan.price.humanHoursPerEngagement} hours including entered quality review. Additional work requires a revised scope.\n\n` +
    `## Automation and quality\n\n${plan.architecture.name}; requested ${plan.requestedAutonomy}; proposed ${plan.proposedAutonomy}. ${plan.authorityStatus}\n\nTarget ${plan.qualityTarget}; submitted evidence ${plan.quality.rank} (${plan.quality.meaning}). ${plan.quality.evidenceStatus}\n\n${s.qualityReview}\n\n` +
    `## Acceptance and review\n\nClient and practitioner agree the artifact rubric before work starts. Record acceptance, corrections, active minutes, cost and due outcomes. No hire, health, revenue or retention result is guaranteed. Candidate human contact and participation alternatives remain available.\n\n` +
    `## Decisions before sending\n\n${plan.warnings.map(w => `- ${w}`).join('\n') || '- Confirm the client-specific terms and acceptance rubric.'}\n- Name contracting parties, delivery owner, support route, currency/tax handling and payment schedule.\n- Agree confidentiality, retention, change control, cancellation and remedies.\n- A human must approve this client-specific offer before it is sent.\n`
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [, , command, file] = process.argv
    if (command === 'catalog' && process.argv.length === 3) process.stdout.write(JSON.stringify(catalog, null, 2) + '\n')
    else if (['configure', 'offer', 'assess'].includes(command) && process.argv.length === 4) {
      const input = JSON.parse(readFileSync(file, 'utf8'))
      const result = command === 'assess' ? assessQuality(input) : configureAgency(input)
      process.stdout.write(command === 'offer' ? renderOffer(result) : JSON.stringify(result, null, 2) + '\n')
    } else fail('Usage: node tools/agency.mjs catalog | configure <config.json> | offer <config.json> | assess <quality.json>')
  } catch (error) {
    process.stderr.write(`Agency configuration rejected: ${error instanceof Error ? error.message : 'Invalid input'}\n`)
    process.exitCode = 1
  }
}
