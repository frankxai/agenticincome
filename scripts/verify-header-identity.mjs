// Reviewed placement pin from frankxai/starlight-estate@d14e0567ef1405432852ab61c1dcb92f368b29e5.
// brand/lock/registry.lock.json: agentic-income.logo-primary.agentic-income-wordmark, site header.
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'

export const webPath = '/brand/wordmark-8c5b7ac822de.svg'
export const expected = '8c5b7ac822de705e183639349f48e70ed37716d6436d9ab0548a06b9a9ca517b'

export function verifyHeader(html, bytes) {
  if (createHash('sha256').update(bytes).digest('hex') !== expected) throw new Error('Header master differs from the estate pin')
  // Next emits this static header on the homepage. Scope to the first home link inside it.
  const header = html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/i)?.[1]
  const link = header?.match(/<a\b[^>]*\shref="\/"[^>]*>([\s\S]*?)<\/a>/i)?.[1]?.trim()
  const image = link?.replace(/^<span\b[^>]*>\s*(<img\s+[^<>]*>)\s*<\/span>$/i, '$1')
  if (!image || !/^<img\s+[^<>]*\/?\s*>$/i.test(image) || !image.includes(' src="' + webPath + '"') ||
      /\s(?:srcset|hidden)\b/i.test(image) || !/\salt="[^"]+"/i.test(image)) {
    throw new Error('Built homepage header must use only the verified wordmark')
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  verifyHeader(readFileSync('.next/server/app/index.html', 'utf8'), readFileSync(join('public', webPath)))
}
