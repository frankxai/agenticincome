/**
 * IncomeGraph.v1 — the typed shape of one inspectable income system.
 *
 * This is a graph, not a document, because the questions that decide whether a
 * business thesis survives are all relational: does this demand claim have
 * evidence, does this irreversible step have a gate, does this cost attach to
 * anything that was ever observed to earn. The document contract
 * (agenticincome.ai/v1 IncomeSystem) is owned by the public open-core repository
 * frankxai/agentic-income-skills and is NOT redefined here — lib/income-graph/export.ts
 * projects a graph into that shape and names what the graph cannot know.
 *
 * Pure module: no IO, no env, no clock, no randomness. The MCP tool, the web
 * surface, and node --test all execute this same code and must agree.
 */

export const NODE_TYPES = [
  'Problem',
  'Customer',
  'Offer',
  'Evidence',
  'Channel',
  'Partner',
  'Asset',
  'Workflow',
  'AgentRole',
  'HumanGate',
  'Cost',
  'RevenueObservation',
  'Experiment',
  'Risk',
  'Maintenance',
  'KillCriterion',
  'Receipt',
] as const

export type NodeType = (typeof NODE_TYPES)[number]

export const EDGE_TYPES = [
  'serves',
  'suffers',
  'evidences',
  'reaches',
  'supplies',
  'fulfills',
  'performs',
  'gates',
  'produces',
  'incurs',
  'observes',
  'tests',
  'threatens',
  'maintains',
  'retires',
  'attests',
] as const

export type EdgeType = (typeof EDGE_TYPES)[number]

/**
 * Allowed endpoint pairs per edge type. An edge outside this table is a
 * modelling error, not a matter of taste: it means two things were connected
 * whose relationship the evaluation rules cannot interpret.
 */
export const EDGE_RULES: Record<EdgeType, { from: readonly NodeType[]; to: readonly NodeType[] }> = {
  serves: { from: ['Offer'], to: ['Customer'] },
  suffers: { from: ['Customer'], to: ['Problem'] },
  evidences: { from: ['Evidence'], to: [...NODE_TYPES] },
  reaches: { from: ['Channel'], to: ['Customer'] },
  supplies: { from: ['Partner'], to: ['Channel', 'Offer', 'Asset', 'Workflow'] },
  fulfills: { from: ['Workflow'], to: ['Offer'] },
  performs: { from: ['AgentRole'], to: ['Workflow'] },
  gates: { from: ['HumanGate'], to: ['Workflow'] },
  produces: { from: ['Workflow'], to: ['Asset'] },
  incurs: { from: ['Workflow', 'Asset', 'Channel', 'AgentRole', 'Maintenance', 'Offer'], to: ['Cost'] },
  observes: { from: ['RevenueObservation'], to: ['Offer'] },
  tests: { from: ['Experiment'], to: [...NODE_TYPES] },
  threatens: { from: ['Risk'], to: [...NODE_TYPES] },
  maintains: { from: ['Maintenance'], to: ['Asset', 'Workflow', 'Channel'] },
  retires: { from: ['KillCriterion'], to: [...NODE_TYPES] },
  attests: { from: ['Receipt'], to: ['RevenueObservation', 'Experiment', 'Evidence', 'Maintenance'] },
}

export const VISIBILITIES = ['public', 'buyer', 'private'] as const
export type Visibility = (typeof VISIBILITIES)[number]

/** Provenance is mandatory on every node and edge: who said it, from where, when. */
export type Provenance = {
  /** A URL, a file path, an interview reference, or a named artifact. Never "internal knowledge". */
  source: string
  /** ISO date (YYYY-MM-DD) the source was recorded or verified. */
  date: string
  method?: string
}

export type GraphNodeBase = {
  id: string
  type: NodeType
  label: string
  /** Human accountable for this node being true. */
  owner: string
  provenance: Provenance
  /** Semver of this node's own content, bumped when its meaning changes. */
  version: string
  visibility: Visibility
  /** The check that would tell you this node is wrong. Free text, but required. */
  evaluation: string
  notes?: string
}

