import createMDX from '@next/mdx'

// Datadog RUM (lib/datadog-rum-config.ts). CSP admits Datadog only when both public RUM
// identifiers are set, keeping unconfigured deploys byte-for-byte identical.
const DATADOG_RUM_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_DD_RUM_APPLICATION_ID?.trim() &&
    process.env.NEXT_PUBLIC_DD_RUM_CLIENT_TOKEN?.trim(),
)
const DATADOG_RUM_SCRIPT_SUFFIX = DATADOG_RUM_ENABLED
  ? ' https://www.datadoghq-browser-agent.com'
  : ''
const DATADOG_RUM_CONNECT_SUFFIX = DATADOG_RUM_ENABLED
  ? ' https://browser-intake-datadoghq.eu https://*.browser-intake-datadoghq.eu'
  : ''

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${DATADOG_RUM_SCRIPT_SUFFIX}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.vercel-insights.com${DATADOG_RUM_CONNECT_SUFFIX}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: { mdxRs: true },
  outputFileTracingIncludes: {
    '/api/mcp/[transport]': ['./knowledge/*.md', './public/downloads/*.md'],
    '/api/mcp': ['./knowledge/*.md', './public/downloads/*.md'],
    '/atlas': ['./vault/atlas.html'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [{ key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY }],
      },
    ]
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
