import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = (path) => readFileSync(join(root, path), 'utf8')

function filesUnder(dir, extensions) {
  return readdirSync(join(root, dir), { recursive: true })
    .map(String)
    .filter((entry) => extensions.some((extension) => entry.endsWith(extension)))
    .map((entry) => join(dir, entry))
}

// A date that tells readers when something will be checked or expires is a promise.
// Once the date has passed, the page is still making it. Fix the data or remove the
// field; do not bump the date without doing the check.
test('no forward-looking date in shipped source has already passed', () => {
  const forwardKeys = /\b(nextReview|reviewBy|reviewDue|nextCheck|validUntil|expiresOn)\b["']?\s*[:=]\s*["'](\d{4}-\d{2}-\d{2})["']/g
  const today = new Date().toISOString().slice(0, 10)
  const files = ['app', 'components', 'lib', 'data'].flatMap((dir) => filesUnder(dir, ['.ts', '.tsx', '.mdx', '.json']))
  assert.ok(files.length > 0)

  const pastDue = []
  for (const file of files) {
    for (const [, key, date] of read(file).matchAll(forwardKeys)) {
      if (date < today) pastDue.push(`${relative('.', file)}: ${key} ${date} is before ${today}`)
    }
  }
  assert.deepEqual(pastDue, [])
})

// The trust desk reads its "payout checked" date from data/programs.json. A date typed
// into the component, other than one the catalog also holds, is a claim with no source.
test('trust desk dates trace to the program catalog', () => {
  const source = read('components/TrustComparisonDesk.tsx')
  assert.ok(!/\b(lastVerified|nextReview)\b/.test(source), 'route dates must come from the catalog, not be typed per card')

  const catalog = JSON.parse(read('data/programs.json'))
  const catalogDates = new Set(
    catalog.programs.flatMap((program) => [program.verifiedAt, program.commissionVerifiedAt]).filter(Boolean),
  )
  for (const [date] of source.matchAll(/\d{4}-\d{2}-\d{2}/g)) {
    assert.ok(catalogDates.has(date), `components/TrustComparisonDesk.tsx names ${date}, which no catalog row holds`)
  }
})

// Blog comparison tables state prices that vendors change. Each priced row has to link
// the vendor's own pricing page, and the table has to say when the prices were read.
test('priced blog comparison rows link a vendor pricing page and carry an as-of date', () => {
  const posts = filesUnder('app/blog', ['page.mdx'])
  assert.ok(posts.length > 0)
  const asOf = /as of (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}/i

  let pricedTables = 0
  for (const post of posts) {
    const source = read(post)
    for (const [table] of source.matchAll(/<ComparisonTable[\s\S]*?\/>/g)) {
      const rows = table.split('\n').filter((line) => /^\s*\{\s*tool:/.test(line))
      const priced = rows.filter((row) => /\d/.test(row.match(/price:\s*'((?:[^'\\]|\\.)*)'/)?.[1] ?? ''))
      if (priced.length === 0) continue
      pricedTables += 1

      assert.match(table, asOf, `${relative('.', post)}: a table with prices needs "as of <Month> <Year>" in its caption`)
      for (const row of priced) {
        const tool = row.match(/tool:\s*'([^']+)'/)?.[1]
        assert.match(row, /priceUrl:\s*'https:\/\/[^']+'/, `${relative('.', post)}: ${tool} states a price without a priceUrl`)
      }
    }
  }
  assert.ok(pricedTables > 0, 'expected at least one priced comparison table')
})
