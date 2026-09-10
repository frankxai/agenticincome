import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { calculateEconomics, modelScenarios } from './economics.mjs'

const document = JSON.parse(readFileSync(new URL('../examples/economics-scenarios.json', import.meta.url), 'utf8'))
const example = document.scenarios[0]

test('worked service scenarios account for review, fees, refunds, setup and acquisition', () => {
  const results = modelScenarios(document)
  assert.deepEqual(results.map(r => r.base.contribution), [585, 2415, 3400])
  assert.deepEqual(results.map(r => r.base.clientCapacity), [10, 5, 2])
  assert.equal(results[0].base.breakEvenClients, 3)
  assert.equal(results[0].base.contributionMargin, 0.13)
})

test('doubling human time exposes losses and delivery overcommitment', () => {
  const results = modelScenarios(document)
  assert.deepEqual(results.map(r => r.doubleHumanTime.contribution), [-1215, -2385, -4100])
  assert.equal(results[2].doubleHumanTime.overCapacity, true)
  assert.equal(results[2].base.overCapacity, false)
  assert.ok(results[2].doubleHumanTime.warnings.length > 0)
})

test('zero clients preserves fixed costs and does not invent a margin', () => {
  const result = calculateEconomics({ ...example, clients: 0 })
  assert.equal(result.contribution, -1350)
  assert.equal(result.contributionMargin, null)
})

test('non-positive unit contribution cannot claim a break-even volume', () => {
  const result = calculateEconomics({ ...example, feePerClient: 100 })
  assert.equal(result.breakEvenClients, null)
  assert.ok(result.contribution < 0)
})

test('zero human time is visible rather than an infinite-capacity promise', () => {
  const result = calculateEconomics({ ...example, humanHoursPerClient: 0 })
  assert.equal(result.clientCapacity, null)
  assert.match(result.warnings.join(' '), /Human service time is zero/)
})

test('invalid and misspelled assumptions fail closed', () => {
  for (const changes of [
    { clients: 1.5 }, { clients: -1 }, { hourlyCost: Infinity },
    { feePerClient: '1500' }, { refundFraction: 1.01 },
    { deliveryFraction: -0.1 }, { currency: 'usd' }, { reviewHours: 10 },
  ]) assert.throws(() => calculateEconomics({ ...example, ...changes }))
  assert.throws(() => calculateEconomics({ ...example, clients: Number.MAX_SAFE_INTEGER, feePerClient: 1e12 }))
  assert.throws(() => modelScenarios({ version: '0.1.0', scenarios: [example, example] }))
})

test('CLI produces usable JSON from the distributed example', () => {
  const script = fileURLToPath(new URL('./economics.mjs', import.meta.url))
  const input = fileURLToPath(new URL('../examples/economics-scenarios.json', import.meta.url))
  const result = spawnSync(process.execPath, [script, input], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(result.stdout).results.length, 3)
})
