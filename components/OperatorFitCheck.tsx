'use client'

import { useState } from 'react'
import Link from 'next/link'
import { fitCheck } from '@/lib/fit-check'
import { trackClientEvent } from '@/lib/client-analytics'
import { EmailCapture } from '@/components/EmailCapture'

type StepOption = {
  id: string
  keycap: string
  label: string
  detail: string
}

const STEPS: {
  id: 'hours' | 'audience' | 'stack' | 'budget'
  question: string
  helper: string
  options: StepOption[]
}[] = [
  {
    id: 'hours',
    question: 'How many focused hours per week can you put into building?',
    helper: 'Used by the deterministic fit-check selector to filter unrealistic maintenance loads.',
    options: [
      { id: '4', keycap: '1', label: 'Under 8 hours / week', detail: 'Evenings or one weekend block alongside a full-time role.' },
      { id: '10', keycap: '2', label: '8 to 14 hours / week', detail: 'Two to three dedicated build sessions every week.' },
      { id: '20', keycap: '3', label: '15+ hours / week', detail: 'Primary operator focus with room for client or product sprints.' },
    ],
  },
  {
    id: 'audience',
    question: 'Do people already read your technical notes, repos, or comparisons?',
    helper: 'Self-serve products convert fastest when distribution already exists.',
    options: [
      { id: 'no', keycap: '1', label: 'Starting from zero audience', detail: 'Need search-intent pages or direct scoped outreach first.' },
      { id: 'yes', keycap: '2', label: 'Yes, an existing list, channel, or active repo', detail: 'Readers already ask how my workflow or stack is configured.' },
    ],
  },
  {
    id: 'stack',
    question: 'How do you build and verify artifacts today?',
    helper: 'Determines whether to match you with CLI skill packs, Markdown kits, or audio tools.',
    options: [
      { id: 'code', keycap: '1', label: 'Terminal coding harness (Claude Code, Codex, OpenCode, Cursor)', detail: 'Comfortable running git branches, Node scripts, and Markdown skills.' },
      { id: 'nocode', keycap: '2', label: 'Web chat + Markdown notes (Claude.ai, ChatGPT, Obsidian)', detail: 'Prefer plain-text playbooks, checklists, and prompt templates.' },
      { id: 'audio', keycap: '3', label: 'Creator media & AI music workflows (Suno, stems, video)', detail: 'Building sonic catalogs, focus tracks, or creator toolkits.' },
    ],
  },
  {
    id: 'budget',
    question: 'What starting depth fits your current stage?',
    helper: 'Nothing here opens live billing automatically; paid packs show inspectable files first.',
    options: [
      { id: '0', keycap: '1', label: 'Free Starter Kit ($0)', detail: 'Give me the 30-minute first-loop checklist on-site right now.' },
      { id: '39', keycap: '2', label: 'Focused single pack ($24 to $39)', detail: 'One targeted skill pack (Claims Guard or Vibe OS).' },
      { id: '67', keycap: '3', label: 'Complete operating desk ($67 to $99)', detail: 'Full 3-model Blueprint or 4-pack Business OS bundle.' },
    ],
  },
]

type Recommendation = {
  modelLabel: string
  why: string
  weekOneArtifact: string
  matchedOfferSlug: string
  matchedOfferTitle: string
  matchedOfferPrice: string
  matchedReason: string
  checklist: string[]
}

