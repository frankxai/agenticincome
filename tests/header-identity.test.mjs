import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { verifyHeader, verifyPublication, webPath } from '../scripts/verify-header-identity.mjs'
const master = readFileSync(new URL('../public' + webPath, import.meta.url))
const header = image => '<header><nav><a href="/">' + image + '</a></nav></header>'
const img = '<img width="280" height="56" style="max-width:none" alt="Agentic Income" src="' + webPath + '"/>'
test('exact master in header', () => verifyHeader(header(img), master))
test('missing, replaced or ambiguous placement', () => {
  for (const candidate of ['', '<svg/>', img + '<svg/>', img.replace('max-width:none','max-width:100%'), img.replace(webPath, '/other.svg'), img.replace('/>', ' srcset="/other.svg 2x"/>')]) {
    assert.throws(() => verifyHeader(header(candidate), master))
  }
})
test('drift in bytes blocks the build', () => assert.throws(() => verifyHeader(header(img), Buffer.concat([master, Buffer.from(' ')]))))

test('Vercel deployment pin preserves the exact path and refuses arbitrary queries', () => {
  verifyHeader(header(img.replace(webPath,webPath+'?dpl=dpl_test123')),master)
  for (const suffix of ['?image=other','?dpl=dpl_ok&src=other','?dpl=dpl_ok?src=other']) {
    assert.throws(()=>verifyHeader(header(img.replace(webPath,webPath+suffix)),master))
  }
})
test('public release refuses a disconnected authority or missing signed decision', async () => {
  await assert.rejects(verifyPublication({}), /signed release decision/)
})
