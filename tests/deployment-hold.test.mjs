import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('merging main preserves the production hold while previews remain enabled', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  // Vercel's project API confirms main is the production branch. An overlapping
  // true rule can re-enable deployment, so allow only this explicit hold.
  assert.deepEqual(config.git.deploymentEnabled, { main: false });
});
