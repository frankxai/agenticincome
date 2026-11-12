/**
 * Shared scroll state for the depth layer.
 *
 * Written by components/motion/scenes.ts from its ScrollTrigger callbacks (GSAP
 * stays the only scroll clock) and read once per frame by depth/stage.ts. This
 * module is a plain object so scenes.ts can write to it whether or not the
 * WebGL chunk was ever loaded.
 */
export const depthState = {
  /** 0 to 1 across the opening scene's scroll. */
  opening: 0,
  /** 0 to 1 as the close scene enters. */
  close: 0,
  /** Build path step in focus while pinned, or -1 when the steps are a plain list. */
  step: -1,
  /** One-shot brightening when the fit_check answer resolves. 0 at rest. */
  pulse: 0,
}

export type DepthState = typeof depthState
