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
  NODE_TYPES,
  VISIBILITIES,
} from '../lib/income-graph/model.ts'

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
    title: 'Agentic Income System Graph v1',
    description:
      'The relational model of one income system. Generated from lib/income-graph/model.ts — edit the TypeScript, not this file. The document contract it drafts (IncomeSystem.v1) is owned by github.com/frankxai/agentic-income-skills.',
    type: 'object',
    additionalProperties: false,
    required: ['apiVersion', 'kind', 'metadata', 'nodes', 'edges'],
    properties: {
      apiVersion: { const: 'agenticincome.ai/v1' },
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
      node: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'type', 'label', 'owner', 'provenance', 'version', 'visibility', 'evaluation'],
        properties: {
          ...common,
          type: { enum: [...NODE_TYPES] },
          label: { type: 'string', minLength: 1 },
          notes: { type: 'string' },
          data: { type: 'object' },
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
