/**
 * Text primitives shared by the adversarial checks.
 *
 * The first version of those checks matched literal phrases, which meant a
 * paraphrase walked through untouched: "recurring revenue that keeps earning
 * while you rest" scored zero against a 31-phrase blacklist that contained
 * every one of its ideas. Everything here exists so a rule can be written
 * against stems and distances instead of exact strings.
 *
 * Pure: no IO, no clock, no regex compiled from user input.
 */

/**
 * Lowercase, strip punctuation and curly quotes, collapse whitespace. `%` and
 * digits survive because a number with a percent sign is itself a claim.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’“”']/g, '')
    .replace(/[^a-z0-9%]+/g, ' ')
    .trim()
}

export function tokenize(text: string): string[] {
  const normalized = normalize(text)
  return normalized.length === 0 ? [] : normalized.split(' ')
}

/**
 * Index of every token beginning with one of the stems. Stems, not words, so
 * "earn", "earns", "earning" and "earnings" are one rule.
 */
export function stemHits(tokens: string[], stems: readonly string[]): number[] {
  const out: number[] = []
  tokens.forEach((token, index) => {
    if (stems.some((stem) => token.startsWith(stem))) out.push(index)
  })
  return out
}

/** Index of every token equal to one of the words. For stems whose prefix is ambiguous ("sign" in "signal"). */
export function wordHits(tokens: string[], words: readonly string[]): number[] {
  const set = new Set(words)
  const out: number[] = []
  tokens.forEach((token, index) => {
    if (set.has(token)) out.push(index)
  })
  return out
}

/** True when any index in `a` is within `window` tokens of any index in `b`. */
export function within(a: number[], b: number[], window: number): boolean {
  return a.some((i) => b.some((j) => Math.abs(i - j) <= window))
}

/** Matched tokens at the given indices, deduped, in graph order. */
export function tokensAt(tokens: string[], indices: number[]): string[] {
  return [...new Set(indices.map((i) => tokens[i]))]
}

/** Whole-phrase match on the normalized text, so "no risk" cannot hide inside "no risks taken". */
export function hasPhrase(normalized: string, phrase: string): boolean {
  return ` ${normalized} `.includes(` ${normalize(phrase)} `)
}

export function matchedPhrases(normalized: string, phrases: readonly string[]): string[] {
  return phrases.filter((phrase) => hasPhrase(normalized, phrase))
}
