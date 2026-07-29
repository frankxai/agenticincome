'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { site } from '@/lib/site'
import { LogoMark } from '@/components/LogoMark'

export function Nav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex min-h-11 min-w-0 items-center gap-2 font-bold text-ink" aria-label="Agentic Income home">
          <LogoMark />
          <span className="hidden min-[360px]:inline">{site.name}</span>
        </Link>
        <div className="hidden items-center gap-5 text-sm text-muted md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center font-semibold hover:text-ink"
              aria-current={pathname === item.href ? 'page' : undefined}
              data-active={pathname === item.href ? 'true' : undefined}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link href="/waitlist" className="nav-lab-link">
          Join the Lab
        </Link>
      </nav>
      <div className="border-t border-border/50 md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-4 px-3 py-1 text-center text-[11px] font-semibold text-muted">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center justify-center rounded-lg px-1 hover:text-ink"
              aria-current={pathname === item.href ? 'page' : undefined}
              data-active={pathname === item.href ? 'true' : undefined}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {item.shortLabel}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
