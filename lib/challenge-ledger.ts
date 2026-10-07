import { z } from 'zod'

const safePath = z.string().regex(/^\/downloads\/ai-shop-challenge\/[a-z0-9-]+\.md$/)
const evidence = z.object({
  label: z.string().min(1).max(160),
  href: z.string().refine((value) => {
    if (/^\/downloads\/[a-z0-9/._-]+$/.test(value) && !value.split('/').some((segment) => segment === '.' || segment === '..')) return true
    try {
      const url = new URL(value)
      return url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash
    } catch { return false }
  }, 'Evidence must be a public-safe download or HTTPS URL without credentials or query data'),
}).strict()

const checkpoint = z.object({
  id: z.enum(['1h', '12h', '48h', '72h', 'monthly']),
  label: z.string(),
  offsetHours: z.number().positive().nullable(),
  title: z.string(),
  deliverable: z.string(),
  acceptance: z.string(),
  state: z.enum(['planned', 'in_progress', 'verified', 'blocked']),
  evidence: z.array(evidence),
}).strict().superRefine((item, ctx) => {
  if (item.state === 'verified' && item.evidence.length === 0) {
    ctx.addIssue({ code: 'custom', message: 'Verified checkpoints require evidence' })
  }
})

const score = z.object({
  buyer_value: z.number().min(0).max(5),
  working_delivery: z.number().min(0).max(5),
  evidence_integrity: z.number().min(0).max(5),
  experience: z.number().min(0).max(5),
  economics: z.number().min(0).max(5),
}).strict()

const submission = z.object({
  id: z.string().regex(/^[a-z]+$/),
  family: z.string(),
  modelVersion: z.string().min(1).nullable(),
  status: z.enum(['not_run', 'in_progress', 'submitted', 'reviewed', 'blocked']),
  ethicalReview: z.enum(['unreviewed', 'pass', 'fail']),
  baselineRevision: z.string().regex(/^[a-f0-9]{40}$/).nullable(),
  protocolVersion: z.string(),
  toolAccessProfile: z.string(),
  toolAccessVerified: z.boolean(),
  review: z.object({
    maker: z.string().min(1), reviewer: z.string().min(1),
    reviewedAt: z.string().datetime(), receipt: evidence,
  }).strict().nullable(),
  startedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
  elapsedMinutes: z.number().nonnegative().nullable(),
  runtimeCostEur: z.number().nonnegative().nullable(),
  score: score.nullable(),
  evidence: z.array(evidence),
  promptPath: safePath,
}).strict().superRefine((item, ctx) => {
  if (item.status === 'not_run' && (item.score !== null || item.startedAt !== null || item.completedAt !== null || item.elapsedMinutes !== null || item.runtimeCostEur !== null || item.evidence.length)) {
    ctx.addIssue({ code: 'custom', message: 'Unrun submissions must have no results or evidence' })
  }
  if (item.status !== 'not_run' && !item.modelVersion) {
    ctx.addIssue({ code: 'custom', message: 'Record the exact model version before a run' })
  }
  if (item.score !== null && (item.status !== 'reviewed' || item.ethicalReview !== 'pass' || item.evidence.length === 0 || !item.startedAt || !item.completedAt || item.elapsedMinutes === null || item.runtimeCostEur === null)) {
    ctx.addIssue({ code: 'custom', message: 'Scores require an ethical reviewed run, evidence, times and recorded cost' })
  }
  if (item.completedAt && (!item.startedAt || Date.parse(item.completedAt) < Date.parse(item.startedAt))) {
    ctx.addIssue({ code: 'custom', message: 'Completion cannot precede a recorded start' })
  }
  if (item.startedAt && item.completedAt && item.elapsedMinutes !== null && Math.abs((Date.parse(item.completedAt) - Date.parse(item.startedAt)) / 60_000 - item.elapsedMinutes) > 0.1) {
    ctx.addIssue({ code: 'custom', message: 'Elapsed time must match the recorded timestamps' })
  }
  if (item.score !== null && (!item.review || !item.toolAccessVerified || !item.baselineRevision)) {
    ctx.addIssue({ code: 'custom', message: 'Scored runs require baseline, verified tool access and independent review receipt' })
  }
  if (item.review && (item.review.maker.trim().toLowerCase() === item.review.reviewer.trim().toLowerCase() || !item.completedAt || Date.parse(item.review.reviewedAt) < Date.parse(item.completedAt))) {
    ctx.addIssue({ code: 'custom', message: 'Review must follow completion and use a distinct reviewer' })
  }
})

