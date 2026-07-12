export type Faq = { q: string; a: string }

/**
 * Site-chrome FAQ block — for plain-TSX pages (the /disclosure policy page, the
 * /challenge landing page) that render outside MDX. Blog content keeps using the
 * shared @agentic-income/engine FaqSection via mdx-components.tsx so every post
 * across the network emits identical FAQPage JSON-LD; this local one covers the
 * site's own TSX pages the same way AffiliateDisclosure does.
 */
export function FaqSection({ items }: { items: Faq[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section className="my-8">
      <h2>Frequently asked questions</h2>
      <div className="mt-3 divide-y divide-border rounded-xl border border-border">
        {items.map((f) => (
          <details key={f.q} className="group px-4 py-3">
            <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden">{f.q}</summary>
            <p className="mt-2 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </section>
  )
}
