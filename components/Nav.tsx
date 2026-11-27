import Link from 'next/link'
import { ArrowUpRight } from '@/components/ArrowUpRight'
import { site } from '@/lib/site'
import { LogoMark } from '@/components/LogoMark'

const sections = [
  { label: 'Research', href: '/blog' },
  { label: 'Toolkits', href: '/offers' },
  { label: 'Implementation', href: '/offers/implementation-sprint' },
  { label: 'MCP', href: '/mcp' },
]

export function Nav() {
  return (
    <header className="border-b border-border/60 glass">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 px-4 sm:px-6">
        <Link href="/" className="flex min-h-14 items-center gap-2 font-bold text-ink">
          <LogoMark />
          {site.name}
        </Link>
        <div className="order-3 flex w-full gap-3 overflow-x-auto border-t border-border/60 text-sm text-muted sm:order-none sm:ml-auto sm:w-auto sm:gap-5 sm:border-0">
          {sections.map(item => (
            <Link key={item.href} href={item.href} className="inline-flex min-h-11 shrink-0 items-center hover:text-ink">
              {item.label}
            </Link>
          ))}
        </div>
        <Link href="/workbench/offer-brief" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink">
          Workbench <ArrowUpRight />
        </Link>
      </nav>
    </header>
  )
}
