import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numberTokens, matchRow, finalVerdict, pageText } from '../scripts/vault-verify.mjs';

test('tokens keep currency and percent context and drop bare single digits', () => {
  const t = numberTokens('$4 / MTok, 8% + 40 cents, 1,503.1 million, 3 seats');
  assert.ok(t.includes('$4'));
  assert.ok(t.includes('8%'));
  assert.ok(t.includes('1,503.1') && t.includes('1503.1'));
  assert.ok(!t.includes('4') && !t.includes('3'));
});

test('a price does not match a longer number', () => {
  assert.equal(matchRow(['$4'], 'costs $40 per seat').verdict, 'number-missing');
  assert.equal(matchRow(['$4'], 'costs $4.50 per seat').verdict, 'number-missing');
  assert.equal(matchRow(['8%'], 'a 18% fee').verdict, 'number-missing');
  assert.equal(matchRow(['$4'], 'input $4 / MTok').verdict, 'number-found');
});

test('a row with no number says so instead of passing', () => {
  assert.equal(matchRow([], 'anything').verdict, 'no-number');
});

test('reviewer receipts upgrade only a match, and live counters are never string-matched', () => {
  assert.equal(finalVerdict('unreachable', { verdict: 'match' }, false), 'reviewer-confirmed');
  assert.equal(finalVerdict('unreachable', { verdict: 'mismatch' }, false), 'unreachable');
  assert.equal(finalVerdict('number-found', undefined, true), 'live-counter');
});

test('page text strips scripts and tags', () => {
  assert.equal(pageText('<p>a</p><script>var x=9</script><b>b</b>').trim(), 'a b');
});
