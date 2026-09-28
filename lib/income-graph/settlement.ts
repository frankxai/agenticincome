/**
 * Settlement rails. An income graph may clear money in a merchant account,
 * attach a signed receipt, meter an agent call in a stablecoin inside a human
 * spend cap, or — rarely — record a right a stranger enforces after the seller
 * is gone. A collection, a coin, a yield, or an agent that can mint is refused
 * here, before a contract is written.
 *
 * Pure: no IO, no clock, no network.
 */

import type { Finding, GraphNode, IncomeGraph } from './model.ts'
import { hasPhrase, matchedPhrases, normalize, stemHits, tokenize, tokensAt, within } from './text.ts'

export const SETTLEMENT_RAILS = ['fiat-account', 'signed-receipt', 'machine-payment', 'on-chain-right', 'refuse'] as const
export type SettlementRail = (typeof SETTLEMENT_RAILS)[number]

export const ON_CHAIN_RIGHTS = ['license', 'royalty-split', 'resaleable-access'] as const
export const ON_CHAIN_UNITS = ['license', 'royalty-split', 'access-right'] as const
export const SETTLEMENT_CHAINS = ['base', 'story', 'solana'] as const

/** Protocols with a public spec and production settlement in 2026. x402 is per request. MPP is a capped session. */
export const MACHINE_PROTOCOLS = ['x402', 'mpp'] as const
export const MACHINE_ASSETS = ['usdc', 'eurc'] as const
export const MACHINE_CHAINS = ['base', 'solana', 'tempo'] as const
export const MACHINE_UNITS = ['request', 'session'] as const
export const MACHINE_CAP_PERIODS = ['day', 'month'] as const

const RIGHT_FOR_UNIT: Record<(typeof ON_CHAIN_UNITS)[number], (typeof ON_CHAIN_RIGHTS)[number]> = {
  license: 'license',
  'royalty-split': 'royalty-split',
  'access-right': 'resaleable-access',
}

/** Language that means a chain product, including the paraphrases that avoid the word NFT. */
const CHAIN_PHRASES = [
  'nft',
  'nfts',
  'non fungible',
  'nonfungible',
  'token drop',
  'token gate',
  'creator coin',
  'social token',
  'memecoin',
  'meme coin',
  'airdrop',
  'whitelist',
  'allowlist',
  'collection drop',
  'pfp',
  'pfps',
  'smart contract',
  'on chain',
  'onchain',
  'blockchain',
  'web3',
  'web 3',
  'gasless',
  'mint price',
  'floor price',
  'erc 721',
  'erc721',
  'erc 1155',
  'erc1155',
  'erc 20',
  'erc20',
  'minting',
] as const

/**
 * A metered agent payment. These are not a token market.
 * x402 (Coinbase, Linux Foundation, 2026) and MPP (Stripe and Tempo, March 2026).
 */
const MACHINE_PHRASES = ['x402', 'machine payments protocol', 'eip 3009', 'http 402'] as const

/** A market in a token. Never a license, even when the rail is labelled on-chain-right. */
const REFUSE_PHRASES = [
  'memecoin',
  'meme coin',
  'airdrop',
  'staking',
  'liquidity pool',
  'holders earn',
  'holder rewards',
  'holder reward',
  'floor price',
  'erc 20',
  'erc20',
  'fungible token',
  'creator coin',
  'social token',
  'token price',
  'investment return',
  'passive yield',
  'whitelist',
  'allowlist',
  'pfp',
  '10k',
  'token gate',
  'agent identity nft',
  'sell the agent nft',
] as const

/** A file someone downloads. Merchant account. */
const COPY_PHRASES = [
  'prompt pack',
  'ebook',
  'chapter',
  'subscription',
  'download',
  'course',
  'newsletter',
  'template pack',
] as const

const AGENT_TREASURY_PHRASES = [
  'agent wallet',
  'agent holds the',
  'autonomous treasury',
  'agents will transact',
  'agent pays gas',
  'agent can spend',
] as const

