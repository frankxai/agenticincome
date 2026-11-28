// All operations before display are in integer cents and hundredths of a percent.
// Round up: a rounded-down quote can miss the requested margin.
export function minimumOfferPrice(input: {currency: 'EUR' | 'USD' | 'GBP'; unitCost: number; targetMarginPercent: number}) {
  const {currency, unitCost, targetMarginPercent} = input
  const cents = Math.round(unitCost * 100)
  const bp = Math.round(targetMarginPercent * 100)
  if (!['EUR','USD','GBP'].includes(currency) || !Number.isFinite(cents + bp) ||
      unitCost < 0 || unitCost > 1_000_000 || cents / 100 !== unitCost ||
      targetMarginPercent < 0 || bp >= 10000 || bp / 100 !== targetMarginPercent) {
    throw new RangeError('Supply a nonnegative per-sale cost and a target margin below 100%, with at most two decimal places.')
  }
  const price = Math.max(1, Math.ceil(cents * 10000 / (10000 - bp)))
  return { currency, unitCost, targetMarginPercent, minimumPrice: price / 100,
    contribution: (price - cents) / 100,
    basis: 'Unit contribution before fixed costs and tax. Cost is assumed constant over the prices considered. This is not evidence of buyer demand.' }
}
