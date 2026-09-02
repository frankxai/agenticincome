/**
 * Deterministic structural and completeness validation for IncomeGraph.v1.
 * No dependencies, so the same function runs in the MCP handler, in the browser,
 * and under node --test with identical output ordering.
 */

import {
  EDGE_RULES,
  EDGE_TYPES,
  ISO_DATE,
  NODE_ID,
  NODE_TYPES,
  REQUIRED_FOR_ACTIVATION,
  SEMVER,
  VISIBILITIES,
  type EdgeType,
  type Finding,
  type GraphEdge,
  type GraphNode,
  type IncomeGraph,
  type NodeType,
} from './model.ts'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function finding(
  code: string,
  path: string,
  message: string,
  remedy: string,
  severity: Finding['severity'] = 'error',
): Finding {
  return { code, severity, path, message, remedy }
}

function checkProvenance(prov: unknown, path: string): Finding[] {
  const out: Finding[] = []
  if (!isObject(prov)) {
    return [
      finding('S05', path, 'provenance is missing', 'Name the source and the date it was recorded.'),
    ]
  }
  if (!str(prov.source).trim()) {
    out.push(
      finding(
        'S05',
        `${path}/source`,
        'provenance.source is empty',
        'Cite a URL, a file, or a named conversation. "I know this" is not a source.',
      ),
    )
  }
  if (!ISO_DATE.test(str(prov.date))) {
    out.push(
      finding('S06', `${path}/date`, 'provenance.date is not an ISO date (YYYY-MM-DD)', 'Record when the source was verified.'),
    )
  }
  return out
}

function checkCommon(
  entity: Record<string, unknown>,
  path: string,
  kind: 'node' | 'edge',
): Finding[] {
  const out: Finding[] = []
  const id = str(entity.id)
  if (!NODE_ID.test(id)) {
    out.push(
      finding('S01', `${path}/id`, `${kind} id "${id}" is not a lowercase slug of 2-64 characters`, 'Use ids like offer-quote-desk.'),
    )
  }
  if (!str(entity.owner).trim()) {
    out.push(finding('S03', `${path}/owner`, 'owner is empty', 'Name the person accountable for this being true.'))
  }
  if (!SEMVER.test(str(entity.version))) {
    out.push(finding('S04', `${path}/version`, 'version is not semver', 'Start at 1.0.0 and bump when the meaning changes.'))
  }
  if (!VISIBILITIES.includes(str(entity.visibility) as never)) {
    out.push(
      finding('S07', `${path}/visibility`, 'visibility must be public, buyer, or private', 'Decide who is allowed to see this before publishing anything.'),
    )
  }
  if (!str(entity.evaluation).trim()) {
    out.push(
      finding('S08', `${path}/evaluation`, 'evaluation rule is empty', 'Write the check that would prove this node wrong. A claim with no test is decoration.'),
    )
  }
  out.push(...checkProvenance(entity.provenance, `${path}/provenance`))
  return out
}