const CHAIN_ACTION_PHRASES = [
  'mint',
  'minting',
  'airdrop',
  'deploy a token',
  'deploy the token',
  'sign transaction',
  'transfer token',
  'transfer the nft',
  'list the nft',
  'spend from the wallet',
  'send crypto',
] as const

const FORBIDDEN_STEP_PHRASES = [
  'mint',
  'minting',
  'airdrop',
  'deploy a token',
  'deploy the token',
  'list the nft',
  'drop the collection',
] as const

const COST_PHRASES = ['gas', 'custody', 'legal', 'counsel', 'wallet', 'chain fee'] as const

const ENFORCEMENT_STEMS = ['enforc', 'resell', 'successor', 'counterpart', 'bankrupt'] as const
const ENFORCEMENT_PHRASES = [
  'seller is gone',
  'without the seller',
  'after the seller',
  'no longer operating',
  'the licensee',
] as const

export type SettlementVerdict = {
  offerId: string
  label: string
  /** The rail the graph asked for, or fiat-account when it asked for nothing and named no chain. */
  rail: SettlementRail
  admitted: boolean
  because: string
}

export type SettlementAnalysis = {
  verdicts: SettlementVerdict[]
  findings: Finding[]
}

function nodesOf(graph: IncomeGraph): GraphNode[] {
  return Array.isArray(graph?.nodes) ? graph.nodes : []
}

function edgesOf(graph: IncomeGraph) {
  return Array.isArray(graph?.edges) ? graph.edges : []
}

function offerCorpus(node: GraphNode): string {
  const data = node.data ?? {}
  return [
    node.label,
    node.notes,
    data.description,
    data.demandClaim,
    data.scarcity?.claim,
    data.price?.unit,
    data.settlement?.strangerEnforcement,
    data.settlement?.right,
    data.settlement?.chain,
    data.settlement?.protocol,
    data.settlement?.asset,
  ]
    .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
    .join(' ')
}

function phrasesIn(text: string, phrases: readonly string[]): string[] {
  return matchedPhrases(normalize(text), phrases)
}

/**
 * "ten thousand unique generative characters" never says NFT.
 * A drop-word within eight tokens of a scarcity-word is the same product.
 */
function dropSignals(text: string): string[] {
  const tokens = tokenize(text)
  const drop = tokens.flatMap((token, index) =>
    token === 'drop' || token === 'collection' || token === 'mint' || token === 'minting' ? [index] : [],
  )
  const scarce = tokens.flatMap((token, index) =>
    token === 'generative' || token === 'pfp' || token === 'allowlist' || token === 'whitelist' ? [index] : [],
  )
  const tenThousand = tokens.flatMap((token, index) => (token === 'thousand' || token === '10000' ? [index] : []))
  const hits: number[] = []
  if (drop.length > 0 && scarce.length > 0 && within(drop, scarce, 8)) hits.push(...drop, ...scarce)
  if (drop.length > 0 && tenThousand.length > 0 && within(drop, tenThousand, 8)) hits.push(...drop, ...tenThousand)
  return tokensAt(tokens, hits)
}

function chainSignals(text: string): string[] {
  return [...new Set([...phrasesIn(text, CHAIN_PHRASES), ...dropSignals(text)])]
}

function machineSignals(text: string): string[] {
  return phrasesIn(text, MACHINE_PHRASES)
}

function refuseSignals(text: string): string[] {
  return [...new Set([...phrasesIn(text, REFUSE_PHRASES), ...dropSignals(text)])]
}

function knownRail(value: unknown): SettlementRail | null {
  return typeof value === 'string' && (SETTLEMENT_RAILS as readonly string[]).includes(value) ? (value as SettlementRail) : null
}

function finding(code: string, path: string, message: string, remedy: string): Finding {
  return { code, severity: 'error', path, message, remedy }
}

function wordCount(text: string): number {
  return tokenize(text).length
}

function enforcementHolds(text: string): boolean {
  if (wordCount(text) < 8) return false
  const tokens = tokenize(text)
  if (stemHits(tokens, ENFORCEMENT_STEMS).length > 0) return true
  return phrasesIn(text, ENFORCEMENT_PHRASES).length > 0
}

