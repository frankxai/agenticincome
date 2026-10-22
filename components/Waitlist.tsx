import registry from '@/data/products.graph.json'
import { WaitlistForm } from '@/lib/demand-capture/WaitlistForm'
import type { ProductConfig } from '@/lib/demand-capture/handler'

export const PRODUCT_ID = 'agentic-income'

export function product(): ProductConfig {
  const row = registry.products.find((p) => p.id === PRODUCT_ID)
  if (!row) throw new Error(`products.graph.json has no row for ${PRODUCT_ID}`)
  return row as ProductConfig
}

/**
 * The standard estate waitlist (DemandSignal schema, KV-backed) for every unlaunched
 * Agentic Income offer. Which page someone joined from travels as `source`, so one
 * registry row covers the Blueprint and Private Intel until they have rows of their own.
 */
export function Waitlist({ headline, sub }: { headline: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-ink">{headline}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{sub}</p>
      <div className="mt-6 max-w-xl">
        <WaitlistForm
          productId={PRODUCT_ID}
          productName="Agentic Income"
          foundingBenefit="Founding members keep the launch price, are named, and see each new loop first."
        />
      </div>
    </div>
  )
}
