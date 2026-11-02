'use client'

import { useId, useState } from 'react'
import type { PackManifest } from '@/lib/pack-manifests'

export function PackInspector({ manifest }: { manifest: PackManifest }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const baseId = useId()
  const activeFile = manifest.files[activeIndex] ?? manifest.files[0]

  async function handleCopyTree() {
    const tree = [
      `${manifest.archiveName} (${manifest.totalFilesLabel}, ${manifest.totalSizeLabel})`,
      ...manifest.files.map((f) => `  |- ${f.path} (${f.sizeLabel})`),
    ].join('\n')
    try {
      await navigator.clipboard.writeText(tree)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const count = manifest.files.length
    if (count <= 1) return
    let next = index
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      next = (index + 1) % count
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      next = (index - 1 + count) % count
    } else if (e.key === 'Home') {
      e.preventDefault()
      next = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      next = count - 1
    } else {
      return
    }
    setActiveIndex(next)
    const target = document.getElementById(`${baseId}-tab-${next}`)
    target?.focus()
  }

  if (!activeFile) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface/90">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-bg/80 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          <span className="font-mono font-semibold text-ink">{manifest.archiveName}</span>
          <span className="text-muted">·</span>
          <span className="font-mono text-muted">{manifest.totalFilesLabel}</span>
          <span className="text-muted">·</span>
          <span className="font-mono text-muted">{manifest.totalSizeLabel}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-muted">
            {manifest.licenseShort}
          </span>
          <button
            type="button"
            onClick={handleCopyTree}
            className="min-h-[44px] rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-xs text-ink transition-colors duration-150 motion-reduce:transition-none hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {copied ? 'Tree copied' : 'Copy file tree'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[17rem_1fr]">
        <div
          role="tablist"
          aria-label="Inspectable files in this package"
          className="flex gap-2 overflow-x-auto border-b border-border bg-bg/40 p-3 lg:flex-col lg:overflow-x-visible lg:border-r lg:border-b-0"
        >
          {manifest.files.map((file, idx) => {
            const selected = idx === activeIndex
            return (
              <button
                key={file.path}
                id={`${baseId}-tab-${idx}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${idx}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveIndex(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`min-h-[44px] shrink-0 rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-150 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:w-full ${
                  selected
                    ? 'border-accent/70 bg-accent/10 text-ink'
                    : 'border-transparent bg-transparent text-muted hover:border-border hover:bg-surface/60 hover:text-ink'
                }`}
              >
                <div className="truncate font-mono text-xs font-semibold">{file.path.split('/').pop()}</div>
                <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted">
                  <span>{file.badge}</span>
                  <span className="font-mono">{file.sizeLabel}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div
          id={`${baseId}-panel-${activeIndex}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeIndex}`}
          className="flex flex-col justify-between bg-bg/60"
        >
          <div className="border-b border-border/70 px-4 py-2.5 font-mono text-xs text-muted sm:px-5">
            {activeFile.path}
          </div>

          <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-ink/95 sm:p-5">
            <code>
              {activeFile.excerpt.map((line, lineIdx) => (
                <div key={`${activeFile.path}-${lineIdx}`} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="select-none text-right text-muted/50">{lineIdx + 1}</span>
                  <span className="whitespace-pre-wrap break-words">{line || ' '}</span>
                </div>
              ))}
            </code>
          </pre>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 bg-surface/50 px-4 py-2.5 text-[11px] text-muted sm:px-5">
            <span>
              Previewing lines 1-{activeFile.excerpt.length} of {activeFile.totalLines}
            </span>
            <span>Inspectable before checkout or access request</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-t border-border bg-surface/70 p-4 sm:grid-cols-2 sm:p-5">
        <div className="rounded-xl border border-border bg-bg/50 p-3.5">
          <div className="font-mono text-[11px] font-semibold text-accent">Good fit if</div>
          <p className="mt-1.5 text-xs leading-5 text-muted">{manifest.buyIf}</p>
        </div>
        <div className="rounded-xl border border-border bg-bg/50 p-3.5">
          <div className="font-mono text-[11px] font-semibold text-gold">Skip this if</div>
          <p className="mt-1.5 text-xs leading-5 text-muted">{manifest.skipIf}</p>
        </div>
      </div>
    </div>
  )
}