function isRegistration(action: string): boolean {
  const tokens = tokenize(action)
  const verb = stemHits(tokens, ['regist', 'assign', 'record'])
  const object = stemHits(tokens, ['licens', 'royalt', 'right'])
  return verb.length > 0 && object.length > 0 && within(verb, object, 6)
}

function costText(node: GraphNode): string {
  return [node.label, node.notes, node.evaluation].filter((part): part is string => typeof part === 'string').join(' ')
}

export function analyzeSettlement(graph: IncomeGraph): SettlementAnalysis {
  const findings: Finding[] = []
  const verdicts: SettlementVerdict[] = []
  const all = nodesOf(graph)
  const links = edgesOf(graph)
  const offers = all.filter((node) => node.type === 'Offer')

  const thesis = typeof graph?.metadata?.thesis === 'string' ? graph.metadata.thesis : ''
  const thesisRefused = refuseSignals(thesis)
  const thesisChain = chainSignals(thesis)
  const thesisMachine = machineSignals(thesis)
  const railsAsked = offers.map((offer) => knownRail(offer.data?.settlement?.rail))
  if (thesisRefused.length > 0) {
    findings.push(
      finding(
        'R07',
        '/metadata/thesis',
        `thesis sells a token market: ${thesisRefused.map((m) => `"${m}"`).join(', ')}`,
        'The thesis is the thing a buyer pays for. Take the token, the mint, and the yield out of it.',
      ),
    )
  } else if (thesisChain.length > 0 && !railsAsked.some((rail) => rail === 'on-chain-right' || rail === 'refuse')) {
    findings.push(
      finding(
        'R07',
        '/metadata/thesis',
        `thesis names a chain and no offer admits or refuses it: ${thesisChain.map((m) => `"${m}"`).join(', ')}`,
        'Set an offer settlement.rail to on-chain-right with the admission fields, or to refuse, or delete the chain from the thesis.',
      ),
    )
  } else if (thesisMachine.length > 0 && !railsAsked.some((rail) => rail === 'machine-payment' || rail === 'refuse')) {
    findings.push(
      finding(
        'R07',
        '/metadata/thesis',
        `thesis names a metered agent payment and no offer admits or refuses it: ${thesisMachine.map((m) => `"${m}"`).join(', ')}`,
        'Set settlement.rail to machine-payment with a protocol, a stablecoin, a per-call or per-session price, and a human spend cap. Or refuse it.',
      ),
    )
  }

  for (const role of all.filter((node) => node.type === 'AgentRole')) {
    const blob = [...(role.data?.allowedActions ?? []), role.label, role.notes ?? ''].join(' ')
    const treasury = [...phrasesIn(blob, AGENT_TREASURY_PHRASES), ...phrasesIn(blob, CHAIN_ACTION_PHRASES)]
    if (treasury.length > 0) {
      findings.push(
        finding(
          'R05',
          `/nodes/${role.id}/data/allowedActions`,
          `agent role "${role.id}" can move a chain asset: ${[...new Set(treasury)].map((m) => `"${m}"`).join(', ')}`,
          'Put minting, transfer, and signing in deniedActions. A person signs anything that leaves a wallet.',
        ),
      )
    }
  }

  for (const workflow of all.filter((node) => node.type === 'Workflow')) {
    for (const step of workflow.data?.steps ?? []) {
      if (step.actor !== 'agent') continue
      const hit = phrasesIn(step.action ?? '', CHAIN_ACTION_PHRASES)
      if (hit.length === 0) continue
      findings.push(
        finding(
          'R05',
          `/nodes/${workflow.id}/data/steps/${step.id}/action`,
          `agent step "${step.id}" moves a chain asset: ${hit.map((m) => `"${m}"`).join(', ')}`,
          'Make the actor a person, and put the step behind a HumanGate. An agent does not mint, transfer, or sign.',
        ),
      )
    }
  }

  for (const offer of offers) {
    const corpus = offerCorpus(offer)
    const refused = refuseSignals(corpus)
    const chain = chainSignals(corpus)
    const machine = machineSignals(corpus)
    const asked = offer.data?.settlement?.rail
    const rail = knownRail(asked)
    const serves = links.some((edge) => edge.type === 'serves' && edge.from === offer.id)
    const path = `/nodes/${offer.id}`

    if (typeof asked === 'string' && asked.trim() && !rail) {
      findings.push(
        finding(
          'R03',
          `${path}/data/settlement/rail`,
          `offer "${offer.id}" has settlement rail "${asked}", which is not a rail`,
          `Use one of: ${SETTLEMENT_RAILS.join(', ')}.`,
        ),
      )
      verdicts.push({
        offerId: offer.id,
        label: offer.label,
        rail: 'refuse',
        admitted: false,
        because: 'The rail name is not one this review understands, so the offer is not for sale.',
      })
      continue
    }

    if (rail === 'refuse') {
      if (serves) {
        findings.push(
          finding(
            'R01',
            path,
            `offer "${offer.id}" is refused and still serves a customer`,
            'Remove the serves edge. A refused chain idea is a record, not a product.',
          ),
        )
      }
      verdicts.push({
        offerId: offer.id,
        label: offer.label,
        rail: 'refuse',
        admitted: !serves,
        because: serves
          ? 'This idea is marked refuse and is still attached to a buyer.'
          : 'Recorded as a chain idea that is not for sale.',
      })
      continue
    }

    if (refused.length > 0) {
      findings.push(
        finding(
          'R04',
          path,
          `offer "${offer.id}" is a token market: ${refused.map((m) => `"${m}"`).join(', ')}`,
          'Delete it. A chain is admitted for a license, a royalty split, or access a stranger enforces after the seller is gone. A metered call is a separate rail, with a stablecoin and a human spend cap.',
        ),
      )
      verdicts.push({
        offerId: offer.id,
        label: offer.label,
        rail: rail ?? 'refuse',
        admitted: false,
        because: 'This is a market in a token. It does not clear.',
      })
      continue
    }

    if ((rail === 'fiat-account' || rail === 'signed-receipt') && (chain.length > 0 || machine.length > 0)) {
      findings.push(
        finding(
          'R02',
          `${path}/data/settlement/rail`,
          `offer "${offer.id}" says ${rail} and also ${[...chain, ...machine].map((m) => `"${m}"`).join(', ')}`,
          'Delete those words, or set the rail to on-chain-right or machine-payment and satisfy every admission, or set the rail to refuse and detach the offer.',
        ),
      )
      verdicts.push({
        offerId: offer.id,
        label: offer.label,
        rail,
        admitted: false,
        because: 'The rail and the words in the offer describe different products.',
      })
      continue
    }

    if (!rail && (chain.length > 0 || machine.length > 0)) {
      findings.push(
        finding(
          'R03',
          `${path}/data/settlement/rail`,
          `offer "${offer.id}" names a chain or a meter and names no rail: ${[...chain, ...machine].map((m) => `"${m}"`).join(', ')}`,
          'Set settlement.rail. Silence is not a merchant account once a chain word or a payment protocol is in the offer.',
        ),
      )
      verdicts.push({
        offerId: offer.id,
        label: offer.label,
        rail: 'refuse',
        admitted: false,
        because: 'A chain word with no rail is treated as a product intended for sale.',
      })
      continue
    }

    if (rail === 'machine-payment') {
      const admission = admitMachine(graph, offer)
      findings.push(...admission)
      verdicts.push({
        offerId: offer.id,
        label: offer.label,
        rail,
        admitted: admission.length === 0,
        because:
          admission.length === 0
            ? 'Admitted as a metered call in a stablecoin, inside a spend cap a person raises. The agent does not hold the treasury. A human can still pay the same price in a merchant account. Turning the endpoint on waits for an attested fiat payment.'
            : 'The metered payment is not admitted yet. The findings name each missing condition.',
      })
      continue
    }

    if (rail === 'on-chain-right') {
      const admission = admitOnChain(graph, offer)
      findings.push(...admission)
      verdicts.push({
        offerId: offer.id,
        label: offer.label,
        rail,
        admitted: admission.length === 0,
        because:
          admission.length === 0
            ? 'Admitted as a right a stranger can enforce after the seller is gone. Deploying it is a separate signature by a person.'
            : 'The chain right is not admitted yet. The findings name each missing condition.',
      })
      continue
    }

    const chosen: SettlementRail = rail ?? 'fiat-account'
    verdicts.push({
      offerId: offer.id,
      label: offer.label,
      rail: chosen,
      admitted: true,
      because:
        chosen === 'signed-receipt'
          ? 'A signed receipt can prove what happened. Payment still clears in a merchant account.'
          : 'Nothing in this offer needs a chain. Payment clears in a merchant account.',
    })
  }

  return { verdicts, findings }
}

