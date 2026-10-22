import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: { mdxRs: true },
  outputFileTracingIncludes: {
    '/api/mcp/[transport]': ['./knowledge/*.md', './public/downloads/*.md'],
    '/api/mcp': ['./knowledge/*.md', './public/downloads/*.md'],
  },
  // The implementation sprint was withdrawn (no consulting, starlight TRUTH.md §1); old links land on /offers.
  async redirects() {
    return [{ source: '/offers/implementation-sprint', destination: '/offers', permanent: false }]
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