function structural(graph: IncomeGraph): Finding[] {
  const out: Finding[] = []

  if (graph.apiVersion !== 'agenticincome.ai/v1') {
    out.push(finding('S00', '/apiVersion', 'apiVersion must be agenticincome.ai/v1', 'Set apiVersion to agenticincome.ai/v1.'))
  }
  if (graph.kind !== 'IncomeGraph') {
    out.push(finding('S00', '/kind', 'kind must be IncomeGraph', 'Set kind to IncomeGraph.'))
  }

  const meta = isObject(graph.metadata) ? graph.metadata : null
  if (!meta) {
    out.push(finding('S02', '/metadata', 'metadata is missing', 'Add id, name, version, updatedAt, principal, and thesis.'))
  } else {
    if (!NODE_ID.test(str(meta.id))) {
      out.push(finding('S01', '/metadata/id', 'metadata.id is not a lowercase slug', 'Use a slug like amsterdam-quote-desk.'))
    }
    if (!str(meta.name).trim()) out.push(finding('S02', '/metadata/name', 'name is empty', 'Name the system.'))
    if (!SEMVER.test(str(meta.version))) {
      out.push(finding('S04', '/metadata/version', 'metadata.version is not semver', 'Start at 0.1.0.'))
    }
    if (!ISO_DATE.test(str(meta.updatedAt))) {
      out.push(finding('S06', '/metadata/updatedAt', 'updatedAt is not an ISO date', 'Use YYYY-MM-DD.'))
    }
    if (!str(meta.principal).trim()) {
      out.push(finding('S03', '/metadata/principal', 'principal is empty', 'A system with no named principal cannot be held to anything.'))
    }
    if (!str(meta.thesis).trim()) {
      out.push(finding('S02', '/metadata/thesis', 'thesis is empty', 'State in one sentence what you believe someone will pay for.'))
    }
  }

  const nodes = Array.isArray(graph.nodes) ? graph.nodes : []
  const edges = Array.isArray(graph.edges) ? graph.edges : []
  if (!Array.isArray(graph.nodes)) out.push(finding('S02', '/nodes', 'nodes must be an array', 'Add a nodes array.'))
  if (!Array.isArray(graph.edges)) out.push(finding('S02', '/edges', 'edges must be an array', 'Add an edges array.'))

  const seen = new Set<string>()
  nodes.forEach((node, index) => {
    const path = `/nodes/${index}`
    if (!isObject(node)) {
      out.push(finding('S02', path, 'node is not an object', 'Remove or repair the entry.'))
      return
    }
    out.push(...checkCommon(node as Record<string, unknown>, path, 'node'))
    if (!NODE_TYPES.includes(str(node.type) as NodeType)) {
      out.push(
        finding('S09', `${path}/type`, `unknown node type "${str(node.type)}"`, `Use one of: ${NODE_TYPES.join(', ')}.`),
      )
    }
    if (!str(node.label).trim()) {
      out.push(finding('S02', `${path}/label`, 'label is empty', 'Give the node a human label.'))
    }
    const id = str(node.id)
    if (id && seen.has(id)) {
      out.push(finding('S10', `${path}/id`, `duplicate node id "${id}"`, 'Ids must be unique across the graph.'))
    }
    seen.add(id)

    const steps = (node as GraphNode).data?.steps
    if (steps) {
      if (!Array.isArray(steps)) {
        out.push(finding('S11', `${path}/data/steps`, 'steps must be an array', 'List the workflow steps in order.'))
      } else {
        steps.forEach((step, stepIndex) => {
          const stepPath = `${path}/data/steps/${stepIndex}`
          if (!isObject(step) || !str((step as Record<string, unknown>).id).trim()) {
            out.push(finding('S11', stepPath, 'step is missing an id', 'Every step needs a stable id so a gate can name it.'))
          }
          if (typeof (step as Record<string, unknown>).irreversible !== 'boolean') {
            out.push(
              finding('S11', `${stepPath}/irreversible`, 'step.irreversible must be a boolean', 'Decide explicitly whether this step can be undone.'),
            )
          }
        })
      }
    }
  })

  edges.forEach((edge, index) => {
    const path = `/edges/${index}`
    if (!isObject(edge)) {
      out.push(finding('S02', path, 'edge is not an object', 'Remove or repair the entry.'))
      return
    }
    out.push(...checkCommon(edge as Record<string, unknown>, path, 'edge'))
    const type = str(edge.type) as EdgeType
    if (!EDGE_TYPES.includes(type)) {
      out.push(finding('S12', `${path}/type`, `unknown edge type "${type}"`, `Use one of: ${EDGE_TYPES.join(', ')}.`))
      return
    }
    const from = nodes.find((n) => isObject(n) && str(n.id) === str(edge.from)) as GraphNode | undefined
    const to = nodes.find((n) => isObject(n) && str(n.id) === str(edge.to)) as GraphNode | undefined
    if (!from) {
      out.push(finding('S13', `${path}/from`, `edge references unknown node "${str(edge.from)}"`, 'Every edge endpoint must exist.'))
    }
    if (!to) {
      out.push(finding('S13', `${path}/to`, `edge references unknown node "${str(edge.to)}"`, 'Every edge endpoint must exist.'))
    }
    if (from && to) {
      const rule = EDGE_RULES[type]
      if (!rule.from.includes(from.type)) {
        out.push(
          finding('S14', `${path}/from`, `${type} cannot start at a ${from.type}`, `${type} starts at: ${rule.from.join(', ')}.`),
        )
      }
      if (!rule.to.includes(to.type)) {
        out.push(
          finding('S14', `${path}/to`, `${type} cannot end at a ${to.type}`, `${type} ends at: ${rule.to.join(', ')}.`),
        )
      }
    }
  })

  return out
}

