import catalog from '@/data/programs.json'
import { createAffiliateHelpers, type Program } from '@agentic-income/engine/catalog-helpers.js'

// Thin per-site binding: the matching/lookup logic lives once in the shared package,
// this file just supplies this site's own vendored catalog. Every existing
// `import { getLink } from '@/lib/affiliate'` call site keeps working unchanged.
export type { Program }
const helpers = createAffiliateHelpers(catalog)

// Exported as its own binding (not just via the destructure below) so every compliance
// surface — the /disclosure page, the local AffiliateDisclosure component, the pre-publish
// gate — can rely on one literal, greppable source of the FTC disclosure text.
export const DISCLOSURE = helpers.DISCLOSURE
export const { findProgram, getLink, payingPrograms } = helpers
