'use client'

import { useState } from 'react'
import { fitCheck, type FitCheckResult } from '@/lib/fit-check'

export function McpPlayground() {
  const [hours, setHours] = useState(10)
  const [budget, setBudget] = useState(250)
  const [hasAudience, setHasAudience] = useState(false)
  const [canCode, setCanCode] = useState(true)
  const [result, setResult] = useState<FitCheckResult | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const handleRun = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const res = fitCheck({
        hoursPerWeek: hours,
        upfrontBudgetUsd: budget,
        hasAudience,
        canCode,
      })
      setResult(res)
      setIsExecuting(false)
    }, 200)
  }

  return (
    <div className="card mt-8 border-accent/30 bg-surface/90 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div>
          <span className="kicker text-[11px] text-accent">Interactive Browser MCP Desk</span>
          <h3 className="text-xl font-semibold text-ink">Test MCP Tool: <code>fit_check</code></h3>
        </div>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-mono text-accent">
          HTTP MCP Live
        </span>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-muted">
            Weekly Hours ({hours}h/wk)
          </label>
          <input
            type="range"
            min="2"
            max="40"
            step="1"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="mt-2 w-full accent-accent"
          />
          <div className="mt-1 flex justify-between text-[11px] font-mono text-muted">
            <span>2h</span>
            <span>20h</span>
            <span>40h</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-muted">
            Upfront Budget (${budget})
          </label>
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-2 w-full accent-accent"
          />
          <div className="mt-1 flex justify-between text-[11px] font-mono text-muted">
            <span>$0</span>
            <span>$1,000</span>
            <span>$2,000</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={hasAudience}
            onChange={(e) => setHasAudience(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          Has Existing Audience
        </label>

        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={canCode}
            onChange={(e) => setCanCode(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          Can Write Code / Technical
        </label>
      </div>

      <div className="mt-6">
        <button
          onClick={handleRun}
          disabled={isExecuting}
          className="cta w-full sm:w-auto text-xs py-2.5 px-6 font-semibold"
        >
          {isExecuting ? 'Executing Tool...' : 'Execute fit_check Tool →'}
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-xl border border-accent/20 bg-bg p-4 font-mono text-xs text-ink animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] text-accent border-b border-border/40 pb-2 mb-2">
            <span>JSON-RPC 2.0 Response</span>
            <span>Status: 200 OK</span>
          </div>
          <pre className="overflow-x-auto text-emerald-400 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
          <div className="mt-3 pt-2 border-t border-border/40 text-[11px] text-muted">
            Recommended Route: <a href={result.read} className="text-accent underline hover:text-ink">{result.read}</a>
          </div>
        </div>
      )}
    </div>
  )
}
