import assert from 'node:assert/strict'
import test from 'node:test'
import { fitCheck, AUTOMATION_POINTER } from '../lib/fit-check.ts'

test('fit_check is deterministic and matches the homepage proof block', () => {
  const result = fitCheck({ hoursPerWeek: 10, upfrontBudgetUsd: 200, hasAudience: false, canCode: true })
  assert.deepEqual(result, {
    model: 'services',
    why: '10 focused hours and working code skills price you into agent-assisted delivery work first.',
    read: '/start',
  })
})

test('an existing audience routes to products', () => {
  const result = fitCheck({ hoursPerWeek: 4, upfrontBudgetUsd: 0, hasAudience: true, canCode: false })
  assert.equal(result.model, 'products')
  assert.equal(result.read, '/delivery/starter-kit')
})

test('low weekly hours without an audience route to systems', () => {
  const result = fitCheck({ hoursPerWeek: 3, upfrontBudgetUsd: 500, hasAudience: false, canCode: true })
  assert.equal(result.model, 'systems')
  assert.equal(result.read, '/operate')
  assert.match(result.why, /\$500/)
})

test('no income promises leak into fit_check output', () => {
  for (const hasAudience of [true, false]) {
    for (const canCode of [true, false]) {
      for (const hours of [0, 5, 10, 40]) {
        const { why } = fitCheck({ hoursPerWeek: hours, upfrontBudgetUsd: 100, hasAudience, canCode })
        assert.doesNotMatch(why, /guarantee|promise|passive income|\$\d+\/mo/i)
      }
    }
  }
})

test('the automation pointer names the sister MCP server', () => {
  assert.match(AUTOMATION_POINTER, /agenticpassiveincome\.com\/api\/mcp/)
})
