/**
 * The zod shape published to calling agents over MCP.
 *
 * `graph: z.unknown()` advertised nothing, so an agent had to spend a round
 * trip on describe_income_graph_schema before it could construct a document.
 * This is the real shape — the same field names the validator reads.
 *
 * It is deliberately permissive below the top level: a node missing its owner
 * must come back as an S03 finding with a remedy in the founder's terms, not as
 * a protocol-level rejection the agent has to decode. Structure is advertised
 * here; judgment stays in reviewIncomeGraph.
 *
 * Kept out of index.ts so the core model stays dependency-free and runnable in
 * node --test, the browser, and the MCP handler alike.
 */

import { z } from 'zod'
import {
  EDGE_TYPES,
  EVIDENCE_KINDS,
  ISO_DATE,
  NODE_TYPES,
  SUPPORTED_API_VERSIONS,
  VISIBILITIES,
} from './model.ts'

const isoDate = z.string().regex(ISO_DATE, 'ISO date, YYYY-MM-DD')

const provenance = z
  .object({
    source: z
      .string()
      .describe('URL, repository file path, or "interview:<name> <YYYY-MM-DD>". Evidence sources must be one of those three.'),
    date: isoDate,
    method: z.string().optional(),
  })
  .partial({ source: true, date: true })

const workflowStep = z.object({
  id: z.string(),
  action: z.string(),
  irreversible: z
    .boolean()
    .optional()
    .describe('Required at v1.1. Omitted in a v1 document, it is migrated to true and reported as M01.'),
  actor: z.enum(['agent', 'human']).optional(),
})

const nodeData = z
  .object({
    demandClaim: z.string().describe('Any assertion that someone wants or will pay for this. Requires an evidences edge.'),
    description: z.string(),
    price: z.object({ currency: z.string(), amount: z.number(), unit: z.string() }),
    volumeAssumption: z.object({
      unitsPerMonth: z.number().optional(),
      conversionRate: z.number().optional(),
      basis: z.string().optional(),
    }),
    scarcity: z.object({ claim: z.string(), countBasis: z.string().optional() }),
    cancellation: z.string(),
    settlement: z
      .object({
        rail: z
          .string()
          .describe('fiat-account, signed-receipt, on-chain-right, or refuse. A wrong value is an R03 finding, not a transport error.'),
        right: z.string().describe('On-chain only: license, royalty-split, or resaleable-access.'),
        strangerEnforcement: z
          .string()
          .describe('On-chain only: who enforces the right after the seller is gone, in at least eight words.'),
        chain: z.string().describe('On-chain right: base, story, or solana. Machine payment: base, solana, or tempo.'),
        protocol: z.string().describe('Machine payment only: x402 or mpp.'),
        asset: z.string().describe('Machine payment only: usdc or eurc.'),
        spendCap: z
          .object({
            amount: z.number(),
            currency: z.string(),
            period: z.string().describe('day or month'),
          })
          .partial(),
      })
      .partial(),
    steps: z.array(workflowStep),
    allowedActions: z.array(z.string()),
    deniedActions: z.array(z.string()),
    gatedStepIds: z.array(z.string()),
    approver: z.string().describe('Must resolve to a Human node or metadata.principal. An AgentRole is rejected.'),
    amount: z.object({ currency: z.string(), amount: z.number(), period: z.enum(['once', 'monthly', 'yearly']) }),
    founderMinutesPerMonth: z.number(),
    borneByBuyer: z.boolean(),
    disclosedToBuyer: z.boolean(),
    observed: z.object({ currency: z.string(), amount: z.number(), occurredAt: isoDate, units: z.number() }),
    finding: z.string().describe('What the source actually said, in at least eight words.'),
    kind: z.enum([...EVIDENCE_KINDS]),
    n: z.number(),
    role: z.enum(['founder', 'operator', 'approver']),
    hypothesis: z.string(),
    decisionRule: z.string(),
    threshold: z.string(),
    reviewBy: isoDate,
    cadenceDays: z.number(),
    artifact: z.string(),
  })
  .partial()
  .passthrough()

const common = {
  id: z.string(),
  owner: z.string().optional().describe('The person accountable for this being true.'),
  provenance: provenance.optional(),
  version: z.string().optional().describe('semver'),
  visibility: z.enum([...VISIBILITIES]).optional(),
  evaluation: z.string().optional().describe('The check that would prove this wrong.'),
}

export const incomeGraphNodeSchema = z.object({
  ...common,
  type: z.enum([...NODE_TYPES]),
  label: z.string(),
  notes: z.string().optional(),
  data: nodeData.optional(),
})

export const incomeGraphEdgeSchema = z.object({
  ...common,
  type: z.enum([...EDGE_TYPES]),
  from: z.string(),
  to: z.string(),
})

export const incomeGraphSchema = z
  .object({
    // Strings, not enums: a wrong apiVersion is an S00 finding with a remedy,
    // not a transport error the calling agent has to interpret.
    apiVersion: z.string().describe(`One of: ${SUPPORTED_API_VERSIONS.join(', ')}`),
    kind: z.string().describe('IncomeGraph'),
    metadata: z
      .object({
        id: z.string(),
        name: z.string(),
        version: z.string(),
        updatedAt: isoDate,
        principal: z.string().describe('The named person the system answers for.'),
        thesis: z.string().describe('The single sentence the whole graph is trying to survive.'),
      })
      .partial({ version: true, updatedAt: true }),
    nodes: z.array(incomeGraphNodeSchema),
    edges: z.array(incomeGraphEdgeSchema),
  })
  .describe('An IncomeGraph document. Incomplete fields are reported as findings, not rejected here.')
