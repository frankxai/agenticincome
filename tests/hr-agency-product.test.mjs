import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { getFreePlaybook, freePlaybookSlugs } from '../lib/free-playbooks.ts'
import '../products/hr-agency-launch-kit/tools/economics.test.mjs'
import '../products/hr-agency-launch-kit/tools/agency.test.mjs'

test('the public sample returns its exact artifact and preserves starter delivery', () => {
  const sample = getFreePlaybook('hr-agency-sample')
  assert.equal(sample.content, readFileSync('public/downloads/ai-native-hr-agency-sample.md', 'utf8'))
  assert.ok(getFreePlaybook('starter-kit').content.length > 0)
  assert.deepEqual(freePlaybookSlugs.sort(), ['hr-agency-sample', 'starter-kit'])
})

test('public playbooks reject paid paths, traversal and object prototype keys', () => {
  for (const slug of ['hr-agency-launch-kit', '../products/hr-agency-launch-kit/01-BUSINESS-BLUEPRINT.md',
    '/etc/passwd', 'constructor', '__proto__', 'toString', 'hr-agency-sample/../../products']) {
    assert.equal(getFreePlaybook(slug), null)
  }
})

test('private bundle manifest describes exact reviewed files without public delivery', () => {
  const root = 'products/hr-agency-launch-kit'
  const manifest = JSON.parse(readFileSync(path.join(root, 'manifest.json'), 'utf8'))
  assert.equal(manifest.productId, 'hr-agency-launch-kit')
  assert.equal(manifest.version, '0.2.0')
  assert.ok(manifest.files.length >= 20)
  assert.equal(new Set(manifest.files.map(f => f.path)).size, manifest.files.length)
  for (const file of manifest.files) {
    assert.ok(!path.isAbsolute(file.path) && !file.path.split('/').includes('..'))
    const digest = createHash('sha256').update(readFileSync(path.join(root, file.path))).digest('hex')
    assert.equal(digest, file.sha256, file.path)
  }
})

test('catalog keeps the review edition closed and points only at its free preview', () => {
  const catalog = JSON.parse(readFileSync('products/catalog.json', 'utf8'))
  const item = catalog.products.find(p => p.id === 'hr-agency-launch-kit')
  assert.equal(item.price_cents, 49900)
  assert.ok(!item.status.trim().toLowerCase().startsWith('for sale'))
  assert.equal(item.delivery.path, '/downloads/ai-native-hr-agency-sample.md')
  assert.ok(readFileSync('public' + item.delivery.path, 'utf8').includes('pre-release'))
  const polar = readFileSync('lib/polar.ts', 'utf8')
  assert.ok(!polar.includes('POLAR_PRODUCT_ID_HR_AGENCY'))
})
