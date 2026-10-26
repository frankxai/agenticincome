import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import test from 'node:test'

import {
  AGENT_JOB_TIERS,
  CREDIT_BONUS_LADDER,
  estimateMonthlyAgentWorkload,
  evaluateCreditLadderSelection,
} from '../lib/income-graph/index.ts'
import { getPost } from '../lib/posts.ts'

// Resolve @/data/programs.json so lib/affiliate.ts can be imported directly under node --test
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@/data/programs.json') {
      const target = pathToFileURL(path.join(process.cwd(), 'data', 'programs.json')).href
      return { url: target, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.endsWith('/data/programs.json')) {
      const raw = readFileSync(new URL(url), 'utf8')
      return {
        format: 'module',
        source: `export default ${raw}`,
        shortCircuit: true,
      }
    }
    return nextLoad(url, context)
  },
})

const { findProgram, getLink, verifiedEconomicsPrograms } = await import('../lib/affiliate.ts')

test('CREDIT_BONUS_LADDER matches the 9-tier progressive commitment schedule', () => {
  assert.equal(CREDIT_BONUS_LADDER.length, 9)
  const expected = [
    [20, 20, 0],
    [50, 55, 10],
    [100, 115, 15],
    [200, 240, 20],
    [500, 625, 25],
    [1000, 1300, 30],
    [2000, 2700, 35],
    [5000, 7000, 40],
    [10000, 14500, 45],
  ]

  for (let i = 0; i < expected.length; i++) {
    const [price, credits, bonusPct] = expected[i]
    const tier = CREDIT_BONUS_LADDER[i]
    assert.equal(tier.monthlyPriceUsd, price)
    assert.equal(tier.effectiveCreditsUsd, credits)
    assert.equal(tier.bonusPercent, bonusPct)
    assert.equal(tier.bonusCreditsUsd, credits - price)
    assert.ok(tier.effectiveCostPerCreditUsd <= 1 && tier.effectiveCostPerCreditUsd > 0.68)
  }
})

test('AGENT_JOB_TIERS defines the 3 outcome-anchored workload complexity bands', () => {
  assert.deepEqual(
    AGENT_JOB_TIERS.map((t) => t.id),
    ['quick-task', 'deep-work', 'run-your-business'],
  )
  assert.equal(AGENT_JOB_TIERS[0].creditBandLabel, '$1–$5')
  assert.equal(AGENT_JOB_TIERS[1].creditBandLabel, '$5–$45')
  assert.equal(AGENT_JOB_TIERS[2].creditBandLabel, '$50–$200+/day')
})

test('evaluateCreditLadderSelection computes capacity ranges and snaps non-exact tiers', () => {
  const exact200 = evaluateCreditLadderSelection(200)
  assert.equal(exact200.exactTierMatch, true)
  assert.equal(exact200.monthlyPriceUsd, 200)
  assert.equal(exact200.effectiveCreditsUsd, 240)
  assert.equal(exact200.bonusCreditsUsd, 40)
  assert.equal(exact200.bonusPercent, 20)
  assert.deepEqual(exact200.estimatedCapacityByTier['quick-task'], {
    minJobs: 48,
    midpointJobs: 80,
    maxJobs: 240,
  })
  assert.deepEqual(exact200.estimatedCapacityByTier['deep-work'], {
    minJobs: 5,
    midpointJobs: 9,
    maxJobs: 48,
  })
  assert.deepEqual(exact200.estimatedCapacityByTier['run-your-business'], {
    minDays: 1,
    midpointDays: 1,
    maxDays: 4,
  })

  const snapped = evaluateCreditLadderSelection(150)
  assert.equal(snapped.exactTierMatch, false)
  assert.equal(snapped.selectedTier.monthlyPriceUsd, 200)
  assert.ok(snapped.assumptions[0].includes('snapped to the $200/mo ladder tier'))
})

test('estimateMonthlyAgentWorkload calculates low/midpoint/high credit demand and recommends the lowest covering tier', () => {
  // 10 quick tasks ($10/$30/$50) + 4 deep work ($20/$100/$180) + 1 business day ($50/$125/$200)
  // Total: low = $80, midpoint = $255, high = $430
  // Lowest tier covering $255 midpoint is $500/mo -> $625 effective credits
  const est = estimateMonthlyAgentWorkload({
    quickTasksPerMonth: 10,
    deepWorkPerMonth: 4,
    businessDaysPerMonth: 1,
  })

  assert.equal(est.lowCreditsUsd, 80)
  assert.equal(est.midpointCreditsUsd, 255)
  assert.equal(est.highCreditsUsd, 430)
  assert.equal(est.recommendedTier.monthlyPriceUsd, 500)
  assert.equal(est.recommendedTier.effectiveCreditsUsd, 625)
  assert.equal(est.unutilizedMidpointCreditsUsd, 370)
  assert.equal(est.exceedsSingleLadderMax, false)
  assert.ok(est.assumptions.some((a) => a.includes('makes no claim or forecast about client acquisition or revenue')))
})

test('estimateMonthlyAgentWorkload flags demand exceeding the $10,000/mo top tier', () => {
  const highVolume = estimateMonthlyAgentWorkload({
    quickTasksPerMonth: 100,
    deepWorkPerMonth: 100,
    businessDaysPerMonth: 100,
  })
  assert.equal(highVolume.midpointCreditsUsd, 300 + 2500 + 12500)
  assert.equal(highVolume.exceedsSingleLadderMax, true)
  assert.equal(highVolume.recommendedTier.monthlyPriceUsd, 10000)
  assert.ok(highVolume.assumptions.some((a) => a.includes('exceeds the largest single commitment tier')))
})

test('Hyperagent catalog entry resolves by name and alias and fails closed on getLink', () => {
  const byName = findProgram('Hyperagent')
  const byAlias = findProgram('hyperagent.com')
  assert.ok(byName, 'Hyperagent must exist in data/programs.json')
  assert.deepEqual(byName, byAlias)
  assert.equal(byName.category, 'agent-platform')
  assert.equal(byName.hasProgram, true)
  assert.equal(byName.priority, 5)
  assert.equal(byName.status, 'verify')
  assert.equal(byName.ourLink, null)
  assert.equal(getLink('Hyperagent'), null, 'getLink must fail closed while ourLink is null')
  assert.equal(getLink('hyperagent.com'), null)
  assert.ok(
    !verifiedEconomicsPrograms().some((p) => p.tool === 'Hyperagent'),
    'unverified program must not appear in verifiedEconomicsPrograms()',
  )
})

test('flagship comparison post is registered and covers all 5 architectural dimensions', () => {
  const slug = 'hyperagent-vs-claude-code-manus-openclaw'
  const meta = getPost(slug)
  assert.ok(meta, 'post must be registered in lib/posts.ts')
  assert.equal(meta.cluster, 'coding')
  assert.deepEqual(meta.tools, ['Hyperagent', 'Claude Code', 'Manus', 'OpenClaw'])

  const contentPost = readFileSync(path.join(process.cwd(), 'content', 'posts', `${slug}.mdx`), 'utf8')
  const appPost = readFileSync(path.join(process.cwd(), 'app', 'blog', slug, 'page.mdx'), 'utf8')

  for (const body of [contentPost, appPost]) {
    assert.match(body, /Thread Context/)
    assert.match(body, /PublishWebpage/)
    assert.match(body, /Suggested learnings/)
    assert.match(body, /executionMode:\s*confirm/)
    assert.match(body, /\$10,000/)
    assert.match(body, /\(\/workbench\)/)
    assert.match(body, /\(\/offers\)/)
  }
})
