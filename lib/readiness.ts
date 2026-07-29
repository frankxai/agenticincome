type ReadinessItem = {
  id: string
  label: string
  category: 'free product' | 'public proof' | 'capture' | 'service' | 'commerce' | 'analytics' | 'observability'
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
  const subscribeWebhook = hasSecureUrlEnv('SUBSCRIBE_WEBHOOK_URL')
  const conciergeEmail = hasEmailEnv('ACCESS_REQUEST_EMAIL')
  const analyticsWebhook = hasSecureUrlEnv('ANALYTICS_WEBHOOK_URL')
  const captureConfigured = subscribeWebhook || conciergeEmail
  const anyPaidCheckout =
    hasSecureUrlEnv('AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL') ||
    hasSecureUrlEnv('AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL')

  const items: ReadinessItem[] = [
    {
      id: 'field_guide',
      label: 'Free Field Guide',
      category: 'free product',
      configured: true,
      requiredForFullLaunch: true,
      detail: 'The buyer map, Outcome Pack anatomy, verified commands, public source, and reference desk are available without payment or email.',
    },
    {
      id: 'public_commands',
      label: 'Public scaffold, validator, and tests',
      category: 'public proof',
      configured: true,
      requiredForFullLaunch: true,
      detail: 'The canonical MIT repository exposes income:init, income:validate, tests, the IncomeSystem schema, and a Request-to-Quote reference pack.',
    },
    {
      id: 'outcome_pack_lab_intake',
      label: 'Outcome Pack Lab intake',
      category: 'capture',
      configured: captureConfigured,
      requiredForFullLaunch: true,
      detail: subscribeWebhook
        ? 'Selective Lab applications forward to the configured intake endpoint.'
        : conciergeEmail
          ? 'Applications use a transparent concierge email handoff and are received only after the applicant sends it.'
          : 'Applications are disabled. The site does not collect or claim to retain an email without a verified destination.',
    },
    {
      id: 'scope_first_build',
      label: 'Outcome Pack Build Sprint',
      category: 'service',
      configured: true,
      requiredForFullLaunch: true,
      detail: 'The commercial offer is scope-first: buyer, acceptance, ownership, delivery, support, and terms must be agreed before payment.',
    },
    {
      id: 'paid_checkout',
      label: 'Self-serve paid checkout',
      category: 'commerce',
      configured: anyPaidCheckout,
      requiredForFullLaunch: false,
      detail: anyPaidCheckout
        ? 'At least one legacy digital-product provider route is configured.'
        : 'Intentionally deferred. Paid self-serve products are not part of the primary launch funnel.',
    },
    {
      id: 'custom_analytics_forwarding',
      label: 'Custom first-party event forwarding',
      category: 'analytics',
      configured: analyticsWebhook,
      requiredForFullLaunch: false,
      detail: analyticsWebhook
        ? 'Allowlisted first-party events forward to the configured endpoint.'
        : 'Optional custom forwarding is not connected; email addresses are never sent to analytics.',
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
  const captureMode: 'webhook' | 'manual_email' | 'unwired' =
    subscribeWebhook ? 'webhook' : conciergeEmail ? 'manual_email' : 'unwired'

  return {
    version: '2026-07-29',
    checkedAt: new Date().toISOString(),
    fullLaunchReady,
    configuredRequired: configuredRequired.length,
    requiredTotal: required.length,
    captureMode,
    commercialMode: 'scope-first',
    items,
  }
}

export type LaunchReadiness = ReturnType<typeof getLaunchReadiness>
