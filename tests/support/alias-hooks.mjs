// Resolves the `@/` path alias (tsconfig.json) for route handlers imported
// under plain `node --test`, trying the extensions Next would.
// Load it with `import './support/alias.mjs'` before importing app/ code.
import { readFileSync, statSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..', '..')
const EXTENSIONS = ['', '.ts', '.tsx', '.mjs', '.js', '/index.ts']

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const base = path.join(ROOT, specifier.slice(2))
    for (const ext of EXTENSIONS) {
      const candidate = base + ext
      if (statSync(candidate, { throwIfNoEntry: false })?.isFile()) {
        return nextResolve(pathToFileURL(candidate).href, context)
      }
    }
  }
  // Shared packages import siblings without an extension, as bundlers allow (lib/demand-capture/handler.ts).
  if (specifier.startsWith('.') && !/\.[cm]?[jt]sx?$|\.json$/.test(specifier) && context.parentURL?.startsWith('file:')) {
    const base = path.resolve(path.dirname(new URL(context.parentURL).pathname), specifier)
    for (const ext of ['.ts', '.tsx', '/index.ts']) {
      if (statSync(base + ext, { throwIfNoEntry: false })?.isFile()) return nextResolve(pathToFileURL(base + ext).href, context)
    }
  }
  // `next` ships no exports map, so ESM needs the file extension spelled out.
  if (specifier === 'next/server') return nextResolve('next/server.js', context)
  return nextResolve(specifier, context)
}

// App code imports JSON the way Next permits (without an import attribute).
// Plain Node ESM rejects that at load time, so read it here before validation.
export async function load(url, context, nextLoad) {
  if (url.endsWith('.json')) {
    return { format: 'json', source: readFileSync(new URL(url), 'utf8'), shortCircuit: true }
  }
  return nextLoad(url, context)
}

