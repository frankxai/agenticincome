// No prompt text or IP address is persisted. Only short-lived counters go into Redis.
import { getVercelOidcToken } from '@vercel/oidc'

export const gatewayEvent = (reason: string, status?: number) => console.info(JSON.stringify({event:'studio_gateway',reason,...(status ? {status} : {})}))

const DAILY_MAX = 100, CLIENT_MAX = 12, PREVIEW_INSTANCE_MAX = 12
let previewDay = '', previewTurns = 0
const reservation = `if tonumber(redis.call('GET',KEYS[1]) or 0)>=tonumber(ARGV[1]) or tonumber(redis.call('GET',KEYS[2]) or 0)>=tonumber(ARGV[2]) then return 0 end
for i=1,2 do redis.call('INCR',KEYS[i]); redis.call('EXPIRE',KEYS[i],90000) end
return 1`

async function reserve(client: string, signal: AbortSignal) {
  const day = new Date().toISOString().slice(0,10)
  for (const [url, token] of [
    [process.env.KV_REST_API_URL, process.env.KV_REST_API_TOKEN],
    [process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN],
  ]) {
    if (!url || !token) continue
    if (new URL(url).protocol !== 'https:') return false
    const key = 'agentic-income:studio:' + (process.env.VERCEL_ENV || 'development') + ':' + day
    const res = await fetch(url, { method: 'POST', signal, redirect: 'error', cache: 'no-store',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', reservation, 2, key, key + ':' + client, DAILY_MAX, CLIENT_MAX]),
    })
    return res.ok && (await res.json()).result === 1
  }
  // Public production must have a shared, atomic spend ceiling. A Vercel
  // preview or explicit local development key can smoke-test on a small allowance.
  if (process.env.VERCEL_ENV !== 'preview' && (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production')) return false
  if (previewDay !== day) { previewDay = day; previewTurns = 0 }
  return ++previewTurns <= PREVIEW_INSTANCE_MAX
}

export async function openGateway(client: string, signal: AbortSignal) {
  if (process.env.STUDIO_MODEL_DISABLED === '1') return null
  try {
    const token = process.env.AI_GATEWAY_API_KEY ||
      (process.env.VERCEL === '1' || process.env.VERCEL_OIDC_TOKEN ? await getVercelOidcToken() : null)
    if (!token) { gatewayEvent('no_gateway_auth'); return null }
    if (!await reserve(client,signal)) { gatewayEvent('no_allowance'); return null }
    return async (messages: unknown[], options: Record<string, unknown>) => {
      const res = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
        method: 'POST', cache: 'no-store', redirect: 'error', signal,
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'openai/gpt-4.1-mini', temperature: 0.25, messages, ...options }),
      })
      if (!res.ok) { gatewayEvent('gateway_refused',res.status); throw Error('Gateway unavailable') }
      const message: unknown = (await res.json()).choices?.[0]?.message
      if (!message) throw Error('Gateway returned no answer')
      return message
    }
  } catch { gatewayEvent('auth_or_quota_unavailable'); return null }
}
