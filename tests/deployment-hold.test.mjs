import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('main deploys to production: no rule in vercel.json disables it', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  // The 2026-11-04 hold ({ main: false }) was lifted by the release approved on 2026-11-12.
  // Re-adding a hold is a release decision, so it must fail here and be made on purpose.
  const rules = config.git?.deploymentEnabled;
  if (rules === undefined) return;
  assert.notEqual(rules, false, 'git.deploymentEnabled: false disables every branch');
  assert.notEqual(rules.main, false, 'git.deploymentEnabled.main: false holds production');
});
