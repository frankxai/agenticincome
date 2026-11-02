import type { Metadata } from 'next'
import { Geist, Geist_Mono, Bricolage_Grotesque } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { MotionRuntime } from '@/components/MotionRuntime'
import { baseOpenGraph, ogImage } from '@/lib/open-graph'
import { site } from '@/lib/site'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  keywords: ['Agent as a Service', 'AI implementation', 'revenue systems', 'agent skills', 'digital products', 'AI tool comparisons'],
  authors: [{ name: site.author }],
  creator: site.author,
  publisher: site.name,
  category: 'business',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', shortcut: '/icon.svg', apple: '/icon.svg' },
  openGraph: {
    ...baseOpenGraph,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      description: site.description,
      founder: { '@id': 'https://www.frankx.ai/frank-riemer#person' },
      sameAs: [
        'https://www.frankx.ai',
        'https://github.com/frankxai/agenticincome',
        ...site.network.map((item) => item.url),
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      publisher: { '@id': `${site.url}/#organization` },
      inLanguage: 'en',
    },
    {
      '@type': 'Person',
      '@id': 'https://www.frankx.ai/frank-riemer#person',
      name: site.author,
      url: 'https://www.frankx.ai/frank-riemer',
      jobTitle: 'AI Architect',
      sameAs: ['https://www.frankx.ai', 'https://github.com/frankxai'],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Nav />
        <MotionRuntime />
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

