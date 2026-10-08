'use client'

import { type KeyboardEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { findProgram, getLink } from '@/lib/affiliate'
import { trackClientEvent } from '@/lib/client-analytics'
import { TrackedLink } from '@/components/TrackedLink'

type RouteStatus = 'paid' | 'unpaid' | 'owned' | 'stale'

type Criteria = {
  fit: number
  value: number
  quality: number
  maintainability: number
  risk: number
}

type TrustRoute = {
  id: string
  title: string
  intent: string
  audience: string
  tool: string
  routeStatus: RouteStatus
  routeLabel: string
  ctaLabel: string
  href?: string
  bestFor: string
  avoidIf: string
  rankingReason: string
  payoutModel?: string
  lastVerified: string
  nextReview: string
  criteria: Criteria
  alternatives: string[]
}

const ROUTES: TrustRoute[] = [
  {
    id: 'faceless-youtube',
    title: 'Faceless YouTube stack',
    intent: 'Script, voice, edit, and clip a channel without hiring a full team.',
    audience: 'Creator operator',
    tool: 'ElevenLabs',
    routeStatus: 'paid',
    routeLabel: 'Paid route',
    ctaLabel: 'Open routed pick',
    bestFor: 'Creators who need voice quality, fast editing, and recurring workflow utility.',
    avoidIf: 'You need the cheapest possible voice stack and can accept lower realism.',
    rankingReason: 'ElevenLabs wins the voice slot on quality and creator fit; CapCut keeps editing accessible. The payout route follows the fit, not the other way around.',
    payoutModel: '22% / 12-month route in catalog',
    lastVerified: '2026-06-12',
    nextReview: '2026-07-12',
    criteria: { fit: 95, value: 82, quality: 94, maintainability: 88, risk: 18 },
    alternatives: ['CapCut for editing', 'Descript for transcript workflows', 'No-pay manual editing route'],
  },
  {
    id: 'frontier-answer',
    title: 'Frontier model answer',
    intent: 'Choose the best model before routing to any payer.',
    audience: 'AI builder',
    tool: 'OpenAI',
    routeStatus: 'unpaid',
    routeLabel: 'No paid route',
    ctaLabel: 'Compare alternatives',
    href: '/blog/personal-ai-coe-under-100',
    bestFor: 'Builders who need the best answer even when the winner pays nothing.',
    avoidIf: 'You want a recommendation filtered only by available affiliate programs.',
    rankingReason: 'Frontier tools like ChatGPT and Claude can win the answer while paying nothing. The desk still shows them when they are the best fit.',
    lastVerified: '2026-06-12',
    nextReview: '2026-07-12',
    criteria: { fit: 91, value: 86, quality: 92, maintainability: 84, risk: 22 },
    alternatives: ['Perplexity for research routing', 'OpenRouter for model access', 'Owned starter kit for operating loop'],
  },
  {
    id: 'owned-system',
    title: 'Owned income loop',
    intent: 'Turn one comparison into a product and list relationship.',
    audience: 'Operator founder',
    tool: 'Starter Kit',
    routeStatus: 'owned',
    routeLabel: 'Owned offer',
    ctaLabel: 'Open starter kit',
    href: '/offers/starter-kit',
    bestFor: 'Operators who need the repeatable first loop instead of another tool list.',
    avoidIf: 'You only want a third-party software recommendation.',
    rankingReason: 'The owned offer is labeled separately because it is Agentic Income product inventory, not a third-party tool verdict.',
    payoutModel: 'Agentic Income product',
    lastVerified: '2026-07-05',
    nextReview: '2026-08-05',
    criteria: { fit: 88, value: 90, quality: 82, maintainability: 92, risk: 20 },
    alternatives: ['Read the free flywheel post', 'Inspect catalog first', 'Use the trust standard before buying'],
  },
  {
    id: 'verify-video-route',
    title: 'Video model backdoor',
    intent: 'Monetize video-model demand only after terms are checked.',
    audience: 'Video creator',
    tool: 'Pika',
    routeStatus: 'stale',
    routeLabel: 'Verify before primary CTA',
    ctaLabel: 'Inspect catalog notes',
    href: '/tools',
    bestFor: 'Teams comparing video tools where direct affiliate terms are changing.',
    avoidIf: 'You need a route that is confirmed safe for primary promotion today.',
    rankingReason: 'The catalog lists Pika as a dead end: no official affiliate program was found on 2026-09-28, and the 30% recurring figure seen online belongs to a different company (pika.style). No paid route is offered.',
    payoutModel: 'No official program',
    lastVerified: '2026-09-28',
    nextReview: 'Immediate',
    criteria: { fit: 78, value: 74, quality: 82, maintainability: 58, risk: 64 },
    alternatives: ['Higgsfield for a verified creator route', 'Topaz for high-AOV upscaling', 'Pollo for aggregator coverage'],
  },
]

const STATUS_COPY: Record<RouteStatus, string> = {
  paid: 'Agentic Income may earn a commission if you buy through this route. The ranking still uses the criteria shown here.',
  unpaid: 'This recommendation does not currently pay Agentic Income. It can still win when it is the best fit.',
  owned: 'This route points to an Agentic Income product and is labeled separately from third-party recommendations.',
  stale: 'Terms or pricing need review before this should be used as a primary outbound CTA.',
}

const STATUS_CLASS: Record<RouteStatus, string> = {
  paid: 'trust-status-paid',
  unpaid: 'trust-status-unpaid',
  owned: 'trust-status-owned',
  stale: 'trust-status-stale',
}

const CRITERIA_LABELS: Array<[keyof Criteria, string]> = [
  ['fit', 'Fit'],
  ['value', 'Value'],
  ['quality', 'Quality'],
  ['maintainability', 'Maint.'],
  ['risk', 'Risk'],
]

function routeHref(route: TrustRoute) {
  if (route.routeStatus === 'paid') return getLink(route.tool)
  return route.href ?? null
}

function routeEvent(route: TrustRoute) {
  if (route.routeStatus === 'paid') return 'affiliate_route_clicked'
  if (route.routeStatus === 'owned') return 'owned_offer_clicked'
  if (route.routeStatus === 'unpaid') return 'unpaid_route_clicked'
  return 'stale_route_seen'
}

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href)
}

