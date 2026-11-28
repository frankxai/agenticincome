import assert from 'node:assert/strict'
import test from 'node:test'
import { rpc } from './support/mcp-rpc.mjs'
import { gatherVault, isVaultQuestion } from '../lib/studio/economy.ts'

async function lookup(q) {
  assert.ok(isVaultQuestion(q))
  const calls = []
  const evidence = await gatherVault(q, async (name, args) => {
    calls.push(name)
    assert.equal(args.confirmedOnly, true)
    const result = await rpc('tools/call', { name, arguments: args }, calls.length)
    return JSON.parse(result.result.content[0].text)
  })
  return {...evidence, calls}
}

test('speech-to-text never substitutes prices for speech synthesis', async () => {
  const query = 'What does it cost to transcribe an hour of audio?'
  const result = await lookup(query)
  assert.deepEqual(result.calls,['list_supply_costs'])
  // Coverage can grow between Vault snapshots. Exercise the empty case independently.
  const absent = await gatherVault(query, async () => ({rows:[]}))
  assert.match(absent.answer,/no confirmed speech transcription rate/i)
  assert.doesNotMatch(absent.answer,/\$[\d.]+/)
  assert.doesNotMatch(result.answer,/Flash\/Turbo|characters|synthesis\*\*/)
})

test('a quoted video estimate uses the vendor, actual unit, quantity, source and capture date', async () => {
  const result = await lookup('What does it cost to generate 10 seconds of video with Runway?')
  const quote = result.answer.match(/10 seconds of generated video × \$([\d.]+) = \$([\d.]+)/)
  assert.ok(quote)
  assert.equal(Number(quote[2]).toFixed(4), (10 * Number(quote[1])).toFixed(4))
  assert.match(result.answer,/Source captured \d{4}-\d{2}-\d{2}/)
  assert.ok(result.links.some(link => new URL(link.href, 'https://example.test').hostname.includes('runway')))
  assert.match(result.artifact.markdown,/https:\/\//)
  assert.doesNotMatch(result.answer,/fal\.ai/)
  const followup = await lookup('What does it cost to generate 10 seconds of video with Runway?\nWhat about 30 seconds?')
  const next = followup.answer.match(/30 seconds of generated video × \$([\d.]+) = \$([\d.]+)/)
  assert.ok(next)
  assert.equal(next[1], quote[1])
  assert.equal(Number(next[2]).toFixed(4), (30 * Number(next[1])).toFixed(4))
  const range = await lookup('What does 5 to 10 seconds of Runway video cost?')
  assert.doesNotMatch(range.answer,/At list price:/)
})

test('merchant fees are quoted with plan scope, without treating a recorded rate as checkout availability', async () => {
  const result = await lookup('Compare Stripe, Whop and Polar card processing fees.')
  for (const phrase of ['Stripe','Whop','Polar','domestic','Starter tier']) assert.ok(result.answer.includes(phrase))
  assert.equal(result.links.filter(l=>l.href.startsWith('https://')).length, 3)
})

test('market evidence keeps seller payouts and platform volume distinct', async () => {
  const payouts = await lookup('How much does Spotify report in royalty payouts?')
  assert.deepEqual(payouts.calls,['search_digital_economies'])
  assert.match(payouts.answer,/royalty payouts to the music industry/)
  assert.ok(payouts.links.some(link => link.href.startsWith('https://')))
  const volume = await lookup('What is the GMV on Spotify?')
  assert.match(volume.answer,/No confirmed record matches that metric/)
  assert.doesNotMatch(volume.answer,/billion/)
})

test('offer assumptions, product sales and affiliate questions keep their separate workflows', () => {
  for (const q of ['What do I keep on a €1,500 service that costs €900 to deliver?', 'I make music. Help me shape a digital product.', 'What is the affiliate commission for audio creators?', 'Which agent skills can I use?']) assert.equal(isVaultQuestion(q),false,q)
})
