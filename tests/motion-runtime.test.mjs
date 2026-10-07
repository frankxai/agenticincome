import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const compiled = ts.transpileModule(
  readFileSync(new URL('../components/MotionRuntime.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } },
).outputText

function run(scene = {}, reduced = false) {
  const tweens = []
  let effect
  let registrations = 0
  let reverts = 0
  const gsap = {
    registerPlugin() { registrations++ },
    utils: { toArray(selector) { return scene[selector] ?? [] } },
    context(callback) { callback(); return { revert() { reverts++ } } },
    fromTo(target, from, to) {
      const targets = typeof target === 'string' ? scene[target] ?? [] : target
      assert.ok(targets.length > 0, 'GSAP must never receive an absent optional target')
      tweens.push({ targets, from, to })
    },
  }
  const compiledModule = { exports: {} }
  vm.runInNewContext(compiled, {
    exports: compiledModule.exports,
    require(name) {
      if (name === 'react') return { useEffect(callback) { effect = callback } }
      if (name === 'gsap') return gsap
      if (name === 'gsap/ScrollTrigger') return { ScrollTrigger: {} }
      throw new Error(`Unexpected import: ${name}`)
    },
    window: { matchMedia() { return { matches: reduced } } },
    document: { querySelector(selector) { return scene[selector]?.[0] ?? null } },
  })
  compiledModule.exports.MotionRuntime()
  const cleanup = effect()
  return { tweens, registrations, cleanup, reverts: () => reverts }
}

test('a route without homepage sections initializes no optional tweens', () => {
  const result = run()
  assert.equal(result.tweens.length, 0)
  result.cleanup()
  assert.equal(result.reverts(), 1)
})

test('present homepage targets retain their timing and actual signal trigger', () => {
  const hero = {}, engine = {}, route = {}, board = {}
  const result = run({ '[data-hero-panel]': [hero], '[data-engine-stage]': [engine], '.signal-route': [route], '.signal-board': [board] })
  assert.equal(result.tweens.length, 3)
  assert.equal(result.tweens[0].targets[0], hero)
  assert.equal(result.tweens[0].to.duration, 0.82)
  assert.equal(result.tweens[1].targets[0], engine)
  assert.equal(result.tweens[1].to.stagger, 0.1)
  assert.equal(result.tweens[2].targets[0], route)
  assert.equal(result.tweens[2].to.scrollTrigger.trigger, board)
  assert.equal(result.tweens[2].to.stagger, 0.06)
  result.cleanup()
  assert.equal(result.reverts(), 1)
})

test('signal routes without their board do not initialize a broken scroll trigger', () => {
  assert.equal(run({ '.signal-route': [{}] }).tweens.length, 0)
})

test('reduced motion exits before registering or initializing animations', () => {
  const result = run({ '[data-hero-panel]': [{}], '[data-engine-stage]': [{}], '.signal-route': [{}], '.signal-board': [{}] }, true)
  assert.equal(result.registrations, 0)
  assert.equal(result.tweens.length, 0)
  assert.equal(result.cleanup, undefined)
})
