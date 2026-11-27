import economies from '@/vault/economies.json'
import supply from '@/vault/supply-chain.json'
import verification from '@/vault/verification.json'
import { searchEconomies, supplyCosts, type VaultData } from '@/lib/vault'

// The public catalog uses only revisioned, redistributable data shipped in this repository.
export const publicVault: VaultData = {
  economies: economies as VaultData['economies'],
  supply: supply as VaultData['supply'],
  verification: verification as VaultData['verification'],
}

export function marketEvidence(sector?: string, query?: string, confirmedOnly = true) {
  const rows = searchEconomies(publicVault, { sector, query, confirmedOnly })
  return { checkedAt: publicVault.verification.checkedAt, confirmedOnly, count: rows.length, rows }
}

export function costEvidence(category?: string, confirmedOnly = true) {
  const rows = supplyCosts(publicVault, { category, confirmedOnly })
  return { checkedAt: publicVault.verification.checkedAt, confirmedOnly, count: rows.length, rows }
}