function isCapStep(action: string): boolean {
  const normalized = normalize(action)
  return hasPhrase(normalized, 'spend cap') || hasPhrase(normalized, 'spending cap')
}

function admitMachine(graph: IncomeGraph, offer: GraphNode): Finding[] {
  const out: Finding[] = []
  const path = `/nodes/${offer.id}`
  const data = offer.data ?? {}
  const settlement = data.settlement ?? {}
  const corpus = offerCorpus(offer)
  const unit = typeof data.price?.unit === 'string' ? data.price.unit : ''
  const protocol = typeof settlement.protocol === 'string' ? settlement.protocol : ''
  const asset = typeof settlement.asset === 'string' ? settlement.asset : ''
  const chain = settlement.chain
  const cap = settlement.spendCap

  if (!(MACHINE_PROTOCOLS as readonly string[]).includes(protocol)) {
    out.push(
      finding(
        'R06',
        `${path}/data/settlement/protocol`,
        `offer "${offer.id}" does not name a machine payment protocol`,
        `Set protocol to one of: ${MACHINE_PROTOCOLS.join(', ')}. x402 meters one call. mpp meters a session.`,
      ),
    )
  }
  if (!(MACHINE_ASSETS as readonly string[]).includes(asset)) {
    out.push(
      finding(
        'R06',
        `${path}/data/settlement/asset`,
        `offer "${offer.id}" is not priced in a stablecoin`,
        `Set asset to one of: ${MACHINE_ASSETS.join(', ')}. A project token is not a settlement asset.`,
      ),
    )
  }
  if (!(MACHINE_UNITS as readonly string[]).includes(unit)) {
    out.push(
      finding(
        'R06',
        `${path}/data/price/unit`,
        `offer "${offer.id}" is priced per "${unit || 'missing unit'}"`,
        `Price it per ${MACHINE_UNITS.join(' or ')}. A file, a seat, or a month clears in a merchant account.`,
      ),
    )
  }
  const copies = phrasesIn(corpus, COPY_PHRASES)
  if (copies.length > 0) {
    out.push(
      finding(
        'R06',
        path,
        `offer "${offer.id}" meters a copy: ${copies.map((item) => `"${item}"`).join(', ')}`,
        'Sell the file through a merchant account. Meter a call, a session, or a license to use a work once.',
      ),
    )
  }
  const capAmount = typeof cap?.amount === 'number' ? cap.amount : 0
  const capPeriod = typeof cap?.period === 'string' ? cap.period : ''
  if (!(capAmount > 0) || !(MACHINE_CAP_PERIODS as readonly string[]).includes(capPeriod)) {
    out.push(
      finding(
        'R06',
        `${path}/data/settlement/spendCap`,
        `offer "${offer.id}" has no human spend cap`,
        'Set spendCap.amount above zero and spendCap.period to day or month. An uncapped agent wallet is not a meter.',
      ),
    )
  }
  if (typeof chain === 'string' && chain.trim() && !(MACHINE_CHAINS as readonly string[]).includes(chain)) {
    out.push(
      finding(
        'R06',
        `${path}/data/settlement/chain`,
        `offer "${offer.id}" names chain "${chain}" for a meter`,
        `Use one of: ${MACHINE_CHAINS.join(', ')}. Story records a license. It does not meter a call.`,
      ),
    )
  }

  const links = edgesOf(graph)
  const workflows = nodesOf(graph).filter(
    (node) => node.type === 'Workflow' && links.some((edge) => edge.type === 'fulfills' && edge.from === node.id && edge.to === offer.id),
  )
  const gates = nodesOf(graph).filter((node) => node.type === 'HumanGate')
  let capped = false
  for (const workflow of workflows) {
    for (const step of workflow.data?.steps ?? []) {
      const gated = gates.some(
        (gate) =>
          links.some((edge) => edge.type === 'gates' && edge.from === gate.id && edge.to === workflow.id) &&
          (gate.data?.gatedStepIds ?? []).includes(step.id),
      )
      if (step.actor === 'human' && step.irreversible === true && gated && isCapStep(step.action ?? '')) capped = true
    }
  }
  if (!capped) {
    out.push(
      finding(
        'R06',
        path,
        `offer "${offer.id}" lets the cap move without a person`,
        'Add an irreversible human step whose action names the spend cap, and put that step on a HumanGate.',
      ),
    )
  }

  const costIds = new Set(
    links
      .filter((edge) => edge.type === 'incurs' && (edge.from === offer.id || workflows.some((workflow) => workflow.id === edge.from)))
      .map((edge) => edge.to),
  )
  const priced = nodesOf(graph).filter(
    (node) =>
      node.type === 'Cost' &&
      costIds.has(node.id) &&
      (node.data?.amount?.amount ?? 0) > 0 &&
      phrasesIn(costText(node), [...COST_PHRASES, 'facilitator', 'network fee']).length > 0,
  )
  if (priced.length === 0) {
    out.push(
      finding(
        'R06',
        path,
        `offer "${offer.id}" records no facilitator or network cost`,
        'Add a Cost, incurred by the offer or its workflow, with an amount above zero, and name the facilitator or the network fee.',
      ),
    )
  }

  return out
}

