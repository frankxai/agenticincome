import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

test('actual Polar adapter keeps its gates and isolates sandbox credentials and endpoint', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'polar-adapter-'))
  const previousEnv = { ...process.env }
  const previousFetch = globalThis.fetch
  try {
    // Only the Next.js import aliases are replaced to run the actual adapter
    // in Node. A synthetic for-sale catalog isolates tests from real offers.
    let source = await readFile(resolve('lib/polar.ts'), 'utf8')
    source = source.replace("import catalog from '@/products/catalog.json'", `const catalog = { products: [{ id: 'blueprint', price_cents: 1000, status: 'for sale', delivery: { path: '/delivery/test' } }] }`)
    source = source.replace("import { polarRuntimeConfiguration, validPolarCheckoutUrl } from '@/lib/commerce/polar-environment'", `import { polarRuntimeConfiguration, validPolarCheckoutUrl } from '${pathToFileURL(resolve('lib/commerce/polar-environment.ts')).href}'`)
    source = source.replace("import { commerceKillSwitchActive, commerceProvider } from '@/lib/commerce/config'", `const commerceKillSwitchActive = () => process.env.COMMERCE_KILL_SWITCH === '1'; const commerceProvider = () => process.env.COMMERCE_PROVIDER || 'none'`)
    const adapter = join(temp, 'adapter.ts')
    await writeFile(adapter, source)
    const { createCheckoutSession, isPolarConfigured, catalogRefusal } = await import(pathToFileURL(adapter).href)
    Object.assign(process.env, { NODE_ENV: 'test', POLAR_SERVER: 'sandbox', POLAR_SANDBOX_ACCESS_TOKEN: 'sandbox-token', POLAR_SANDBOX_PRODUCT_ID_BLUEPRINT: 'sandbox-product', POLAR_ACCESS_TOKEN: 'live-token', POLAR_PRODUCT_ID_BLUEPRINT: 'live-product', COMMERCE_PROVIDER: 'polar' })
    delete process.env.VERCEL_ENV
    delete process.env.COMMERCE_KILL_SWITCH
    let requests = []
    globalThis.fetch = async (url, init) => {
      requests.push({ url, init })
      return new Response(JSON.stringify({ url: 'https://sandbox.polar.sh/checkout/test' }), { status: 201 })
    }
    assert.equal(isPolarConfigured('blueprint'), true)
    assert.equal(catalogRefusal({ id: 'blueprint', price_cents: 1000, status: 'pre-stage' }), 'checkout_gated')
    assert.equal(await createCheckoutSession('unknown-product'), null)
    assert.equal(await createCheckoutSession('blueprint'), 'https://sandbox.polar.sh/checkout/test')
    assert.equal(requests[0].url, 'https://sandbox-api.polar.sh/v1/checkouts/')
    assert.equal(requests[0].init.headers.authorization, 'Bearer sandbox-token')
    assert.deepEqual(JSON.parse(requests[0].init.body).products, ['sandbox-product'])
    process.env.COMMERCE_KILL_SWITCH = '1'
    assert.equal(await createCheckoutSession('blueprint'), null)
    process.env.COMMERCE_KILL_SWITCH = ''
    process.env.VERCEL_ENV = 'production'
    assert.equal(isPolarConfigured('blueprint'), false)
    assert.equal(await createCheckoutSession('blueprint'), null)
    assert.equal(requests.length, 1)
  } finally {
    globalThis.fetch = previousFetch
    for (const key of Object.keys(process.env)) if (!(key in previousEnv)) delete process.env[key]
    Object.assign(process.env, previousEnv)
    await rm(temp, { recursive: true, force: true })
  }
})