function computeRecommendation(answers: Record<string, string>): Recommendation {
  const hoursPerWeek = Number(answers.hours ?? '8')
  const hasAudience = answers.audience === 'yes'
  const canCode = answers.stack === 'code'
  const isAudio = answers.stack === 'audio'
  const upfrontBudgetUsd = Number(answers.budget ?? '0')

  const base = fitCheck({ hoursPerWeek, upfrontBudgetUsd, hasAudience, canCode })

  const modelLabels = {
    services: 'Model 1 · Scoped Services',
    products: 'Model 2 · Packaged Digital Products',
    systems: 'Model 3 · Operated Comparison Systems',
  } as const

  let matchedOfferSlug = 'starter-kit'
  let matchedOfferTitle = 'Income Flywheel Starter Kit'
  let matchedOfferPrice = 'Free ($0)'
  let matchedReason = 'Best zero-cost starting loop before committing to any paid template.'

  if (isAudio && upfrontBudgetUsd > 0) {
    matchedOfferSlug = 'vibe-os-pack'
    matchedOfferTitle = 'Vibe OS Pack'
    matchedOfferPrice = '$24'
    matchedReason = 'Matches your audio/media workflow with 3 Suno skills and 4 Python utilities.'
  } else if (upfrontBudgetUsd === 39) {
    matchedOfferSlug = 'claims-guard-pack'
    matchedOfferTitle = 'Claims Guard Pack'
    matchedOfferPrice = '$39'
    matchedReason = 'Gives your pages and offers a 5-gate claim, citation, and disclosure check before publish.'
  } else if (upfrontBudgetUsd >= 67 && canCode && hasAudience) {
    matchedOfferSlug = 'abos-pack-bundle'
    matchedOfferTitle = 'Agentic Business OS Pack Bundle'
    matchedOfferPrice = '$99'
    matchedReason = 'Combines Claims Guard, Business Intelligence, Design Contract, and Weekly Rhythm for repo-native operators.'
  } else if (upfrontBudgetUsd >= 67) {
    matchedOfferSlug = 'blueprint'
    matchedOfferTitle = 'Income Architecture Blueprint'
    matchedOfferPrice = '$67'
    matchedReason = 'Gives you the full planning template, scenario math, and kill-criterion sheet for your entry model.'
  }

  const weekOneArtifact =
    base.model === 'products'
      ? '1 inspectable digital pack outline + 30-minute comparison bridge'
      : base.model === 'services'
        ? '1 fixed-scope audit offer with written acceptance gates'
        : '1 citable tool comparison page with verified recurring-payer disclosure'

  const checklist = [
    `Lock entry lane: ${modelLabels[base.model]} (${hoursPerWeek}h/wk calendar ceiling).`,
    'Pick one tool or workflow category you have tested firsthand in the last 30 days.',
    `Ship Week-1 artifact: ${weekOneArtifact}.`,
    'Add inline FTC/EU material-connection disclosure and name at least one non-affiliate option.',
    `Set a 30-day review date and inspect ${matchedOfferTitle} (${matchedOfferPrice}) files before scaling.`,
  ]

  return {
    modelLabel: modelLabels[base.model],
    why: base.why,
    weekOneArtifact,
    matchedOfferSlug,
    matchedOfferTitle,
    matchedOfferPrice,
    matchedReason,
    checklist,
  }
}

