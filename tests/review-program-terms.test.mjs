import assert from 'node:assert/strict'
import { test } from 'node:test'
import { auditPrograms, observeSource } from '../scripts/review-program-terms.mjs'

const now = Date.parse('2026-11-27')
const program = {
  tool: 'Example', status: 'active', hasProgram: true, commission: '25% for eligible plans',
  commissionVerifiedAt: '2026-11-27', commissionSourceUrl: 'https://example.com/partners',
  ourLink: 'https://example.com/private-tracking-link',
}

test('reviews distinct recorded URLs, preserves units and flags rate drift without rewriting data', async () => {
  const calls = []
  const rows = await auditPrograms([program, { ...program, tool: 'Old', commission: '15%' }], now, url => {
    calls.push(url)
    return { status: 200, text: 'Earn 25% on eligible plans for 15 months.' }
  })
  assert.deepEqual(calls, [program.commissionSourceUrl])
  assert.deepEqual(rows[0].reasons, [])
  assert.deepEqual(rows[1].reasons, ['Recheck quoted figures: 15%'])
  assert.equal(rows[1].terms, '15%')
})

test('closed, stale, unknown and missing sources stay visible, without fetching referral URLs', async () => {
  const closed = { ...program, hasProgram: false, status: 'closed', commissionSourceUrl: null, commissionVerifiedAt: '2026-08-29' }
  const invalid = { ...program, commissionSourceUrl: 'http://example.com/terms', commissionVerifiedAt: null, verifiedAt: '2026-11-27' }
  const rows = await auditPrograms([closed, invalid], now, () => assert.fail('No official HTTPS source'))
  assert.deepEqual(rows[0].reasons, ['Hold promotion until program eligibility is confirmed', 'Renew the 90-day source review', 'Record an official terms source'])
  assert.deepEqual(rows[1].reasons, ['Record a valid reviewer date', 'Record an official terms source'])
})

test('redirects, provider errors, oversized and non-text pages remain reviewable', async () => {
  for (const [response, error] of [
    [new Response(null, { status: 302, headers: { location: 'https://elsewhere.example/' } }), 'Review source response'],
    [new Response(null, { status: 403 }), 'Review source response'],
    [new Response('pdf', { headers: { 'content-type': 'application/pdf' } }), 'Review non-text source'],
    [new Response('x'.repeat(1024 * 1024 + 1)), 'Review oversized source'],
  ]) {
    const result = await observeSource(program.commissionSourceUrl, (_url, init) => {
      assert.equal(init.redirect, 'manual')
      return response
    })
    assert.equal(result.error, error)
  }
})

test('document observations ignore markup, scripts, and styles', async () => {
  const result = await observeSource(program.commissionSourceUrl, () => new Response(
    '<style>.x{width:25%}</style><script>const s="25%"</script><p>Rate on application</p>',
    { headers: { 'content-type': 'text/html' } },
  ))
  assert.equal(result.status, 200)
  assert.doesNotMatch(result.text, /25%/)
  assert.match(result.text, /Rate on application/)
})
