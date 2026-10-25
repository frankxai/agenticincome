import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadVault, validate, computeMargin } from '../scripts/vault-validate.mjs';

test('committed vault validates', () => {
  assert.deepEqual(validate(loadVault()), []);
});

test('a result without a receipt is rejected', () => {
  const v = loadVault();
  v.experiments.experiments[0].results = [{ value: 42 }];
  assert.ok(validate(v).some((e) => e.includes('result without receipt')));
});

test('an unsourced economy row is rejected', () => {
  const v = loadVault();
  v.economies = { rows: [{ id: 'x', value: 1, retrievedAt: '2026-10-25' }] };
  assert.ok(validate(v).some((e) => e.includes('sourceUrl must be https')));
});

test('a stated margin that does not match its inputs is rejected', () => {
  const v = loadVault();
  v.supply = { rows: [{ id: 'cost', price: 2, sourceUrl: 'https://example.com', retrievedAt: '2026-10-25' }] };
  v.margins = {
    scenarios: [{
      id: 'm', revenueModel: 'digital-product-mor', priceUsd: 10, priceIsHypothesis: true,
      costLines: [{ supplyId: 'cost', quantity: 1 }], grossMarginPct: 95,
    }],
  };
  assert.ok(validate(v).some((e) => e.includes('stated 95%')));
});

test('a cost line pointing at an unpriced supply row is rejected', () => {
  const v = loadVault();
  v.supply = { rows: [{ id: 'cost', price: null, sourceUrl: 'https://example.com', retrievedAt: '2026-10-25' }] };
  v.margins = {
    scenarios: [{
      id: 'm', revenueModel: 'digital-product-mor', priceUsd: 10, priceIsHypothesis: true,
      costLines: [{ supplyId: 'cost', quantity: 1 }], grossMarginPct: 80,
    }],
  };
  assert.ok(validate(v).some((e) => e.includes('no numeric sourced price')));
});

test('margin arithmetic reads prices, fees and take rate from sourced rows', () => {
  const supply = new Map([
    ['gpu', { price: 5 }],
    ['card', { rate: 0.05, fixedUsd: 0.5 }],
  ]);
  const economies = new Map([['store', { takeRateFraction: 0.3 }]]);
  const { marginPct } = computeMargin({
    priceUsd: 100,
    costLines: [{ supplyId: 'gpu', quantity: 2 }],
    feeLines: [{ supplyId: 'card' }],
    takeRateFrom: 'store',
  }, supply, economies);
  assert.equal(Number(marginPct.toFixed(2)), 54.5);
});

test('non-zero spend without a spend gate is rejected', () => {
  const v = loadVault();
  v.experiments.experiments[0].spendBudgetUsd = 50;
  assert.ok(validate(v).some((e) => e.includes('spend human gate')));
});
