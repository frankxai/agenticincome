'use client'

import { useState } from 'react'

type TabId = 'overview' | 'lanes' | 'agents' | 'system'

interface SystemMetric {
  label: string
  value: string
  status: 'unconnected' | 'illustrative'
  detail: string
}

const METRICS: SystemMetric[] = [
  { label: 'Account identity', value: 'Not verified', status: 'unconnected', detail: 'No authenticated account is connected' },
  { label: 'Agent activity', value: 'Not connected', status: 'unconnected', detail: 'No runtime activity is measured here' },
  { label: 'Authority policy', value: 'Illustrative', status: 'illustrative', detail: 'The policy below is not runtime enforcement' },
  { label: 'Validation status', value: 'Not verified', status: 'unconnected', detail: 'No current CI or delivery receipt is connected' },
]

const WORKFLOW_EXAMPLES = [
  { id: 'EXAMPLE-01', role: 'Research', action: 'Compare partner terms with a dated source', state: 'illustrative' },
  { id: 'EXAMPLE-02', role: 'Quality review', action: 'Inspect accessibility and performance evidence', state: 'illustrative' },
  { id: 'EXAMPLE-03', role: 'Delivery', action: 'Prepare a proposal for a person to review', state: 'illustrative' },
]

export function IncomeCommandDesk() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [filterState, setFilterState] = useState<string>('all')

  const filteredExamples = filterState === 'all' ? WORKFLOW_EXAMPLES : []

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-[#0A0C14]/90 p-6 shadow-2xl backdrop-blur-md">
      {/* Operator Status Header */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
              Illustrative interface · no connected telemetry
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Income Command Center
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-slate-300">
            Interface prototype
          </span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-mono text-emerald-300">
            Account not connected
          </span>
        </div>
      </div>

      <p className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-relaxed text-slate-300">
        This interface uses illustrative workflow examples. It has no connected agent activity,
        revenue, approval queue, or current validation results. No account identity or access
        control is verified by this screen. Do not enter private information here.
      </p>

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
              ['lanes', 'Policy Examples'],
              ['agents', 'Workflow Examples'],
              ['system', 'Reference Source'],
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
              This prototype shows how a future income workspace could present verified activity
              and decisions. Its values are placeholders, not observations of a running system.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="text-sm font-semibold text-white">Proposed payment model</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Polar is the proposed merchant of record. This screen does not confirm checkout, fulfilment, custody, or balances.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="text-sm font-semibold text-white">Execution evidence</h3>
                <p className="mt-1 text-xs text-slate-400">
                  No agent runs or repository checks are connected to this screen. Read the source and current check results before relying on a capability.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lanes' && (
          <div role="tabpanel" className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Illustrative authority policy</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <span className="text-xs font-mono font-bold text-emerald-400">EXAMPLE: ROUTINE WORK</span>
                <p className="mt-2 text-xs text-slate-300">Research diffs, static validation, test runs, internal report drafting.</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <span className="text-xs font-mono font-bold text-amber-400">EXAMPLE: REVIEW REQUIRED</span>
                <p className="mt-2 text-xs text-slate-300">Public content, partner disclosures, customer-facing deliverables.</p>
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                <span className="text-xs font-mono font-bold text-rose-300">EXAMPLE: OWNER APPROVAL</span>
                <p className="mt-2 text-xs text-slate-300">Pricing, contracts, payments, permission changes, and production releases.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div role="tabpanel" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Illustrative workflow examples</h3>
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
                  onClick={() => setFilterState('connected')}
                  className={`min-h-[44px] px-3 py-1 rounded-lg border border-white/10 ${
                    filterState === 'connected' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Connected activity
                </button>
              </div>
            </div>

            {filteredExamples.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.01] p-8 text-center text-sm text-slate-400">
                No activity source is connected. There are no verified runs to show.
              </div>
            ) : (
              <ul className="space-y-2">
                {filteredExamples.map((d) => (
                  <li key={d.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-slate-300">{d.id}</span>
                      <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-slate-200">{d.role}</span>
                      <span className="text-slate-300">{d.action}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Example only</span>
                      <span className={`px-2 py-0.5 rounded font-mono uppercase ${
                        'bg-amber-500/20 text-amber-300'
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
            <h3 className="text-sm font-semibold text-white">Public reference</h3>
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-slate-300 space-y-2">
              <div>Public reference repository: <a href="https://github.com/frankxai/agentic-income-skills" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">github.com/frankxai/agentic-income-skills</a></div>
              <div>Reference manifest contract: <span className="text-slate-200">IncomeSystem.v1</span></div>
              <div>Current validation: <span className="text-slate-300">not connected; no pass result is claimed</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
