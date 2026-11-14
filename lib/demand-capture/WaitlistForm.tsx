'use client'

import { useEffect, useRef, useState } from 'react'
import { PAIN_PROMPT, PRICE_BANDS, PRICE_PROMPT, URGENCY, rolesFor } from './questions'
import type { ClosedWaitlistState, WaitlistState } from './types'

/**
 * Every visible string can be re-voiced per property; the questions, the
 * schema and the two-step flow cannot. Styling comes from the `wl-*` classes,
 * which each property defines in its own stylesheet so the form belongs to the
 * page it sits on instead of looking like a widget dropped onto it.
 */
/**
 * Plain strings only, so a server component can pass them across the client
 * boundary. Placeholders: {count} {n} {benefit} {product}.
 */
export type WaitlistCopy = {
  join: string
  joining: string
  quiet: string
  waiting: string
  entered: string
  enteredNoPosition: string
  seats: string
  intro: string
  roleLabel: string
  pricePrompt: string
  urgencyLabel: string
  painPrompt: string
  painPlaceholder: string
  send: string
  saving: string
  skip: string
  done: string
  doneNoPosition: string
  doneText: string
  consent: string
  closed: string
}

export const DEFAULT_COPY: WaitlistCopy = {
  join: 'Join the list',
  joining: 'Joining...',
  quiet: 'One email when it opens. Nothing else.',
  waiting: '{count} people waiting.',
  entered: 'You are in, at number {n}.',
  enteredNoPosition: 'You are in.',
  seats: '{n} founding places left. {benefit}',
  intro: 'Three optional questions. They decide what gets built first, and what it costs.',
  roleLabel: 'You are',
  pricePrompt: PRICE_PROMPT,
  urgencyLabel: 'How soon',
  painPrompt: PAIN_PROMPT,
  painPlaceholder: 'One line is plenty.',
  send: 'Send',
  saving: 'Saving...',
  skip: 'Skip',
  done: 'Thank you. You are number {n}.',
  doneNoPosition: 'Thank you.',
  doneText: 'You will hear from us when {product} is ready, and not before.',
  closed: 'The waitlist is not open yet, so nothing can be recorded here. Check back later.',
  consent: 'Email me about {product}. Your address and your answers stay with this list. Unsubscribe in any email.',
}

/** The page's own utm_* parameters, bounded, so a signup keeps the campaign that brought it. */
function pageUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const out: Record<string, string> = {}
  for (const [k, v] of new URLSearchParams(window.location.search)) {
    if (/^utm_[a-z0-9_]{1,32}$/i.test(k) && v && Object.keys(out).length < 8) out[k] = v.slice(0, 200)
  }
  return out
}

const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''))

type Props = {
  productId: string
  productName: string
  /** What they get that a later signup does not. Stated plainly or omitted, never implied. */
  foundingBenefit?: string
  /** Pass handleState's response as is. A closed one renders a not-open message instead of the form. */
  initialState?: WaitlistState | ClosedWaitlistState
  endpoint?: string
  /** Consumer surfaces should not say "company". */
  placeholder?: string
  copy?: Partial<WaitlistCopy>
}

