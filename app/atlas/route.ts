import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { atlasDocument, atlasEnabled } from '@/lib/atlas-page'

// Internal economy atlas, generated from vault/*.json by scripts/vault-atlas.mjs.
export async function GET() {
  if (!atlasEnabled(process.env)) {
    return new Response('Not found', { status: 404, headers: { 'x-robots-tag': 'noindex, nofollow' } })
  }
  const fragment = await readFile(path.join(process.cwd(), 'vault', 'atlas.html'), 'utf8')
  return new Response(atlasDocument(fragment), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  })
}
