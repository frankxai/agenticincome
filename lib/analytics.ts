import { normalizeAnalyticsEvent, forwardAnalyticsEvent as forward, type AnalyticsEvent } from '@agentic-income/engine/analytics.js'

// Thin per-site binding: validation/allow-list logic lives once in the shared package;
// this file just binds the site host for outbound forwarding so every existing
// `forwardAnalyticsEvent(event)` call site (no second argument) keeps working unchanged.
export type { AnalyticsEvent }
export { normalizeAnalyticsEvent }

export function forwardAnalyticsEvent(event: AnalyticsEvent): Promise<boolean> {
  return forward(event, 'agenticincome.ai')
}
