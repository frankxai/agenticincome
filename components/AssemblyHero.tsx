'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * The Assembly — signature hero.
 * Scroll scrubs four stages (Audit → Architect → Implement → Verify): scattered
 * task-particles assemble into the actual income-machine schematic the knowledge
 * base teaches. Reduced motion / small screens render the completed schematic.
 * Doctrine: motion reveals causality; the diagram is real, labeled, and honest.
 */

type Node = {
  id: string
  label: string
  sub?: string
  // normalized center + half-extents (0..1 space, 16:9-ish stage)
  cx: number
  cy: number
  hw: number
  hh: number
  shape: 'box' | 'diamond' | 'ticks' | 'strip'
  color: 'ink' | 'cyan' | 'emerald' | 'amber' | 'muted'
}

const NODES: Node[] = [
  { id: 'cap', label: 'Your capability', sub: 'skills · surfaces · assets', cx: 0.11, cy: 0.42, hw: 0.072, hh: 0.085, shape: 'box', color: 'ink' },
  { id: 'research', label: 'Research', cx: 0.335, cy: 0.2, hw: 0.055, hh: 0.052, shape: 'box', color: 'cyan' },
  { id: 'build', label: 'Build', cx: 0.335, cy: 0.42, hw: 0.055, hh: 0.052, shape: 'box', color: 'cyan' },
  { id: 'verify', label: 'Verify', cx: 0.335, cy: 0.64, hw: 0.055, hh: 0.052, shape: 'box', color: 'cyan' },
  { id: 'artifacts', label: 'Artifacts', sub: 'offer · product · engine', cx: 0.565, cy: 0.42, hw: 0.075, hh: 0.085, shape: 'box', color: 'emerald' },
  { id: 'gate', label: 'Human gate', cx: 0.745, cy: 0.42, hw: 0.045, hh: 0.075, shape: 'diamond', color: 'amber' },
  { id: 'revenue', label: 'Revenue events', cx: 0.905, cy: 0.42, hw: 0.055, hh: 0.075, shape: 'ticks', color: 'emerald' },
  { id: 'ledger', label: 'Your ledger — attested, local', cx: 0.5, cy: 0.9, hw: 0.42, hh: 0.0, shape: 'strip', color: 'muted' },
]

const EDGES: Array<[string, string]> = [
  ['cap', 'research'],
  ['cap', 'build'],
  ['cap', 'verify'],
  ['research', 'artifacts'],
  ['build', 'artifacts'],
  ['verify', 'artifacts'],
  ['artifacts', 'gate'],
  ['gate', 'revenue'],
  ['revenue', 'ledger'],
]

const STAGES = [
  { n: '01', name: 'Audit', note: 'map what you have' },
  { n: '02', name: 'Architect', note: 'choose the machine' },
  { n: '03', name: 'Implement', note: 'agents assemble it' },
  { n: '04', name: 'Verify', note: 'gates before revenue' },
]

const COLORS = {
  ink: [241, 243, 249],
  cyan: [6, 182, 212],
  emerald: [16, 185, 129],
  amber: [245, 158, 11],
  muted: [138, 144, 168],
} as const

type Particle = {
  sx: number
  sy: number
  tx: number
  ty: number
  delay: number
  size: number
  color: keyof typeof COLORS
  dust: boolean
}

