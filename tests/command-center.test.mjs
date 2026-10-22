import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('command center page links operate', () => {
  const page = read('app/command/page.tsx')
    const operate = read('app/operate/page.tsx')

  assert.match(page, /href="\/operate"/)

  assert.match(operate, /href="\/command"/)
})

test('command center components expose zero secrets and zero custody violations', () => {
  const page = read('app/command/page.tsx')
  const desk = read('components/IncomeCommandDesk.tsx')

  for (const code of [page, desk]) {
    assert.doesNotMatch(code, /sk_live|secret_key|api_key|bearer\s+[a-z0-9]/i)
    assert.doesNotMatch(code, /eval\(|exec\(|child_process/i)
  }
})
