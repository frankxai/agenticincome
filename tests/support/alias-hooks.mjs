// Resolves the `@/` path alias (tsconfig.json) for route handlers imported
// under plain `node --test`, trying the extensions Next would.
// Load it with `import './support/alias.mjs'` before importing app/ code.
import { existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..', '..')
const EXTENSIONS = ['', '.ts', '.tsx', '.mjs', '.js', '/index.ts']

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const base = path.join(ROOT, specifier.slice(2))
    for (const ext of EXTENSIONS) {
      const candidate = base + ext
      if (existsSync(candidate) && !candidate.endsWith(path.sep)) {
        return nextResolve(pathToFileURL(candidate).href, context)
      }
    }
  }
  // `next` ships no exports map, so ESM needs the file extension spelled out.
  if (specifier === 'next/server') return nextResolve('next/server.js', context)
  return nextResolve(specifier, context)
}
