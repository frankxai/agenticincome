/** Portable, side-effect-free contract shared by the workbench and MCP. */
export const OFFER_BRIEF_VERSION = 'OfferBrief.v1' as const
export const OFFER_CURRENCIES = ['EUR', 'USD', 'GBP'] as const
export const OFFER_TEXT_LIMITS = {
  sourceTitle: 160, sourceUrl: 2048, excerpt: 2400,
  buyer: 360, offer: 800, experiment: 800, successCriterion: 480,
} as const
export const OFFER_UNIT_LIMIT = 1_000_000

export interface OfferBriefInput {
  sourceTitle: string
  sourceUrl?: string
  sourceDate: string
  excerpt: string
  buyer: string
  offer: string
  currency: (typeof OFFER_CURRENCIES)[number]
  unitPrice: number
  unitCost: number
  experiment: string
  successCriterion: string
}

function requiredText(value: string, label: string, limit: number): string {
  if (typeof value !== 'string' || !value.trim() || value.length > limit) {
    throw new RangeError(`${label} must contain 1 to ${limit} characters.`)
  }
  // Exported text may contain paragraphs, but never invisible control or direction overrides.
  for (const char of value) {
    const point = char.codePointAt(0)!
    if ((point < 32 && ![9, 10, 13].includes(point)) || point === 127 ||
        (point >= 0x202a && point <= 0x202e) || (point >= 0x2066 && point <= 0x2069)) {
      throw new RangeError(`${label} contains an unsupported control character.`)
    }
  }
  return value.trim()
}

function sourceLink(value: string | undefined): string | null {
  if (value === undefined || value === '') return null
  const text = requiredText(value, 'Source link', OFFER_TEXT_LIMITS.sourceUrl)
  try {
    const url = new URL(text)
    if (url.protocol === 'https:' && !url.username && !url.password) return url.href
  } catch {
    // Share the same validation message for an invalid link or scheme.
  }
  throw new RangeError('Use an HTTPS source link without embedded credentials, or leave it blank.')
}

function moneyInCents(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0 || value > OFFER_UNIT_LIMIT ||
      Number(value.toFixed(2)) !== value) {
    throw new RangeError(`${label} must be between 0 and 1,000,000 with at most two decimal places.`)
  }
  return Math.round(value * 100)
}

export function buildOfferBrief(input: OfferBriefInput, asOf = new Date().toISOString().slice(0, 10)) {
  const title = requiredText(input.sourceTitle, 'Source title', OFFER_TEXT_LIMITS.sourceTitle)
  const url = sourceLink(input.sourceUrl)
  const excerpt = requiredText(input.excerpt, 'Source excerpt', OFFER_TEXT_LIMITS.excerpt)
  const date = input.sourceDate
  const parsed = new Date(`${date}T00:00:00Z`)
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new RangeError('Choose a valid source date.')
  }
  if (date > asOf) throw new RangeError('Choose a source date on or before today.')
  const buyer = requiredText(input.buyer, 'Buyer', OFFER_TEXT_LIMITS.buyer)
  const offer = requiredText(input.offer, 'Offer', OFFER_TEXT_LIMITS.offer)
  const experiment = requiredText(input.experiment, 'Experiment', OFFER_TEXT_LIMITS.experiment)
  const successCriterion = requiredText(input.successCriterion, 'Success criterion', OFFER_TEXT_LIMITS.successCriterion)
  if (!OFFER_CURRENCIES.includes(input.currency)) throw new RangeError('Choose EUR, USD or GBP.')

  const price = moneyInCents(input.unitPrice, 'Unit price')
  const cost = moneyInCents(input.unitCost, 'Unit cost')
  const contribution = price - cost
  return {
    version: OFFER_BRIEF_VERSION,
    source: { id: 'S1' as const, title, date, url, excerpt, status: 'user-supplied' as const },
    hypothesis: { buyer, offer, sourceIds: ['S1'], status: 'untested' as const },
    economics: {
      currency: input.currency, unitPrice: price / 100, unitCost: cost / 100,
      contribution: contribution / 100,
      marginPercent: price ? Math.round(contribution / price * 1000) / 10 : null,
    },
    validation: { experiment, successCriterion, status: 'planned' as const },
    approval: { required: true as const, actions: ['Contact buyers', 'Publish the offer', 'Commit to pricing', 'Spend money'] },
  }
}

