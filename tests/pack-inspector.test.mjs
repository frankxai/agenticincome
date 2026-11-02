import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()
const read = (rel) => readFileSync(path.join(root, rel), 'utf8')

test('every offer in lib/offers.ts has a matching PACK_MANIFESTS entry and valid SVG schematic plate', () => {
  const offersSrc = read('lib/offers.ts')
  const manifestsSrc = read('lib/pack-manifests.ts')

  const offerSlugs = [...offersSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
  assert.equal(offerSlugs.length, 8, 'expected all 8 catalog + sprint offers in lib/offers.ts')

  for (const slug of offerSlugs) {
    assert.ok(
      manifestsSrc.includes(`slug: '${slug}'`),
      `PACK_MANIFESTS must include manifest for offer slug "${slug}"`,
    )
    const platePath = path.join(root, 'public', 'images', 'products', `plate-${slug}.svg`)
    assert.ok(existsSync(platePath), `SVG plate missing on disk: ${platePath}`)
    const svg = readFileSync(platePath, 'utf8')
    assert.ok(svg.startsWith('<svg'), `plate-${slug}.svg must start with <svg`)
    assert.ok(svg.includes('viewBox="0 0 640 360"'), `plate-${slug}.svg must use 640x360 16:9 viewBox`)
  }
})

test('funnel and product inspection files contain zero em-dashes and preserve fail-closed catalog gates', () => {
  const checkedFiles = [
    'DESIGN.md',
    'lib/offers.ts',
    'lib/pack-manifests.ts',
    'components/PackInspector.tsx',
    'components/OperatorFitCheck.tsx',
    'components/ProductLadder.tsx',
    'app/offers/page.tsx',
    'app/offers/[slug]/page.tsx',
    'app/start/page.tsx',
  ]

  for (const rel of checkedFiles) {
    const content = read(rel)
    assert.ok(
      !content.includes('\u2014'),
      `${rel} contains a forbidden em-dash (\\u2014); replace with colon, period, or middot`,
    )
  }

  const catalog = JSON.parse(read('products/catalog.json'))
  const gatedIds = ['agent-team-pro', 'private-intel', 'claims-guard-pack', 'abos-pack-bundle', 'vibe-os-pack']
  for (const id of gatedIds) {
    const entry = catalog.products.find((p) => p.id === id)
    assert.ok(entry, `catalog.json missing ${id}`)
    assert.ok(
      !entry.status.trim().toLowerCase().startsWith('for sale'),
      `Doctrine 0 violation: gated product ${id} must not be flipped to "for sale"`,
    )
  }
})
