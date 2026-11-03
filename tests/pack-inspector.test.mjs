import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()
const read = (rel) => readFileSync(path.join(root, rel), 'utf8')

function loadManifests() {
  const src = read('lib/pack-manifests.ts')
  const marker = 'export const PACK_MANIFESTS: Record<string, PackManifest> = '
  const start = src.indexOf(marker)
  assert.ok(start >= 0, 'PACK_MANIFESTS declaration not found in lib/pack-manifests.ts')
  const jsonStart = start + marker.length
  const endMarker = '\n\nexport function getPackManifest'
  const jsonEnd = src.indexOf(endMarker, jsonStart)
  assert.ok(jsonEnd > jsonStart, 'getPackManifest footer not found in lib/pack-manifests.ts')
  return JSON.parse(src.slice(jsonStart, jsonEnd))
}

test('every offer in lib/offers.ts has a disk-verified PACK_MANIFESTS entry and valid SVG schematic plate', () => {
  const offersSrc = read('lib/offers.ts')
  const manifests = loadManifests()
  const catalog = JSON.parse(read('products/catalog.json'))

  const offerSlugs = [...offersSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
  assert.equal(offerSlugs.length, 8, 'expected all 8 catalog + sprint offers in lib/offers.ts')

  for (const slug of offerSlugs) {
    const manifest = manifests[slug]
    assert.ok(manifest, `PACK_MANIFESTS must include manifest for offer slug "${slug}"`)
    assert.ok(manifest.files.length >= 1, `manifest "${slug}" must expose at least 1 real file`)

    for (const file of manifest.files) {
      const abs = path.join(root, file.diskPath)
      assert.ok(existsSync(abs), `manifest "${slug}" references missing disk file: ${file.diskPath}`)
      const actualBytes = statSync(abs).size
      assert.equal(file.bytes, actualBytes, `${file.diskPath} byte count mismatch`)
      const rawLines = readFileSync(abs, 'utf8').replace(/\r\n/g, '\n').split('\n')
      if (rawLines.length > 1 && rawLines[rawLines.length - 1] === '') rawLines.pop()
      assert.equal(file.totalLines, rawLines.length, `${file.diskPath} line count mismatch`)
      assert.deepEqual(
        file.excerpt,
        rawLines.slice(0, file.excerpt.length),
        `${file.diskPath} excerpt must match verbatim opening lines on disk`,
      )
    }

    const platePath = path.join(root, 'public', 'images', 'products', `plate-${slug}.svg`)
    assert.ok(existsSync(platePath), `SVG plate missing on disk: ${platePath}`)
    const svg = readFileSync(platePath, 'utf8')
    assert.ok(svg.startsWith('<svg'), `plate-${slug}.svg must start with <svg`)
    assert.ok(svg.trimEnd().endsWith('</svg>'), `plate-${slug}.svg must close </svg>`)
    assert.ok(svg.includes('viewBox="0 0 640 360"'), `plate-${slug}.svg must use 640x360 16:9 viewBox`)
    assert.equal(
      /&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(svg),
      false,
      `plate-${slug}.svg contains an unescaped XML ampersand (&)`,
    )
  }

  const blueprintCatalog = catalog.products.find((p) => p.id === 'blueprint')
  assert.deepEqual(
    manifests.blueprint.files.map((f) => f.diskPath),
    blueprintCatalog.delivery.files,
    'blueprint manifest files must match products/catalog.json delivery.files 1:1',
  )
})

test('public funnel UI avoids prohibited internal vocabulary, preserves #request-access fallback, and keeps fail-closed catalog gates', () => {
  const authoredUiFiles = [
    'lib/offers.ts',
    'components/PackInspector.tsx',
    'components/OperatorFitCheck.tsx',
    'components/ProductLadder.tsx',
    'app/offers/page.tsx',
    'app/offers/[slug]/page.tsx',
  ]

  for (const rel of authoredUiFiles) {
    const content = read(rel)
    assert.ok(
      !content.includes('\u2014'),
      `${rel} contains a forbidden em-dash (\\u2014); replace with colon, period, or middot`,
    )
  }

  const fitCheckSrc = read('components/OperatorFitCheck.tsx')
  for (const term of ['coding harness', 'operator fit-check', 'Operator fit-check', 'Operator Plan', 'Send this Week-1 checklist to your inbox']) {
    assert.ok(!fitCheckSrc.includes(term), `OperatorFitCheck.tsx must not expose "${term}"`)
  }

  const offerDetailSrc = read('app/offers/[slug]/page.tsx')
  assert.ok(
    offerDetailSrc.includes('{!isFree && !liveCheckout ? ('),
    'app/offers/[slug]/page.tsx must preserve #request-access fallback whenever !liveCheckout',
  )

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
