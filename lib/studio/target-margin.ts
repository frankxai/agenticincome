import { z } from 'zod'
import { assumptions, type Message } from './assumptions.ts'

const resultSchema = z.object({minimumPrice:z.number(),contribution:z.number(),basis:z.string()})
type Run = (name:'minimum_offer_price',args:Record<string,unknown>)=>Promise<unknown>

export async function targetMarginAnswer(messages:Message[],run:Run) {
  const latest = messages.at(-1)?.content ?? ''
  const previous = messages.at(-2)
  const resuming = previous?.role === 'assistant' && previous.content.startsWith('What is your total variable delivery cost per sale') && !/%|percent\b/i.test(latest)
  const question = resuming ? (messages.slice(0,-2).filter(m=>m.role === 'user').at(-1)?.content || latest) : latest
  const targets = [...question.matchAll(/(-?\d+(?:[.,]\d+)?)\s*(?:%|percent\b)/gi)]
  if (!targets.length || (!/margin|keep|retain|get back to/i.test(question) && !/\btarget\b/i.test(question)) || !/\b(?:target|aim|keep|want|wanting|need|charge|minimum price|price floor|to (?:make|earn|retain|reach|hit|maintain|preserve|achieve))\b/i.test(question)) return undefined
  if (/\b(?:markup|vat|tax rate|discount)\b/i.test(question) || targets.length !== 1) {
    return {answer:'A markup, tax rate or discount is different from a contribution margin. Which single contribution margin should the price cover?', links:[]}
  }
  const target = Number(targets[0][1].replace(',','.'))
  if (target < 0 || target >= 100 || Math.round(target * 100) / 100 !== target) return {answer:'Choose one target contribution margin from 0% through 99.99%.',links:[]}
  const data = assumptions(messages.map(m=>m.role==='user' && m.content===question ? {...m,content:m.content.replace(targets[0][0], 'the target')} : m))
  if (data.ambiguous || data.cost === undefined || !data.currency) return {answer:'What is your total variable delivery cost per sale, and in which currency? Include all per-sale fees at the proposed price. I’ll use it to calculate the minimum price for your target margin.',links:[]}
  const {currency,cost} = data
  const result = resultSchema.parse(await run('minimum_offer_price',{currency,unitCost:cost,targetMarginPercent:target}))
  const money = new Intl.NumberFormat('en-IE',{style:'currency',currency,minimumFractionDigits:0,maximumFractionDigits:2})
  const price = money.format(result.minimumPrice), expense = money.format(cost), keep = money.format(result.contribution)
  const answer = 'Charge at least '+price+' per sale to keep a '+target+'% contribution margin at '+expense+' in variable cost. That leaves '+keep+' before fixed costs and tax.\n\nPrice floor = '+expense+' ÷ (1 − '+target+'%), rounded up to the next cent when needed.\n\nThat is your financial floor. Test whether a buyer will pay it. Recalculate any price-dependent processing fees at the new price.'
  return {answer,links:[{label:'Read the pricing research',href:'/blog/pricing-ai-work'}],artifact:{filename:'target-margin.md',markdown:'# Minimum offer price\n\n'+answer+'\n\nBasis: '+result.basis+'\n'}}
}
