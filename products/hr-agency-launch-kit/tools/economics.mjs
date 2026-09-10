import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const numericFields = [
  'clients', 'feePerClient', 'humanHoursPerClient', 'hourlyCost',
  'variableToolCostPerClient', 'fixedToolCost', 'acquisitionCost',
  'allocatedSetupCost', 'refundFraction', 'processingFraction',
  'availableHours', 'deliveryFraction',
]
const allowedFields = new Set(['id', 'currency', ...numericFields])
const money = (n) => {
  if (!Number.isFinite(n) || Math.abs(n * 100) > Number.MAX_SAFE_INTEGER) {
    throw new Error('Calculated amount exceeds safe scenario precision')
  }
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function calculateEconomics(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Scenario must be an object')
  for (const key of Object.keys(input)) {
    if (!allowedFields.has(key)) throw new Error(`Unknown scenario field: ${key}`)
  }
  if (typeof input.id !== 'string' || !/^[a-z0-9-]{1,80}$/.test(input.id)) throw new Error('Invalid scenario id')
  if (typeof input.currency !== 'string' || !/^[A-Z]{3}$/.test(input.currency)) throw new Error('Use a three-letter currency')
  for (const key of numericFields) {
    if (typeof input[key] !== 'number' || !Number.isFinite(input[key]) || input[key] < 0) {
      throw new Error(`${key} must be a finite non-negative number`)
    }
  }
  if (!Number.isSafeInteger(input.clients)) throw new Error('clients must be a safe integer')
  for (const key of ['refundFraction', 'processingFraction', 'deliveryFraction']) {
    if (input[key] > 1) throw new Error(`${key} must be between zero and one`)
  }
  const gross = input.clients * input.feePerClient
  const refunds = gross * input.refundFraction
  const processing = gross * input.processingFraction
  const hours = input.clients * input.humanHoursPerClient
  const labor = hours * input.hourlyCost
  const variableTools = input.clients * input.variableToolCostPerClient
  const fixedCosts = input.fixedToolCost + input.acquisitionCost + input.allocatedSetupCost
  const net = gross - refunds - processing - labor - variableTools - fixedCosts
  const unit = input.feePerClient * (1 - input.refundFraction - input.processingFraction)
    - input.variableToolCostPerClient - input.humanHoursPerClient * input.hourlyCost
  const deliveryHours = input.availableHours * input.deliveryFraction
  const capacity = input.humanHoursPerClient > 0 ? Math.floor(deliveryHours / input.humanHoursPerClient) : null
  const breakEven = unit > 0 ? Math.ceil(fixedCosts / unit) : null
  if (![hours, deliveryHours].every(Number.isFinite)) throw new Error('Calculated hours must be finite')
  for (const value of [capacity, breakEven]) {
    if (value !== null && !Number.isSafeInteger(value)) throw new Error('Calculated client count exceeds safe precision')
  }
  const warnings = []
  if (hours > deliveryHours) warnings.push('Planned work exceeds available delivery hours')
  if (unit <= 0) warnings.push('Each additional client has non-positive contribution before fixed costs')
  if (breakEven !== null && capacity !== null && breakEven > capacity) warnings.push('Break-even exceeds modeled delivery capacity')
  if (input.humanHoursPerClient === 0) warnings.push('Human service time is zero; capacity cannot be inferred')
  return {
    id: input.id, currency: input.currency, synthetic: true,
    grossScenarioRevenue: money(gross), refundAllowance: money(refunds),
    processingAllowance: money(processing), humanHours: money(hours),
    laborCost: money(labor), variableToolCost: money(variableTools),
    fixedAndAcquisitionAndSetup: money(fixedCosts), contribution: money(net),
    contributionMargin: gross > 0 ? Math.round(net / gross * 10000) / 10000 : null,
    unitContributionBeforeFixed: money(unit), breakEvenClients: breakEven,
    availableDeliveryHours: money(deliveryHours), clientCapacity: capacity,
    overCapacity: hours > deliveryHours, warnings,
  }
}

export function modelScenarios(document) {
  if (!document || document.version !== '0.1.0' || !Array.isArray(document.scenarios) || !document.scenarios.length) {
    throw new Error('Expected version 0.1.0 and a non-empty scenarios array')
  }
  const ids = new Set()
  return document.scenarios.map((input) => {
    const base = calculateEconomics(input)
    if (ids.has(input.id)) throw new Error(`Duplicate scenario id: ${input.id}`)
    ids.add(input.id)
    return {
      base,
      doubleHumanTime: calculateEconomics({ ...input, humanHoursPerClient: input.humanHoursPerClient * 2 }),
      higherToolCost: calculateEconomics({ ...input, variableToolCostPerClient: input.variableToolCostPerClient * 1.5 }),
    }
  })
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage: node tools/economics.mjs examples/economics-scenarios.json')
    const document = JSON.parse(readFileSync(process.argv[2], 'utf8'))
    const results = modelScenarios(document)
    process.stdout.write(JSON.stringify({ notice: 'Synthetic scenario arithmetic; not earnings forecasts or vendor quotes. Tax and unentered overhead excluded.', results }, null, 2) + '\n')
  } catch (error) {
    process.stderr.write(`Scenario rejected: ${error instanceof Error ? error.message : 'Invalid input'}\n`)
    process.exitCode = 1
  }
}
