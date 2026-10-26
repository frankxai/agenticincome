#!/usr/bin/env node
// Builds vault/atlas.html, a self-contained internal page, from the vault JSON files.
// The page computes every figure from the embedded data, so it rebuilds instead of being hand-edited.
import { writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadVault, validate } from './vault-validate.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'vault', 'atlas.html');

const vault = loadVault();
const errors = validate(vault);
if (errors.length) {
  console.error('vault-atlas: vault does not validate; run pnpm vault:check');
  process.exit(1);
}

// The registry is only needed to validate partner rows; the page reads partners.json.
const pageData = { ...vault };
delete pageData.programs;
const payload = JSON.stringify(pageData).replace(/</g, '\\u003c');
const template = readFileSync(join(HERE, 'vault-atlas.template.html'), 'utf8');
writeFileSync(OUT, template.replace('__VAULT_DATA__', payload));
console.log(`vault-atlas: wrote ${OUT}`);
