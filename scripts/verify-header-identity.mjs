// Reviewed placement pin from frankxai/starlight-estate@d14e0567ef1405432852ab61c1dcb92f368b29e5.
// brand/lock/registry.lock.json: agentic-income.logo-primary.agentic-income-wordmark, site header.
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import { createServer } from 'node:http'
import { once } from 'node:events'

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
  // The homepage is dynamic. Exercise the built Next route, including its actual image markup.
  const { default: next } = await import('next')
  const app = next({ dev: false, dir: process.cwd(), hostname: '127.0.0.1' })
  await app.prepare()
  const server = createServer(app.getRequestHandler())
  try {
    server.listen(0, '127.0.0.1')
    await once(server, 'listening')
    const url = 'http://127.0.0.1:' + server.address().port
    const page = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30000) })
    if (!page.ok) throw new Error('Local homepage returned ' + page.status)
    verifyHeader(await page.text(), readFileSync(join('public', webPath)))
  } finally {
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
    await app.close()
  }
}
