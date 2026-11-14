export type Stage = 'concept' | 'building' | 'gated' | 'live'

export type PriceBand =
  | 'free-only'
  | 'under-25'
  | '25-99'
  | '100-299'
  | '300-999'
  | 'over-1000'
  | 'company-pays'

export type Urgency = 'now' | 'this-quarter' | 'exploring'

/**
 * Captured in two steps on purpose. Step 1 is email alone so a hesitant visitor
 * still becomes a signal; everything below `email` is step 2, asked after they
 * have already joined and therefore costs no conversions when skipped.
 */
export interface DemandSignal {
  productId: string
  email: string
  name?: string

  role?: string
  pain?: string
  urgency?: Urgency
  priceBand?: PriceBand
  alternative?: string

  source: string
  referrer?: string
  utm?: Record<string, string>
  position: number
  createdAt: string
  /** Set when a known address updates its answers. createdAt stays the first join. */
  updatedAt?: string
  consent: true
}

/** What handleState returns while the list cannot take addresses (owner unconfirmed or no store). */
export interface ClosedWaitlistState {
  open: false
  productId: string
}

export interface WaitlistState {
  /** Present as true on a state read from handleState; absent on a join response. */
  open?: true
  productId: string
  /** null when the signal was recorded but the store could not be read back for a count. Never estimated. */
  count: number | null
  position?: number
  /** Set on a join that was recorded while a follow-up step failed. The address is stored. */
  partial?: true
  /** Withheld below the product's publicCountThreshold. Never estimate it. */
  publicCount: number | null
  foundingCohort: number
  foundingSeatsLeft: number | null
  stage: Stage
}
