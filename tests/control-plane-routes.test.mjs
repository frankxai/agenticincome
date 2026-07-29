import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('public navigation leads with the free path, evidence, method, and scope-first build', () => {
  const navigation = read('lib/site.ts')
  const build = read('app/build/page.tsx')
  const operate = read('app/operate/page.tsx')
  const proof = read('app/proof/page.tsx')

  for (const route of ['/start', '/proof', '/pack', '/offers/implementation-sprint']) {
    assert.match(navigation, new RegExp(`href: '${route}'`))
  }

  // The deeper lifecycle remains addressable even though internal operating
  // taxonomy no longer crowds the primary audience navigation.
  assert.match(build, /Agents prepare\. An authorized principal commits\./)
  assert.match(operate, /Autonomy increases only with evidence\./)
  assert.match(proof, /System evidence—not customer income evidence\./)
})

test('request-to-quote reference is local and cannot send or price', () => {
  const page = read('app/build/request-to-quote/page.tsx')
  const desk = read('components/RequestToQuoteDesk.tsx')

  assert.match(page, /does not submit data, contact anyone, calculate a price, or create an agreement/)
  assert.match(desk, /No network request/)
  assert.match(desk, /Not allowed: send a quote, promise an outcome, sign terms, access production credentials, or move money/)
  assert.doesNotMatch(desk, /fetch\(/)
  assert.doesNotMatch(desk, /localStorage/)
})
