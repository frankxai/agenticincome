type ReadinessItem = {
  id: string
  label: string
  category: 'checkout' | 'capture' | 'analytics' | 'observability'
  configured: boolean
  requiredForFullLaunch: boolean
  detail: string
}

function hasSecureUrlEnv(name: string) {
  const value = process.env[name]
  if (!value) return false

  try {
    const url = new URL(value)
    return url.protocol === 'https:'
  } catch {
    return false
  }
}

function hasEmailEnv(name: string) {
  const value = process.env[name]
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
}

export function getLaunchReadiness() {
  const blueprintCheckout = hasSecureUrlEnv('AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL')
  const privateIntelCheckout = hasSecureUrlEnv('AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL')
  const subscribeWebhook = hasSecureUrlEnv('SUBSCRIBE_WEBHOOK_URL')
  const conciergeEmail = hasEmailEnv('ACCESS_REQUEST_EMAIL')
  const analyticsWebhook = hasSecureUrlEnv('ANALYTICS_WEBHOOK_URL')
  const captureConfigured = subscribeWebhook || conciergeEmail

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
      detail: 'The root layout includes the Vercel Web Analytics and Speed Insights components and sends interaction events as Vercel custom events. Collection starts only once both features are enabled on the Vercel project; this page cannot confirm that project setting.',
    },
  ]

  const required = items.filter((item) => item.requiredForFullLaunch)
  const configuredRequired = required.filter((item) => item.configured)
  const fullLaunchReady = configuredRequired.length === required.length

  return {
    version: '2026-06-26',
    checkedAt: new Date().toISOString(),
    fullLaunchReady,
    configuredRequired: configuredRequired.length,
    requiredTotal: required.length,
    captureMode: subscribeWebhook ? 'webhook' : conciergeEmail ? 'manual_email' : 'unwired',
    items,
  }
}

export type LaunchReadiness = ReturnType<typeof getLaunchReadiness>