// deterministic PRNG so server/client and every visit agree
function mulberry(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function nodePerimeterPoint(node: Node, t: number): [number, number] {
  const { cx, cy, hw, hh, shape } = node
  if (shape === 'diamond') {
    const seg = Math.floor(t * 4)
    const u = (t * 4) % 1
    const pts: Array<[number, number]> = [
      [cx, cy - hh],
      [cx + hw, cy],
      [cx, cy + hh],
      [cx - hw, cy],
    ]
    const [x1, y1] = pts[seg % 4]
    const [x2, y2] = pts[(seg + 1) % 4]
    return [x1 + (x2 - x1) * u, y1 + (y2 - y1) * u]
  }
  if (shape === 'ticks') {
    const tick = Math.floor(t * 5)
    const u = (t * 5) % 1
    const tx = cx - hw + (tick / 4) * hw * 2
    return [tx, cy + hh - u * hh * 2 * (0.55 + 0.45 * ((tick * 2654435761) % 5) / 4)]
  }
  if (shape === 'strip') {
    return [cx - hw + t * hw * 2, cy]
  }
  // box perimeter
  const per = 4 * (hw + hh)
  let d = t * per
  if (d < 2 * hw) return [cx - hw + d, cy - hh]
  d -= 2 * hw
  if (d < 2 * hh) return [cx + hw, cy - hh + d]
  d -= 2 * hh
  if (d < 2 * hw) return [cx + hw - d, cy + hh]
  d -= 2 * hw
  return [cx - hw, cy + hh - d]
}

function buildParticles(count: number): Particle[] {
  const rand = mulberry(20260711)
  const parts: Particle[] = []
  const weights = NODES.map((n) =>
    n.shape === 'strip' ? n.hw * 1.2 : n.shape === 'ticks' ? (n.hw + n.hh) * 2.4 : 4 * (n.hw + n.hh),
  )
  const totalW = weights.reduce((a, b) => a + b, 0)
  const structured = Math.floor(count * 0.82)
  for (let i = 0; i < count; i++) {
    const sx = rand()
    const sy = rand()
    if (i >= structured) {
      parts.push({ sx, sy, tx: sx, ty: sy, delay: rand(), size: 0.7 + rand() * 0.9, color: 'muted', dust: true })
      continue
    }
    // pick node by weight
    let pick = rand() * totalW
    let idx = 0
    while (pick > weights[idx] && idx < NODES.length - 1) {
      pick -= weights[idx]
      idx++
    }
    const node = NODES[idx]
    const [tx, ty] = nodePerimeterPoint(node, rand())
    parts.push({
      sx,
      sy,
      tx,
      ty,
      delay: rand() * 0.55,
      size: 0.9 + rand() * 1.1,
      color: node.color,
      dust: false,
    })
  }
  return parts
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

function drawScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  particles: Particle[],
) {
  ctx.clearRect(0, 0, w, h)
  // stage mapping
  const scanT = clamp01(p / 0.24) // audit sweep
  const assembleT = clamp01((p - 0.22) / 0.34) // architect: scatter -> structure
  const edgeT = clamp01((p - 0.52) / 0.26) // implement: connections draw
  const verifyT = clamp01((p - 0.8) / 0.2) // verify: pulse + revenue ticks

  const mapX = (nx: number) => w * (0.05 + nx * 0.9)
  const mapY = (ny: number) => h * (0.14 + ny * 0.72)

  // drafting grid, appears with assembly, stays whisper-quiet
  if (assembleT > 0.01) {
    ctx.strokeStyle = `rgba(241,243,249,${0.028 * assembleT})`
    ctx.lineWidth = 1
    const step = Math.max(48, w / 24)
    ctx.beginPath()
    for (let x = step; x < w; x += step) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
    }
    for (let y = step; y < h; y += step) {
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
    }
    ctx.stroke()
  }

  // audit scanline
  if (p < 0.26 && scanT > 0) {
    const sx = w * (0.06 + 0.88 * scanT)
    const grad = ctx.createLinearGradient(sx - 60, 0, sx + 2, 0)
    grad.addColorStop(0, 'rgba(6,182,212,0)')
    grad.addColorStop(1, `rgba(6,182,212,${0.28 * (1 - scanT * 0.4)})`)
    ctx.fillStyle = grad
    ctx.fillRect(sx - 60, 0, 62, h)
  }

  // edges (implement stage)
  if (edgeT > 0) {
    const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]))
    EDGES.forEach(([a, b], i) => {
      const t = clamp01(edgeT * EDGES.length - i * 0.55)
      if (t <= 0) return
      const na = nodeById[a]
      const nb = nodeById[b]
      const x1 = mapX(na.cx + (nb.cx > na.cx ? na.hw : 0))
      const y1 = mapY(na.cy)
      const x2 = mapX(nb.cx - (nb.cx > na.cx ? nb.hw : 0))
      const y2 = mapY(nb.shape === 'strip' ? nb.cy - 0.02 : nb.cy)
      ctx.strokeStyle = `rgba(6,182,212,${0.16 + 0.22 * t})`
      ctx.lineWidth = 1
      ctx.beginPath()
      const mx = x1 + (x2 - x1) * 0.5
      ctx.moveTo(x1, y1)
      // orthogonal blueprint routing
      ctx.lineTo(x1 + (mx - x1) * t, y1)
      if (t > 0.5) {
        ctx.lineTo(mx, y1 + (y2 - y1) * clamp01((t - 0.5) / 0.25))
        if (t > 0.75) ctx.lineTo(mx + (x2 - mx) * clamp01((t - 0.75) / 0.25), y2)
      }
      ctx.stroke()
    })
  }

  // verify pulse travels the spine (cap -> build -> artifacts -> gate -> revenue)
  if (verifyT > 0 && verifyT < 1) {
    const spine = ['cap', 'build', 'artifacts', 'gate', 'revenue']
    const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]))
    const seg = Math.min(spine.length - 2, Math.floor(verifyT * (spine.length - 1)))
    const u = verifyT * (spine.length - 1) - seg
    const na = nodeById[spine[seg]]
    const nb = nodeById[spine[seg + 1]]
    const px = mapX(na.cx + (nb.cx - na.cx) * u)
    const py = mapY(na.cy + (nb.cy - na.cy) * u)
    const glow = ctx.createRadialGradient(px, py, 0, px, py, 26)
    glow.addColorStop(0, 'rgba(16,185,129,0.5)')
    glow.addColorStop(1, 'rgba(16,185,129,0)')
    ctx.fillStyle = glow
    ctx.fillRect(px - 26, py - 26, 52, 52)
  }

  // particles
  for (const pt of particles) {
    let x: number, y: number, alpha: number
    const [r, g, b] = COLORS[pt.color]
    if (pt.dust) {
      alpha = 0.34 * (1 - assembleT)
      if (alpha <= 0.01) continue
      x = mapX(pt.sx)
      y = mapY(pt.sy)
      ctx.fillStyle = `rgba(${COLORS.muted.join(',')},${alpha})`
      ctx.fillRect(x, y, pt.size, pt.size)
      continue
    }
    const local = easeInOut(clamp01((assembleT - pt.delay * 0.4) / 0.6))
    x = mapX(pt.sx + (pt.tx - pt.sx) * local)
    y = mapY(pt.sy + (pt.ty - pt.sy) * local)
    // color: ink while loose, node color once structured; verify saturates
    const structured = local > 0.92
    const colorGain = structured ? 0.55 + 0.45 * verifyT : 0.25
    const cr = Math.round(COLORS.ink[0] + (r - COLORS.ink[0]) * (structured ? colorGain : 0))
    const cg = Math.round(COLORS.ink[1] + (g - COLORS.ink[1]) * (structured ? colorGain : 0))
    const cb = Math.round(COLORS.ink[2] + (b - COLORS.ink[2]) * (structured ? colorGain : 0))
    alpha = 0.35 + 0.45 * local + (p < 0.26 ? 0.2 * Math.max(0, 1 - Math.abs(mapX(pt.sx) - w * (0.06 + 0.88 * scanT)) / 46) : 0)
    ctx.fillStyle = `rgba(${cr},${cg},${cb},${Math.min(0.95, alpha)})`
    const s = pt.size * (structured ? 1.15 : 1)
    ctx.fillRect(x - s / 2, y - s / 2, s, s)
  }
}

