#!/usr/bin/env node
// Validates vault/: cross-references, sourcing, and margin arithmetic.
// Margins are recomputed from supply-chain rows so a hand-typed margin cannot drift from its inputs.
import { reviewedMarginTerms } from '../lib/vault.ts';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'vault');
const MARGIN_TOLERANCE_PCT = 0.5;

export function loadVault(root = ROOT) {
  const read = (f) => {
    const p = join(root, f);
    return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null;
  };
  return {
    models: read('revenue-models.json'),
    estate: read('estate-map.json'),
    experiments: read('experiments.json'),
    competitions: read('competitions.json'),
    economies: read('economies.json'),
    supply: read('supply-chain.json'),
    macro: read('macro.json'),
    margins: read('margins.json'),
    partners: read('partners.json'),
    playbooks: read('playbooks.json'),
    verification: read('verification.json'),
    programs: read(join('..', 'data', 'programs.json')),
  };
}

function validatePartners(v, errors) {
  if (!v.partners) return new Set();
  const programs = new Map((v.programs?.programs ?? []).map((p) => [p.tool, p]));
  const tools = new Set();
  for (const r of v.partners.rows) {
    tools.add(r.tool);
    const p = programs.get(r.tool);
    if (!p) { errors.push(`partners ${r.tool}: not in data/programs.json`); continue; }
    if (!p.hasProgram || p.status !== 'active') errors.push(`partners ${r.tool}: registry status is ${p.status}, not active`);
    if (!String(p.commission ?? '').includes(r.rateText)) errors.push(`partners ${r.tool}: "${r.rateText}" not in registry commission text`);
    if (typeof r.rate === 'number' && `${Math.round(r.rate * 100)}%` !== r.rateText) errors.push(`partners ${r.tool}: rate ${r.rate} disagrees with ${r.rateText}`);
  }
  return tools;
}

function validatePlaybooks(v, ids, errors) {
  if (!v.playbooks) return;
  const stages = new Set(v.playbooks.stages);
  for (const pb of v.playbooks.playbooks) {
    const at = `playbook ${pb.property}`;
    if (!ids.props.has(pb.property)) errors.push(`${at}: unknown property`);
    for (const s of pb.streams) {
      if (!ids.models.has(s.model)) errors.push(`${at}: unknown model ${s.model}`);
      if (!stages.has(s.stage)) errors.push(`${at}: bad stage ${s.stage}`);
    }
    for (const s of pb.shops) if (!ids.economies.has(s)) errors.push(`${at}: unknown shop ${s}`);
    for (const p of pb.partners) if (!ids.partners.has(p)) errors.push(`${at}: unknown partner ${p}`);
    for (const a of pb.articles) for (const r of a.rows) if (!ids.anyRow.has(r)) errors.push(`${at}: article "${a.title}" cites unknown row ${r}`);
    if (pb.nextExperiment && !ids.experiments.has(pb.nextExperiment)) errors.push(`${at}: unknown experiment ${pb.nextExperiment}`);
  }
}

const isHttps = (u) => typeof u === 'string' && /^https:\/\//.test(u);

function uniqueIds(rows, label, errors) {
  const seen = new Set();
  for (const r of rows) {
    if (!r.id) errors.push(`${label}: row without id`);
    else if (seen.has(r.id)) errors.push(`${label}: duplicate id ${r.id}`);
    seen.add(r.id);
  }
  return seen;
}

function sourced(rows, label, dateField, errors) {
  for (const r of rows) {
    if (!isHttps(r.sourceUrl)) errors.push(`${label} ${r.id}: sourceUrl must be https`);
    if (!r[dateField]) errors.push(`${label} ${r.id}: missing ${dateField}`);
  }
}

// Prices, fee rates and take rates are read from their sourced rows, never from the scenario.
export function computeMargin(s, supplyById, economyById = new Map()) {
  let cost = 0;
  for (const line of s.costLines ?? []) {
    cost += line.quantity * supplyById.get(line.supplyId).price;
  }
  for (const fee of s.feeLines ?? []) {
    const src = supplyById.get(fee.supplyId);
    cost += s.priceUsd * (src.rate ?? 0) + (src.fixedUsd ?? 0);
  }
  if (s.takeRateFrom) {
    const terms = reviewedMarginTerms(economyById.get(s.takeRateFrom));
    if (!terms) throw new RangeError('Marketplace transaction terms are missing.');
    cost += s.priceUsd * terms.rate + terms.fixedUsd;
  }
  const marginPct = ((s.priceUsd - cost) / s.priceUsd) * 100;
  return { costUsd: cost, marginPct };
}

