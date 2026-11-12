/**
 * Five code-native character plates for the build path: Auditor, Architect,
 * Implementer, Verifier and the Human gate. Same visual language as
 * public/images/products/plate-*.svg: a framed plate on a 32px grid, 1.5px
 * strokes, 10px panel corners, mono markings. Strokes use currentColor; each
 * plate carries exactly one emerald detail (its instrument).
 *
 * The plate is decoration (aria-hidden). The step name is always carried by
 * real text beside it. Elements marked data-idle are animated once on entry by
 * components/motion/scenes.ts; at rest they sit in their final position.
 */

export type CharacterKind = 'auditor' | 'architect' | 'implementer' | 'verifier' | 'human'

const MONO = 'var(--font-mono), ui-monospace, monospace'
const STROKE = 1.5

function Frame({ index }: { index: string }) {
  return (
    <>
      <rect x="0.5" y="0.5" width="239" height="239" rx="15.5" fill="var(--color-surface)" stroke="var(--color-border)" />
      <path
        d="M48 36V240M80 36V240M112 36V240M144 36V240M176 36V240M208 36V240M0 68H240M0 100H240M0 132H240M0 164H240M0 196H240"
        stroke="var(--color-border)"
        strokeWidth="0.75"
        opacity="0.55"
      />
      <line x1="0" y1="36" x2="240" y2="36" stroke="var(--color-border)" />
      <rect x="14" y="14" width="8" height="8" rx="2" stroke="currentColor" strokeOpacity="0.5" />
      <text x="30" y="22" fill="var(--color-muted)" fontFamily={MONO} fontSize="10">
        {index}
      </text>
      <path d="M196 18h30" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="1 4" strokeLinecap="round" />
      {/* floor */}
      <path d="M28 208h184" stroke="currentColor" strokeOpacity="0.45" strokeDasharray="1 5" strokeLinecap="round" />
    </>
  )
}

/** The agent: a square head with a visor on panel shoulders. Shared by four plates. */
function AgentBust() {
  return (
    <g stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
      <path d="M36 208v-18a24 24 0 0 1 24-24h72a24 24 0 0 1 24 24v18" fill="var(--color-surface)" />
      <path d="M56 188h28M56 198h16" strokeOpacity="0.45" />
      <rect x="120" y="182" width="16" height="16" rx="4" strokeOpacity="0.6" />
      <path d="M84 154v12M108 154v12" strokeOpacity="0.6" />
      <path d="M96 70V56" />
      <rect x="91" y="46" width="10" height="10" rx="3" fill="var(--color-surface)" />
      <rect x="44" y="70" width="104" height="84" rx="20" fill="var(--color-surface-2)" />
      <rect x="60" y="94" width="72" height="30" rx="15" fill="var(--color-surface)" strokeOpacity="0.6" />
      <g data-idle="eye" fill="currentColor" stroke="none">
        <rect x="76" y="104" width="12" height="10" rx="3" />
        <rect x="104" y="104" width="12" height="10" rx="3" />
      </g>
      <path d="M60 138h16" strokeOpacity="0.45" />
    </g>
  )
}

function Auditor() {
  return (
    <>
      <AgentBust />
      <g stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round">
        <path d="M205 124l15 16" strokeWidth="5" />
        <circle cx="187" cy="104" r="27" fill="var(--color-surface)" />
        <circle cx="187" cy="104" r="20" strokeOpacity="0.4" />
      </g>
      <path data-idle="tool" data-idle-kind="glint" d="M173 100a15 15 0 0 1 12-11" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
    </>
  )
}

function Architect() {
  return (
    <>
      <AgentBust />
      <g stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
        <path d="M185 70l-16 72" />
        <g data-idle="tool" data-idle-kind="swing">
          <path d="M191 70l16 72" />
        </g>
        <path d="M178 106h20" strokeOpacity="0.5" />
        <rect x="182" y="58" width="12" height="12" rx="4" fill="var(--color-surface)" />
      </g>
      <path d="M162 152q26 13 52 0" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
    </>
  )
}

function Implementer() {
  return (
    <>
      <AgentBust />
      <g data-idle="tool" data-idle-kind="turn">
        <g transform="rotate(22 188 120)" strokeLinecap="round" strokeLinejoin="round">
          <g stroke="currentColor" strokeWidth={STROKE}>
            <rect x="181" y="94" width="14" height="60" rx="7" fill="var(--color-surface)" />
            <path d="M171 64v18a17 17 0 0 0 34 0V64" />
          </g>
          <path d="M188 62l9 5v10l-9 5-9-5V67z" stroke="var(--color-accent)" strokeWidth="2.5" />
        </g>
      </g>
    </>
  )
}

function Verifier() {
  return (
    <>
      <AgentBust />
      <g stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6">
        <path d="M176 128l-7 26 12-7M200 128l7 26-12-7" />
      </g>
      <g data-idle="tool" data-idle-kind="press">
        <g stroke="currentColor" strokeWidth={STROKE}>
          <circle cx="188" cy="102" r="30" strokeDasharray="4 4.4" />
          <circle cx="188" cy="102" r="22" fill="var(--color-surface)" />
        </g>
        <path d="M177 102l8 8 14-16" stroke="var(--color-accent)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  )
}

/** The human: round head, soft shoulders, no visor. Holds the key. */
function Human() {
  return (
    <>
      <g stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 208v-8a42 42 0 0 1 42-42h48a42 42 0 0 1 42 42v8" fill="var(--color-surface)" />
        <circle cx="96" cy="106" r="42" fill="var(--color-surface-2)" />
        <g data-idle="eye" fill="currentColor" stroke="none">
          <circle cx="82" cy="104" r="4" />
          <circle cx="110" cy="104" r="4" />
        </g>
        <path d="M86 124q10 6 20 0" strokeOpacity="0.6" />
      </g>
      <g data-idle="tool" data-idle-kind="key" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="158" y="92" width="26" height="26" rx="9" />
        <path d="M184 105h40M208 105v11M218 105v8" />
      </g>
    </>
  )
}

const FIGURES: Record<CharacterKind, () => React.JSX.Element> = {
  auditor: Auditor,
  architect: Architect,
  implementer: Implementer,
  verifier: Verifier,
  human: Human,
}

export function CharacterPlate({ kind, index }: { kind: CharacterKind; index: string }) {
  const Figure = FIGURES[kind]
  return (
    <svg
      className="cine-plate"
      data-cine="plate"
      viewBox="0 0 240 240"
      width="240"
      height="240"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <Frame index={index} />
      <Figure />
    </svg>
  )
}
