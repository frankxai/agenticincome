import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Vercel branch rules are minimatch patterns. This covers the forms a hold would
// realistically use; it is deliberately stricter than a literal "main" lookup.
const escape = (part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const matches = (pattern, branch) =>
  new RegExp('^' + pattern.split('*').map(escape).join('.*') + '$').test(branch);

test('main deploys to production: no rule in vercel.json disables it', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  // The 2026-11-04 hold ({ main: false }) was lifted by the release approved on 2026-11-12.
  // Re-adding a hold is a release decision, so it must fail here and be made on purpose.
  const rules = config.git?.deploymentEnabled;
  if (rules === undefined) return;
  assert.notEqual(rules, false, 'git.deploymentEnabled: false disables every branch');
  if (rules === true) return;

  const matching = Object.entries(rules).filter(([pattern]) => matches(pattern, 'main'));
  const disabled = matching.some(([, enabled]) => enabled === false);
  const enabled = matching.some(([, value]) => value === true);
  assert.ok(!disabled || enabled, 'a matching rule holds main; remove it or add a more specific true rule');
});
