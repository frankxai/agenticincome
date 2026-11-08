/**
 * Read-side of the digital economy vault for agent tools. Pure: callers pass the
 * vault data in, so the MCP route, the atlas build and the node tests all agree.
 * Nothing here forecasts revenue. Margins are arithmetic over sourced list prices.
 */

export type VerificationVerdict =
  | 'number-found'
  | 'reviewer-confirmed'
  | 'live-counter'
  | 'number-missing'
  | 'unreachable'
  | 'no-number'

type Sourced = { id: string; sourceUrl: string }

export type EconomyRow = Sourced & {
  name: string
  platform?: string
  sector: string
  metric: string
  value: number | null
  unit: string
  valueText: string
  period?: string
  takeRate?: string | null
  takeRateFraction?: number | null
  retrievedAt: string
}

export type SupplyRow = Sourced & {
  vendor: string
  category: string
  item: string
  price: number | null
  priceKind: 'unit' | 'rate'
  unit: string
  priceText: string
  rate?: number
  fixedUsd?: number
  /** Set on partner payouts to us; such a row is income, never a selling fee. */
  commissionRate?: number
  retrievedAt: string
}

export type VaultData = {
  economies: { rows: EconomyRow[] }
  supply: { rows: SupplyRow[] }
  verification: { checkedAt: string; results: { id: string; verdict: VerificationVerdict }[] }
}

/** Verdicts that mean a person or a page fetch saw the value on its own source. Live counters drift, so they are excluded. */
export const CONFIRMED: ReadonlySet<VerificationVerdict> = new Set(['number-found', 'reviewer-confirmed'])

const positive = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0

function verdicts(v: VaultData): Map<string, VerificationVerdict> {
  return new Map(v.verification.results.map((r) => [r.id, r.verdict]))
}

function withCheck<T extends Sourced>(row: T, map: Map<string, VerificationVerdict>, checkedAt: string) {
  const verdict = map.get(row.id) ?? 'unreachable'
  return { ...row, verification: { verdict, confirmed: CONFIRMED.has(verdict), checkedAt } }
}

export function searchEconomies(v: VaultData, opts: { sector?: string; query?: string; confirmedOnly?: boolean } = {}) {
  const map = verdicts(v)
  const q = opts.query?.trim().toLowerCase()
  return v.economies.rows
    .filter((r) => !opts.sector || r.sector === opts.sector)
    .filter((r) => !q || `${r.name} ${r.metric}`.toLowerCase().includes(q))
    .map((r) => withCheck(r, map, v.verification.checkedAt))
    .filter((r) => !opts.confirmedOnly || r.verification.confirmed)
}

export function supplyCosts(v: VaultData, opts: { category?: string; confirmedOnly?: boolean } = {}) {
  const map = verdicts(v)
  return v.supply.rows
    .filter((r) => !opts.category || r.category === opts.category)
    .map((r) => withCheck(r, map, v.verification.checkedAt))
    .filter((r) => !opts.confirmedOnly || r.verification.confirmed)
}

export type MarginInput = {
  priceUsd: number
  costLines: { supplyId: string; quantity: number }[]
  feeSupplyIds?: string[]
  takeRateFrom?: string
}

export type MarginResult =
  | { ok: true; priceUsd: number; costUsd: number; keepUsd: number; grossMarginPct: number; lines: { label: string; usd: number; sourceUrl: string }[] }
  | { ok: false; refused: string[] }

/** Unit margin from sourced rows. Refuses unknown, unpriced or unconfirmed inputs instead of guessing. */
export function unitMargin(v: VaultData, input: MarginInput): MarginResult {
  if (!positive(input.priceUsd)) return { ok: false, refused: ['priceUsd must be a finite number greater than 0'] }
  const map = verdicts(v)
  const supply = new Map(v.supply.rows.map((r) => [r.id, r]))
  const econ = new Map(v.economies.rows.map((r) => [r.id, r]))
  const refused: string[] = []
  const lines: { label: string; usd: number; sourceUrl: string }[] = []
  const confirmed = (id: string) => CONFIRMED.has(map.get(id) ?? 'unreachable')

  for (const c of input.costLines) {
    const row = supply.get(c.supplyId)
    if (!positive(c.quantity)) refused.push(`${c.supplyId}: quantity must be a finite number greater than 0`)
    else if (!row || row.priceKind !== 'unit' || typeof row.price !== 'number') refused.push(`${c.supplyId}: no unit price`)
    else if (!confirmed(row.id)) refused.push(`${c.supplyId}: source not confirmed`)
    else lines.push({ label: `${row.vendor}: ${row.item} x ${c.quantity}`, usd: c.quantity * row.price, sourceUrl: row.sourceUrl })
  }
  for (const id of input.feeSupplyIds ?? []) {
    const row = supply.get(id)
    const hasTerms = row && (typeof row.rate === 'number' || typeof row.fixedUsd === 'number')
    if (!row || row.priceKind !== 'rate' || typeof row.commissionRate === 'number') refused.push(`${id}: not a selling fee row`)
    else if (!hasTerms) refused.push(`${id}: fee terms not machine-readable (no rate or fixed fee)`)
    else if (!confirmed(row.id)) refused.push(`${id}: source not confirmed`)
    else lines.push({ label: `${row.vendor} fee`, usd: input.priceUsd * (row.rate ?? 0) + (row.fixedUsd ?? 0), sourceUrl: row.sourceUrl })
  }
  if (input.takeRateFrom) {
    const row = econ.get(input.takeRateFrom)
    if (!row || typeof row.takeRateFraction !== 'number') refused.push(`${input.takeRateFrom}: no base take rate`)
    else if (!confirmed(row.id)) refused.push(`${input.takeRateFrom}: source not confirmed`)
    else lines.push({ label: `${row.platform ?? row.name} take rate`, usd: input.priceUsd * row.takeRateFraction, sourceUrl: row.sourceUrl })
  }
  if (refused.length) return { ok: false, refused }

  const costUsd = lines.reduce((a, l) => a + l.usd, 0)
  const keepUsd = input.priceUsd - costUsd
  return { ok: true, priceUsd: input.priceUsd, costUsd, keepUsd, grossMarginPct: (keepUsd / input.priceUsd) * 100, lines }
}
