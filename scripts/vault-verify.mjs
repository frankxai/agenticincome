#!/usr/bin/env node
// Re-fetches every vault source and checks that the row's stated number appears on the page.
// Writes vault/verification.json as a dated receipt. A match proves presence, not meaning:
// "verified" rows still get human or second-model spot checks before public use.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadVault } from './vault-validate.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'vault', 'verification.json');
const TIMEOUT_MS = 25_000;
const CONCURRENCY = 4;
const UA = 'AgenticIncomeVaultVerify/1.0 (+https://github.com/frankxai/agenticincome)';

// Pull the load-bearing numbers out of a human value string. Each number becomes one group of
// spellings: "$1,503.1 million" -> [["$1,503.1", "1,503.1", "$1503.1", "1503.1"]].
// A bare single digit is too common to prove anything, so it only counts with a "$" or "%" attached.
export function numberGroups(text) {
  const groups = [];
  for (const m of String(text ?? '').matchAll(/(\$\s?)?(\d[\d,]*(?:\.\d+)?)(\s?%)?/g)) {
    const [, dollar, num, pct] = m;
    const bare = num.replace(/,$/, '');
    const isBareDigit = /^\d$/.test(bare);
    const spellings = new Set();
    for (const n of new Set([bare, bare.replace(/,/g, '')])) {
      if (dollar) spellings.add('$' + n);
      if (pct) spellings.add(n + '%');
      if (!isBareDigit) spellings.add(n);
    }
    if (spellings.size) groups.push([...spellings]);
  }
  return groups;
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Boundaries stop "$4" matching "$40" or "$4.50", and "8%" matching "18%".
const tokenRegex = (t) => new RegExp(`(?<![\\d.,])${escape(t)}(?!\\d|\\.\\d)`);

export function pageText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
}

// Every number the row states must appear; one matching number out of several proves nothing.
export function matchRow(groups, text) {
  if (!groups.length) return { found: [], missing: [], verdict: 'no-number' };
  const found = [], missing = [];
  for (const g of groups) {
    const hit = g.find((t) => tokenRegex(t).test(text));
    if (hit) found.push(hit); else missing.push(g[0]);
  }
  return { found, missing, verdict: missing.length ? 'number-missing' : 'number-found' };
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    // Without a language some sites localize prices ("0,2 USD"), which no row spells that way.
    const headers = { 'user-agent': UA, accept: 'text/html,application/json;q=0.9,*/*;q=0.8', 'accept-language': 'en-US,en;q=0.9' };
    const res = await fetch(url, { headers, signal: ctrl.signal, redirect: 'follow' });
    const body = res.ok ? await res.text() : '';
    return { status: res.status, text: res.ok ? pageText(body) : '' };
  } catch (e) {
    return { status: e.name === 'AbortError' ? 'timeout' : 'error', text: '' };
  } finally {
    clearTimeout(timer);
  }
}

function rowsToCheck(v) {
  const rows = [];
  for (const r of v.economies?.rows ?? []) rows.push({ file: 'economies', id: r.id, url: r.sourceUrl, text: r.valueText, live: r.live });
  for (const r of v.supply?.rows ?? []) rows.push({ file: 'supply-chain', id: r.id, url: r.sourceUrl, text: r.priceText });
  for (const f of v.macro?.facts ?? []) rows.push({ file: 'macro', id: f.id, url: f.sourceUrl, text: f.claim, live: f.live });
  return rows;
}

// Reviewer receipts cover sources a plain fetch cannot read (SEC asks for a contact address we do not invent).
function reviewerReceipts() {
  const p = join(dirname(OUT), 'verification-manual.json');
  return existsSync(p) ? new Map(JSON.parse(readFileSync(p, 'utf8')).receipts.map((r) => [r.id, r])) : new Map();
}

// A receipt upgrades a row only when the reviewer read the row's own URL and recorded the metric.
// Live counters drift daily, so they are reported as such and never count as confirmed.
export function finalVerdict(auto, receipt, live, url) {
  if (auto === 'number-found') return 'number-found';
  if (receipt?.verdict === 'match' && receipt.url === url && receipt.metric) return 'reviewer-confirmed';
  if (live) return 'live-counter';
  return auto;
}

async function main() {
  const rows = rowsToCheck(loadVault());
  const urls = [...new Set(rows.map((r) => r.url))];
  const pages = new Map();
  let next = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < urls.length) {
      const url = urls[next++];
      pages.set(url, await fetchText(url));
    }
  }));
  const checkedAt = new Date().toISOString();
  const receipts = reviewerReceipts();
  const results = rows.map((r) => {
    const page = pages.get(r.url);
    const auto = page.status !== 200
      ? { status: page.status, verdict: 'unreachable', found: [] }
      : { status: 200, ...matchRow(numberGroups(r.text), page.text) };
    const receipt = receipts.get(r.id);
    return {
      file: r.file, id: r.id, url: r.url, status: auto.status, automated: auto.verdict, found: auto.found, missing: auto.missing ?? [],
      verdict: finalVerdict(auto.verdict, receipt, r.live, r.url),
      ...(receipt ? { reviewer: { by: receipt.by, at: receipt.at, verdict: receipt.verdict, url: receipt.url, metric: receipt.metric, note: receipt.note } } : {}),
    };
  });
  const summary = results.reduce((acc, r) => ({ ...acc, [r.verdict]: (acc[r.verdict] ?? 0) + 1 }), {});
  writeFileSync(OUT, JSON.stringify({
    $comment: 'Receipt from scripts/vault-verify.mjs. number-found = every number the row states appears on the fetched page; reviewer-confirmed = a plain fetch could not confirm it but a recorded reviewer read the same URL and named the metric (verification-manual.json); live-counter = a daily-changing counter whose committed value no longer matches the source, not counted as confirmed; number-missing = page loaded but no row number found (stale, rendered by script, or worded differently); unreachable = blocked, timed out or gone for a plain fetch, which says nothing about the value; no-number = the row states no number to check.',
    checkedAt, urlCount: urls.length, summary, results,
  }, null, 2));
  console.log(`vault-verify: ${results.length} rows over ${urls.length} urls`, summary);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
