import { checkoutUrl, getOffer } from './offers.ts'
import { catalogRefusal, isCheckoutLive, pricedCatalogProducts } from './polar.ts'

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

/**
 * One checkout item per priced catalog SKU. A SKU counts as configured when
 * either checkout path can actually take a buyer to Polar (both paths apply
 * the catalog gate). It is required for full launch only when the catalog
 * says it is for sale: a SKU the catalog still gates is reported, not
 * required, so readiness measures "everything we sell can be bought".
 */
function checkoutItems(): ReadinessItem[] {
  return pricedCatalogProducts().map((product) => {
    const offer = getOffer(product.id)
    const staticLink = offer ? checkoutUrl(offer) : null
    const configured = isCheckoutLive(product.id) || Boolean(staticLink)
    const forSale = catalogRefusal(product) === null

    return {
      id: `${product.id.replace(/-/g, '_')}_checkout`,
      label: `${product.name} checkout`,
      category: 'checkout',
      configured,
      requiredForFullLaunch: forSale,
      detail: configured
        ? 'Buyers can reach secure Polar checkout from the product page.'
        : forSale
          ? 'On sale, but the payment provider is not connected. The product page shows a waitlist.'
          : 'Not on sale yet. The product page shows a waitlist.',
    }
  })
}

export function getLaunchReadiness() {
  const subscribeWebhook = hasSecureUrlEnv('SUBSCRIBE_WEBHOOK_URL')
  const conciergeEmail = hasEmailEnv('ACCESS_REQUEST_EMAIL')
  const analyticsWebhook = hasSecureUrlEnv('ANALYTICS_WEBHOOK_URL')
  const captureConfigured = subscribeWebhook || conciergeEmail

  const items: ReadinessItem[] = [
    ...checkoutItems(),
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
    version: '2026-10-30',
    checkedAt: new Date().toISOString(),
    fullLaunchReady,
    configuredRequired: configuredRequired.length,
    requiredTotal: required.length,
    captureMode: subscribeWebhook ? 'webhook' : conciergeEmail ? 'manual_email' : 'unwired',
    items,
  }
}

export type LaunchReadiness = ReturnType<typeof getLaunchReadiness>
