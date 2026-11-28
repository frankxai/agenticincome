import assert from 'node:assert/strict'
import test from 'node:test'
import { rpc } from './support/mcp-rpc.mjs'
import { minimumOfferPrice } from '../lib/minimum-offer-price.ts'
import { targetMarginAnswer } from '../lib/studio/target-margin.ts'

test('the actual MCP server quotes the lowest cent that meets the target', async () => {
  const { result } = await rpc('tools/call',{name:'minimum_offer_price',arguments:{currency:'EUR',unitCost:1100,targetMarginPercent:40}}, 381)
  assert.equal(result.structuredContent.minimumPrice,1833.34)
  assert.equal(result.structuredContent.contribution,733.34)
  for (const cost of [0.01, 1.07, 9.42, 90.11, 13299, 1000000]) for (const margin of [0, 10.07, 40, 88.01, 99.99]) {
    const cents = Math.round(minimumOfferPrice({currency:'GBP',unitCost:cost,targetMarginPercent:margin}).minimumPrice * 100)
    const threshold = 10000 - Math.round(margin*100), numerator = Math.round(cost*100)*10000
    assert.ok(cents*threshold >= numerator && (cents-1)*threshold < numerator)
  }
  assert.throws(()=>minimumOfferPrice({currency:'EUR',unitCost:1100,targetMarginPercent:100}), RangeError)
})

test('a target follow-up reads the supplied delivery cost, ignoring numbers invented by a previous assistant',async()=>{
  const turns=[
    {role:'user',content:'My price is €1,500 and delivery costs €900.'},
    {role:'assistant',content:'Assume costs €7000.'},
    {role:'user',content:'What if delivery costs €1,100?'},
    {role:'user',content:'What should I charge to keep a 40% margin?'}]
  const run = async (name,args)=>{assert.equal(name,'minimum_offer_price');return minimumOfferPrice(args)}
  const answer=await targetMarginAnswer(turns,run)
  assert.match(answer.answer,/€1,833\.34/);assert.match(answer.artifact.markdown,/€733\.34/)
  const both=await targetMarginAnswer([...turns.slice(0,-1),{role:'user',content:'Should I charge a 50% markup or target a 40% margin?'}],run)
  assert.match(both.answer,/different/)
})