function admitOnChain(graph: IncomeGraph, offer: GraphNode): Finding[] {
  const out: Finding[] = []
  const path = `/nodes/${offer.id}`
  const data = offer.data ?? {}
  const settlement = data.settlement ?? {}
  const corpus = offerCorpus(offer)
  const unit = typeof data.price?.unit === 'string' ? data.price.unit : ''
  const right = typeof settlement.right === 'string' ? settlement.right : ''
  const chain = settlement.chain

  if (!(ON_CHAIN_RIGHTS as readonly string[]).includes(right)) {
    out.push(
      finding(
        'R06',
        `${path}/data/settlement/right`,
        `offer "${offer.id}" does not name a right a chain can hold`,
        `Set right to one of: ${ON_CHAIN_RIGHTS.join(', ')}.`,
      ),
    )
  }

  if (!(ON_CHAIN_UNITS as readonly string[]).includes(unit)) {
    out.push(
      finding(
        'R06',
        `${path}/data/price/unit`,
        `offer "${offer.id}" is priced per "${unit || 'missing unit'}", which is a copy or a subscription`,
        `Price the offer per ${ON_CHAIN_UNITS.join(', ')}. A file, a seat, or a month clears in a merchant account.`,
      ),
    )
  } else if ((ON_CHAIN_RIGHTS as readonly string[]).includes(right) && RIGHT_FOR_UNIT[unit as (typeof ON_CHAIN_UNITS)[number]] !== right) {
    out.push(
      finding(
        'R06',
        `${path}/data/settlement/right`,
        `offer "${offer.id}" prices a ${unit} and names the right "${right}"`,
        'Make the unit and the right the same thing.',
      ),
    )
  }

  const copies = phrasesIn(corpus, COPY_PHRASES)
  if (copies.length > 0) {
    out.push(
      finding(
        'R06',
        path,
        `offer "${offer.id}" is a copy: ${copies.map((m) => `"${m}"`).join(', ')}`,
        'Sell the file through a merchant account. A chain right is a license, a royalty split, or access the buyer must prove to someone who is not you.',
      ),
    )
  }

  const enforcement = typeof settlement.strangerEnforcement === 'string' ? settlement.strangerEnforcement : ''
  if (!enforcementHolds(enforcement)) {
    out.push(
      finding(
        'R06',
        `${path}/data/settlement/strangerEnforcement`,
        `offer "${offer.id}" does not say which stranger enforces the right after the seller is gone`,
        'Write at least eight words naming the licensee, the successor, or the enforcement, and the moment the seller is no longer the one who can answer.',
      ),
    )
  }

  if (data.scarcity) {
    out.push(
      finding(
        'R06',
        `${path}/data/scarcity`,
        `offer "${offer.id}" publishes a scarcity claim on a chain right`,
        'Delete the scarcity claim. The thing being sold is the right, and a countdown is a mint.',
      ),
    )
  }

  if (typeof chain === 'string' && chain.trim() && !(SETTLEMENT_CHAINS as readonly string[]).includes(chain)) {
    out.push(
      finding(
        'R06',
        `${path}/data/settlement/chain`,
        `offer "${offer.id}" names chain "${chain}"`,
        `Use one of: ${SETTLEMENT_CHAINS.join(', ')}. Leave the field off until a person chooses.`,
      ),
    )
  }

  const links = edgesOf(graph)
  const workflows = nodesOf(graph).filter(
    (node) => node.type === 'Workflow' && links.some((edge) => edge.type === 'fulfills' && edge.from === node.id && edge.to === offer.id),
  )
  const gates = nodesOf(graph).filter((node) => node.type === 'HumanGate')

  if (workflows.length === 0) {
    out.push(
      finding(
        'R06',
        path,
        `offer "${offer.id}" has no workflow that registers the right`,
        'Add a workflow that fulfills the offer, with one irreversible step a person takes to register the license, the royalty split, or the access right.',
      ),
    )
  }

  let registered = false
  for (const workflow of workflows) {
    for (const step of workflow.data?.steps ?? []) {
      const forbidden = phrasesIn(step.action ?? '', FORBIDDEN_STEP_PHRASES)
      if (forbidden.length > 0) {
        out.push(
          finding(
            'R06',
            `/nodes/${workflow.id}/data/steps/${step.id}/action`,
            `workflow "${workflow.id}" step "${step.id}" is a mint: ${forbidden.map((m) => `"${m}"`).join(', ')}`,
            'Replace the step with registering the license, the royalty split, or the access right.',
          ),
        )
      }
      const gated = gates.some(
        (gate) =>
          links.some((edge) => edge.type === 'gates' && edge.from === gate.id && edge.to === workflow.id) &&
          (gate.data?.gatedStepIds ?? []).includes(step.id),
      )
      if (step.actor === 'human' && step.irreversible === true && gated && isRegistration(step.action ?? '')) {
        registered = true
      }
    }
  }
  if (workflows.length > 0 && !registered) {
    out.push(
      finding(
        'R06',
        path,
        `offer "${offer.id}" has no human-gated step that registers the right`,
        'Add an irreversible step, actor human, whose action registers or assigns the license, royalty, or right, and name that step in a HumanGate.',
      ),
    )
  }

  const costIds = new Set(
    links
      .filter((edge) => edge.type === 'incurs' && (edge.from === offer.id || workflows.some((workflow) => workflow.id === edge.from)))
      .map((edge) => edge.to),
  )
  const costs = nodesOf(graph).filter((node) => node.type === 'Cost' && costIds.has(node.id))
  const priced = costs.filter((cost) => (cost.data?.amount?.amount ?? 0) > 0 && phrasesIn(costText(cost), COST_PHRASES).length > 0)
  if (priced.length === 0) {
    out.push(
      finding(
        'R06',
        path,
        `offer "${offer.id}" records no chain cost`,
        'Add a Cost, incurred by the offer or its workflow, with an amount above zero, and name gas, custody, legal review, or wallet support in it.',
      ),
    )
  }

  return out
}

/** Whole-phrase probe used by tests that want to know why a sentence did not match. */
export function settlementProbe(text: string): { chain: string[]; refuse: string[] } {
  return { chain: chainSignals(text), refuse: refuseSignals(text) }
}