function completeness(graph: IncomeGraph): Finding[] {
  const out: Finding[] = []
  const nodes = Array.isArray(graph.nodes) ? graph.nodes : []
  const edges = Array.isArray(graph.edges) ? graph.edges : []
  const present = new Set(nodes.map((n) => n.type))

  for (const type of REQUIRED_FOR_ACTIVATION) {
    if (!present.has(type)) {
      out.push(
        finding(
          'C01',
          '/nodes',
          `no ${type} node`,
          `A system without a ${type} cannot be activated. Add one before you test the market.`,
        ),
      )
    }
  }

  const offers = nodes.filter((n) => n.type === 'Offer')
  for (const offer of offers) {
    const index = nodes.indexOf(offer)
    const served = edges.some((e) => e.type === 'serves' && e.from === offer.id)
    if (!served) {
      out.push(
        finding('C02', `/nodes/${index}`, `offer "${offer.id}" serves no Customer`, 'Connect the offer to the customer it is for, or delete it.'),
      )
    }
    const fulfilled = edges.some((e) => e.type === 'fulfills' && e.to === offer.id)
    if (!fulfilled) {
      out.push(
        finding('C03', `/nodes/${index}`, `offer "${offer.id}" has no Workflow that fulfills it`, 'Describe how the thing actually gets delivered.'),
      )
    }
    if (!offer.data?.price) {
      out.push(
        finding('C04', `/nodes/${index}/data/price`, `offer "${offer.id}" has no price`, 'A priceless offer cannot produce an economic event.'),
      )
    }
  }

  const customers = nodes.filter((n) => n.type === 'Customer')
  for (const customer of customers) {
    const index = nodes.indexOf(customer)
    if (!edges.some((e) => e.type === 'reaches' && e.to === customer.id)) {
      out.push(
        finding('C05', `/nodes/${index}`, `no Channel reaches customer "${customer.id}"`, 'Name how this person finds out you exist.'),
      )
    }
    if (!edges.some((e) => e.type === 'suffers' && e.from === customer.id)) {
      out.push(
        finding(
          'C06',
          `/nodes/${index}`,
          `customer "${customer.id}" is not connected to a Problem`,
          'Connect the customer to the problem they have, or you are selling to nobody.',
          'warning',
        ),
      )
    }
  }

  const workflows = nodes.filter((n) => n.type === 'Workflow')
  for (const workflow of workflows) {
    const index = nodes.indexOf(workflow)
    if (!edges.some((e) => e.type === 'performs' && e.to === workflow.id)) {
      out.push(
        finding('C07', `/nodes/${index}`, `workflow "${workflow.id}" has no AgentRole performing it`, 'Say who or what runs this, agent or human.'),
      )
    }
    if (!workflow.data?.steps?.length) {
      out.push(
        finding('C08', `/nodes/${index}/data/steps`, `workflow "${workflow.id}" has no steps`, 'A workflow with no steps cannot be gated or costed.'),
      )
    }
  }

  for (const kill of nodes.filter((n) => n.type === 'KillCriterion')) {
    const index = nodes.indexOf(kill)
    if (!kill.data?.threshold || !kill.data?.reviewBy) {
      out.push(
        finding(
          'C09',
          `/nodes/${index}/data`,
          `kill criterion "${kill.id}" needs both a threshold and a reviewBy date`,
          'A kill criterion you never check is a sunk-cost machine.',
        ),
      )
    }
  }

  // A Partner edge is a commercial recommendation. It may only exist when it
  // points at a record in the verified partner registry this site already
  // publishes — never at a program someone remembered.
  for (const partner of nodes.filter((n) => n.type === 'Partner')) {
    const index = nodes.indexOf(partner)
    const source = partner.provenance?.source ?? ''
    if (!/programs\.json|^https?:\/\//i.test(source)) {
      out.push(
        finding(
          'C11',
          `/nodes/${index}/provenance/source`,
          `partner "${partner.id}" does not cite a verified registry record`,
          'Cite data/programs.json#<slug> or the program terms URL. Unverified partner edges are how disclosure obligations get missed.',
        ),
      )
    }
    if (!edges.some((e) => e.type === 'supplies' && e.from === partner.id)) {
      out.push(
        finding('C11', `/nodes/${index}`, `partner "${partner.id}" supplies nothing`, 'Connect the partner to what it actually provides, or remove it.'),
      )
    }
  }

  for (const maintenance of nodes.filter((n) => n.type === 'Maintenance')) {
    const index = nodes.indexOf(maintenance)
    if (!maintenance.data?.cadenceDays) {
      out.push(
        finding('C10', `/nodes/${index}/data/cadenceDays`, `maintenance "${maintenance.id}" has no cadence`, 'State how often this must be redone.'),
      )
    }
  }

  return out
}

export function validateStructure(graph: IncomeGraph): Finding[] {
  const out = structural(graph)
  // Completeness rules read the graph as if it parsed; skip them when it did not.
  if (!out.some((f) => f.code === 'S02' && (f.path === '/nodes' || f.path === '/edges'))) {
    out.push(...completeness(graph))
  }
  return out
}

export type { Finding, GraphEdge, GraphNode, IncomeGraph }
