import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { atlasDocument, atlasEnabled } from '../lib/atlas-page.ts'
import { ATLAS_PATH, buildAtlasHtml } from '../scripts/vault-atlas.mjs'

const committed = readFileSync(ATLAS_PATH, 'utf8')

test('the committed atlas is fresh: rebuilding from vault/*.json gives the same file', () => {
  assert.equal(committed, buildAtlasHtml(), 'run node scripts/vault-atlas.mjs after changing vault data')
})

test('the route is off in production and on everywhere else', () => {
  assert.equal(atlasEnabled({ VERCEL_ENV: 'production' }), false)
  assert.equal(atlasEnabled({ VERCEL_ENV: 'preview' }), true)
  assert.equal(atlasEnabled({ VERCEL_ENV: 'development' }), true)
  assert.equal(atlasEnabled({}), true)
})

test('the document is complete, noindex, and drops the fonts the CSP would block', () => {
  const doc = atlasDocument(committed)
  assert.ok(doc.startsWith('<!doctype html>'))
  assert.match(doc, /<head>[\s\S]*<title>Economy Atlas<\/title>[\s\S]*<\/head>/)
  assert.match(doc, /<meta name="robots" content="noindex, nofollow">/)
  assert.doesNotMatch(doc, /fonts\.(googleapis|gstatic)\.com/)
  assert.match(doc, /<body>[\s\S]*<script id="vault" type="application\/json">/)
  assert.equal((doc.match(/<style>/g) ?? []).length, 2, 'reset plus the atlas styles, both in head')
})

test('the builder keeps dollar sequences in data literal', () => {
  const html = buildAtlasHtml({ models: { models: [] }, note: "costs $& and $' and $`" })
  assert.ok(html.includes("costs $& and $' and $`"))
})
