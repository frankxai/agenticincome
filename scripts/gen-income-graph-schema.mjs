#!/usr/bin/env node
/**
 * Generates schemas/income-graph.v1.schema.json from lib/income-graph/model.ts.
 * The TypeScript model is the source of truth; the JSON Schema is a published
 * artifact for tools that cannot import TypeScript. A test asserts they match,
 * so the schema can never drift from the validator that actually runs.
 *
 *   node scripts/gen-income-graph-schema.mjs          # write
 *   node scripts/gen-income-graph-schema.mjs --check  # fail if stale
 */

import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import {
  EDGE_RULES,
  EDGE_TYPES,
  EVIDENCE_KINDS,
  NODE_TYPES,
  SCHEMA_ID,
  SUPPORTED_API_VERSIONS,
  VISIBILITIES,
} from '../lib/income-graph/model.ts'
import {
  MACHINE_ASSETS,
  MACHINE_CAP_PERIODS,
  MACHINE_CHAINS,
  MACHINE_PROTOCOLS,
  ON_CHAIN_RIGHTS,
  SETTLEMENT_CHAINS,
  SETTLEMENT_RAILS,
} from '../lib/income-graph/settlement.ts'

const OUT = path.join(process.cwd(), 'public', 'schemas', 'income-graph.v1.schema.json')

const provenance = {
  type: 'object',
  additionalProperties: false,
  required: ['source', 'date'],
  properties: {
    source: { type: 'string', minLength: 1, description: 'URL, file path, or named artifact. Never "internal knowledge".' },
    date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
    method: { type: 'string' },
  },
}

const common = {
  id: { type: 'string', pattern: '^[a-z0-9][a-z0-9._-]{1,63}$' },
  owner: { type: 'string', minLength: 1 },
  provenance: { $ref: '#/$defs/provenance' },
  version: { type: 'string', pattern: '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)$' },
  visibility: { enum: [...VISIBILITIES] },
  evaluation: { type: 'string', minLength: 1, description: 'The check that would prove this wrong.' },
}

export function buildSchema() {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://agenticincome.ai/schemas/income-graph.v1.schema.json',
    title: `Agentic Income System Graph (${SCHEMA_ID})`,
    description:
      'The relational model of one income system. Generated from lib/income-graph/model.ts — edit the TypeScript, not this file. v1.1 requires irreversible on every workflow step and adds the Human node type a gate approver must resolve to; a v1 document is still accepted and migrated, with every assumed value reported as an M01 finding. The document contract it drafts (IncomeSystem.v1) is owned by github.com/frankxai/agentic-income-skills.',
    type: 'object',
    additionalProperties: false,
    required: ['apiVersion', 'kind', 'metadata', 'nodes', 'edges'],
    properties: {
      apiVersion: { enum: [...SUPPORTED_API_VERSIONS] },
      kind: { const: 'IncomeGraph' },
      metadata: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'name', 'version', 'updatedAt', 'principal', 'thesis'],
        properties: {
          id: common.id,
          name: { type: 'string', minLength: 1 },
          version: common.version,
          updatedAt: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
          principal: { type: 'string', minLength: 1 },
          thesis: { type: 'string', minLength: 1 },
        },
      },
      nodes: { type: 'array', items: { $ref: '#/$defs/node' } },
      edges: { type: 'array', items: { $ref: '#/$defs/edge' } },
    },
    $defs: {
      provenance,
      workflowStep: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'action', 'irreversible', 'actor'],
        description:
          'irreversible is required at v1.1. A v1 step that omits it is migrated to true — unknown is treated as dangerous, not as safe.',
        properties: {
          id: { type: 'string', minLength: 1 },
          action: { type: 'string', minLength: 1 },
          irreversible: { type: 'boolean' },
          actor: { enum: ['agent', 'human'] },
        },
      },
      node: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'type', 'label', 'owner', 'provenance', 'version', 'visibility', 'evaluation'],
        properties: {
          ...common,
          type: { enum: [...NODE_TYPES] },
          label: { type: 'string', minLength: 1 },
          notes: { type: 'string', description: 'Scanned for demand language exactly like data.demandClaim.' },
          data: {
            type: 'object',
            properties: {
              steps: { type: 'array', items: { $ref: '#/$defs/workflowStep' } },
              kind: { enum: [...EVIDENCE_KINDS], description: 'Evidence only: what kind of artifact the source is.' },
              approver: {
                type: 'string',
                description:
                  'HumanGate only: must resolve to a Human node (id or label) or to metadata.principal. An AgentRole is rejected.',
              },
              settlement: {
                type: 'object',
                additionalProperties: false,
                description:
                  'Offer only. Absent means fiat-account, unless the offer text names a chain or a machine-payment protocol, which blocks. on-chain-right is a license, a royalty split, or resaleable access. machine-payment is x402 or mpp in usdc or eurc, per request or session, inside a human spend cap.',
                properties: {
                  rail: { enum: [...SETTLEMENT_RAILS] },
                  right: { enum: [...ON_CHAIN_RIGHTS] },
                  strangerEnforcement: { type: 'string', minLength: 1 },
                  chain: { enum: [...new Set([...SETTLEMENT_CHAINS, ...MACHINE_CHAINS])] },
                  protocol: { enum: [...MACHINE_PROTOCOLS] },
                  asset: { enum: [...MACHINE_ASSETS] },
                  spendCap: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      amount: { type: 'number', exclusiveMinimum: 0 },
                      currency: { type: 'string', minLength: 1 },
                      period: { enum: [...MACHINE_CAP_PERIODS] },
                    },
                  },
                },
              },
            },
          },
        },
      },
      edge: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'type', 'from', 'to', 'owner', 'provenance', 'version', 'visibility', 'evaluation'],
        properties: {
          ...common,
          type: { enum: [...EDGE_TYPES] },
          from: common.id,
          to: common.id,
        },
        allOf: EDGE_TYPES.map((type) => ({
          if: { properties: { type: { const: type } }, required: ['type'] },
          then: {
            description: `${type}: ${EDGE_RULES[type].from.join('|')} -> ${EDGE_RULES[type].to.join('|')}`,
          },
        })),
      },
    },
  }
}

const serialized = `${JSON.stringify(buildSchema(), null, 2)}\n`

if (process.argv.includes('--check')) {
  const current = readFileSync(OUT, 'utf8')
  if (current !== serialized) {
    console.error('[income-graph] schemas/income-graph.v1.schema.json is stale. Run: node scripts/gen-income-graph-schema.mjs')
    process.exitCode = 1
  } else {
    console.log('[income-graph] schema is current')
  }
} else if (process.argv[1] && process.argv[1].endsWith('gen-income-graph-schema.mjs')) {
  writeFileSync(OUT, serialized)
  console.log(`[income-graph] wrote ${OUT}`)
}
