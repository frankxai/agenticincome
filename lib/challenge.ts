/**
 * The 7-Day Agentic Income Challenge — a free, evergreen lead-magnet path.
 *
 * Self-contained data (no filesystem, no email-sequence infrastructure): each day
 * is one concrete action that maps to a real `/ai` pack command or knowledge-base
 * file, so the reader can start the actual system today. The framing is capability,
 * never income — see knowledge/05-honest-marketing.md for the doctrine this obeys.
 */
export type ChallengeDay = {
  day: number
  title: string
  /** The pack command this day runs, if any — rendered as a mono chip. */
  command?: string
  /** One concrete, real action — an artifact that exists, not a lecture. */
  action: string
  /** A real destination: an internal route or a knowledge-base file on GitHub. */
  href: string
  hrefLabel: string
}

const KNOWLEDGE = 'https://github.com/frankxai/agenticincome/blob/main/knowledge'

export const challengeDays: ChallengeDay[] = [
  {
    day: 1,
    title: 'Assess your real leverage',
    command: '/ai assess',
    action:
      'Install the /ai pack and run the assessment. It audits your skills, sites, socials, and assets into a leverage read — where proof and distribution already overlap. Output: a written capability inventory.',
    href: '/pack',
    hrefLabel: 'Install the /ai pack',
  },
  {
    day: 2,
    title: 'Pick one income model',
    action:
      'Choose a single model from your real constraints — a service, a product, or a system. One category, not five. Read the model economics with their labor floors and failure modes, then commit to one.',
    href: `${KNOWLEDGE}/02-income-models.md`,
    hrefLabel: 'Read: Income Models',
  },
  {
    day: 3,
    title: 'Architect the business',
    command: '/ai architect',
    action:
      'Turn the model into a full plan: every number a labeled scenario, every plan carrying a kill criterion. No projections dressed as promises — a structure you could actually run.',
    href: '/pack',
    hrefLabel: 'See the pack stages',
  },
  {
    day: 4,
    title: 'Choose the honest tool stack',
    action:
      'Assemble the minimum machine — checkout (merchant of record), email, hosting, analytics. Inspect the live catalog; every tool carries its cost and a non-affiliate alternative, so you pick on fit, not on payout.',
    href: '/tools',
    hrefLabel: 'Inspect the tool catalog',
  },
  {
    day: 5,
    title: 'Design the offer',
    command: '/ai offer',
    action:
      'Shape one offer: outcome-anchored pricing, scope armor, and the agent team that delivers it. See how offers are packaged honestly — boundaries stated, delivery path defined before promotion.',
    href: '/offers',
    hrefLabel: 'See offer patterns',
  },
  {
    day: 6,
    title: 'Write copy that passes both gates',
    action:
      'Draft your landing page so it earns engineer respect and an FTC yawn at the same time. Write toward capability, never dollars: name the machinery, show the honest costs, and disclose every affiliate link before the click.',
    href: `${KNOWLEDGE}/05-honest-marketing.md`,
    hrefLabel: 'Read: Honest Marketing',
  },
  {
    day: 7,
    title: 'Ship it, then operate the loop',
    command: '/ai ship · /ai operate',
    action:
      'Publish the offer through self-serve checkout, then start the weekly loop: numbers, delivery QA, a freshness check, a kill-criteria verdict, one experiment. You finish the week with a live, real system — the outcome is honestly yours either way.',
    href: '/trust',
    hrefLabel: 'Read the trust standard',
  },
]
