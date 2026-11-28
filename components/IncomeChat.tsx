'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import './IncomeChat.css'

type StudioReply = {
  mode: 'ai' | 'tools'
  answer: string
  tools: { name: string; label: string }[]
  links: { label: string; href: string }[]
  artifact?: { filename: string; markdown: string }
  notice?: string
}

type Exchange = { question: string; reply: StudioReply }

const prompts = [
  { key: 'idea', label: 'Shape a digital product', question: 'I make music. Help me shape a digital product.' },
  { key: 'pricing', label: 'Price a service', question: 'What do I keep on a €1,500 service that costs €900 to deliver?' },
  { key: 'partners', label: 'Research partners', question: 'Which partner programs should I research for a creator business?' },
  { key: 'mcp', label: 'Connect an agent', question: 'How do I connect the MCP to my agent?' },
]

function PresetFromLink({ select }: { select: (question: string) => void }) {
  const values = useSearchParams().getAll('ask')
  const preset = values.length === 1 ? prompts.find(item => item.key === values[0]) : undefined
  useEffect(() => {
    if (preset) select(preset.question)
  }, [preset, select])
  return null
}

function safeSource(href: string) {
  if (typeof href !== 'string') return false
  try {
    const url = new URL(href, 'https://www.agenticincome.ai')
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}

function saveMarkdown(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename.replace(/[^a-zA-Z0-9_.-]/g, '-').slice(0, 120) || 'agentic-income.md'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function transcriptText(exchanges: Exchange[]) {
  const parts = ['# Agentic Income conversation']
  for (const { question, reply } of exchanges) {
    parts.push('## You', question, reply.mode === 'ai' ? '## AI assistant' : '## MCP tools', reply.answer)
    if (reply.notice) parts.push(reply.notice)
    if (reply.tools.length) parts.push('Tools used: ' + reply.tools.map(tool => tool.name).join(', '))
    for (const source of reply.links.filter(source => safeSource(source.href))) {
      parts.push(source.label + ' · ' + new URL(source.href, window.location.origin).href)
    }
  }
  return parts.join('\n\n') + '\n'
}

function SendMark() {
  return <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 16V4m-5 5 5-5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function DownloadMark() {
  return <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2.5v10m-4-4 4 4 4-4M3 13.5v3h14v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function AnswerText({ text }: { text: string }) {
  // Keep model output as text. Only conventional headings and emphasis gain presentation.
  return <div className="ic-answer">{text.split(/\n\s*\n/).map((paragraph, index) => {
    const lines = paragraph.split('\n').map(line => line.replace(/^#{1,6}\s+/, '').replace(/^[-*]\s+/, '• '))
    return <p key={index}>{lines.join('\n').split(/(\*\*[^*]+\*\*)/g).map((part, n) => part.startsWith('**') && part.endsWith('**') ? <strong key={n}>{part.slice(2, -2)}</strong> : part)}</p>
  })}</div>
}

function Result({ reply }: { reply: StudioReply }) {
  const sources = reply.links.filter(source => safeSource(source.href))
  return <div className="ic-assistant">
    <div className="ic-speaker">{reply.mode === 'tools' ? 'MCP tools' : 'AI assistant'}</div>
    <AnswerText text={reply.answer} />
    {reply.notice && <p className="ic-notice">{reply.notice}</p>}
    {sources.length > 0 && <div className="ic-links">{sources.map((link, index) => <a href={link.href} key={index}>{link.label}<span aria-hidden="true"> ↗</span></a>)}</div>}
    {reply.tools.length > 0 && <details className="ic-sources">
      <summary>Tools used <span>{reply.tools.length}</span></summary>
      <ul>{reply.tools.map((tool, index) => <li key={index}>{tool.label} <code>{tool.name}</code></li>)}</ul>
    </details>}
    {reply.artifact && <button className="ic-download" type="button" onClick={() => saveMarkdown(reply.artifact!.filename, reply.artifact!.markdown)}>
      <DownloadMark /> Download result
    </button>}
  </div>
}

export function IncomeChat() {
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState('')
  const [error, setError] = useState('')
  const active = useRef<AbortController | null>(null)
  const log = useRef<HTMLDivElement>(null)
  const lastResponse = useRef<HTMLDivElement>(null)

  const selectPreset = useCallback((question: string) => {
    if (active.current) return
    setDraft(question)
    setError('')
  }, [])

  useEffect(() => () => { active.current?.abort() }, [])

  useEffect(() => {
    if (!log.current) return
    if (pending) log.current.scrollTop = log.current.scrollHeight
    else if (lastResponse.current) {
      const position = lastResponse.current.getBoundingClientRect().top - log.current.getBoundingClientRect().top
      log.current.scrollTop = Math.max(0, log.current.scrollTop + position - 8)
    }
  }, [exchanges, pending])

  async function send(question: string) {
    const text = question.trim()
    if (!text || active.current) return
    const controller = new AbortController()
    active.current = controller
    setError('')
    setDraft('')
    setPending(text)
    const messages = exchanges.slice(-3).flatMap(({ question, reply }) => [
      { role: 'user', content: question },
      { role: 'assistant', content: reply.answer.slice(0, 2000) },
    ])
    messages.push({ role: 'user', content: text })
    try {
      const response = await fetch('/api/studio/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }), signal: controller.signal,
      })
      const body = await response.json().catch(() => null)
      if (!response.ok) {
        if (response.status === 429) throw new Error('Too many questions in a short time. Wait a moment, then send yours again.')
        throw new Error(typeof body?.error === 'string' ? body.error : 'The assistant is unavailable. Your question is ready to retry.')
      }
      if (!body || typeof body.answer !== 'string' || !body.answer.trim() ||
          !['ai', 'tools'].includes(body.mode) || !Array.isArray(body.tools) || !Array.isArray(body.links)) {
        throw new Error('The assistant returned an incomplete answer. Please try again.')
      }
      setExchanges(previous => [...previous, { question: text, reply: body as StudioReply }])
    } catch (err) {
      if (controller.signal.aborted) return
      setDraft(text)
      setError(err instanceof TypeError ? 'Connection interrupted. Your question is ready to retry.' :
        err instanceof Error ? err.message : 'Your question could not be sent. Please try again.')
    } finally {
      if (!controller.signal.aborted) {
        active.current = null
        setPending('')
      }
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    void send(draft)
  }

  const started = exchanges.length > 0 || Boolean(pending)
  return <section className={'income-chat' + (started ? ' ic-started' : '')} id="income-chat" aria-labelledby="income-chat-title" data-dd-privacy="mask">
    <Suspense fallback={null}><PresetFromLink select={selectPreset} /></Suspense>
    <div className="ic-top">
      <h2 id="income-chat-title" className="ic-visually-hidden">Ask Agentic Income</h2>
      {exchanges.length > 0 && <button type="button" className="ic-save" title="Download conversation" aria-label="Download conversation" onClick={() => saveMarkdown('agentic-income-conversation.md', transcriptText(exchanges))}><DownloadMark /></button>}
    </div>
    {started && <div className="ic-log" role="log" aria-label="Conversation" aria-live="polite" tabIndex={0} ref={log}>
      {exchanges.map((turn, index) => <div className="ic-turn" key={index}>
        <div className="ic-question"><span className="ic-visually-hidden">You asked </span>{turn.question}</div>
        <div ref={index === exchanges.length - 1 ? lastResponse : undefined}><Result reply={turn.reply} /></div>
      </div>)}
      {pending && <div className="ic-turn"><div className="ic-question"><span className="ic-visually-hidden">You asked </span>{pending}</div>
        <p className="ic-thinking"><span aria-hidden="true" /> Preparing your answer…</p></div>}
    </div>}
    {error && <p className="ic-error" role="alert">{error}</p>}
    <form className="ic-compose" onSubmit={submit}>
      <label className="ic-visually-hidden" htmlFor="income-chat-prompt">{started ? 'Ask a follow-up' : 'Ask about an idea, an offer or its economics'}</label>
      <textarea id="income-chat-prompt" rows={2} maxLength={1500} value={draft} readOnly={Boolean(pending)}
        placeholder={started ? 'Ask a follow-up…' : 'Describe your idea or ask about its economics…'}
        onChange={event => setDraft(event.target.value)} onKeyDown={event => {
          if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault()
            void send(draft)
          }
        }} />
      <button type="submit" className="ic-send" aria-label="Send message" disabled={!draft.trim() || Boolean(pending)}><SendMark /></button>
    </form>
    <div className="ic-footer">
      {!started && <div className="ic-prompts" aria-label="Try a question">{prompts.filter(prompt => prompt.key !== 'mcp').map(prompt => <button type="button" key={prompt.key} onClick={() => void send(prompt.question)}>{prompt.label}</button>)}</div>}
      <Link href="/privacy#studio-chat" className="ic-privacy">Chat privacy</Link>
    </div>
    <noscript><style>{'.income-chat .ic-compose,.income-chat .ic-prompts{display:none}'}</style><p className="ic-offline">Chat requires JavaScript. <Link href="/mcp">Connect your own AI assistant</Link> or <Link href="/blog">explore the research</Link>.</p></noscript>
  </section>
}
