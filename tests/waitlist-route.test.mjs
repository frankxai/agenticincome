import './support/alias.mjs'
import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, test } from 'node:test'

const { GET, POST } = await import('../app/api/waitlist/route.ts')
const { resetAnalyticsRateLimitForTests } = await import('../lib/api-security.ts')

const ENV = ['KV_REST_API_URL', 'KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'RESEND_API_KEY', 'RESEND_AUDIENCE_ID']
const savedEnv = Object.fromEntries(ENV.map((name) => [name, process.env[name]]))
const realFetch = globalThis.fetch
const realError = console.error
const ORIGIN = 'https://agenticincome.ai'
const EMAIL = 'visitor.private@example.com'

let logged
let kvCalls
/** A minimal Upstash REST stand-in: one hash of positions, one counter. */
function fakeKv({ count = 5, fail = false } = {}) {
  process.env.KV_REST_API_URL = 'https://kv.test'
  process.env.KV_REST_API_TOKEN = 'token'
  const positions = new Map()
  let counter = count
  globalThis.fetch = async (_url, init) => {
    const command = JSON.parse(init.body)
    kvCalls.push(String(command[0]).toLowerCase())
    if (fail) return new Response(JSON.stringify({ error: 'ERR boom' }), { status: 500 })
    const name = String(command[0]).toLowerCase()
    let result = null
    if (name === 'eval') {
      const email = command[4]
      if (!positions.has(email)) positions.set(email, ++counter)
      result = positions.get(email)
    } else if (name === 'get') result = String(counter)
    else if (name === 'hset') result = 1
    return new Response(JSON.stringify({ result }), { status: 200 })
  }
}

const post = (body, headers = {}) =>
  POST(new Request(`${ORIGIN}/api/waitlist`, {
    method: 'POST',
    headers: { origin: ORIGIN, 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.9', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }))
const get = (query = 'productId=agentic-income') => GET(new Request(`${ORIGIN}/api/waitlist?${query}`))
const valid = { productId: 'agentic-income', email: EMAIL, consent: true }

beforeEach(() => {
  for (const name of ENV) delete process.env[name]
  resetAnalyticsRateLimitForTests()
  kvCalls = []
  logged = []
  console.error = (...args) => logged.push(args.map(String).join(' '))
})
afterEach(() => {
  globalThis.fetch = realFetch
  console.error = realError
  for (const name of ENV) {
    if (savedEnv[name] === undefined) delete process.env[name]
    else process.env[name] = savedEnv[name]
  }
})

describe('GET /api/waitlist (state)', () => {
  test('unknown product is 404', async () => {
    assert.equal((await get('productId=nope')).status, 404)
    assert.equal((await get('')).status, 404)
  })

  test('no KV env: reports open:false and never calls a store', async () => {
    const res = await get()
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.open, false)
    assert.equal(body.reason, 'not_configured')
    assert.deepEqual(kvCalls, [])
  })

  test('a half-set pair is closed, not mixed', async () => {
    process.env.KV_REST_API_URL = 'https://kv.test'
    assert.equal((await (await get()).json()).open, false)
  })

  test('open with a store: the count below the threshold stays server side', async () => {
    fakeKv({ count: 5 })
    const body = await (await get()).json()
    assert.equal(body.open, true)
    assert.equal(body.publicCount, null)
    assert.equal('count' in body, false)
    assert.equal(body.foundingSeatsLeft, null)
  })

  test('the count is published only at or above the threshold', async () => {
    fakeKv({ count: 100 })
    assert.equal((await (await get()).json()).publicCount, 100)
  })

  test('store failure is 503 and closed', async () => {
    fakeKv({ fail: true })
    const res = await get()
    assert.equal(res.status, 503)
    assert.equal((await res.json()).open, false)
  })
})

describe('POST /api/waitlist (join)', () => {
  test('unknown product is 404', async () => {
    fakeKv()
    assert.equal((await post({ ...valid, productId: 'not-a-product' })).status, 404)
    assert.equal((await post({ email: EMAIL, consent: true })).status, 404)
    assert.deepEqual(kvCalls, [])
  })

  test('validation errors are 400 and touch no store', async () => {
    fakeKv()
    const badEmail = await post({ ...valid, email: 'not-an-email' })
    assert.equal(badEmail.status, 400)
    assert.equal((await badEmail.json()).error, 'Valid email required')
    const noConsent = await post({ ...valid, consent: false })
    assert.equal(noConsent.status, 400)
    assert.equal((await noConsent.json()).error, 'Consent required')
    assert.equal((await post('{not json')).status, 400)
    assert.deepEqual(kvCalls, [])
  })

  test('request guards: origin 403, media type 415, unidentified client 403', async () => {
    fakeKv()
    assert.equal((await post(valid, { origin: 'https://attacker.example' })).status, 403)
    assert.equal((await post(valid, { 'content-type': 'text/plain' })).status, 415)
    assert.equal((await post(valid, { 'x-forwarded-for': '' })).status, 403)
  })

  test('closed (no KV env): 503 with open:false, and nothing is reported as saved', async () => {
    const res = await post(valid)
    assert.equal(res.status, 503)
    const body = await res.json()
    assert.equal(body.open, false)
    assert.equal(body.position, undefined)
    assert.match(body.error, /Nothing was saved/)
  })

  test('store failure is 503 and the address never reaches the response or the log', async () => {
    fakeKv({ fail: true })
    const res = await post(valid)
    assert.equal(res.status, 503)
    const text = await res.text()
    assert.equal(text.includes(EMAIL), false)
    assert.equal(logged.length, 1)
    assert.equal(logged[0].includes(EMAIL), false)
  })

  test('success returns the recorded position and no raw count', async () => {
    fakeKv({ count: 5 })
    const res = await post({ ...valid, source: '/' })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.open, true)
    assert.equal(body.position, 6)
    assert.equal(body.publicCount, null)
    assert.equal('count' in body, false)
    assert.ok(kvCalls.includes('hset'))
  })

  test('a repeat join returns the same position', async () => {
    fakeKv({ count: 5 })
    const first = await (await post(valid)).json()
    const again = await (await post(valid)).json()
    assert.equal(again.position, first.position)
  })

  test('rate limit answers 429', async () => {
    fakeKv()
    let last
    for (let i = 0; i < 80; i += 1) {
      last = await post(valid)
      if (last.status === 429) break
    }
    assert.equal(last.status, 429)
  })
})
