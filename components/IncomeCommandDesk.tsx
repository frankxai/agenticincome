'use client'

import { useState } from 'react'

type TabId = 'overview' | 'lanes' | 'agents' | 'system'

interface SystemMetric {
  label: string
  value: string
  status: 'active' | 'review' | 'locked'
  detail: string
}

const METRICS: SystemMetric[] = [
  { label: 'Single-Tenant Operator', value: 'Frank Riemer', status: 'active', detail: 'Principal authority' },
  { label: 'Active Agent Fleet', value: '3 Operating Agents', status: 'active', detail: 'starlight-business · impec · skill' },
  { label: 'Authority Guardrail', value: '3-Tier Lanes Active', status: 'review', detail: '1 pending principal review' },
  { label: 'Artifact Source', value: 'GitHub Main Branch', status: 'active', detail: 'frankxai/agentic-income-skills' },
]

const AGENT_DECISIONS = [
  { id: 'DEC-2026-081', agent: 'starlight-business', lane: 'Automatic', action: 'Audited affiliate commission terms against registry', time: '12m ago', state: 'verified' },
  { id: 'DEC-2026-080', agent: 'impeccable', lane: 'Automatic', action: 'Ran WCAG AAA contrast and CLS verification suite', time: '1h ago', state: 'verified' },
  { id: 'DEC-2026-079', agent: 'agentic-income-skills', lane: 'Review before action', action: 'Drafted IncomeGraph.v1 schema update proposal', time: '3h ago', state: 'pending_review' },
]

export function IncomeCommandDesk() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [filterState, setFilterState] = useState<string>('all')

  const filteredDecisions = filterState === 'all'
    ? AGENT_DECISIONS
    : AGENT_DECISIONS.filter(d => d.state === filterState)

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-[#0A0C14]/90 p-6 shadow-2xl backdrop-blur-md">
      {/* Operator Status Header */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
              Single-Tenant Operator Boundary Active
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Income Command Center
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-slate-300">
            Dogfood Portal v0.1
          </span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-mono text-emerald-300">
            Frank Riemer (Sole Tenant)
          </span>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="text-xs font-medium text-slate-400">{m.label}</div>
            <div className="mt-2 text-xl font-bold text-white font-mono">{m.value}</div>
            <div className="mt-1 text-xs text-slate-400">{m.detail}</div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="mt-8 border-b border-white/10">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Command Center views">
          {(
            [
              ['overview', 'System Overview'],
              ['lanes', 'Authority Lanes'],
              ['agents', 'Agent Fleet Logs'],
              ['system', 'Artifact Truth'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`min-h-[44px] px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                activeTab === id
                  ? 'border-b-2 border-emerald-400 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="mt-6 min-h-[220px]">
        {activeTab === 'overview' && (
          <div role="tabpanel" className="space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              This single-tenant command center provides Frank Riemer and authorized agent processes
              a real-time dogfood view into active revenue models, approval gates, and repository artifacts.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="text-sm font-semibold text-white">Merchant & Settlement Rail</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Merchant of Record: Polar.sh. AgenticIncome holds zero customer custody and zero payout balances.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="text-sm font-semibold text-white">Execution Discipline</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Zero arbitrary code execution. All system modifications require explicit repository PRs and CI quality checks.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lanes' && (
          <div role="tabpanel" className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Authority Boundary Matrix</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <span className="text-xs font-mono font-bold text-emerald-400">LANE 1: AUTOMATIC</span>
                <p className="mt-2 text-xs text-slate-300">Research diffs, static validation, test runs, internal report drafting.</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <span className="text-xs font-mono font-bold text-amber-400">LANE 2: REVIEW</span>
                <p className="mt-2 text-xs text-slate-300">Public content, partner disclosures, customer-facing deliverables.</p>
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                <span className="text-xs font-mono font-bold text-rose-300">LANE 3: PRINCIPAL</span>
                <p className="mt-2 text-xs text-slate-300">Pricing, contracts, money transfers, production promotions (Frank only).</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div role="tabpanel" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Recent Agent Decision Records</h3>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setFilterState('all')}
                  className={`min-h-[44px] px-3 py-1 rounded-lg border border-white/10 ${
                    filterState === 'all' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterState('pending_review')}
                  className={`min-h-[44px] px-3 py-1 rounded-lg border border-white/10 ${
                    filterState === 'pending_review' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pending Review
                </button>
              </div>
            </div>

            {filteredDecisions.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.01] p-8 text-center text-sm text-slate-400">
                No decision records match the current filter.
              </div>
            ) : (
              <ul className="space-y-2">
                {filteredDecisions.map((d) => (
                  <li key={d.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-slate-300">{d.id}</span>
                      <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-slate-200">{d.agent}</span>
                      <span className="text-slate-300">{d.action}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{d.time}</span>
                      <span className={`px-2 py-0.5 rounded font-mono uppercase ${
                        d.state === 'verified' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {d.state}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'system' && (
          <div role="tabpanel" className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Repository & Artifact Proof Truth</h3>
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-slate-300 space-y-2">
              <div>Primary Public Repository: <a href="https://github.com/frankxai/agentic-income-skills" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">github.com/frankxai/agentic-income-skills</a></div>
              <div>Operating Manifest Contract: <span className="text-slate-200">IncomeSystem.v1</span></div>
              <div>Quality Gates: <span className="text-emerald-400">pnpm run merge:gate (100% Passing)</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
