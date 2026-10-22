'use client'

import { useId, useState } from 'react'
import type { FitCheckResult } from '@/lib/fit-check'

type Run =
  | { state: 'idle' }
  | { state: 'running' }
  | { state: 'done'; status: number; result: FitCheckResult; raw: string }
  | { state: 'error'; status: number | null; message: string }

// The route runs with SSE disabled but still answers a streamable-HTTP client
// with one `event: message` frame, so read either shape.
function parseRpc(body: string): unknown {
  const dataLine = body.split('\n').find((line) => line.startsWith('data:'))
  return JSON.parse(dataLine ? dataLine.slice(5) : body)
}

function curlFor(args: Record<string, number | boolean>) {
  const payload = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: { name: 'fit_check', arguments: args },
  })
  return `curl -s https://www.agenticincome.ai/api/mcp \\\n  -H 'content-type: application/json' \\\n  -H 'accept: application/json, text/event-stream' \\\n  -d '${payload}'`
}

export function McpPlayground({ className = '' }: { className?: string }) {
  const id = useId()
  const [hours, setHours] = useState(10)
  const [budget, setBudget] = useState(250)
  const [hasAudience, setHasAudience] = useState(false)
  const [canCode, setCanCode] = useState(true)
  const [run, setRun] = useState<Run>({ state: 'idle' })

  const args = { hoursPerWeek: hours, upfrontBudgetUsd: budget, hasAudience, canCode }

  const handleRun = async () => {
    setRun({ state: 'running' })
    let status: number | null = null
    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: { name: 'fit_check', arguments: args },
        }),
      })
      status = res.status
      const rpc = parseRpc(await res.text()) as {
        result?: { content?: { type: string; text: string }[] }
        error?: { message?: string }
      }
      const text = rpc.result?.content?.[0]?.text
      if (!res.ok || !text) throw new Error(rpc.error?.message ?? 'The server returned no tool result.')
      setRun({ state: 'done', status, result: JSON.parse(text) as FitCheckResult, raw: text })
    } catch (err) {
      setRun({ state: 'error', status, message: err instanceof Error ? err.message : 'The request failed.' })
    }
  }

  return (
    <div className={`card border-accent/30 bg-surface/90 backdrop-blur-md ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div>
          <span className="kicker text-[11px] text-accent">Live MCP tool</span>
          <h3 className="text-xl font-semibold text-ink">
            Run <code>fit_check</code> against <code>/api/mcp</code>
          </h3>
        </div>
        <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
          {run.state === 'done' || (run.state === 'error' && run.status !== null)
            ? `HTTP ${run.status}`
            : 'Not run yet'}
        </span>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-hours`} className="block text-xs font-medium uppercase tracking-wider text-muted">
            Hours a week ({hours}h)
          </label>
          <input
            id={`${id}-hours`}
            type="range"
            min="2"
            max="40"
            step="1"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="mt-2 w-full accent-accent"
          />
        </div>

        <div>
          <label htmlFor={`${id}-budget`} className="block text-xs font-medium uppercase tracking-wider text-muted">
            Upfront budget (${budget})
          </label>
          <input
            id={`${id}-budget`}
            type="range"
            min="0"
            max="2000"
            step="50"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-2 w-full accent-accent"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-6">
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={hasAudience}
            onChange={(e) => setHasAudience(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          I already have an audience
        </label>

        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={canCode}
            onChange={(e) => setCanCode(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          I can write code
        </label>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleRun}
          disabled={run.state === 'running'}
          className="cta w-full px-6 py-2.5 text-xs font-semibold sm:w-auto"
        >
          {run.state === 'running' ? 'Calling /api/mcp…' : 'Run fit_check'}
        </button>
      </div>

      <div aria-live="polite">
        {run.state === 'done' && (
          <div className="mt-6 rounded-xl border border-accent/20 bg-bg p-4 font-mono text-xs text-ink">
            <div className="mb-2 flex items-center justify-between border-b border-border/40 pb-2 text-[11px] text-accent">
              <span>tools/call result from /api/mcp</span>
              <span>HTTP {run.status}</span>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap text-emerald-400">{run.raw}</pre>
            <div className="mt-3 border-t border-border/40 pt-2 text-[11px] text-muted">
              Read next:{' '}
              <a href={run.result.read} className="text-accent underline hover:text-ink">
                {run.result.read}
              </a>
            </div>
          </div>
        )}
        {run.state === 'error' && (
          <p className="mt-6 text-sm text-muted">
            The live call failed{run.status !== null ? ` (HTTP ${run.status})` : ''}: {run.message}
          </p>
        )}
      </div>

      <details className="mt-6 text-xs text-muted">
        <summary className="cursor-pointer">The same call from your terminal</summary>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg border border-border/60 bg-bg p-3 font-mono text-[11px] text-ink">
          {curlFor(args)}
        </pre>
      </details>
    </div>
  )
}