/** Type-specific payloads. Every field is optional at the type level and enforced by rules. */
export type NodeData = {
  /** Customer / Problem / Offer: a statement about demand that requires Evidence. */
  demandClaim?: string
  /** Offer: the price the buyer pays, and the unit it buys. */
  price?: { currency: string; amount: number; unit: string }
  /** Offer: scarcity shown to buyers. countBasis must name what produces the number. */
  scarcity?: { claim: string; countBasis?: string }
  /** Offer: how a buyer stops paying. Required when price.unit is recurring. */
  cancellation?: string
  /** Workflow: ordered steps. */
  steps?: WorkflowStep[]
  /** AgentRole: what the agent may do without asking. */
  allowedActions?: string[]
  /** AgentRole: what the agent may never do, gate or not. */
  deniedActions?: string[]
  /** HumanGate: the step ids this gate blocks, and who may release it. */
  gatedStepIds?: string[]
  approver?: string
  /** Cost: recurring or one-off money the operator spends. */
  amount?: { currency: string; amount: number; period: 'once' | 'monthly' | 'yearly' }
  /** Cost: founder time, the cost most systems hide from themselves. */
  founderMinutesPerMonth?: number
  /** Cost: true when the buyer pays it. Must then be disclosed pre-purchase. */
  borneByBuyer?: boolean
  disclosedToBuyer?: boolean
  /** RevenueObservation: money that actually arrived. Never a forecast. */
  observed?: { currency: string; amount: number; occurredAt: string; units: number }
  /** Evidence: what the source actually says. */
  finding?: string
  /** Experiment: the falsifiable prediction and its decision rule. */
  hypothesis?: string
  decisionRule?: string
  /** KillCriterion: the threshold and the date it is checked. */
  threshold?: string
  reviewBy?: string
  /** Maintenance: cadence in days. */
  cadenceDays?: number
  /** Receipt: the artifact path or URL that proves the thing it attests. */
  artifact?: string
}

export type WorkflowStep = {
  id: string
  action: string
  /** True when the step cannot be undone by the operator: sends, charges, publishes, signs, deletes. */
  irreversible: boolean
  actor: 'agent' | 'human'
}

export type GraphNode = GraphNodeBase & { data?: NodeData }

export type GraphEdge = {
  id: string
  type: EdgeType
  from: string
  to: string
  owner: string
  provenance: Provenance
  version: string
  visibility: Visibility
  evaluation: string
}

export type IncomeGraph = {
  apiVersion: 'agenticincome.ai/v1'
  kind: 'IncomeGraph'
  metadata: {
    id: string
    name: string
    version: string
    updatedAt: string
    principal: string
    /** The single sentence the whole graph is trying to survive. */
    thesis: string
  }
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export type Severity = 'error' | 'warning'

export type Finding = {
  /** Stable code: S## structural, C## completeness, A## adversarial, E## economics. */
  code: string
  severity: Severity
  /** JSON-pointer-ish path into the graph. */
  path: string
  message: string
  /** What to do about it, in the founder's terms. */
  remedy: string
}

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
export const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/
export const NODE_ID = /^[a-z0-9][a-z0-9._-]{1,63}$/

/** Node types without which a graph is not a business, only a wish. */
export const REQUIRED_FOR_ACTIVATION: readonly NodeType[] = [
  'Problem',
  'Customer',
  'Offer',
  'Evidence',
  'Channel',
  'Workflow',
  'AgentRole',
  'HumanGate',
  'Cost',
  'KillCriterion',
]

/** Recurring price units force a stated cancellation path (forced continuity check). */
export const RECURRING_UNITS = ['month', 'monthly', 'year', 'yearly', 'week', 'weekly', 'seat/month']
