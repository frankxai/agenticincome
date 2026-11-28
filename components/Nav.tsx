import Link from 'next/link'
import { ArrowUpRight } from '@/components/ArrowUpRight'
import { site } from '@/lib/site'
import { LogoMark } from '@/components/LogoMark'

const sections = [
  { label: 'Ask the studio', href: '/#income-chat' },
  { label: 'Research', href: '/blog' },
  { label: 'Toolkits', href: '/offers' },
  { label: 'Implementation', href: '/offers/implementation-sprint' },
  { label: 'Workbench', href: '/workbench' },
]

export function Nav() {
  return (
    <header className="revenue-nav border-b border-border/60 glass">
      <nav aria-label="Main" className="relative mx-auto flex max-w-6xl items-center justify-between gap-x-3 px-4 sm:px-6">
        <Link href="/" className="revenue-nav-brand flex min-h-14 items-center gap-2 font-bold text-ink">
          <LogoMark />
          {site.name}
        </Link>
        <div className="ml-auto hidden gap-5 text-sm text-muted md:flex">
          {sections.map(item => (
            <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center hover:text-ink">
              {item.label}
            </Link>
          ))}
        </div>
        <Link href="/mcp" className="revenue-nav-workbench ml-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink md:ml-5">
          <span className="hidden min-[370px]:inline">Connect MCP</span><span className="min-[370px]:hidden">MCP</span> <ArrowUpRight />
        </Link>
        <details className="revenue-nav-mobile relative text-sm md:hidden">
          <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center font-semibold">Menu</summary>
          <div className="absolute right-0 z-30 grid min-w-48 border border-border bg-surface p-2 text-ink shadow-xl">
            {sections.map(item => <a key={item.href} href={item.href} className="flex min-h-11 items-center px-3">{item.label}</a>)}
          </div>
        </details>
      </nav>
    </header>
  )
}
