#!/usr/bin/env node
// Minimal internal link checker for the income network sites.
// Validates that links in MDX and components point to existing routes or external go./affiliate targets.
// Extend as the catalog and post surface grows.

import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const APP = path.join(ROOT, 'app')
const MDX_EXT = '.mdx'

const knownRoutes = new Set([
  '/', '/blog', '/start', '/tools', '/offers', '/trust', '/delivery/starter-kit', '/delivery/blueprint', '/delivery/private-intel',
])

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p, acc)
    else acc.push(p)
  }
  return acc
}

const files = walk(APP).filter(f => f.endsWith('.tsx') || f.endsWith(MDX_EXT) || f.endsWith('.ts'))

let errors = 0

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  const links = [...content.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1])

  for (const href of links) {
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#') || href.startsWith('/go.') || href.startsWith('/downloads/')) continue
    if (href.startsWith('/blog/') || href.startsWith('/')) {
      const clean = href.split('?')[0].split('#')[0]
      if (!knownRoutes.has(clean) && !fs.existsSync(path.join(APP, clean.replace(/^\//, '') + '/page.tsx')) && !fs.existsSync(path.join(APP, clean.replace(/^\//, '') + '/page.mdx'))) {
        // Allow dynamic blog slugs
        if (clean.startsWith('/blog/')) continue
        if (clean.startsWith('/offers/')) continue
        if (clean.startsWith('/api/')) continue
        console.error(`[links] ${path.relative(ROOT, file)} → unknown internal: ${href}`)
        errors++
      }
    }
  }
}

if (errors) {
  console.error(`\n${errors} internal link issues found.`)
  process.exit(1)
}
console.log('✓ internal links look good (static check)')
