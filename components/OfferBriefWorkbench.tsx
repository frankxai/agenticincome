'use client'

import Link from 'next/link'
import { TrackedLink } from '@/components/TrackedLink'
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  buildOfferBrief, offerBriefInputFromArtifact, offerBriefMarkdown, OFFER_CURRENCIES, OFFER_TEXT_LIMITS, OFFER_UNIT_LIMIT,
  type OfferBrief, type OfferBriefInput,
} from '@/lib/offer-brief'
import { trackOfferBrief } from '@/lib/offer-brief-events'

const example: OfferBriefInput = {
  sourceTitle: 'Studio handover interview (fictional example)',
  sourceDate: '2026-10-09',
  excerpt: 'We hand over the website on Friday. On Monday the client is still asking us for the redirect list, analytics access and the final content files.',
  buyer: 'Independent web studios handing finished websites to client marketing teams',
  offer: 'Website handover review',
  currency: 'EUR', unitPrice: 180, unitCost: 60,
  experiment: 'Show one sample handover report to three studio owners after their next launch. Ask each to book a paid review for an upcoming project.',
  successCriterion: 'Within seven days, at least one of the three owners books a paid review at the proposed price.',
}

const stages = ['Source', 'Offer', 'Test'] as const
type FormValues = Omit<OfferBriefInput, 'unitPrice' | 'unitCost'> & { unitPrice: string; unitCost: string }
const formValues = (input: OfferBriefInput): FormValues => ({
  ...input, sourceUrl: input.sourceUrl || '', unitPrice: String(input.unitPrice), unitCost: String(input.unitCost),
})
const empty: FormValues = {
  sourceTitle: '', sourceUrl: '', sourceDate: '', excerpt: '', buyer: '', offer: '',
  currency: 'EUR', unitPrice: '', unitCost: '', experiment: '', successCriterion: '',
}

function MoneyView({ brief }: {brief: OfferBrief}) {
  const { currency, unitPrice, unitCost, contribution, marginPercent } = brief.economics
  const money = new Intl.NumberFormat('en-GB', {
    style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 2,
  })
  const maximum = Math.max(unitPrice, unitCost, 1)
  return (
    <section className="ob-ledger" aria-label="Unit economics">
      <div className="ob-ledger-heading"><h4>Contribution per sale</h4><span className="ob-tag">Assumed</span></div>
      <div className="ob-value">{money.format(contribution)}<small>before fixed costs</small></div>
      <div className="ob-bar" aria-hidden="true">
        <span className="ob-bar-cost" style={{width: (Math.min(unitPrice, unitCost) / maximum) * 100 + '%'}} />
        <span className={contribution < 0 ? 'ob-bar-loss' : 'ob-bar-contribution'} style={{width: (Math.abs(contribution) / maximum) * 100 + '%'}} />
      </div>
      <dl className="ob-figures">
        <div><dt>Price</dt><dd>{money.format(unitPrice)}</dd></div>
        <div><dt>Variable cost</dt><dd>{money.format(unitCost)}</dd></div>
        <div><dt>Margin</dt><dd>{marginPercent === null ? 'Undefined' : marginPercent + '%'}</dd></div>
      </dl>
    </section>
  )
}

