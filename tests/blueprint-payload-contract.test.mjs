import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = (rel) => readFileSync(path.join(root, rel), 'utf8')

function loadPackManifests() {
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

function extractBlueprintDeliverablesFromOffersTs(src) {
  const slugIdx = src.indexOf("slug: 'blueprint'")
  assert.ok(slugIdx >= 0, "slug: 'blueprint' not found in lib/offers.ts")
  const nextSlugIdx = src.indexOf("slug: '", slugIdx + 1)
  const block = nextSlugIdx > slugIdx ? src.slice(slugIdx, nextSlugIdx) : src.slice(slugIdx)
  const delivMatch = block.match(/deliverables:\s*\[([\s\S]*?)\]/)
  assert.ok(delivMatch, 'deliverables array not found on blueprint offer in lib/offers.ts')
  return [...delivMatch[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1])
}

function parseCsvLine(line) {
  const cells = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      cells.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  cells.push(current)
  assert.equal(inQuotes, false, `unclosed CSV quote in line: ${line}`)
  return cells
}

test('blueprint offer deliverables, catalog.json, pack-manifests.ts, and MANIFEST.json match 1:1', () => {
  const catalog = JSON.parse(read('products/catalog.json'))
  const blueprintCatalog = catalog.products.find((p) => p.id === 'blueprint')
  assert.ok(blueprintCatalog, 'blueprint entry missing from products/catalog.json')

  const expectedFiles = [
    'products/blueprint/00-README.md',
    'products/blueprint/operating-desk-architecture.md',
    'products/blueprint/coding-tool-comparison-matrix.md',
    'products/blueprint/recurring-payer-catalog.csv',
    'products/blueprint/offer-and-waitlist-ladder.md',
    'products/blueprint/polar-fulfillment-checklist.md',
    'products/blueprint/MANIFEST.json',
  ]

  assert.deepEqual(
    blueprintCatalog.delivery.files,
    expectedFiles,
    'products/catalog.json blueprint.delivery.files must list the 7 Operating Desk files in install order',
  )

  const offersDeliverables = extractBlueprintDeliverablesFromOffersTs(read('lib/offers.ts'))
  assert.equal(
    offersDeliverables.length,
    expectedFiles.length,
    'lib/offers.ts blueprint.deliverables count must match catalog.json blueprint.delivery.files 1:1',
  )

  const offersFilePrefixes = offersDeliverables.map((item) => item.split(':')[0]?.trim())
  assert.deepEqual(
    offersFilePrefixes,
    expectedFiles.map((f) => path.basename(f)),
    'every lib/offers.ts blueprint deliverable must lead with its exact delivered filename in install order',
  )

  const packManifests = loadPackManifests()
  assert.deepEqual(
    packManifests.blueprint.files.map((f) => f.diskPath),
    expectedFiles,
    'lib/pack-manifests.ts PACK_MANIFESTS.blueprint.files must match catalog.json 1:1',
  )

  const diskManifest = JSON.parse(read('products/blueprint/MANIFEST.json'))
  assert.equal(diskManifest.productId, 'blueprint')
  assert.equal(diskManifest.priceCents, 6700)
  assert.equal(diskManifest.currency, 'USD')
  assert.deepEqual(
    [...diskManifest.files.map((f) => f.path), 'products/blueprint/MANIFEST.json'],
    expectedFiles,
    'products/blueprint/MANIFEST.json must cover all 6 peer deliverables alongside itself',
  )
})

test('every delivered blueprint file exists on disk, uses LF line endings, and matches SHA-256 checksums', () => {
  const catalog = JSON.parse(read('products/catalog.json'))
  const blueprintCatalog = catalog.products.find((p) => p.id === 'blueprint')
  const diskManifest = JSON.parse(read('products/blueprint/MANIFEST.json'))
  const byPath = new Map(diskManifest.files.map((entry) => [entry.path, entry]))

  let totalBytes = 0
  for (const relPath of blueprintCatalog.delivery.files) {
    const abs = path.join(root, relPath)
    assert.ok(existsSync(abs), `missing promised blueprint deliverable on disk: ${relPath}`)
    const buf = readFileSync(abs)
    assert.ok(buf.length >= 1000, `${relPath} must be substantive (>= 1000 bytes, got ${buf.length})`)
    totalBytes += buf.length

    const text = buf.toString('utf8')
    assert.equal(text.includes('\r\n'), false, `${relPath} must use LF line endings for cross-platform hash parity`)

    if (relPath !== 'products/blueprint/MANIFEST.json') {
      const entry = byPath.get(relPath)
      assert.ok(entry, `${relPath} missing from MANIFEST.json`)
      assert.equal(entry.bytes, statSync(abs).size, `${relPath} byte size mismatch vs MANIFEST.json`)

      const lines = text.split('\n')
      if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop()
      assert.equal(entry.lines, lines.length, `${relPath} line count mismatch vs MANIFEST.json`)

      const actualSha = createHash('sha256').update(buf).digest('hex')
      assert.equal(actualSha, entry.sha256, `${relPath} SHA-256 mismatch vs MANIFEST.json`)
    }
  }

  assert.ok(totalBytes >= 40_000, `expected substantive Operating Desk payload (>= 40 KB total, got ${totalBytes} B)`)
})

test('recurring-payer-catalog.csv enforces primary sources, verification dates, and non-affiliate alternatives', () => {
  const raw = read('products/blueprint/recurring-payer-catalog.csv')
  const lines = raw.trimEnd().split('\n')
  assert.ok(lines.length >= 11, 'expected header plus at least 10 verified partner rows in recurring-payer-catalog.csv')

  const header = parseCsvLine(lines[0])
  assert.deepEqual(header, [
    'slug',
    'tool_name',
    'category',
    'program_status',
    'commission_terms',
    'recurring_window',
    'cookie_days',
    'network',
    'non_affiliate_alternative',
    'verified_at',
    'primary_source_url',
    'drift_risk_note',
  ])

  for (let i = 1; i < lines.length; i += 1) {
    const cells = parseCsvLine(lines[i])
    assert.equal(cells.length, header.length, `row ${i} column count mismatch`)
    const row = Object.fromEntries(header.map((col, idx) => [col, cells[idx]]))

    assert.match(row.slug, /^[a-z0-9-]+$/, `row ${i} invalid slug: ${row.slug}`)
    assert.ok(row.non_affiliate_alternative.trim().length >= 5, `row ${i} (${row.slug}) must name a non-affiliate alternative`)
    assert.match(row.verified_at, /^\d{4}-\d{2}-\d{2}$/, `row ${i} (${row.slug}) must carry YYYY-MM-DD verified_at`)
    assert.match(row.primary_source_url, /^https:\/\/[^\s]+$/, `row ${i} (${row.slug}) must link an https:// primary source`)

    for (const [col, val] of Object.entries(row)) {
      assert.equal(
        /^[=+\-@]/.test(val.trimStart()),
        false,
        `row ${i} (${row.slug}) column "${col}" starts with a spreadsheet formula-injection prefix`,
      )
    }
  }
})

test('blueprint deliverables, offer copy, and catalog reject banned claims and preserve money-gate invariants', () => {
  const catalog = JSON.parse(read('products/catalog.json'))
  const blueprintCatalog = catalog.products.find((p) => p.id === 'blueprint')

  // Money-gate invariants: $67 Blueprint stays at 6700 cents / Polar status; gated SKUs stay closed.
  assert.equal(blueprintCatalog.price_cents, 6700)
  assert.equal(blueprintCatalog.interval, null)
  assert.equal(blueprintCatalog.status, 'for sale — private delivery via Polar')

  const starter = catalog.products.find((p) => p.id === 'starter-kit')
  assert.equal(starter.price_cents, 0)

  for (const gatedId of ['agent-team-pro', 'private-intel', 'claims-guard-pack', 'abos-pack-bundle', 'vibe-os-pack']) {
    const gated = catalog.products.find((p) => p.id === gatedId)
    assert.ok(gated, `missing catalog product ${gatedId}`)
    assert.equal(
      gated.status.trim().toLowerCase().startsWith('for sale'),
      false,
      `gated product ${gatedId} must remain closed`,
    )
  }

  const bannedPatterns = [
    { re: /\b5[-–]20[x×]\b/i, reason: 'unsourced ROI multiple (5-20x)' },
    { re: /\b(10x|100x)\b/i, reason: 'unsourced multiplier claim' },
    { re: /\bFortune\s*500\b/i, reason: 'unverified Fortune 500 prestige claim' },
    { re: /\b(guaranteed income|guaranteed revenue|effortless passive|autopilot income|get rich)\b/i, reason: 'prohibited income-guarantee language' },
    { re: /github\.com\/frankxai\/agenticincome(?!-skills)\b/i, reason: 'private repo URL leak in buyer-facing deliverable or offer surface' },
  ]

  const targets = [
    'lib/offers.ts',
    ...blueprintCatalog.delivery.files,
  ]

  for (const relPath of targets) {
    const content = read(relPath)
    assert.equal(content.includes('\u2014'), false, `${relPath} must not contain em-dashes (\\u2014)`)
    for (const { re, reason } of bannedPatterns) {
      assert.doesNotMatch(content, re, `${relPath} triggered banned claim check: ${reason}`)
    }
  }

  const blueprintCatalogJson = JSON.stringify(blueprintCatalog)
  for (const { re, reason } of bannedPatterns) {
    assert.doesNotMatch(blueprintCatalogJson, re, `products/catalog.json (blueprint) triggered banned claim check: ${reason}`)
  }
})


test('public Blueprint excerpts contain only the authored CSV sample and partial protected files', () => {
  const manifest = loadPackManifests().blueprint
  const csv = manifest.files.find((file) => file.diskPath.endsWith('recurring-payer-catalog.csv'))
  assert.ok(csv)
  const sample = read('products/blueprint/previews/recurring-payer-catalog.sample.csv').replace(/\r\n/g, '\n').trimEnd().split('\n')
  assert.equal(sample.length, 3, 'public CSV sample has its header and exactly two chosen records')
  assert.deepEqual(csv.excerpt, sample)
  assert.equal(csv.badge, '2-row CSV sample')
  const paidRows = read(csv.diskPath).replace(/\r\n/g, '\n').trimEnd().split('\n')
  assert.deepEqual(sample, paidRows.slice(0, 3), 'line numbers describe a leading contiguous sample')
  const publicPayload = JSON.stringify(manifest)
  for (const row of paidRows.slice(1)) {
    if (!sample.includes(row)) {
      const encodedRow = JSON.stringify(row).slice(1, -1)
      assert.equal(publicPayload.includes(encodedRow), false, 'non-sample paid records must not reach the client manifest')
    }
  }
  for (const file of manifest.files) {
    const source = read(file.diskPath).replace(/\r\n/g, '\n').trimEnd().split('\n')
    assert.ok(file.excerpt.length <= Math.floor(source.length / 2), `protected preview exceeds half the source lines: ${file.diskPath}`)
    assert.ok(Buffer.byteLength(file.excerpt.join('\n'), 'utf8') <= Math.floor(Buffer.byteLength(source.join('\n'), 'utf8') / 2), `protected preview exceeds half the source bytes: ${file.diskPath}`)
  }
})

test('manifest generation retains the authored sample, refuses future complete protected previews and permits public files', () => {
  const tempBase = path.resolve(os.tmpdir())
  const temp = mkdtempSync(path.join(tempBase, 'blueprint-preview-boundary-'))
  assert.equal(path.dirname(temp), tempBase)
  try {
    for (const rel of ['products', 'public/downloads', 'scripts/build-pack-manifests.mjs', 'lib']) {
      cpSync(path.join(root, rel), path.join(temp, rel), { recursive: true })
    }
    const run = () => spawnSync(process.execPath, ['scripts/build-pack-manifests.mjs'], { cwd: temp, encoding: 'utf8' })
    const original = readFileSync(path.join(temp, 'lib/pack-manifests.ts'), 'utf8')
    const generated = run()
    assert.equal(generated.status, 0, generated.stderr)
    assert.equal(readFileSync(path.join(temp, 'lib/pack-manifests.ts'), 'utf8'), original, 'generator must have zero drift')
    writeFileSync(path.join(temp, 'products/blueprint/operating-desk-architecture.md'), '# Short paid deliverable\nPrivate detail\n')
    const shortProtected = run()
    assert.notEqual(shortProtected.status, 0)
    assert.match(shortProtected.stderr, /Protected deliverable needs an explicit partial sample/)
    assert.equal(readFileSync(path.join(temp, 'lib/pack-manifests.ts'), 'utf8'), original, 'failed generation must retain the previous safe manifest')
    writeFileSync(path.join(temp, 'products/blueprint/operating-desk-architecture.md'), '# Short paid deliverable\nPrivate detail\n' + '\n'.repeat(30))
    const paddedProtected = run()
    assert.notEqual(paddedProtected.status, 0)
    assert.match(paddedProtected.stderr, /Protected deliverable needs an explicit partial sample/)
    cpSync(path.join(root, 'products/blueprint/operating-desk-architecture.md'), path.join(temp, 'products/blueprint/operating-desk-architecture.md'))
    writeFileSync(path.join(temp, 'public/downloads/agentic-income-starter-kit.md'), '# Intentionally public starter\nComplete free sample\n')
    const publicFile = run()
    assert.equal(publicFile.status, 0, publicFile.stderr)
    assert.ok(readFileSync(path.join(temp, 'lib/pack-manifests.ts'), 'utf8').includes('Complete free sample'))
    cpSync(path.join(root, 'products/blueprint/recurring-payer-catalog.csv'), path.join(temp, 'products/blueprint/previews/recurring-payer-catalog.sample.csv'))
    const completeSample = run()
    assert.notEqual(completeSample.status, 0)
    assert.match(completeSample.stderr, /Public sample must be shorter than protected deliverable/)
  } finally {
    assert.equal(path.dirname(path.resolve(temp)), tempBase)
    rmSync(temp, { recursive: true, force: true })
  }
})

test('protected preview limits reject near-complete, byte-heavy, empty and misleading samples without replacing safe output', () => {
  const tempBase = path.resolve(os.tmpdir())
  const temp = mkdtempSync(path.join(tempBase, 'blueprint-preview-limits-'))
  assert.equal(path.dirname(temp), tempBase)
  try {
    for (const rel of ['products', 'public/downloads', 'scripts/build-pack-manifests.mjs', 'lib']) {
      cpSync(path.join(root, rel), path.join(temp, rel), { recursive: true })
    }
    const run = () => spawnSync(process.execPath, ['scripts/build-pack-manifests.mjs'], { cwd: temp, encoding: 'utf8' })
    const output = path.join(temp, 'lib/pack-manifests.ts')
    const original = readFileSync(output, 'utf8')
    const document = 'products/blueprint/operating-desk-architecture.md'
    const sample = 'products/blueprint/previews/recurring-payer-catalog.sample.csv'
    const paid = read('products/blueprint/recurring-payer-catalog.csv').replace(/\r\n/g, '\n').trimEnd().split('\n')
    const rejected = (rel, text, reason) => {
      writeFileSync(path.join(temp, rel), text)
      const result = run()
      assert.notEqual(result.status, 0, reason)
      assert.match(result.stderr, reason)
      assert.equal(readFileSync(output, 'utf8'), original, 'failed generation retains the complete last safe manifest')
      cpSync(path.join(root, rel), path.join(temp, rel))
    }
    rejected(document, '', /Protected deliverable needs an explicit partial sample/)
    rejected(document, Array.from({ length: 23 }, (_, i) => `Paid detail ${i}`).join('\n'), /Protected preview exceeds half the source lines/)
    rejected(document, ['界'.repeat(3000), ...Array.from({ length: 70 }, (_, i) => `x${i}`)].join('\n'), /Protected preview exceeds half the source bytes/)
    rejected(sample, paid.slice(1).join('\n'), /Protected CSV preview must contain its header and exactly 2 leading records/)
    rejected(sample, [paid[0], paid[2], paid[1]].join('\n'), /Protected CSV preview must contain its header and exactly 2 leading records/)
    rejected(sample, paid.slice(0, 4).join('\n'), /Protected CSV preview must contain its header and exactly 2 leading records/)
    rejected(sample, ['', ...paid.slice(1, 3)].join('\n'), /Protected CSV preview must contain its header and exactly 2 leading records/)
    // Normalized source and sample must regenerate the same serialized payload.
    for (const rel of [sample, 'products/blueprint/recurring-payer-catalog.csv']) {
      writeFileSync(path.join(temp, rel), read(rel).replace(/\r\n/g, '\n').replace(/\n/g, '\r\n'))
    }
    const crlf = run()
    assert.equal(crlf.status, 0, crlf.stderr)
    // File byte metadata legitimately changes with CRLF; the public excerpt does not.
    const generated = readFileSync(output, 'utf8')
    const marker = 'export const PACK_MANIFESTS: Record<string, PackManifest> = '
    const manifest = JSON.parse(generated.split(marker)[1].split('\n\nexport function getPackManifest')[0])
    assert.deepEqual(manifest.blueprint.files.find((f) => f.kind === 'csv').excerpt, paid.slice(0, 3))
  } finally {
    assert.equal(path.dirname(path.resolve(temp)), tempBase)
    rmSync(temp, { recursive: true, force: true })
  }
})
