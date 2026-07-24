import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import test from 'node:test'

const root = new URL('..', import.meta.url)
const sourceExtensions = new Set(['.ts', '.tsx', '.md', '.mdx'])
const productionRoots = ['app', 'components', 'lib']
const coreGettingStarted = [
  'README.md',
  'docs/GETTING-STARTED.md',
  'packs/PORTABLE.md',
  'knowledge/integrations/claude-code.md',
  'knowledge/integrations/codex.md',
]

function walk(path, files = []) {
  for (const entry of readdirSync(new URL(`${path}/`, root), { withFileTypes: true })) {
    const child = join(path, entry.name)
    if (entry.isDirectory()) walk(child, files)
    else if (sourceExtensions.has(extname(entry.name))) files.push(child)
  }
  return files
}

const read = (path) => readFileSync(new URL(path, root), 'utf8')
const publicRepository = 'https://github.com/frankxai/agentic-income-skills'
const privateRepositoryLink =
  /https:\/\/github\.com\/frankxai\/agenticincome(?:\.git)?(?=$|[/?#"'`\s)])/i
const privateRepositoryVariants = [
  ['bare', 'https://github.com/frankxai/agenticincome'],
  ['git clone', 'https://github.com/frankxai/agenticincome.git'],
  ['query', 'https://github.com/frankxai/agenticincome?tab=readme'],
  ['fragment', 'https://github.com/frankxai/agenticincome#readme'],
  ['blob path', 'https://github.com/frankxai/agenticincome/blob/main/README.md'],
]
const publicRepositoryVariants = [
  'https://github.com/frankxai/agentic-income-skills',
  'https://github.com/frankxai/agentic-income-skills.git',
  'https://github.com/frankxai/agentic-income-skills?tab=readme',
  'https://github.com/frankxai/agentic-income-skills#quick-start',
  'https://github.com/frankxai/agentic-income-skills/blob/main/README.md',
]
const privateSupportingRepositories = [
  'https://github.com/frankxai/go-agenticincome',
  'https://github.com/frankxai/dpi',
  'https://github.com/frankxai/hermes',
]
const privatePluginCommands = [
  '/plugin marketplace add frankxai/agenticincome',
  '/plugin install ai-pack@agenticincome',
]

test('the private app matcher catches repository URL variants without matching public skills', () => {
  for (const [label, value] of privateRepositoryVariants) {
    assert.match(value, privateRepositoryLink, `private ${label} variant must be blocked`)
  }

  for (const value of publicRepositoryVariants) {
    assert.doesNotMatch(value, privateRepositoryLink, `public repository must remain allowed: ${value}`)
  }
})

test('production surfaces never route users to the private app repository or its plugin commands', () => {
  const files = productionRoots.flatMap((path) => walk(path))

  for (const file of files) {
    const content = read(file)
    assert.doesNotMatch(content, privateRepositoryLink, `${relative('.', file)} links the private app repository`)
    for (const command of privatePluginCommands) {
      assert.ok(!content.includes(command), `${relative('.', file)} publishes private plugin command: ${command}`)
    }
  }
})

test('core getting-started docs use only the public install path', () => {
  for (const file of coreGettingStarted) {
    const content = read(file)
    assert.match(content, new RegExp(publicRepository.replaceAll('/', '\\/')), `${file} must name the public repository`)
    assert.doesNotMatch(content, privateRepositoryLink, `${file} links the private app repository`)
    for (const command of privatePluginCommands) {
      assert.ok(!content.includes(command), `${file} publishes private plugin command: ${command}`)
    }
  }
})

test('the shared install surface publishes executable package scripts from the public repository', () => {
  const terminal = read('components/PackTerminal.tsx')
  const packPage = read('app/pack/page.tsx')

  assert.match(terminal, /git clone https:\/\/github\.com\/frankxai\/agentic-income-skills\.git/)
  assert.match(
    terminal,
    /'npm run income:validate -- \.\.\/my-income-system\/income-system\.json',/,
    'the copyable validation command must target the scaffolded system',
  )
  assert.doesNotMatch(
    terminal,
    /'npm run income:validate -- examples\/request-to-quote-desk\/income-system\.json',/,
    'the copyable validation command must not target the bundled example',
  )
  for (const command of ['npm run income:init', 'npm run income:validate', 'npm test']) {
    assert.ok(terminal.includes(command), `PackTerminal must publish ${command}`)
  }
  assert.match(packPage, /no Claude marketplace installation is\s+advertised or required/i)
})

test('README never presents private supporting repositories as public evidence', () => {
  const readme = read('README.md')

  for (const repository of privateSupportingRepositories) {
    assert.ok(!readme.includes(repository), `README links private repository: ${repository}`)
  }
  assert.doesNotMatch(readme, /inspectable\s+go\.agenticincome\.ai/i)
})