function formatProgramStatus(route: TrustRoute) {
  const program = findProgram(route.tool)
  if (!program) return route.routeStatus === 'owned' ? 'Owned product path' : 'No catalog payer'
  return `${program.status ?? 'active'}${program.recurring ? ` / ${program.recurring}` : ''}`
}

export function TrustComparisonDesk() {
  const [activeId, setActiveId] = useState(ROUTES[0].id)
  const activeRoute = useMemo(() => ROUTES.find((route) => route.id === activeId) ?? ROUTES[0], [activeId])
  const activeHref = routeHref(activeRoute)

  useEffect(() => {
    trackClientEvent('disclosure_seen', { source: 'trust-comparison-desk', state: 'visible' })
  }, [])

  useEffect(() => {
    trackClientEvent('last_verified_visible', {
      source: 'trust-comparison-desk',
      tool: activeRoute.tool,
      state: activeRoute.lastVerified,
    })
  }, [activeRoute.lastVerified, activeRoute.tool])

  function selectRoute(route: TrustRoute) {
    setActiveId(route.id)
    trackClientEvent('comparison_criteria_opened', {
      source: 'trust-comparison-desk',
      tool: route.tool,
      state: route.routeStatus,
    })

    if (!routeHref(route)) {
      trackClientEvent('null_link_rendered', {
        source: 'trust-comparison-desk',
        tool: route.tool,
        state: route.routeStatus,
      })
    }

    if (route.routeStatus === 'stale') {
      trackClientEvent('stale_route_seen', {
        source: 'trust-comparison-desk',
        tool: route.tool,
        state: route.lastVerified,
      })
    }
  }

  function focusRoute(routeId: string) {
    window.requestAnimationFrame(() => {
      document.getElementById(`route-tab-${routeId}`)?.focus()
    })
  }

  function moveRoute(routeIndex: number, direction: number) {
    const nextRoute = ROUTES[(routeIndex + direction + ROUTES.length) % ROUTES.length]
    selectRoute(nextRoute)
    focusRoute(nextRoute.id)
  }

  function handleRouteKeyDown(event: KeyboardEvent<HTMLButtonElement>, routeIndex: number) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      moveRoute(routeIndex, 1)
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveRoute(routeIndex, -1)
    }

    if (event.key === 'Home') {
      event.preventDefault()
      selectRoute(ROUTES[0])
      focusRoute(ROUTES[0].id)
    }

    if (event.key === 'End') {
      event.preventDefault()
      const lastRoute = ROUTES[ROUTES.length - 1]
      selectRoute(lastRoute)
      focusRoute(lastRoute.id)
    }
  }

  function trackRouteClick(route: TrustRoute, href: string) {
    trackClientEvent(routeEvent(route), {
      href,
      tool: route.tool,
      source: 'trust-comparison-desk',
      state: route.routeStatus,
    })
  }

  return (
    <section className="section-band trust-desk-section" aria-labelledby="trust-desk-title">
      <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="section-heading motion-reveal">
          <div className="kicker">Criteria before click</div>
          <h2 id="trust-desk-title">
            <span>Every route </span>
            <span>earns its click.</span>
          </h2>
          <p>
            The recommendation still has to show why it wins, how fresh the claim is, whether Agentic Income can get paid, and what the reader should compare before clicking.
          </p>
          <div className="trust-desk-legend" aria-label="Route status legend">
            <span className="trust-status trust-status-paid">Paid</span>
            <span className="trust-status trust-status-unpaid">Unpaid</span>
            <span className="trust-status trust-status-owned">Owned</span>
            <span className="trust-status trust-status-stale">Stale</span>
          </div>
          <Link
            href="/trust"
            className="cta-secondary mt-6 w-full sm:w-auto"
            onClick={() => trackClientEvent('trust_standard_clicked', { href: '/trust', source: 'trust-comparison-desk' })}
          >
            Read trust standard
          </Link>
        </div>

        <div className="trust-desk motion-reveal">
          <div className="trust-desk-topline">
            <div>
              <div className="panel-label">Decision desk</div>
              <h3>AI tool route review</h3>
            </div>
            <div className="trust-freshness">
              <span>Last verified</span>
              <strong>{activeRoute.lastVerified}</strong>
            </div>
          </div>

          <div className="trust-desk-grid">
            <div className="trust-route-list" role="tablist" aria-label="Comparison routes">
              {ROUTES.map((route, routeIndex) => (
                <button
                  id={`route-tab-${route.id}`}
                  key={route.id}
                  type="button"
                  role="tab"
                  className={`trust-route-button ${route.id === activeRoute.id ? 'is-active' : ''}`}
                  onClick={() => selectRoute(route)}
                  onKeyDown={(event) => handleRouteKeyDown(event, routeIndex)}
                  aria-selected={route.id === activeRoute.id}
                  aria-controls="route-tabpanel"
                  tabIndex={route.id === activeRoute.id ? 0 : -1}
                >
                  <span className={`trust-status ${STATUS_CLASS[route.routeStatus]}`}>{route.routeLabel}</span>
                  <strong>{route.title}</strong>
                  <small>{route.intent}</small>
                </button>
              ))}
            </div>

            <article id="route-tabpanel" role="tabpanel" aria-labelledby={`route-tab-${activeRoute.id}`} className="trust-route-detail" aria-live="polite">
              <div className="trust-detail-header">
                <div>
                  <span className={`trust-status ${STATUS_CLASS[activeRoute.routeStatus]}`}>{activeRoute.routeLabel}</span>
                  <h3>{activeRoute.title}</h3>
                  <p>{activeRoute.audience}</p>
                </div>
                <div className="trust-program-status">{formatProgramStatus(activeRoute)}</div>
              </div>

              <div className="trust-disclosure-box">
                <div className="panel-label">Disclosure in context</div>
                <p>{STATUS_COPY[activeRoute.routeStatus]}</p>
              </div>

              <div className="trust-criteria-grid" aria-label={`${activeRoute.title} ranking criteria`}>
                {CRITERIA_LABELS.map(([key, label]) => (
                  <div key={key} className="trust-meter">
                    <div className="trust-meter-label">
                      <span>{label}</span>
                      <strong>{activeRoute.criteria[key]}</strong>
                    </div>
                    <div className="trust-meter-track" aria-hidden="true">
                      <span style={{ width: `${activeRoute.criteria[key]}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="trust-route-copy">
                <div>
                  <span>Why it wins</span>
                  <p>{activeRoute.rankingReason}</p>
                </div>
                <div>
                  <span>Best for</span>
                  <p>{activeRoute.bestFor}</p>
                </div>
                <div>
                  <span>Avoid if</span>
                  <p>{activeRoute.avoidIf}</p>
                </div>
              </div>

              <div className="trust-alternatives">
                <div className="panel-label">Alternatives before action</div>
                <div className="trust-alt-row">
                  {activeRoute.alternatives.map((alternative) => (
                    <span key={alternative}>{alternative}</span>
                  ))}
                </div>
              </div>

              <div className="trust-action-row">
                <div>
                  <div className="panel-label">Next review</div>
                  <p>{activeRoute.nextReview}</p>
                  {activeRoute.payoutModel && <small>{activeRoute.payoutModel}</small>}
                </div>
                {activeHref ? (
                  isExternalHref(activeHref) ? (
                    <TrackedLink
                      href={activeHref}
                      target="_blank"
                      rel="sponsored nofollow noopener"
                      className="cta trust-route-cta"
                      event={routeEvent(activeRoute)}
                      payload={{
                        tool: activeRoute.tool,
                        source: 'trust-comparison-desk',
                        state: activeRoute.routeStatus,
                      }}
                    >
                      {activeRoute.ctaLabel}
                    </TrackedLink>
                  ) : (
                    <Link
                      href={activeHref}
                      className="cta trust-route-cta"
                      onClick={() => trackRouteClick(activeRoute, activeHref)}
                    >
                      {activeRoute.ctaLabel}
                    </Link>
                  )
                ) : (
                  <span className="trust-disabled-cta">No paid route available</span>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
