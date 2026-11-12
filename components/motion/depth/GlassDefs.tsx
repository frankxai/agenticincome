/**
 * The refraction filter for the homepage glass. Server-rendered, no script.
 *
 * It is only ever referenced from `backdrop-filter` when depth/mount.ts has
 * confirmed the browser applies SVG filters there (Chromium). Everywhere else
 * the glass is frosted (blur and saturation) and this element is inert.
 *
 * Low-frequency noise drives a displacement map, so straight edges behind the
 * glass (the slabs, the page grid, the signal field) bend the way they do
 * behind a thick pane. The noise is static: nothing here animates.
 */
export function GlassDefs() {
  return (
    <svg className="cine-glass-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter id="cine-refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.007" numOctaves="2" seed="11" result="lens" />
          <feDisplacementMap in="SourceGraphic" in2="lens" scale="96" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}
