import { z } from 'zod'
import { analyticsClientKey, consumeAnalyticsRateLimit, hasJsonContentType, isSameOriginRequest } from '../../../../lib/api-security.ts'
import { studioChat } from '../../../../lib/studio/chat.ts'

export const runtime = 'nodejs'
export const maxDuration = 25
const MAX_BYTES = 30_000
const messages = z.strictObject({messages:z.array(z.discriminatedUnion('role',[
  z.strictObject({role:z.literal('user'),content:z.string().trim().min(1).max(1500)}),
  z.strictObject({role:z.literal('assistant'),content:z.string().trim().min(1).max(3500)}),
])).min(1).max(8)})
const respond = (body:unknown,status = 200,extra:Record<string,string> = {}) => Response.json(body,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff',...extra}})
const invalid = () => respond({error:'Send up to eight conversation messages ending with your question.'},400)
async function readInput(req:Request) {
  if (!req.body) return invalid()
  if (Number(req.headers.get('content-length')) > MAX_BYTES) return respond({error:'Conversation is too large.'},413)
  const reader = req.body.getReader()
  const timeout = AbortSignal.any([req.signal,AbortSignal.timeout(3000)])
  const cancel = () => { void reader.cancel().catch(()=>{}) }
  timeout.addEventListener('abort',cancel,{once:true})
  const decoder = new TextDecoder('utf-8',{fatal:true})
  let size = 0, value = ''
  try {
    while (true) {
      timeout.throwIfAborted()
      const item = await reader.read()
      if (item.done) break
      size += item.value.length
      if (size > MAX_BYTES) return respond({error:'Conversation is too large.'},413)
      value += decoder.decode(item.value,{stream:true})
    }
    timeout.throwIfAborted()
    const result = messages.safeParse(JSON.parse(value+decoder.decode()))
    if (!result.success || result.data.messages.at(-1)?.role !== 'user') return invalid()
    return result.data.messages
  } catch { return invalid() }
  finally { timeout.removeEventListener('abort',cancel); await reader.cancel().catch(()=>{}) }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return respond({error:'Open this conversation on Agentic Income.'},403)
  if (!hasJsonContentType(request)) return invalid()
  const client = analyticsClientKey(request) ?? 'anonymous'
  const limit = consumeAnalyticsRateLimit('studio:'+client)
  if (!limit.allowed) return respond({error:'Pause for a minute before the next question.'},429,{'Retry-After':String(limit.retryAfterSeconds)})
  const input = await readInput(request)
  if (input instanceof Response) return input
  try { return respond(await studioChat(input,client,request.signal)) }
  catch { return respond({error:'The research tools could not complete this turn. Please try again.'},503) }
}
