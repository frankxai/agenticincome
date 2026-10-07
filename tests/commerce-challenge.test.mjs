import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import test from 'node:test'
import { parseChallengeLedger, submissionScore, checkpointDueAt } from '../lib/challenge-ledger.ts'

const source = JSON.parse(readFileSync(new URL('../data/commerce-challenge.json', import.meta.url), 'utf8'))
const copy = () => structuredClone(source)

test('all competitors begin unrun and unscored under one shared budget', () => {
  const ledger = parseChallengeLedger(copy())
  assert.equal(ledger.startAt, null)
  assert.equal(ledger.round.timeBudgetMinutes, 60)
  assert.equal(ledger.round.runtimeBudgetEur, 10)
  assert.equal(ledger.round.spendingAuthorized, false)
  assert.equal(ledger.submissions.length, 8)
  for (const item of ledger.submissions) {
    assert.equal(item.status, 'not_run')
    assert.equal(submissionScore(item, ledger.rubric), null)
    assert.equal(item.modelVersion, null)
  }
})

test('no score, cost or completion may be attached to an unrun competitor', () => {
  for (const field of ['elapsedMinutes', 'runtimeCostEur']) {
    const ledger = copy()
    ledger.submissions[0][field] = 0
    assert.throws(() => parseChallengeLedger(ledger))
  }
  const ledger = copy()
  ledger.submissions[0].score = { buyer_value: 5, working_delivery: 5, evidence_integrity: 5, experience: 5, economics: 5 }
  assert.throws(() => parseChallengeLedger(ledger))
})

test('reviewed scores require the exact model, evidence, times and cost', () => {
  const ledger = copy()
  ledger.startAt = '2026-10-07T20:00:00Z'
  ledger.round.status = 'review'
  ledger.round.baselineRevision = 'a'.repeat(40)
  const item = ledger.submissions[0]
  Object.assign(item, { status: 'reviewed', ethicalReview: 'pass', baselineRevision: ledger.round.baselineRevision, toolAccessVerified: true, review: { maker: 'Maker', reviewer: 'Independent reviewer', reviewedAt: '2026-10-07T21:10:00Z', receipt: { label: 'Review receipt', href: '/downloads/test-receipt.md' } }, modelVersion: 'recorded-test-model', startedAt: '2026-10-07T20:00:00Z', completedAt: '2026-10-07T21:00:00Z', elapsedMinutes: 60, runtimeCostEur: 2, evidence: [{ label: 'Review receipt', href: '/downloads/test-receipt.md' }], score: { buyer_value: 5, working_delivery: 4, evidence_integrity: 5, experience: 3, economics: 4 } })
  const parsed = parseChallengeLedger(ledger)
  assert.equal(submissionScore(parsed.submissions[0], parsed.rubric), 86)
  item.ethicalReview = 'fail'
  assert.throws(() => parseChallengeLedger(ledger))
  item.ethicalReview = 'pass'
  item.runtimeCostEur = 11
  assert.throws(() => parseChallengeLedger(ledger))
  item.runtimeCostEur = 2
  item.elapsedMinutes = 1
  assert.throws(() => parseChallengeLedger(ledger))
  item.elapsedMinutes = 60
  ledger.startAt = null
  assert.throws(() => parseChallengeLedger(ledger))
  ledger.startAt = '2026-10-07T20:00:00Z'
  item.review.reviewer = 'Maker'
  assert.throws(() => parseChallengeLedger(ledger))
  item.review.reviewer = 'Independent reviewer'
  item.baselineRevision = 'b'.repeat(40)
  assert.throws(() => parseChallengeLedger(ledger))
  item.baselineRevision = ledger.round.baselineRevision
  item.evidence = []
  assert.throws(() => parseChallengeLedger(ledger))
})

test('public evidence refuses credentials, query data and executable URLs', () => {
  for (const href of ['javascript:alert(1)', 'https://user:password@example.org/evidence', 'https://example.org/evidence?email=private', '/downloads/../private.json']) {
    const ledger = copy()
    ledger.round.evidence = [{ label: 'Unsafe receipt', href }]
    assert.throws(() => parseChallengeLedger(ledger))
  }
})

test('checkpoints cannot claim verification without evidence or begin without a clock', () => {
  const ledger = copy()
  ledger.checkpoints[0].state = 'verified'
  assert.throws(() => parseChallengeLedger(ledger))
  ledger.checkpoints[0].state = 'planned'
  ledger.round.status = 'in_progress'
  assert.throws(() => parseChallengeLedger(ledger))
  assert.equal(checkpointDueAt(null, 1), null)
  assert.equal(checkpointDueAt('2026-10-07T21:00:00Z', 12), '2026-10-08T09:00:00.000Z')
  assert.equal(checkpointDueAt('2026-10-07T21:00:00Z', null), null)
})

test('each downloadable model prompt contains the identical shared protocol', () => {
  const brief = readFileSync(new URL('../public/downloads/ai-shop-challenge/brief.md', import.meta.url), 'utf8')
  for (const item of source.submissions) {
    const path = new URL(`../public${item.promptPath}`, import.meta.url)
    assert.ok(existsSync(path))
    assert.ok(readFileSync(path, 'utf8').endsWith(brief))
  }
})
