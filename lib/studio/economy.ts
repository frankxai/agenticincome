import { z } from 'zod'

type Runner = (name: 'list_supply_costs' | 'search_digital_economies', args: Record<string, unknown>) => Promise<unknown>
type Evidence = { answer: string; links: { label: string; href: string }[]; artifact?: { filename: string; markdown: string } }

// The public filters are Vault category IDs, not search keywords. Within a category,
// keep unlike products (speech synthesis vs. transcription; input vs. output) apart.
type CostFocus = [RegExp, string, string, RegExp?]
const costFocus: CostFocus[] = [
  [/transcrib|transcript|speech.to.text|whisper/i, 'media', 'speech transcription', /transcrib|transcript|speech.to.text|whisper/i],
  [/text.to.speech|speech synthesis|voice generation|voiceover|\btts\b/i, 'media', 'speech synthesis', /text.to.speech|speech synthesis|\btts\b/i],
  [/\bvideos?\b|runway|kling/i, 'media', 'video generation', /video/i],
  [/\bimages?\b|megapixel|flux|replicate/i, 'media', 'image generation', /image|megapixel/i],
  [/\baudio\b|elevenlabs|suno/i, 'media', 'audio tools', /speech|voice|audio|elevenlabs|suno/i],
  [/gpu|h100|runpod|lambda/i, 'gpu', 'GPU compute'],
  [/pgvector|supabase|redis|upstash|pinecone|vector database|turbopuffer/i, 'memory', 'data infrastructure'],
  [/stablecoin|onchain|x402|agent payments?/i, 'agent-payments', 'agent payment rails'],
  [/stripe|whop|polar|gumroad|paddle|lemon squeezy|payment processing|card processing|checkout|merchant.of.record/i, 'payments', 'payment processing'],
  [/inference|tokens?|anthropic|claude|openai|gpt|gemini|openrouter|groq|together ai/i, 'inference', 'model inference'],
]
const sectorFocus: [RegExp, string][] = [
  [/templates?/i, 'templates'], [/music|royalt/i, 'music'], [/games?|gaming/i, 'games'], [/creative economy|creators?/i, 'creator'],
  [/app stores?|mobile apps?/i, 'apps'], [/digital.goods|digital.assets/i, 'digital-goods'], [/freelance|services/i, 'services'],
  [/ecommerce|e-commerce/i, 'commerce'], [/b2b.software|saas/i, 'b2b-software'], [/agent marketplaces?/i, 'ai-agents'],
]
const marketNames = ['Shopify App Store','Shopify','Apple App Store','Google Play','Steam','Fortnite','Roblox','Patreon','Substack','YouTube','Spotify','Bandcamp','DistroKid','Envato','Gumroad','Whop','AWS Marketplace','Apify','RapidAPI','Notion','Framer','Webflow','Fiverr','Upwork','Kindle','Etsy','Unity','Hugging Face']
const sellers = ['ElevenLabs','Suno','Replicate','Runway','fal.ai','RunPod','Lambda','Together AI','OpenAI','Anthropic','Google','OpenRouter','Groq','Supabase','Pinecone','turbopuffer','Upstash','Stripe','Whop','Polar','Paddle','Lemon Squeezy','Gumroad','Coinbase']
const isCost = /cost|pric|how much|how expensive|cheaper|compare|fee|rate|budget|charge|per (?:minute|hour|second|token)|estimate/i
const isMarket = /payout|take.rate|royalt|gmv|gross merchandise|market(?:place)? (?:size|data|research|fee|economics)|marketplaces?|sector|billings|sales volume|earnings|transaction volume|how (?:big|large)/i
const excluded = /\b(affiliate|referral|partner programs?)\b/i

function marketNamesIn(text: string) {
  const matched: string[] = []
  for (const name of marketNames) {
    if (text.toLowerCase().includes(name.toLowerCase()) && !matched.some(n => n.includes(name))) matched.push(name)
  }
  return matched.slice(0, 2)
}