export type OfferBrief = ReturnType<typeof buildOfferBrief>

// Indented code blocks preserve the owner's text verbatim across Markdown renderers.
// Embedded links, headings and HTML stay inert in the downloaded document.
function literal(text: string): string {
  return text.split(/\r\n?|\n/).map((line) => `    ${line}`).join('\n')
}

export function offerBriefMarkdown(brief: OfferBrief): string {
  const { source, hypothesis, economics, validation } = brief
  const money = (value: number) => `${economics.currency} ${value.toFixed(2)}`
  return [
    '# Offer evidence brief', brief.version,
    '## Source S1', literal(source.title), `Recorded ${source.date}. Supplied by the author.`,
    ...(source.url ? [literal(source.url)] : []), literal(source.excerpt),
    '## Buyer hypothesis', literal(hypothesis.buyer),
    '## Offer hypothesis', literal(hypothesis.offer),
    'S1 informed this hypothesis. Demand still needs a market test.',
    '## Economics per sale', [
      `- Assumed price: ${money(economics.unitPrice)}`,
      `- Assumed variable cost: ${money(economics.unitCost)}`,
      `- Contribution before fixed costs: ${money(economics.contribution)}`,
      `- Contribution margin: ${economics.marginPercent === null ? 'undefined at zero price' : economics.marginPercent + '%'}`,
    ].join('\n'), '## Planned experiment', literal(validation.experiment),
    '## Acceptance criterion', literal(validation.successCriterion),
    '## Owner approval', 'A person approves outreach, publication, pricing commitments and spending.',
  ].join('\n\n') + '\n'
}

function artifactRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new RangeError('Open an OfferBrief.v1 JSON export from this workbench or its MCP tool.')
  }
  return value as Record<string, unknown>
}

/** Reopen site downloads, tool payloads and JSON-RPC envelopes. Ignore derived values and authority. */
export function offerBriefInputFromArtifact(value: unknown): OfferBriefInput {
  let record = artifactRecord(value)
  if ('result' in record) record = artifactRecord(record.result)
  if (record.isError === true) throw new RangeError('The saved tool response contains an error.')
  if ('structuredContent' in record) {
    record = artifactRecord(record.structuredContent)
  } else if (Array.isArray(record.content)) {
    const first = record.content[0]
    const text = first?.type === 'text' ? first.text : undefined
    if (typeof text !== 'string' || text.length > 64_000) throw new RangeError('Choose a JSON offer brief export.')
    try {
      record = artifactRecord(JSON.parse(text))
    } catch {
      throw new RangeError('The saved tool response does not contain an offer brief.')
    }
  }
  if ('brief' in record) record = artifactRecord(record.brief)
  if (record.version !== OFFER_BRIEF_VERSION) throw new RangeError('Choose an OfferBrief.v1 JSON export.')
  const source = artifactRecord(record.source)
  const hypothesis = artifactRecord(record.hypothesis)
  const economics = artifactRecord(record.economics)
  const validation = artifactRecord(record.validation)
  // Build the trusted shape using the same validator as a newly entered source.
  const input = {
    sourceTitle: source.title, sourceUrl: source.url ?? undefined, sourceDate: source.date, excerpt: source.excerpt,
    buyer: hypothesis.buyer, offer: hypothesis.offer, currency: economics.currency,
    unitPrice: economics.unitPrice, unitCost: economics.unitCost,
    experiment: validation.experiment, successCriterion: validation.successCriterion,
  } as OfferBriefInput
  buildOfferBrief(input)
  return input
}