export function OperatorFitCheck() {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [copiedPlan, setCopiedPlan] = useState(false)

  const isComplete = stepIndex >= STEPS.length
  const currentStep = STEPS[stepIndex]

  function selectOption(stepId: string, optionId: string) {
    const next = { ...answers, [stepId]: optionId }
    const nextStep = stepIndex + 1
    setAnswers(next)
    setStepIndex(nextStep)
    if (nextStep >= STEPS.length) {
      const rec = computeRecommendation(next)
      trackClientEvent('fit_check_completed', {
        offer: rec.matchedOfferSlug,
        source: 'operator-fit-check',
        state: `${next.stack ?? 'unknown'}-${next.budget ?? '0'}usd`,
      })
    }
  }

  function handleStepKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (isComplete || !currentStep) return
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const target = e.target as HTMLElement | null
    if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
    const matched = currentStep.options.find((opt) => opt.keycap === e.key)
    if (matched) {
      e.preventDefault()
      selectOption(currentStep.id, matched.id)
    }
  }

  function resetQuiz() {
    setAnswers({})
    setStepIndex(0)
    setCopiedPlan(false)
  }

  const recommendation = isComplete ? computeRecommendation(answers) : null

  async function copyChecklist() {
    if (!recommendation) return
    const md = [
      `# Week-1 Operator Plan (${recommendation.modelLabel})`,
      '',
      `Why this lane fits: ${recommendation.why}`,
      '',
      ...recommendation.checklist.map((item) => `- [ ] ${item}`),
    ].join('\n')
    try {
      await navigator.clipboard.writeText(md)
      setCopiedPlan(true)
      setTimeout(() => setCopiedPlan(false), 1800)
    } catch {
      setCopiedPlan(false)
    }
  }

  return (
    <section aria-label="60-second operator fit-check" className="rounded-2xl border border-border bg-surface/90 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="font-mono text-xs font-semibold text-accent">
            {isComplete ? 'Diagnostic complete · deterministic fit-check' : `Operator fit-check · Step 0${stepIndex + 1} / 0${STEPS.length}`}
          </div>
          <h2 className="mt-1 text-2xl font-semibold text-ink">
            {isComplete ? 'Your Week-1 build lane is ready.' : 'Match your hours and stack to the right starting kit'}
          </h2>
        </div>
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={isComplete ? resetQuiz : () => setStepIndex((s) => Math.max(0, s - 1))}
            className="min-h-[44px] rounded-full border border-border bg-bg/70 px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {isComplete ? 'Start over' : 'Previous step'}
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2" aria-hidden="true">
        {STEPS.map((s, idx) => (
          <div
            key={s.id}
            className={`h-1.5 rounded-full transition-colors duration-150 motion-reduce:transition-none ${
              idx < stepIndex || isComplete
                ? 'bg-accent'
                : idx === stepIndex
                  ? 'bg-accent/55'
                  : 'bg-border'
            }`}
          />
        ))}
      </div>

      {!isComplete && currentStep ? (
        <div className="mt-6" onKeyDown={handleStepKeyDown}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-semibold text-ink">{currentStep.question}</h3>
            <span className="font-mono text-[11px] text-muted">
              Press 1-{currentStep.options.length} or click
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">{currentStep.helper}</p>

          <div className="mt-5 grid gap-3">
            {currentStep.options.map((opt) => {
              const selected = answers[currentStep.id] === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-keyshortcuts={opt.keycap}
                  onClick={() => selectOption(currentStep.id, opt.id)}
                  className={`flex min-h-[60px] w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-colors duration-150 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    selected
                      ? 'border-accent bg-accent/10'
                      : 'border-border bg-bg/60 hover:border-accent/60 hover:bg-bg/90'
                  }`}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border bg-surface font-mono text-xs font-semibold text-accent">
                    {opt.keycap}
                  </span>
                  <div>
                    <div className="font-semibold text-ink">{opt.label}</div>
                    <div className="mt-0.5 text-xs leading-5 text-muted">{opt.detail}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {isComplete && recommendation ? (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-accent/40 bg-bg/70 p-4">
              <div className="font-mono text-[11px] font-semibold text-accent">Recommended entry model</div>
              <div className="mt-1.5 text-xl font-semibold text-ink">{recommendation.modelLabel}</div>
              <p className="mt-2 text-xs leading-5 text-muted">{recommendation.why}</p>
            </div>
            <div className="rounded-xl border border-border bg-bg/70 p-4">
              <div className="font-mono text-[11px] font-semibold text-gold">Week-1 target deliverable</div>
              <div className="mt-1.5 text-lg font-semibold text-ink">{recommendation.weekOneArtifact}</div>
              <p className="mt-2 text-xs leading-5 text-muted">
                Start with the free on-site Starter Kit first, then inspect the matched package below only if you want pre-built templates.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-bg/50 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-mono text-xs font-semibold text-ink">5-step Week-1 checklist</div>
              <button
                type="button"
                onClick={copyChecklist}
                className="min-h-[44px] rounded-full border border-border bg-surface px-4 py-2 font-mono text-xs text-ink hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {copiedPlan ? 'Markdown copied' : 'Copy Markdown plan'}
              </button>
            </div>
            <ol className="mt-3 space-y-2 text-sm text-muted">
              {recommendation.checklist.map((item, i) => (
                <li key={item} className="flex gap-2.5">
                  <span className="font-mono text-xs font-semibold text-accent">0{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-4 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
            <div>
              <div className="font-mono text-[11px] font-semibold text-accent">Matched package · {recommendation.matchedOfferPrice}</div>
              <div className="mt-1 text-lg font-semibold text-ink">{recommendation.matchedOfferTitle}</div>
              <p className="mt-1 text-sm text-muted">{recommendation.matchedReason}</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/delivery/starter-kit" className="cta-secondary text-sm">
                Open free Starter Kit
              </Link>
              <Link href={`/offers/${recommendation.matchedOfferSlug}`} className="cta text-sm">
                Inspect {recommendation.matchedOfferTitle}
              </Link>
            </div>
          </div>

          <EmailCapture
            headline="Send this Week-1 checklist to your inbox"
            sub="Optional: save your entry-lane checklist and get notified when gated packs open."
            source={`fit-check-${recommendation.matchedOfferSlug}`}
            buttonLabel="Save my plan"
            successMessage="Saved. Your first-loop plan and access request are logged."
          />
        </div>
      ) : null}
    </section>
  )
}
