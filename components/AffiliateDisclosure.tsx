import { DISCLOSURE } from '@/lib/affiliate'

/**
 * Site-chrome disclosure notice — for plain-TSX surfaces (the /disclosure policy page,
 * the trust desk, offer pages) that render outside MDX. Blog content keeps using the
 * shared @agentic-income/engine AffiliateDisclosure via mdx-components.tsx so every
 * post across the network stays on one canonical component; this local one renders the
 * same DISCLOSURE constant for the site's own TSX pages, matching how Nav/Footer/Hero
 * are already local-per-site rather than shared.
 */
export function AffiliateDisclosure({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={
        compact
          ? 'my-4 rounded-lg border border-border bg-surface/60 px-4 py-3 text-xs leading-5 text-muted'
          : 'my-6 rounded-lg border border-border bg-surface/60 px-4 py-3 text-sm leading-6 text-muted'
      }
    >
      <span className="mr-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent">Disclosure</span>
      {DISCLOSURE}
    </p>
  )
}
