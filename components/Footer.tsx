import Link from 'next/link'
import { site } from '@/lib/site'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <div className="font-bold text-ink">{site.name}</div>
            <p className="mt-2 max-w-sm text-sm text-muted">{site.description}</p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-muted">Related research</div>
            <ul className="mt-3 space-y-2 text-sm">
              {site.network.map((n) => (
                <li key={n.url}>
                  <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent">{n.name}</a>
                  <span className="text-muted"> — {n.blurb}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2">
            <div className="text-xs font-semibold uppercase text-muted">Explore</div>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {site.nav.map((item) => (
                <Link key={item.href} href={item.href} className="text-ink hover:text-accent">
                  {item.label}
                </Link>
              ))}
              <Link href="/waitlist" className="text-ink hover:text-accent">
                Outcome Pack Lab
              </Link>
              <Link href="/offers" className="text-ink hover:text-accent">
                Product paths
              </Link>
              <Link href="/blog" className="text-ink hover:text-accent">
                Research
              </Link>
              <Link href="/readiness" className="text-ink hover:text-accent">
                Readiness
              </Link>
              <Link href="/disclosure" className="text-ink hover:text-accent">
                Disclosure
              </Link>
              <Link href="/privacy" className="text-ink hover:text-accent">
                Privacy
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span suppressHydrationWarning>© {new Date().getFullYear()} {site.name}. Built by {site.author}.</span>
          <span>Free education, scope-first implementation, and disclosed research. No income promises.</span>
        </div>
      </div>
    </footer>
  )
}