export function validate(v) {
  const errors = [];
  if (!v.models) errors.push('revenue-models.json missing');
  if (!v.estate) errors.push('estate-map.json missing');
  if (!v.experiments) errors.push('experiments.json missing');
  if (errors.length) return errors;

  const modelIds = uniqueIds(v.models.models, 'revenue-models', errors);
  const propIds = uniqueIds(v.estate.properties, 'estate-map', errors);

  for (const p of v.estate.properties) {
    for (const m of p.revenueModels) {
      if (!modelIds.has(m)) errors.push(`estate-map ${p.id}: unknown revenue model ${m}`);
    }
  }

  const experimentIds = uniqueIds(v.experiments.experiments, 'experiments', errors);
  const statuses = new Set(v.experiments.statuses);
  for (const e of v.experiments.experiments) {
    for (const f of ['title', 'hypothesis', 'metric', 'killRule', 'duration']) {
      if (!e[f]) errors.push(`experiment ${e.id}: missing ${f}`);
    }
    if (!modelIds.has(e.revenueModel)) errors.push(`experiment ${e.id}: unknown revenue model ${e.revenueModel}`);
    if (!propIds.has(e.property)) errors.push(`experiment ${e.id}: unknown property ${e.property}`);
    if (!statuses.has(e.status)) errors.push(`experiment ${e.id}: bad status ${e.status}`);
    if (e.spendBudgetUsd !== 0 && !(e.humanGates ?? []).some((g) => /spend/i.test(g))) {
      errors.push(`experiment ${e.id}: non-zero spend needs a spend human gate`);
    }
    for (const r of e.results ?? []) {
      if (!r.receipt) errors.push(`experiment ${e.id}: result without receipt`);
    }
  }

  if (v.competitions) {
    uniqueIds(v.competitions.formats, 'competitions', errors);
    for (const entry of v.competitions.leaderboard) {
      if (!entry.receipt) errors.push(`leaderboard entry ${entry.id ?? '?'}: missing receipt`);
    }
  }

  const economyById = new Map();
  if (v.economies) {
    uniqueIds(v.economies.rows, 'economies', errors);
    sourced(v.economies.rows, 'economies', 'retrievedAt', errors);
    for (const r of v.economies.rows) economyById.set(r.id, r);
  }

  const supplyById = new Map();
  if (v.supply) {
    uniqueIds(v.supply.rows, 'supply-chain', errors);
    sourced(v.supply.rows, 'supply-chain', 'retrievedAt', errors);
    for (const r of v.supply.rows) supplyById.set(r.id, r);
  }

  if (v.macro) {
    uniqueIds(v.macro.facts, 'macro', errors);
    sourced(v.macro.facts, 'macro', 'asOf', errors);
  }

  if (v.margins) {
    uniqueIds(v.margins.scenarios, 'margins', errors);
    for (const s of v.margins.scenarios) {
      if (s.priceIsHypothesis !== true) errors.push(`margin ${s.id}: our price must be marked priceIsHypothesis`);
      if (!modelIds.has(s.revenueModel)) errors.push(`margin ${s.id}: unknown revenue model ${s.revenueModel}`);
      let resolvable = true;
      for (const line of s.costLines ?? []) {
        const src = supplyById.get(line.supplyId);
        if (!(Number.isFinite(line.quantity) && line.quantity > 0)) {
          errors.push(`margin ${s.id}: cost line ${line.supplyId} quantity must be a finite number greater than 0`);
          resolvable = false;
        }
        if (!src || typeof src.price !== 'number' || src.priceKind === 'rate') {
          errors.push(`margin ${s.id}: cost line ${line.supplyId} has no numeric sourced price`);
          resolvable = false;
        }
      }
      for (const fee of s.feeLines ?? []) {
        const src = supplyById.get(fee.supplyId);
        if (!src || typeof src.commissionRate === 'number' || (typeof src.rate !== 'number' && typeof src.fixedUsd !== 'number')) {
          errors.push(`margin ${s.id}: fee line ${fee.supplyId} has no sourced rate or fixed fee`);
          resolvable = false;
        }
      }
      if (s.takeRateFrom && !reviewedMarginTerms(economyById.get(s.takeRateFrom))) {
        errors.push(`margin ${s.id}: takeRateFrom ${s.takeRateFrom} has no reviewed transaction terms`);
        resolvable = false;
      }
      if (!resolvable) continue;
      const { marginPct } = computeMargin(s, supplyById, economyById);
      if (Math.abs(marginPct - s.grossMarginPct) > MARGIN_TOLERANCE_PCT) {
        errors.push(`margin ${s.id}: stated ${s.grossMarginPct}% but inputs give ${marginPct.toFixed(1)}%`);
      }
    }
  }

  const partnerTools = validatePartners(v, errors);
  validatePlaybooks(v, {
    props: propIds, models: modelIds, experiments: experimentIds, partners: partnerTools,
    economies: new Set(economyById.keys()),
    anyRow: new Set([...economyById.keys(), ...supplyById.keys(), ...(v.macro?.facts ?? []).map((f) => f.id)]),
  }, errors);

  return errors;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const errors = validate(loadVault());
  if (errors.length) {
    console.error(`vault: ${errors.length} problem(s)`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log('vault: ok');
}
