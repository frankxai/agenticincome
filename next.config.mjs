import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: { mdxRs: true },
  outputFileTracingIncludes: {
    '/api/mcp/[transport]': ['./knowledge/*.md', './public/downloads/*.md'],
    '/api/mcp': ['./knowledge/*.md', './public/downloads/*.md'],
    '/atlas': ['./vault/atlas.html'],
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
