/** Polar environments use separate organization tokens and product IDs. */
export type PolarEnvironment = Record<string, string | undefined>
export type PolarRuntime = {
  server: 'production' | 'sandbox'
  checkoutEndpoint: string
  accessToken: string
  productId: string
}

/**
 * Return null for incomplete or ambiguous configuration. Production keeps its
 * existing default. Sandbox must be explicit and may never run in a Vercel
 * production deployment; local production-mode processes are also refused.
 */
export function polarRuntimeConfiguration(env: PolarEnvironment, productEnvKey: string): PolarRuntime | null {
  const server = env.POLAR_SERVER?.trim() || 'production'
  if (server !== 'production' && server !== 'sandbox') return null
  if (server === 'sandbox') {
    const vercelEnv = env.VERCEL_ENV?.trim()
    if (vercelEnv === 'production') return null
    if (vercelEnv && vercelEnv !== 'preview' && vercelEnv !== 'development') return null
    if (!vercelEnv && env.NODE_ENV !== 'test' && env.NODE_ENV !== 'development') return null
  }
  const prefix = server === 'sandbox' ? 'POLAR_SANDBOX_' : 'POLAR_'
  const accessToken = env[`${prefix}ACCESS_TOKEN`]?.trim()
  const suffix = productEnvKey.startsWith('POLAR_PRODUCT_ID_') ? productEnvKey.slice('POLAR_'.length) : ''
  const productId = suffix && env[`${prefix}${suffix}`]?.trim()
  if (!accessToken || !productId) return null
  return {
    server,
    checkoutEndpoint: server === 'sandbox'
      ? 'https://sandbox-api.polar.sh/v1/checkouts/'
      : 'https://api.polar.sh/v1/checkouts/',
    accessToken,
    productId,
  }
}

export function validPolarCheckoutUrl(value: unknown, server: PolarRuntime['server']): string | null {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null
    if (server === 'sandbox' && url.hostname !== 'sandbox.polar.sh') return null
    // Preserve existing production URL handling while disallowing sandbox links.
    if (server === 'production' && url.hostname === 'sandbox.polar.sh') return null
    return url.toString()
  } catch {
    return null
  }
}
