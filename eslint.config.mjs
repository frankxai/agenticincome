import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // lib/demand-capture/handler.ts is a byte-for-byte upstream copy (PROVENANCE.md); its unused `hasAnswers` warning is fixed upstream, not here.
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'lib/demand-capture/handler.ts']),
])