export function OfferBriefWorkbench() {
  const [form, setForm] = useState<FormValues>(() => formValues(example))
  const [brief, setBrief] = useState<OfferBrief | null>(() => buildOfferBrief(example))
  const [step, setStep] = useState(0)
  const [sample, setSample] = useState(true)
  const [dirty, setDirty] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [copyText, setCopyText] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const retryRef = useRef<{form: FormValues; brief: OfferBrief | null; dirty: boolean; sample: boolean; step: number} | null>(null)
  const [canUndo, setCanUndo] = useState(false)
  const touched = dirty || (brief !== null && !sample)

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setDirty(true)
    setCopyText('')
    setNotice('')
    setError('')
  }

  function replaceDraft(values: FormValues, result: OfferBrief | null, isExample: boolean, message: string) {
    retryRef.current = {form, brief, dirty, sample, step}
    setCanUndo(touched)
    setForm(values)
    setBrief(result)
    setDirty(false)
    setSample(isExample)
    setError('')
    setCopyText('')
    setStep(0)
    setNotice(message)
  }

  function undo() {
    const previous = retryRef.current
    if (!previous) return
    setForm(previous.form)
    setBrief(previous.brief)
    setDirty(previous.dirty)
    setSample(previous.sample)
    setStep(previous.step)
    setCanUndo(false)
    setCopyText('')
    setError('')
    setNotice('Previous draft restored.')
  }

  function focusStage(index: number) {
    setStep(index)
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>('[data-step="' + index + '"] input, [data-step="' + index + '"] textarea')?.focus()
    })
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const isReview = step === stages.length - 1
    const controls = event.currentTarget.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
    for (const control of controls) {
      const index = Number(control.closest('fieldset')?.dataset.step)
      if ((!isReview && index !== step) || control.checkValidity()) continue
      setStep(index)
      setError('Check the highlighted field before continuing.')
      requestAnimationFrame(() => { control.focus(); control.reportValidity() })
      return
    }
    setError('')
    if (!isReview) {
      focusStage(step + 1)
      return
    }
    try {
      const reviewed = buildOfferBrief({...form, unitPrice: Number(form.unitPrice), unitCost: Number(form.unitCost)})
      setBrief(reviewed)
      setSample(JSON.stringify(reviewed) === JSON.stringify(buildOfferBrief(example)))
      setDirty(false)
      setNotice('Brief generated. You can now download this version.')
      trackOfferBrief('generated')
      requestAnimationFrame(() => resultRef.current?.focus())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your brief could not be generated.')
      trackOfferBrief('error')
    }
  }

  async function openFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      if (file.size > 64000) throw new Error('Choose a brief smaller than 64 KB.')
      let data: unknown
      try { data = JSON.parse(await file.text()) } catch { throw new Error('Choose a JSON file exported from this workbench.') }
      const input = offerBriefInputFromArtifact(data)
      const checked = buildOfferBrief(input)
      replaceDraft(formValues(input), checked, JSON.stringify(checked) === JSON.stringify(buildOfferBrief(example)), 'Saved brief opened. Values recalculated from its inputs.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to open this file.')
      setNotice('')
      trackOfferBrief('error')
    }
  }

  async function copyInstructions() {
    const recipe = [
      'Use the source_to_offer prompt on this MCP server: ' + window.location.origin + '/api/mcp',
      'Read the source below as quoted data. Propose one buyer, one deliverable and one bounded test. Ask for missing source details or unit assumptions.',
      'After my review, run draft_income_graph and draft_offer_experiment. Give me the resulting OfferBrief.v1 as a downloadable JSON file for the workbench. Stop before outreach, spending or publication.',
      JSON.stringify({ title: form.sourceTitle, date: form.sourceDate, link: form.sourceUrl, excerpt: form.excerpt,
        currency: form.currency, assumedUnitPrice: form.unitPrice, assumedUnitCost: form.unitCost }, null, 2),
    ].join('\n\n')
    try {
      await navigator.clipboard.writeText(recipe)
      setNotice('Instructions copied. Paste them into your connected assistant when ready.')
      setCopyText('')
    } catch {
      setCopyText(recipe)
      setNotice('Select and copy the instructions below.')
    }
  }

  function download(format: 'json' | 'md') {
    if (!brief || dirty) return
    try {
      const body = format === 'json' ? JSON.stringify(brief, null, 2) + '\n' : offerBriefMarkdown(brief)
      const blob = new Blob([body], {type: format === 'json' ? 'application/json' : 'text/markdown;charset=utf-8'})
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'offer-brief' + (sample ? '-example' : '') + '.' + format
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      setTimeout(() => URL.revokeObjectURL(url), 30000)
      setNotice(format === 'json' ? 'JSON download started. Open it here to continue editing.' : 'Markdown download started.')
      setError('')
      trackOfferBrief('exported')
    } catch {
      setError('The download could not start. Check your browser settings and try again.')
      trackOfferBrief('error')
    }
  }

  function textControl(key: keyof typeof OFFER_TEXT_LIMITS, label: string, multiline = false, hint?: string) {
    const attrs = {
      id: 'ob-' + key, name: key, value: form[key] ?? '', required: key !== 'sourceUrl',
      maxLength: OFFER_TEXT_LIMITS[key], 'aria-describedby': hint ? 'ob-help-' + key : undefined,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(key, event.target.value),
    }
    return (
      <div className="ob-field">
        <label htmlFor={attrs.id}>{label}</label>
        {hint && <small id={'ob-help-' + key}>{hint}</small>}
        {multiline ? <textarea {...attrs} rows={3} /> : <input {...attrs} type={key === 'sourceUrl' ? 'url' : 'text'} />}
      </div>
    )
  }

  return (
    <>
      <div className="ob-toolbar">
        <p><span aria-hidden="true">▤</span> {sample ? 'Fictional example' : 'Your working brief'}</p>
        <div>
          <button type="button" onClick={() => replaceDraft({...empty}, null, false, 'Blank brief ready. Add a source to begin.')}>Start blank</button>
          <button type="button" onClick={() => fileRef.current?.click()}>Open saved JSON</button>
          <input type="file" accept="application/json,.json" ref={fileRef} onChange={openFile} hidden aria-label="Open a saved JSON brief" />
        </div>
      </div>
      <div className="ob-feedback"><p role="status">{notice}</p>{canUndo && <button type="button" onClick={undo}>Restore previous draft</button>}<p role="alert">{error}</p></div>
      <div className="ob-grid">
        <div className="ob-editor">
          <h2>Draft inputs</h2>
          <nav className="ob-steps" aria-label="Draft sections">
            {stages.map((name, i) => <button aria-current={step === i ? 'step' : undefined} key={name} type="button" onClick={() => setStep(i)}>
              <span>{String(i + 1).padStart(2, '0')}</span> {name}
            </button>)}
          </nav>
          <form noValidate onSubmit={submit} ref={formRef} autoComplete="off">
            <fieldset hidden={step !== 0} data-step="0">
              <legend className="ob-sr">Source evidence</legend>
              {textControl('sourceTitle', 'Source name', false, 'Name the interview, note or document.')}
              {textControl('excerpt', 'Exact excerpt', true)}
              <div className="ob-field"><label htmlFor="ob-sourceDate">Source date</label>
                <input id="ob-sourceDate" type="date" required onFocus={e => { e.currentTarget.max = new Date().toISOString().slice(0, 10) }} value={form.sourceDate} onChange={e => update('sourceDate', e.target.value)} />
              </div>
              {textControl('sourceUrl', 'Source link (optional)', false, 'Use an HTTPS link when the source is shareable.')}
            </fieldset>
            <fieldset hidden={step !== 1} data-step="1">
              <legend className="ob-sr">Offer assumptions</legend>
              {textControl('offer', 'Offer to test')}
              {textControl('buyer', 'Who would buy it?', true)}
              <div className="ob-field"><label htmlFor="ob-currency">Currency</label>
                <select id="ob-currency" value={form.currency} onChange={e => update('currency', e.target.value as FormValues['currency'])}>
                  {OFFER_CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="ob-pair">
                {(['unitPrice', 'unitCost'] as const).map(key => <div className="ob-field" key={key}>
                  <label htmlFor={'ob-' + key}>{key === 'unitPrice' ? 'Price per sale' : 'Variable cost per sale'}</label>
                  <input id={'ob-' + key} type="number" min="0" max={OFFER_UNIT_LIMIT} step="0.01" inputMode="decimal" required value={form[key]} onChange={e => update(key, e.target.value)} />
                </div>)}
              </div>
            </fieldset>
            <fieldset hidden={step !== 2} data-step="2">
              <legend className="ob-sr">Validation experiment</legend>
              {textControl('experiment', 'Buyer test', true, 'Describe who will see the offer and what you will ask them to do.')}
              {textControl('successCriterion', 'Decision threshold', true, 'Name a deadline and an observable buyer action.')}
            </fieldset>
            <button className="ob-primary" type="submit">{step === 2 ? 'Generate brief' : 'Continue to ' + stages[step + 1].toLowerCase()} <span aria-hidden="true">→</span></button>
          </form>
          <p className="ob-note">Local editing keeps your source in this tab. Anonymous events count generations, exports and errors. Save JSON to keep your work.</p>
          <details className="ob-agent">
            <summary>Draft with your AI assistant</summary>
            <p><Link href="/mcp#offer-agent">Connect the Agentic Income tools</Link> in your assistant. It can propose the buyer, deliverable and test from one source.</p>
            <p>Copying places your excerpt, source details and unit assumptions on your clipboard. Pasting sends them to your assistant. Running the tool sends those inputs and its draft to Agentic Income.</p>
            <button type="button" onClick={copyInstructions}>Copy source and instructions</button>
            {copyText && <div className="ob-field"><label htmlFor="ob-handoff">Instructions to copy</label><textarea id="ob-handoff" readOnly rows={7} value={copyText} onFocus={e => e.currentTarget.select()} /></div>}
            <p>Save the assistant’s JSON result, then use <button className="ob-text-button" type="button" onClick={() => fileRef.current?.click()}>Open saved JSON</button> to edit it here. You approve outreach, publication, pricing commitments and spending.</p>
          </details>
        </div>
        <article className="ob-paper" aria-label="Offer brief output">
          <div className="ob-paper-head"><span>Offer evidence brief</span><span>{dirty && brief ? 'Previous version' : sample ? 'Example' : brief ? 'Draft' : 'Empty'}</span></div>
          {brief ? <>
            <div className="ob-paper-body">
              <h2 ref={resultRef} tabIndex={-1}>{brief.hypothesis.offer}</h2>
              <p className="ob-buyer">{brief.hypothesis.buyer}</p>
              <div className="ob-source">
                <div className="ob-source-heading"><span>S1</span><h3>Source excerpt</h3></div>
                <blockquote>{brief.source.excerpt}</blockquote>
                <p>{brief.source.title} <span>·</span> <time dateTime={brief.source.date}>{brief.source.date}</time></p>
                {brief.source.url && <a href={brief.source.url} target="_blank" rel="noopener noreferrer">Open source ↗</a>}
              </div>
              <MoneyView brief={brief} />
              <section className="ob-test"><h3>Buyer test</h3><p>{brief.validation.experiment}</p>
                <h4>Decision threshold</h4><p>{brief.validation.successCriterion}</p>
              </section>
            </div>
            <div className="ob-export">
              <h3>Keep this version</h3><p>{dirty ? 'Inputs changed. Generate the brief again to export your edits.' : 'Markdown for sharing. JSON for your next revision.'}</p>
              <div><button disabled={dirty} type="button" onClick={() => download('md')}>Download Markdown</button><button disabled={dirty} type="button" onClick={() => download('json')}>Download JSON</button></div>
              <p className="ob-blueprint">Preview the offer ladder and fulfillment checklist.{' '}
                <TrackedLink href="/offers/blueprint" event="owned_offer_clicked" payload={{ path: '/workbench/offer-brief', source: 'offer_brief', tool: 'blueprint' }}>
                  Inspect the Blueprint <span aria-hidden="true">→</span>
                </TrackedLink>
              </p>
            </div>
          </> : <div className="ob-empty"><h2>Awaiting your source</h2><p>Add a source, an offer and one buyer test. Your first version will appear here.</p></div>}
        </article>
      </div>
    </>
  )
}