export function WaitlistForm({
  productId,
  productName,
  foundingBenefit,
  initialState,
  endpoint = '/api/waitlist',
  placeholder = 'you@company.com',
  copy: copyOverrides,
}: Props) {
  const copy = { ...DEFAULT_COPY, ...copyOverrides }
  const [step, setStep] = useState<'join' | 'refine' | 'done'>('join')
  const closed = initialState !== undefined && 'open' in initialState && initialState.open === false
  const openInitial = initialState && !closed ? (initialState as WaitlistState) : undefined
  const [state, setState] = useState<WaitlistState | undefined>(openInitial)
  const [email, setEmail] = useState('')
  // The address the join request actually carried. Later requests use it, not whatever the input
  // holds now, so an edit made while the join was pending cannot split the answers onto a second address.
  const [joinedEmail, setJoinedEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // Each step replaces the last, which unmounts whatever had focus. Move focus to the new step's
  // heading (tabIndex -1: focusable by script, not a tab stop) so keyboard and screen-reader users
  // land on the new content instead of the top of the document. Not on first render.
  const headingRef = useRef<HTMLParagraphElement>(null)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [step])

  async function post(payload: Record<string, unknown>) {
    setBusy(true)
    setError('')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email: joinedEmail || email, consent: joinedEmail ? true : consent, utm: pageUtm(), ...payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setState(data)
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      return false
    } finally {
      setBusy(false)
    }
  }

  // Once a response has arrived it is the truth, including a null ("unknown") from a partial join:
  // never fall back to the pre-signup snapshot, which would advertise stale places.
  const latest = state ?? openInitial
  const seats = latest?.foundingSeatsLeft ?? null
  const shownCount = latest?.publicCount ?? null

  if (closed) {
    return (
      <p className="wl-note" role="status">
        {copy.closed}
      </p>
    )
  }

  if (step === 'join') {
    return (
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault()
          const source = typeof window === 'undefined' ? '' : window.location.pathname
          const submitted = email
          if (await post({ source })) {
            setJoinedEmail(submitted)
            setStep('refine')
          }
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            readOnly={busy}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={placeholder}
            aria-label={'Email address to join the waitlist for ' + productName}
            className="wl-input flex-1"
          />
          <button type="submit" disabled={busy} className="wl-btn">
            {busy ? copy.joining : copy.join}
          </button>
        </div>

        <label className="wl-note flex items-start gap-2.5">
          <input
            type="checkbox"
            required
            checked={consent}
            disabled={busy}
            onChange={(event) => setConsent(event.target.checked)}
            className="wl-check mt-1"
          />
          <span>{fill(copy.consent, { product: productName })}</span>
        </label>

        {error ? <p className="wl-error">{error}</p> : null}

        <p className="wl-note">
          {shownCount !== null ? fill(copy.waiting, { count: shownCount.toLocaleString() }) + ' ' : ''}
          {foundingBenefit && seats !== 0 ? foundingBenefit : copy.quiet}
        </p>
      </form>
    )
  }

  if (step === 'refine') {
    return (
      <div className="space-y-6">
        <div className="wl-panel">
          <p ref={headingRef} tabIndex={-1} className="wl-panel-title">
            {state?.position ? fill(copy.entered, { n: state.position }) : copy.enteredNoPosition}
          </p>
          {foundingBenefit && seats !== null && seats > 0 ? (
            <p className="wl-panel-text">{fill(copy.seats, { n: seats, benefit: foundingBenefit })}</p>
          ) : null}
        </div>

        <div className="space-y-5">
          <p className="wl-note">{copy.intro}</p>

          <Choice
            label={copy.roleLabel}
            options={rolesFor(productId)}
            value={answers.role}
            onPick={(value) => setAnswers({ ...answers, role: value })}
          />
          <Choice
            label={copy.pricePrompt}
            options={PRICE_BANDS.map((band) => band.label)}
            values={PRICE_BANDS.map((band) => band.value)}
            value={answers.priceBand}
            onPick={(value) => setAnswers({ ...answers, priceBand: value })}
          />
          <Choice
            label={copy.urgencyLabel}
            options={URGENCY.map((item) => item.label)}
            values={URGENCY.map((item) => item.value)}
            value={answers.urgency}
            onPick={(value) => setAnswers({ ...answers, urgency: value })}
          />

          <label className="block space-y-2">
            <span className="wl-label">{copy.painPrompt}</span>
            <textarea
              rows={3}
              maxLength={400}
              value={answers.pain ?? ''}
              onChange={(event) => setAnswers({ ...answers, pain: event.target.value })}
              className="wl-input w-full"
              placeholder={copy.painPlaceholder}
            />
          </label>
        </div>

        {error ? <p className="wl-error">{error}</p> : null}

        <div className="flex items-center gap-5">
          <button
            onClick={async () => {
              if (await post(answers)) setStep('done')
            }}
            disabled={busy}
            className="wl-btn wl-btn-quiet"
          >
            {busy ? copy.saving : copy.send}
          </button>
          <button onClick={() => setStep('done')} className="wl-link">
            {copy.skip}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="wl-panel">
      <p ref={headingRef} tabIndex={-1} className="wl-panel-title">
        {state?.position ? fill(copy.done, { n: state.position }) : copy.doneNoPosition}
      </p>
      <p className="wl-panel-text">{fill(copy.doneText, { product: productName })}</p>
    </div>
  )
}

function Choice({
  label,
  options,
  values,
  value,
  onPick,
}: {
  label: string
  options: string[]
  values?: string[]
  value?: string
  onPick: (value: string) => void
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="wl-label">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const optionValue = values?.[index] ?? option
          const active = value === optionValue
          return (
            <button
              key={optionValue}
              type="button"
              onClick={() => onPick(optionValue)}
              aria-pressed={active}
              className={'wl-chip' + (active ? ' wl-chip-active' : '')}
            >
              {option}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
