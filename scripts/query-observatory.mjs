import { openSync, readSync, closeSync } from 'node:fs'
import { projectCatalog, catalogCsv } from '../lib/observatory.mjs'
import { auditObservatory, observatoryDashboard } from '../lib/observatory-health.mjs'

try {
  const [path, ...args] = process.argv.slice(2)
  if (!path || args.length % 2) throw new Error('arguments')
  const filters = {}, auditOptions = {}, seen = new Set()
  let format = 'json'
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i], value = args[i + 1]
    if (seen.has(key) || !value || !['--layer', '--model', '--search', '--format', '--audit-at', '--freshness-days'].includes(key)) throw new Error('arguments')
    seen.add(key)
    if (key === '--format') { if (!['json', 'csv', 'health', 'html'].includes(value)) throw new Error('arguments'); format = value }
    else if (key === '--audit-at') auditOptions.audit_at = value
    else if (key === '--freshness-days') { if (!/^[1-9]\d*$/.test(value)) throw new Error('arguments'); auditOptions.freshness_days = Number(value) }
    else filters[key.slice(2)] = value
  }
  // Bounded read also handles a file growing between metadata and read operations.
  const fd = openSync(path, 'r'), limit = 2 * 1024 * 1024, buffer = Buffer.alloc(limit + 1)
  let size = 0
  try { while (size < buffer.length) { const read = readSync(fd, buffer, size, buffer.length - size, null); if (!read) break; size += read } } finally { closeSync(fd) }
  if (size > limit) throw new Error('size')
  const input = JSON.parse(buffer.subarray(0, size).toString('utf8'))
  if (!['health', 'html'].includes(format) && Object.keys(auditOptions).length) throw new Error('arguments')
  const options = { ...auditOptions, filters }
  const result = format === 'html' ? observatoryDashboard(input, options) : format === 'health' ? JSON.stringify(auditObservatory(input, options), null, 2) + '\n' : format === 'csv' ? catalogCsv(projectCatalog(input, filters)) : JSON.stringify(projectCatalog(input, filters), null, 2) + '\n'
  process.stdout.write(result)
} catch {
  // Avoid leaking raw input, private path, JSON parser context or stack traces.
  process.stderr.write('{"error":"invalid_catalog_request"}\n')
  process.exitCode = 1
}
