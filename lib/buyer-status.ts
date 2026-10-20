/**
 * Buyer-facing wording for a catalog `status`. The status string itself stays the
 * machine-readable sale gate read by lib/polar.ts; this only decides what a visitor
 * reads. Anything that is not clearly free or for sale reads as "Not on sale yet", so
 * a new or misspelled status can never make a product look available.
 */
export function buyerStatus(status: string, priceCents: number): string {
  const normalized = status.trim().toLowerCase()
  if (priceCents === 0 || normalized.startsWith('free')) return 'Free, delivered on this site'
  if (normalized.startsWith('for sale')) return 'For sale, by private delivery'
  return 'Not on sale yet'
}
