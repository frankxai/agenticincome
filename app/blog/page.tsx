import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import Link from 'next/link'
import { sortedPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'AI Tool Comparisons',
  description: 'Honest, AEO-ready comparisons of the AI tools that actually make creators money.',
  alternates: { canonical: '/blog' },
  openGraph: {
    ...baseOpenGraph,
    title: 'AI Tool Comparisons',
    description: 'Honest, AEO-ready comparisons of the AI tools that actually make creators money.',
    url: '/blog',
  },
}

export default function BlogIndex() {
  return (
    <div className="py-16">
      <div className="max-w-3xl">
        <div className="uppercase text-xs text-accent">Research</div>
        <h1 className="mt-2 text-5xl font-semibold">Comparisons</h1>
        <p className="mt-4 text-lg text-muted">Every post is a real test in the shape AI search engines cite — direct answer first, sortable tables, the honest pick, and links only to tools that pay recurring when they win.</p>
      </div>

      <div className="mt-10 grid gap-4">
        {sortedPosts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group block rounded-2xl border border-border glass p-7 transition hover:border-accent">
            <div className="flex items-center gap-3 text-xs uppercase text-muted">
              <span className="font-semibold text-accent">{p.cluster}</span>
              <span>·</span>
              <time>{p.date}</time>
            </div>
            <h2 className="mt-3 text-2xl font-semibold group-hover:text-accent">{p.title}</h2>
            <p className="mt-3 text-[15px] text-muted">{p.dek}</p>
            <div className="mt-4 text-xs text-accent">Read the breakdown →</div>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/tools" className="cta-secondary">See the full live catalog of payers →</Link>
      </div>
    </div>
  )
}
