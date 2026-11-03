#!/usr/bin/env node
import { readFileSync, statSync } from 'node:fs'
import { compileMeasurements } from '../lib/measurement.mts'

try {
  if (process.argv.length !== 3) throw new Error('Usage: node scripts/measure-income.mjs INPUT.json')
  const file = process.argv[2]
  if (!statSync(file).isFile() || statSync(file).size > 262144) throw new Error('Input must be a regular JSON file under 256 KiB')
  process.stdout.write(JSON.stringify(compileMeasurements(JSON.parse(readFileSync(file, 'utf8'))), null, 2) + '\n')
} catch (error) {
  const message = error instanceof Error && /^(Usage:|Input must be|Invalid measurement:)/.test(error.message)
    ? error.message : 'Measurement failed; supply a valid measurement input'
  process.stderr.write(JSON.stringify({ error: message }) + '\n')
  process.exitCode = 1
}

