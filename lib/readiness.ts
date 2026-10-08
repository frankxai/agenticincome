import activationEvidence from '../data/commerce-activation.json' with { type: 'json' }
import { checkoutUrl, getOffer } from './offers.ts'
import { isCheckoutLive } from './polar.ts'

type ReadinessCategory =
  | 'checkout' | 'capture' | 'analytics' | 'observability'
  | 'merchant' | 'rights' | 'terms' | 'fulfilment' | 'entitlement'
  | 'delivery' | 'recovery' | 'assurance'

type ReadinessItem = {
  id: string
  label: string
  category: ReadinessCategory
  requirement: 'configuration' | 'evidence'
  configured: boolean
  requiredForFullLaunch: boolean
  detail: string
  evidence: string[]
}

export type ActivationGate = { state: string; evidence: string[] }

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

function isPublicEvidence(value: string) {
  if (/^\/downloads\/[a-z0-9/._-]+$/.test(value) && !value.split('/').some((segment) => segment === '.' || segment === '..')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash
  } catch {
    return false
  }
}

export function isVerifiedActivationGate(gate: ActivationGate) {
  return gate.state === 'verified' && gate.evidence.length > 0 && gate.evidence.every(isPublicEvidence)
}

export function getLaunchReadiness() {
  const blueprintOffer = getOffer('blueprint')!
  const privateIntelOffer = getOffer('private-intel')!
  const blueprintCheckout = Boolean(checkoutUrl(blueprintOffer)) || isCheckoutLive('blueprint')
  const privateIntelCheckout = Boolean(checkoutUrl(privateIntelOffer)) || isCheckoutLive('private-intel')
  const subscribeWebhook = hasSecureUrlEnv('SUBSCRIBE_WEBHOOK_URL')
  const conciergeEmail = hasEmailEnv('ACCESS_REQUEST_EMAIL')
  const analyticsWebhook = hasSecureUrlEnv('ANALYTICS_WEBHOOK_URL')
  const captureConfigured = subscribeWebhook || conciergeEmail

  const configurationItems: ReadinessItem[] = [
    {
      id: 'blueprint_checkout', label: 'Blueprint checkout', category: 'checkout', requirement: 'configuration',
      configured: blueprintCheckout, requiredForFullLaunch: true,
      detail: blueprintCheckout
        ? 'The catalog permits the Blueprint to leave the site for its configured secure checkout. Commercial evidence gates still apply.'
        : 'Blueprint remains request-access until the catalog permits sale and its provider is configured.',
      evidence: [],
    },
    {
      id: 'private_intel_checkout', label: 'Private Intel checkout', category: 'checkout', requirement: 'configuration',
      configured: privateIntelCheckout, requiredForFullLaunch: true,
      detail: privateIntelCheckout
        ? 'The catalog permits the membership to leave the site for its configured recurring checkout. Commercial evidence gates still apply.'
        : 'Membership remains request-access until the catalog permits sale and its provider is configured.',
      evidence: [],
    },
    {
      id: 'owned_capture', label: 'Owned-audience capture', category: 'capture', requirement: 'configuration',
      configured: captureConfigured, requiredForFullLaunch: true,
      detail: subscribeWebhook
        ? 'Access requests forward to the configured owned-audience endpoint.'
        : conciergeEmail
          ? 'Access requests can open a concierge email handoff.'
          : 'Access requests return a request ID but are not routed to an operator.',
      evidence: [],
    },
    {
      id: 'analytics_forwarding', label: 'Analytics forwarding', category: 'analytics', requirement: 'configuration',
      configured: analyticsWebhook, requiredForFullLaunch: true,
      detail: analyticsWebhook
        ? 'First-party events forward to the configured analytics endpoint.'
        : 'First-party events validate locally but are not forwarded.',
      evidence: [],
    },
    {
      id: 'vercel_observability', label: 'Vercel Web Analytics and Speed Insights', category: 'observability',
      requirement: 'configuration', configured: true, requiredForFullLaunch: false,
      detail: 'The root layout includes the Vercel components. This source-level fact does not prove that project collection is enabled or that any real visitor event exists.',
      evidence: [],
    },
  ]

  const activationItems: ReadinessItem[] = activationEvidence.offers.flatMap((offer) =>
    offer.gates.map((gate) => ({
      id: `activation_${offer.offerId}_${gate.id}`,
      label: `${offer.label}: ${gate.label}`,
      category: gate.category as ReadinessCategory,
      requirement: 'evidence',
      configured: isVerifiedActivationGate(gate),
      requiredForFullLaunch: gate.requiredForFullLaunch,
      detail: gate.detail,
      evidence: gate.evidence.filter(isPublicEvidence),
    })),
  )

  const items = [...configurationItems, ...activationItems]
  const required = items.filter((item) => item.requiredForFullLaunch)
  const configuredRequired = required.filter((item) => item.configured)
  const evidenceItems = activationItems.filter((item) => item.requiredForFullLaunch)
  const verifiedEvidence = evidenceItems.filter((item) => item.configured)

  return {
    version: '2026-10-08',
    activationVersion: activationEvidence.version,
    checkedAt: new Date().toISOString(),
    fullLaunchReady: configuredRequired.length === required.length,
    configuredRequired: configuredRequired.length,
    requiredTotal: required.length,
    verifiedEvidenceGates: verifiedEvidence.length,
    evidenceGateTotal: evidenceItems.length,
    evidenceOfferTotal: activationEvidence.offers.length,
    captureMode: subscribeWebhook ? 'webhook' : conciergeEmail ? 'manual_email' : 'unwired',
    items,
  }
}

export type LaunchReadiness = ReturnType<typeof getLaunchReadiness>