export const challengeLedgerSchema = z.object({
  schemaVersion: z.literal(1),
  protocolVersion: z.string(),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startAt: z.string().datetime().nullable(),
  round: z.object({
    id: z.string(), title: z.string(), hypothesis: z.string(), buyer: z.string(), offer: z.string(),
    proposedPriceEur: z.number().positive(),
    status: z.enum(['planned', 'in_progress', 'review', 'completed', 'stopped']),
    primaryMetric: z.string(), primaryMetricValue: z.number().nonnegative().nullable(),
    timeBudgetMinutes: z.number().positive(), runtimeBudgetEur: z.number().nonnegative(),
    spendingAuthorized: z.literal(false),
    baselineRevision: z.string().regex(/^[a-f0-9]{40}$/).nullable(),
    toolAccessProfile: z.string().min(1),
    evidence: z.array(evidence), decision: z.enum(['continue', 'revise', 'stop']).nullable(),
    readiness: z.array(z.object({ label: z.string(), state: z.enum(['planned', 'unverified', 'verified', 'blocked']) }).strict()),
  }).strict(),
  checkpoints: z.array(checkpoint).length(5),
  rubric: z.array(z.object({ id: z.enum(['buyer_value', 'working_delivery', 'evidence_integrity', 'experience', 'economics']), label: z.string(), weight: z.number().positive(), evidence: z.string() }).strict()).length(5),
  submissions: z.array(submission).min(1),
}).strict().superRefine((ledger, ctx) => {
  if (ledger.rubric.reduce((total, item) => total + item.weight, 0) !== 100 || new Set(ledger.rubric.map((item) => item.id)).size !== 5) {
    ctx.addIssue({ code: 'custom', message: 'Rubric must contain five unique criteria totaling 100' })
  }
  const offsets = { '1h': 1, '12h': 12, '48h': 48, '72h': 72, monthly: null }
  if (new Set(ledger.checkpoints.map((item) => item.id)).size !== 5 || ledger.checkpoints.some((item) => item.offsetHours !== offsets[item.id])) {
    ctx.addIssue({ code: 'custom', message: 'Checkpoint cadence must match the shared protocol' })
  }
  if (new Set(ledger.submissions.map((item) => item.id)).size !== ledger.submissions.length) {
    ctx.addIssue({ code: 'custom', message: 'Submission identifiers must be unique' })
  }
  if (!ledger.startAt && ledger.round.status !== 'planned') {
    ctx.addIssue({ code: 'custom', message: 'An active round requires a recorded start' })
  }
  if (ledger.round.primaryMetricValue !== null && ledger.round.evidence.length === 0) {
    ctx.addIssue({ code: 'custom', message: 'Measured outcomes require evidence' })
  }
  if (ledger.submissions.some((item) => item.score !== null && (item.elapsedMinutes! > ledger.round.timeBudgetMinutes || item.runtimeCostEur! > ledger.round.runtimeBudgetEur))) {
    ctx.addIssue({ code: 'custom', message: 'Scored runs must stay inside the equal time and cost budget' })
  }
  for (const item of ledger.submissions) {
    if (item.protocolVersion !== ledger.protocolVersion || item.toolAccessProfile !== ledger.round.toolAccessProfile) {
      ctx.addIssue({ code: 'custom', message: 'All submissions must use the shared protocol and tool-access profile' })
    }
    if (item.score !== null && (!ledger.startAt || ledger.round.status === 'planned' || !ledger.round.baselineRevision || item.baselineRevision !== ledger.round.baselineRevision || Date.parse(item.startedAt!) < Date.parse(ledger.startAt))) {
      ctx.addIssue({ code: 'custom', message: 'Scored submissions require a started round and the identical accepted baseline' })
    }
  }
})

export type ChallengeLedger = z.infer<typeof challengeLedgerSchema>
export type ChallengeSubmission = ChallengeLedger['submissions'][number]

export function parseChallengeLedger(value: unknown): ChallengeLedger {
  return challengeLedgerSchema.parse(value)
}

export function submissionScore(item: ChallengeSubmission, rubric: ChallengeLedger['rubric']): number | null {
  if (item.status !== 'reviewed' || item.ethicalReview !== 'pass' || item.score === null) return null
  return Math.round(rubric.reduce((total, criterion) => total + (item.score![criterion.id] / 5) * criterion.weight, 0))
}

export function checkpointDueAt(startAt: string | null, offsetHours: number | null): string | null {
  if (startAt === null || offsetHours === null) return null
  return new Date(Date.parse(startAt) + offsetHours * 60 * 60 * 1000).toISOString()
}
