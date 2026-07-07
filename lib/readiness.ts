type ReadinessItem = {
  id: string
  label: string
  category: 'checkout' | 'capture' | 'analytics' | 'observability'
  configured: boolean
  requiredForFullLaunch: boolean
  detail: string
}

type EnvCheck = { configured: boolean; misconfigured: boolean; warning?: string }

// Distinguishes "not set" (a normal, expected state before a provider is wired) from
// "set but wrong" (a typo'd URL, a malformed email) — the readiness API previously
// collapsed both into a single `false`, so a misspelled env var name looked identical
// to one that was never set at all. The second case should be loud, not silent.
function checkSecureUrlEnv(name: string): EnvCheck {
  const value = process.env[name]
  if (!value) return { configured: false, misconfigured: false }

  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') {
      return { configured: false, misconfigured: true, warning: `${name} is set but is not https:// — refusing to use an insecure checkout URL.` }
    }
    return { configured: true, misconfigured: false }
  } catch {
    return { configured: false, misconfigured: true, warning: `${name} is set but is not a valid URL. Check for a typo or truncated value.` }
  }
}

function checkEmailEnv(name: string): EnvCheck {
  const value = process.env[name]
  if (!value) return { configured: false, misconfigured: false }

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  return valid
    ? { configured: true, misconfigured: false }
    : { configured: false, misconfigured: true, warning: `${name} is set but does not look like a valid email address.` }
}

export function getLaunchReadiness() {
  const blueprintCheckoutCheck = checkSecureUrlEnv('AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL')
  const privateIntelCheckoutCheck = checkSecureUrlEnv('AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL')
  const subscribeWebhookCheck = checkSecureUrlEnv('SUBSCRIBE_WEBHOOK_URL')
  const conciergeEmailCheck = checkEmailEnv('ACCESS_REQUEST_EMAIL')
  const analyticsWebhookCheck = checkSecureUrlEnv('ANALYTICS_WEBHOOK_URL')

  const blueprintCheckout = blueprintCheckoutCheck.configured
  const privateIntelCheckout = privateIntelCheckoutCheck.configured
  const subscribeWebhook = subscribeWebhookCheck.configured
  const conciergeEmail = conciergeEmailCheck.configured
  const analyticsWebhook = analyticsWebhookCheck.configured
  const captureConfigured = subscribeWebhook || conciergeEmail

  const misconfigurationWarnings = [blueprintCheckoutCheck, privateIntelCheckoutCheck, subscribeWebhookCheck, conciergeEmailCheck, analyticsWebhookCheck]
    .map((check) => check.warning)
    .filter((warning): warning is string => Boolean(warning))

  if (misconfigurationWarnings.length > 0 && process.env.NODE_ENV !== 'test') {
    for (const warning of misconfigurationWarnings) console.warn(`[readiness] ${warning}`)
  }

  const items: ReadinessItem[] = [
    {
      id: 'blueprint_checkout',
      label: 'Blueprint checkout',
      category: 'checkout',
      configured: blueprintCheckout,
      requiredForFullLaunch: true,
      detail: blueprintCheckout
        ? 'Paid Blueprint clicks can leave the site for secure checkout.'
        : 'Blueprint clicks fall back to request-access.',
    },
    {
      id: 'private_intel_checkout',
      label: 'Private Intel checkout',
      category: 'checkout',
      configured: privateIntelCheckout,
      requiredForFullLaunch: true,
      detail: privateIntelCheckout
        ? 'Membership clicks can leave the site for recurring checkout.'
        : 'Membership clicks fall back to request-access.',
    },
    {
      id: 'owned_capture',
      label: 'Owned-audience capture',
      category: 'capture',
      configured: captureConfigured,
      requiredForFullLaunch: true,
      detail: subscribeWebhook
        ? 'Access requests forward to the configured owned-audience endpoint.'
        : conciergeEmail
          ? 'Access requests can open a concierge email handoff.'
          : 'Access requests return a request ID but are not routed to an operator.',
    },
    {
      id: 'analytics_forwarding',
      label: 'Analytics forwarding',
      category: 'analytics',
      configured: analyticsWebhook,
      requiredForFullLaunch: true,
      detail: analyticsWebhook
        ? 'First-party events forward to the configured analytics endpoint.'
        : 'First-party events validate locally but are not forwarded.',
    },
    {
      id: 'vercel_observability',
      label: 'Vercel Web Analytics and Speed Insights',
      category: 'observability',
      configured: true,
      requiredForFullLaunch: false,
      detail: 'The root layout includes Vercel Web Analytics and Speed Insights components; the project features are enabled in Vercel.',
    },
  ]

  const required = items.filter((item) => item.requiredForFullLaunch)
  const configuredRequired = required.filter((item) => item.configured)
  const fullLaunchReady = configuredRequired.length === required.length

  return {
    version: '2026-07-06',
    checkedAt: new Date().toISOString(),
    fullLaunchReady,
    configuredRequired: configuredRequired.length,
    requiredTotal: required.length,
    captureMode: subscribeWebhook ? 'webhook' : conciergeEmail ? 'manual_email' : 'unwired',
    // Distinct from `items[].configured === false` — this list only has entries when an
    // env var is SET but fails validation (a typo, a truncated URL). An empty array here
    // with items still unconfigured just means "not set yet," which is fine.
    misconfigurationWarnings,
    items,
  }
}

export type LaunchReadiness = ReturnType<typeof getLaunchReadiness>
