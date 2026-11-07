import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { withSource } from '../lib/link-source.ts'

test('router links get the source tag', () => {
  assert.equal(withSource('https://go.agenticincome.ai/systeme', 'page'), 'https://go.agenticincome.ai/systeme?src=page')
  assert.equal(withSource('https://go.agenticincome.ai/systeme', 'mcp'), 'https://go.agenticincome.ai/systeme?src=mcp')
})

test('an existing query is kept and src is never duplicated', () => {
  assert.equal(withSource('https://go.agenticincome.ai/x?utm_source=a', 'page'), 'https://go.agenticincome.ai/x?utm_source=a&src=page')
  assert.equal(withSource('https://go.agenticincome.ai/x?src=page', 'mcp'), 'https://go.agenticincome.ai/x?src=mcp')
})

test('other hosts and non-URLs come back unchanged', () => {
  for (const link of ['https://partner.example.com/ref/123', 'https://evil.go.agenticincome.ai.example.com/x', 'not a url', '/tools']) {
    assert.equal(withSource(link, 'page'), link)
  }
})

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')

test('the MCP server tags partner links as mcp', () => {
  assert.match(read('app/api/mcp/[transport]/route.ts'), /ourLink: withSource\(p\.ourLink, 'mcp'\)/)
})

test('site pages default to page: getLink tags, and the raw catalog link on /tools is wrapped', () => {
  assert.match(read('lib/affiliate.ts'), /export function getLink\(tool: string, src: LinkSource = 'page'\)/)
  assert.match(read('app/tools/page.tsx'), /href=\{withSource\(program\.ourLink, 'page'\)\}/)
})
