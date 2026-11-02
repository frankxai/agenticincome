import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numberGroups, matchRow, finalVerdict, pageText } from '../scripts/vault-verify.mjs';

test('each number becomes one group of spellings; bare single digits are dropped', () => {
  const g = numberGroups('$4 / MTok, 8% + 40 cents, 1,503.1 million, 3 seats');
  assert.equal(g.length, 4);
  assert.ok(g[0].includes('$4') && !g[0].includes('4'));
  assert.ok(g[1].includes('8%'));
  assert.ok(g[3].includes('1,503.1') && g[3].includes('1503.1'));
});

test('a price does not match a longer number', () => {
  assert.equal(matchRow([['$4']], 'costs $40 per seat').verdict, 'number-missing');
  assert.equal(matchRow([['$4']], 'costs $4.50 per seat').verdict, 'number-missing');
  assert.equal(matchRow([['8%']], 'a 18% fee').verdict, 'number-missing');
  assert.equal(matchRow([['$4']], 'input $4 / MTok').verdict, 'number-found');
});

test('every number in the row must appear, not just one (Codex counterexample)', () => {
  const groups = numberGroups('8% + $0.40 per transaction');
  const page = 'A separate 8% discount applies. The transaction fee is 10% plus $0.50.';
  const r = matchRow(groups, page);
  assert.equal(r.verdict, 'number-missing');
  assert.deepEqual(r.missing, ['$0.40']);
});

test('a row with no number says so instead of passing', () => {
  assert.equal(matchRow([], 'anything').verdict, 'no-number');
});

test('a receipt upgrades only a named-metric match on the same URL', () => {
  const url = 'https://example.com/a';
  assert.equal(finalVerdict('unreachable', { verdict: 'match', url, metric: 'GMV' }, false, url), 'reviewer-confirmed');
  assert.equal(finalVerdict('unreachable', { verdict: 'match', url: 'https://example.com/b', metric: 'GMV' }, false, url), 'unreachable');
  assert.equal(finalVerdict('unreachable', { verdict: 'match', url, metric: null }, false, url), 'unreachable');
  assert.equal(finalVerdict('unreachable', { verdict: 'numeric-sighting', url, metric: null }, false, url), 'unreachable');
});

test('a live counter that no longer matches is reported as live, not confirmed', () => {
  assert.equal(finalVerdict('number-missing', undefined, true, 'u'), 'live-counter');
  assert.equal(finalVerdict('number-found', undefined, true, 'u'), 'number-found');
});

test('page text strips scripts and tags', () => {
  assert.equal(pageText('<p>a</p><script>var x=9</script><b>b</b>').trim(), 'a b');
});