export function AssemblyHero() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)
  const [stageIdx, setStageIdx] = useState(0)
  const [staticScene, setStaticScene] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const host = canvas.parentElement as HTMLElement

    let raf = 0
    let running = false
    let particles = buildParticles(1050)

    const resize = () => {
      const rect = host.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) return
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const render = () => {
      const rect = canvas.getBoundingClientRect()
      drawScene(ctx, rect.width, rect.height, progressRef.current, particles)
    }

    const loop = () => {
      render()
      if (running) raf = requestAnimationFrame(loop)
    }

    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()

    mm.add(
      {
        full: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
        lite: '(max-width: 899px), (prefers-reduced-motion: reduce)',
      },
      (mmCtx) => {
        const { full } = mmCtx.conditions as { full: boolean; lite: boolean }
        resize()
        if (full) {
          setStaticScene(false)
          particles = buildParticles(1050)
          const st = ScrollTrigger.create({
            trigger: wrap,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.4,
            onUpdate: (self) => {
              progressRef.current = self.progress
              setStageIdx(Math.min(3, Math.floor(self.progress * 4)))
            },
            onToggle: (self) => {
              running = self.isActive
              if (running) {
                cancelAnimationFrame(raf)
                raf = requestAnimationFrame(loop)
              }
            },
          })
          render()
          return () => {
            st.kill()
            running = false
            cancelAnimationFrame(raf)
          }
        }
        // lite: completed machine, no pin, no loop
        setStaticScene(true)
        particles = buildParticles(600)
        progressRef.current = 1
        setStageIdx(3)
        render()
        return () => {}
      },
    )

    // ResizeObserver beats window resize: it fires when the host box actually
    // has dimensions (late layout, pane resizes, font swaps).
    const ro = new ResizeObserver(() => {
      resize()
      render()
    })
    ro.observe(host)

    return () => {
      mm.revert()
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section ref={wrapRef} className="hero-breakout" aria-label="How the income machine assembles">
      <div className="assembly-stage">
        {/* headline block */}
        <div className="assembly-copy">
          <p className="kicker text-[color:var(--color-accent-2)]">Agentic income · the hub · earn</p>
          <h1 className="assembly-title">
            The hours are over.
            <br />
            <span className="t-grad">The machines are yours.</span>
          </h1>
          <p className="assembly-sub">
            For a century, solo income obeyed one law: money = hours × rate. AI agents just broke
            it. Direct an engineering team from your terminal. Ship real revenue machinery. Keep
            the surplus — and inspect every gear.
          </p>
          <div className="assembly-actions">
            <Link href="/pack" className="cta">Install /ai — free</Link>
            <a href="#the-shift" className="cta-secondary">
              Watch it assemble ↓
            </a>
          </div>
          <p className="assembly-legend">
            <span className="lg-emerald">open machinery</span>
            <span className="lg-cyan">education</span>
            <span className="lg-amber">commercial — always labeled</span>
          </p>
        </div>

        {/* the drafting surface: canvas + node labels share one box */}
        <div className="assembly-canvas">
          <canvas ref={canvasRef} aria-hidden="true" />
          <div className={`assembly-labels ${stageIdx >= 1 || staticScene ? 'is-on' : ''}`} aria-hidden="true">
            {NODES.map((n) => (
              <div
                key={n.id}
                className={`assembly-label label-${n.color}`}
                style={{
                  left: `${(0.05 + n.cx * 0.9) * 100}%`,
                  top: `${(0.14 + (n.cy + n.hh) * 0.72) * 100 + 2.4}%`,
                }}
              >
                {n.label}
                {n.sub ? <span>{n.sub}</span> : null}
              </div>
            ))}
          </div>
        </div>

        {/* stage rail */}
        <ol className="assembly-rail" aria-label="Assembly stages">
          {STAGES.map((s, i) => (
            <li key={s.n} className={i === stageIdx ? 'is-active' : i < stageIdx ? 'is-done' : ''}>
              <span className="rail-n">{s.n}</span>
              <span className="rail-name">{s.name}</span>
              <span className="rail-note">{s.note}</span>
            </li>
          ))}
        </ol>

        <p className="assembly-scrollhint" aria-hidden="true">
          {staticScene ? 'The machine, assembled.' : 'Scroll — watch it assemble'}
        </p>
      </div>
    </section>
  )
}
