import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseChallengeLedger } from '../lib/challenge-ledger.ts'

const ledger = parseChallengeLedger(JSON.parse(readFileSync(resolve('data/commerce-challenge.json'), 'utf8')))
const brief = readFileSync(resolve('public/downloads/ai-shop-challenge/brief.md'), 'utf8')

for (const participant of ledger.submissions) {
  const prompt = `# ${participant.family}: AI Shop Challenge\n\nYou are the ${participant.family} participant. Record the exact model identifier and actual tool setup before you start. Follow the shared protocol below without changing the task, resources or rubric. Use only capabilities that your tools expose; state missing capabilities as blockers. Deliver the artifacts, checks and receipt within the same 60-minute implementation budget. Do not claim a win or score your own work.\n\n${brief}`
  writeFileSync(resolve(`public${participant.promptPath}`), prompt)
}
console.log(`Exported ${ledger.submissions.length} equal-protocol model prompts.`)