export function isVaultQuestion(text: string): boolean {
  if (excluded.test(text) || /\b(?:i (?:charge|keep|sell)|my (?:selling price|margin)|contribution margin|costs? .*to deliver)\b/i.test(text)) return false
  return isMarket.test(text) || (isCost.test(text) && (costFocus.some(([rx]) => rx.test(text)) || marketNamesIn(text).length > 0 ||
    (sectorFocus.some(([rx]) => rx.test(text)) && /market|sector|store/i.test(text))))
}

const sourceFields = { sourceUrl: z.url().startsWith('https://'), retrievedAt: z.string(), verification: z.object({ confirmed: z.literal(true) }) }
const costSchema = z.object({ ...sourceFields, vendor: z.string(), item: z.string(), unit: z.string(), priceText: z.string(), price: z.number().nullable(), priceKind: z.enum(['rate', 'unit']) })
const marketSchema = z.object({ ...sourceFields, name: z.string(), metric: z.string(), valueText: z.string(), period: z.string().optional() })
type CostRow = z.infer<typeof costSchema>
const atlas = { label: 'Explore the Economy Vault', href: '/atlas' }
const includes = (text: string, term: string) => text.toLowerCase().includes(term.toLowerCase())

// Multiply only unambiguous, compatible quantities. Never turn token tiers,
// transaction schedules, free allowances or monthly minima into per-job prices.
function calculation(text: string, row: CostRow) {
  if (row.priceKind !== 'unit' || row.price == null || row.price < 0) return ''
  // Do not extrapolate from input runtime, ranges, or compound durations.
  if (/input video|footage|transcod|edit(?:ing)?|analys|\d\s*(?:[-–]|to\s*\d)|\b(?:between|or|plus)\b|\b(?:second|minute|hour)s?\s+and\b/i.test(text)) return ''
  const quantities = [...text.matchAll(/(?:^|\s)(an?|one|\d+(?:\.\d+)?)\s*[- ]?\s*(seconds?|minutes?|hours?|images?|megapixels?)\b/gi)]
  if (quantities.length !== 1) return ''
  const [,raw,unit] = quantities[0]
  let qty = /^(?:an?|one)$/i.test(raw) ? 1 : Number(raw)
  let basis = ''
  if (row.unit === 'USD per second of video' && /^(second|minute|hour)/i.test(unit)) {
    qty *= /^hour/i.test(unit) ? 3600 : /^minute/i.test(unit) ? 60 : 1
    basis = 'seconds of generated video'
  } else if (/transcrib|transcript|speech.to.text/i.test(row.item) && /^USD per (minute|hour) of audio$/i.test(row.unit) && /^(second|minute|hour)/i.test(unit)) {
    const seconds = qty * (/^hour/i.test(unit) ? 3600 : /^minute/i.test(unit) ? 60 : 1)
    const hourly = / per hour /i.test(row.unit)
    qty = seconds / (hourly ? 3600 : 60)
    basis = (hourly ? 'hours' : 'minutes')+' of audio'
  } else if (row.unit === 'USD per GPU-hour' && /^hour/i.test(unit)) basis = 'GPU-hours'
  else if (row.unit === 'USD per megapixel' && /^megapixel/i.test(unit)) basis = 'megapixels'
  else if (row.unit === 'USD per output image' && /^image/i.test(unit)) basis = 'output images'
  if (!basis || !(qty > 0 && qty <= 1e8)) return ''
  const usd = (n: number) => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:5}).format(n)
  return ' At list price: ' + qty + ' ' + basis + ' × ' + usd(row.price) + ' = ' + usd(qty * row.price) + ' in vendor usage.'
}

function evidence(answer: string, links: Evidence['links'], title: string): Evidence {
  const sources = [...new Map([...links, atlas].map(l => [l.href, l])).values()]
  return { answer, links: sources, artifact: { filename:'economy-vault-research.md', markdown:'# '+title+'\n\n'+answer+'\n\n'+sources.map(s => '- '+s.label+': '+new URL(s.href,'https://www.agenticincome.ai').href).join('\n')+'\n' } }
}

