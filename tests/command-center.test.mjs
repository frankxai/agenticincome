import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const url = (path) => new URL(`../${path}`, import.meta.url)

test('the unauthenticated /command "private portal" stays removed until real auth exists', () => {
  assert.equal(existsSync(url('app/command/page.tsx')), false)
  assert.equal(existsSync(url('components/IncomeCommandDesk.tsx')), false)
  const operate = readFileSync(url('app/operate/page.tsx'), 'utf8')
  assert.doesNotMatch(operate, /href="\/command"/)
})
