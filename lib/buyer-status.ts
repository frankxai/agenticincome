/**
 * Buyer-facing wording for a catalog `status`. The status string itself stays the
 * machine-readable sale gate read by lib/polar.ts; this only decides what a visitor
 * reads. "Free" needs both a zero price and a status that says free, "For sale" needs
 * the same prefix the gate needs, and everything else reads "Not on sale yet", so a
 * new or misspelled status can never make a product look available.
 */
export function buyerStatus(status: string, priceCents: number): string {
  const normalized = status.trim().toLowerCase()
  if (priceCents === 0 && normalized.startsWith('free')) return 'Free, delivered on this site'
  if (priceCents > 0 && normalized.startsWith('for sale')) return 'For sale, by private delivery'
  return 'Not on sale yet'
}