export async function gatherVault(context: string, run: Runner): Promise<Evidence> {
  const turns = context.trim().split('\n')
  const latest = turns.at(-1) ?? context
  const text = isVaultQuestion(latest) ? latest : context
  const subject = costFocus.find(([rx]) => rx.test(text))
  const markets = marketNamesIn(text)
  if (subject && (!isMarket.test(text) || (!markets.length && !sectorFocus.some(([rx])=>rx.test(text))))) {
    const [, category, label, match] = subject
    const parsed = z.object({ rows: z.array(costSchema) }).parse(await run('list_supply_costs', { category, confirmedOnly:true }))
    const latestSellers = sellers.filter(s => includes(latest,s))
    const requested = latestSellers.length ? latestSellers : sellers.filter(s => includes(text,s))
    const directions = ['input','output'].filter(w=>new RegExp('\\b'+w+'\\b','i').test(text))
    const facets = ['haiku','opus','sonnet','fable','gemini','gpt','kling','flux'].filter(s=>new RegExp('\\b'+s+'\\b','i').test(text))
    if (directions.length === 1) facets.push(...directions)
    const rows = parsed.rows.filter(r => (!match || match.test(r.vendor+' '+r.item+' '+r.unit)) && facets.every(f=> includes(r.item,f)))
    const shortlist = requested.length ? requested.flatMap(v => rows.filter(r => includes(r.vendor,v)).slice(0,2)) : rows.slice(0,3)
    const missing = requested.filter(v=>!shortlist.some(r=>includes(r.vendor,v)))
    const lines = shortlist.slice(0,5).map(r => '**'+r.vendor+' · '+r.item+'** — '+r.priceText+' ('+r.unit+').'+calculation(latest,r)+' Source captured '+r.retrievedAt+'.')
    const noRate = 'The Vault has no confirmed '+label+' rate for '+(missing.length ? missing.join(', ') : 'this request')+'.'
    if (!lines.length || missing.length) lines.push(noRate+(label === 'speech transcription' ? ' A text-to-speech rate prices the opposite job and cannot support a transcription estimate.' : ' Supply a dated vendor quote to price it.'))
    const answer = lines.join('\n\n')+(shortlist.length ? '\n\nThese are recorded vendor prices. Confirm the plan, region and billing unit before quoting a client; review labor and retries are additional.' : '')
    return evidence(answer,shortlist.map(r=>({label:r.vendor+' pricing',href:r.sourceUrl})), 'Supply cost research')
  }
  const sector = sectorFocus.find(([rx])=>rx.test(text))?.[1]
  if (!markets.length && !sector) return { answer:'Which marketplace or sector should I look up? The Economy Vault tracks dated payouts, sales volume and fees separately. Try “music industry payouts” or “Notion Marketplace fees”.', links:[atlas] }
  let metric: RegExp | undefined
  if (/payout|royalt|earnings/i.test(text)) metric = /payout|royalt|earning|payments? (?:from|to)/i
  else if (/\bgmv\b|merchandise volume/i.test(text)) metric = /gmv|merchandise volume/i
  else if (/fee|take.rate/i.test(text)) metric = /fee|revenue share|take.rate/i
  const results = []
  const missingMarkets: string[] = []
  for (const query of markets.length ? markets : [undefined]) {
    const result = z.object({rows:z.array(marketSchema)}).parse(await run('search_digital_economies', { ...(query ? {query} : {sector}),confirmedOnly:true }))
    const matches = result.rows.filter(r=>!metric || metric.test(r.metric)).slice(0,2)
    if (!matches.length && query) missingMarkets.push(query)
    results.push(...matches)
  }
  const where = markets.join(' / ') || sector
  const answer = results.length ? results.map(r=>'**'+r.name+' · '+r.metric+'** — '+r.valueText+(r.period ? ' ('+r.period+')' : '')+'. Source captured '+r.retrievedAt+'.').join('\n\n')+'\n\nKeep each figure attached to its metric and period. Platform volume is not the income an individual seller can expect.'
    : 'No confirmed record matches that metric for '+where+'. The Vault does not substitute platform sales for payouts or extrapolate an individual seller’s income.'
  const missingNote = results.length && missingMarkets.length ? '\n\nNo confirmed record matched the same metric for '+missingMarkets.join(' / ')+'.' : ''
  return evidence(answer+missingNote, results.map(r=>({label:r.name+' · source',href:r.sourceUrl})), 'Marketplace research')
}
