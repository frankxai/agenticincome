import Link from 'next/link'
import { site } from '@/lib/site'
import Image from 'next/image'

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-bold text-ink">
          <span className="block h-10 w-28 shrink-0 overflow-hidden">
            <Image src="/brand/wordmark-8c5b7ac822de.svg" alt={site.name} width={280} height={56} className="max-w-none -translate-x-4 -translate-y-4" unoptimized priority />
          </span>
        </Link>
        <div className="hidden items-center gap-5 text-sm text-muted sm:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-ink"
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="border-t border-border/50 sm:hidden">
        <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-6 py-2 text-xs font-semibold text-muted">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 hover:text-ink"
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
