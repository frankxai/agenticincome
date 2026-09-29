import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import test from 'node:test'

// Next.js replaces a parent's openGraph object instead of merging it, so a page
// that sets openGraph without baseOpenGraph serves no og:image. The root page
// shares its segment with app/opengraph-image.tsx and keeps the image without it.
test('every page that sets openGraph keeps the shared preview image', () => {
  const root = new URL('../app/', import.meta.url)
  const pages = readdirSync(root, { recursive: true })
    .map(String)
    .filter((entry) => /(^|[\\/])page\.(tsx|mdx)$/.test(entry) && entry !== 'page.tsx')
  assert.ok(pages.length > 0)

  for (const page of pages) {
    const source = readFileSync(new URL(page, root), 'utf8')
    if (!/\bopenGraph:\s*\{/.test(source)) continue
    assert.match(source, /\.\.\.baseOpenGraph/, `app/${page} sets openGraph without baseOpenGraph`)
  }
})
