import assert from 'node:assert/strict'
import test from 'node:test'
import { VERCEL_MAX_EVENT_PROPERTIES, toVercelEventProperties } from '../lib/analytics.ts'

test('Vercel custom event keeps at most two low-cardinality properties', () => {
  const props = toVercelEventProperties({
    event: 'affiliate_route_clicked',
    path: '/tools',
    href: 'https://go.agenticincome.ai/x?utm_source=a',
    source: 'comparison',
    tool: 'higgsfield',
    state: 'verified',
    ts: '2026-09-28T00:00:00.000Z',
  })
  assert.deepEqual(props, { tool: 'higgsfield', source: 'comparison' })
  assert.ok(Object.keys(props).length <= VERCEL_MAX_EVENT_PROPERTIES)
})

test('Vercel custom event never carries href, requestId, path, or ts', () => {
  const props = toVercelEventProperties({
    event: 'subscribe_success',
    path: '/join',
    requestId: 'req_123',
    source: 'footer',
    state: 'ok',
    ts: '2026-09-28T00:00:00.000Z',
  })
  assert.deepEqual(props, { source: 'footer', state: 'ok' })
  for (const key of ['href', 'requestId', 'path', 'ts']) assert.equal(key in props, false)
})
