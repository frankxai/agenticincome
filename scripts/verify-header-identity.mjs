// Reviewed placement pin from frankxai/starlight-estate@d14e0567ef1405432852ab61c1dcb92f368b29e5.
// brand/lock/registry.lock.json: agentic-income.logo-primary.agentic-income-wordmark, site header.
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { isAbsolute, join } from 'node:path'
import { createServer } from 'node:http'
import { once } from 'node:events'

export const webPath = '/brand/wordmark-8c5b7ac822de.svg'
export const expected = '8c5b7ac822de705e183639349f48e70ed37716d6436d9ab0548a06b9a9ca517b'

export const version = '2026-08-07T14:12:50.618Z'

// The deployment operator supplies read-only, current authority mounts and a human-signed
// release decision. A preview can be reviewed before either has been provisioned.
export async function verifyPublication(env) {
  const root = env.VIS_ESTATE_ROOT, revision = env.VERCEL_GIT_COMMIT_SHA || env.VIS_RELEASE_REVISION
  if (!root || !isAbsolute(root) || !/^[a-f0-9]{40}$/.test(revision || '') ||
      !env.VIS_PUBLICATION_APPROVAL_PATH || !env.ESTATE_IDENTITY_OWNER_PUBLIC_KEY) {
    throw Error('Production header requires a current estate mount and signed release decision')
  }
  const {resolveIdentity} = await import(pathToFileURL(join(root,'brand/scripts/identity.mjs')).href)
  const request = {identity_id:'agentic-income',variant:'logo.primary',intended_use:'site header',channel:'website',
    required_approval:'identity',expected_sha256:expected,expected_version:version}
  const receipt = resolveIdentity(request)
  if (receipt.status !== 'resolved' || receipt.sha256 !== expected || receipt.approved_version !== version ||
      receipt.identity_id !== request.identity_id || receipt.variant !== request.variant ||
      receipt.intended_use !== request.intended_use || receipt.channel !== request.channel ||
      receipt.approval_state !== 'canonical') throw Error('Current authority refused the pinned header')
  const {approvedReviewer} = await import(pathToFileURL(join(root,'brand/scripts/promotion-approval.mjs')).href)
  const decision = JSON.parse(readFileSync(env.VIS_PUBLICATION_APPROVAL_PATH,'utf8'))
  return approvedReviewer(decision,['publish_placement','agenticincome.ai','site header','website',revision,
    receipt.asset_id,version,expected],env.ESTATE_IDENTITY_OWNER_PUBLIC_KEY)
}

export function verifyHeader(html, bytes) {
  if (createHash('sha256').update(bytes).digest('hex') !== expected) throw new Error('Header master differs from the estate pin')
  // Next emits this static header on the homepage. Scope to the first home link inside it.
  const header = html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/i)?.[1]
  const link = header?.match(/<a\b[^>]*\shref="\/"[^>]*>([\s\S]*?)<\/a>/i)?.[1]?.trim()
  const image = link?.replace(/^<span\b[^>]*>\s*(<img\s+[^<>]*>)\s*<\/span>$/i, '$1')
  const source = image?.match(/\ssrc="([^"]+)"/i)?.[1] || ''
  const validSource = source === webPath || (source.startsWith(webPath+'?') &&
    /^dpl=dpl_[A-Za-z0-9]+$/.test(source.slice(webPath.length+1)))
  if (!image || !/^<img\s+[^<>]*\/?\s*>$/i.test(image) || !validSource ||
      !/\sstyle="[^"]*\bmax-width:\s*none(?:;|")/i.test(image) ||
      !/\swidth="280"/i.test(image) || !/\sheight="56"/i.test(image) ||
      /\s(?:srcset|hidden)\b/i.test(image) || !/\salt="[^"]+"/i.test(image)) {
    throw new Error('Built homepage header must use only the verified wordmark')
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // The homepage is dynamic. Exercise the built Next route, including its actual image markup.
  if (process.env.VERCEL_ENV === 'production' || process.argv.includes('--release')) await verifyPublication(process.env)
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
