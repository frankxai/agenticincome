import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { verifyHeader, webPath } from '../scripts/verify-header-identity.mjs'
const master = readFileSync(new URL('../public' + webPath, import.meta.url))
const header = image => '<header><nav><a href="/">' + image + '</a></nav></header>'
const img = '<img alt="Agentic Income" src="' + webPath + '"/>'
test('exact master in header', () => verifyHeader(header(img), master))
test('missing, replaced or ambiguous placement', () => {
  for (const candidate of ['', '<svg/>', img + '<svg/>', img.replace(webPath, '/other.svg'), img.replace('/>', ' srcset="/other.svg 2x"/>')]) {
    assert.throws(() => verifyHeader(header(candidate), master))
  }
})
test('drift in bytes blocks the build', () => assert.throws(() => verifyHeader(header(img), Buffer.concat([master, Buffer.from(' ')]))))
