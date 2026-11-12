import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Camera,
  CanvasTexture,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NoBlending,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  ShaderMaterial,
  Shape,
  SRGBColorSpace,
  Vector2,
  Vector4,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three'
import { buildInstruments } from './instruments'
import { COMPOSITE_FRAGMENT, FIELD_FRAGMENT, FULLSCREEN_VERTEX } from './shaders'
import type { DepthState } from './state'

/**
 * The WebGL half of the depth layer. This is the only module that imports
 * three, so it is the lazy chunk; depth/mount.ts decides whether to load it.
 *
 * One canvas, one context, one frame callback (registered on GSAP's ticker, so
 * the layer adds no requestAnimationFrame loop of its own). The canvas is
 * fixed behind the document. Each frame it draws, with a scissor per view:
 *   1. the signal field, composited into the regions that are on screen;
 *   2. the artifact stage, three slabs behind the hero terminal;
 *   3. one instrument inside each visible build path plate.
 * Scroll never reaches this file directly: it reads depth/state.ts, which
 * scenes.ts writes from ScrollTrigger.
 */

/** GSAP's ticker, handed in by depth/mount.ts so this chunk shares the page's one frame loop without importing gsap itself. */
export type FrameClock = {
  add: (callback: (time: number, deltaMs: number) => void) => unknown
  remove: (callback: (time: number, deltaMs: number) => void) => unknown
}

export type StageHooks = {
  /** First frame is on screen (or the context came back): the CSS poster can step aside. */
  onLive: () => void
  /** The context was lost: the CSS poster and SVG plates take over again. */
  onLost: () => void
}

const MAX_DPR = 1.5
const FIELD_SCALE = 0.5
const SLAB_MARGIN = 240
const SLAB_DEPTH = 8
const SLAB_BEVEL = 2
const DEG = Math.PI / 180

type Region = {
  /** Region in css px (left, top, right, bottom), or null when it should not be drawn. */
  rect: () => [number, number, number, number] | null
  feather: [number, number, number, number]
  level: () => number
  gold: number
  cover: number
  /** [x where the text side ends, how far the light is held back on that side]. */
  quiet: () => [number, number]
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const ease = (value: number) => value * value * (3 - 2 * value)

function roundedRect(width: number, height: number, radius: number): Shape {
  const x = -width / 2
  const y = -height / 2
  const shape = new Shape()
  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.absarc(x + width - radius, y + radius, radius, -Math.PI / 2, 0, false)
  shape.lineTo(x + width, y + height - radius)
  shape.absarc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2, false)
  shape.lineTo(x + radius, y + height)
  shape.absarc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI, false)
  shape.lineTo(x, y + radius)
  shape.absarc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false)
  return shape
}

/**
 * One key light, one emerald rim, and a low fill so unlit faces do not fall to pure black.
 * The key is a point light so a flat face carries a falloff instead of one flat tone. `reach` is the
 * scene's working distance in its own units; intensity scales with its square to cancel the physical decay.
 */
function addLights(scene: Scene, reach: number, keyLevel: number) {
  const key = new PointLight(0xeef1ff, keyLevel * reach * reach, 0, 2)
  key.position.set(-0.75 * reach, 0.8 * reach, 0.85 * reach)
  const rim = new DirectionalLight(0x10b981, 14)
  rim.position.set(0.9, 0.55, -0.75)
  scene.add(key, rim, new AmbientLight(0x8a90a8, 0.9))
}

export function createStage(root: HTMLElement, canvas: HTMLCanvasElement, state: DepthState, clock: FrameClock, hooks: StageHooks) {
  // failIfMajorPerformanceCaveat: a software rasteriser (no GPU) gets no context, so the page keeps its poster.
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: true })
  renderer.autoClear = false
  renderer.setClearColor(0x000000, 0)

  /* ---- elements this layer reads positions from ---- */
  const header = document.querySelector<HTMLElement>('header')
  const opening = root.querySelector<HTMLElement>('[data-scene="opening"]')
  const object = opening?.querySelector<HTMLElement>('[data-cine="object"]') ?? null
  const terminal = object?.querySelector<HTMLElement>('.terminal') ?? null
  const deck = root.querySelector<HTMLElement>('.cine-deck')
  const inspectors = Array.from(root.querySelectorAll<HTMLElement>('.cine-rows[data-cine="inspector"]'))
  const close = root.querySelector<HTMLElement>('[data-scene="close"]')
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-cine="step"]'))
  const plates = steps.map((step) => step.querySelector<SVGElement>('[data-cine="plate"]'))
  // Nearest slab first. Each sheet carries its file name (the span) and lines read from that file (data-excerpt).
  const sheets = object ? Array.from(object.querySelectorAll<HTMLElement>('[data-cine="sheet"]')).reverse() : []
  const labels = sheets.map((sheet) => sheet.querySelector<HTMLElement>('span'))

  let width = 1
  let height = 1
  let dpr = 1
  let intro = 0
  let fieldTime = 0
  let fan = 0
  let closeLevel = 0
  let pointerX = 0
  let pointerY = 0
  let lookX = 0
  let lookY = 0

  /* ---- signal field: half-resolution noise pass, then a tinted composite per region ---- */
  const triangle = new BufferGeometry()
  triangle.setAttribute('position', new BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))
  const flatCamera = new Camera()
  const fieldTarget = new WebGLRenderTarget(2, 2, { depthBuffer: false })
  const fieldMaterial = new ShaderMaterial({
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: FIELD_FRAGMENT,
    depthTest: false,
    depthWrite: false,
    uniforms: { uResolution: { value: new Vector2(1, 1) }, uTime: { value: 0 }, uScroll: { value: 0 } },
  })
  const compositeMaterial = new ShaderMaterial({
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: COMPOSITE_FRAGMENT,
    depthTest: false,
    depthWrite: false,
    blending: NoBlending,
    uniforms: {
      uField: { value: fieldTarget.texture },
      uViewport: { value: new Vector2(1, 1) },
      uDpr: { value: 1 },
      uRect: { value: new Vector4() },
      uFeather: { value: new Vector4() },
      uLevel: { value: 0 },
      uGold: { value: 0 },
      uCover: { value: 1 },
      uQuiet: { value: new Vector2(-1e5, 0) },
    },
  })
  const fieldScene = new Scene()
  const fieldMesh = new Mesh(triangle, fieldMaterial)
  fieldMesh.frustumCulled = false
  fieldScene.add(fieldMesh)
  const compositeScene = new Scene()
  const compositeMesh = new Mesh(triangle, compositeMaterial)
  compositeMesh.frustumCulled = false
  compositeScene.add(compositeMesh)

  const none: [number, number] = [-1e5, 0]
  const regions: Region[] = []
  if (opening) {
    regions.push({
      // Starts at the top of the site nav so the nav has the field behind it to bend.
      rect: () => {
        const rect = opening.getBoundingClientRect()
        const top = header ? Math.min(rect.top, header.getBoundingClientRect().top) : rect.top
        return [0, top, width, rect.bottom]
      },
      feather: [0, 0, 0, 220],
      level: () => intro * (0.78 + 0.3 * clamp01(state.opening * 1.5)) + state.pulse * 0.5,
      gold: 0,
      cover: 1,
      quiet: () => [terminal ? terminal.getBoundingClientRect().left : width * 0.5, 0.66],
    })
  }
  if (deck) {
    regions.push({
      // The deck's own footprint: the cards are glass, so the field is seen through them and as they slide in.
      rect: () => {
        const rect = deck.getBoundingClientRect()
        return [rect.left, rect.top, rect.right, rect.bottom]
      },
      feather: [36, 36, 36, 36],
      level: () => intro * 1.25,
      gold: 0.3,
      cover: 1,
      quiet: () => none,
    })
  }
  for (const list of inspectors) {
    regions.push({
      // Only the row in focus is glass; every other row is opaque, so the field shows through one row at a time.
      rect: () => {
        if (!list.classList.contains('is-inspecting')) return null
        const rect = list.getBoundingClientRect()
        return [rect.left + 1, rect.top + 1, rect.right - 1, rect.bottom - 1]
      },
      feather: [0, 0, 0, 0],
      level: () => intro * 1.5,
      gold: 0,
      cover: 1,
      quiet: () => none,
    })
  }
  if (close) {
    regions.push({
      rect: () => {
        const rect = close.getBoundingClientRect()
        return [0, rect.top, width, rect.bottom + 48]
      },
      feather: [0, 240, 0, 160],
      level: () => intro * (0.42 + 0.3 * closeLevel),
      gold: 0.5,
      cover: 1,
      quiet: () => none,
    })
  }

  /* ---- artifact stage: three bevelled slabs behind the terminal, in css pixel units ---- */
  const slabMaterial = new MeshStandardMaterial({ color: 0x1f2630, roughness: 0.5, metalness: 0.3 })
  const slabScene = new Scene()
  addLights(slabScene, 620, 4.2)
  const slabCamera = new PerspectiveCamera(28, 1, 10, 6000)
  const slabGroups: Group[] = []
  const slabDisposables: Array<{ dispose: () => void }> = []
  let slabWidth = 0
  let slabHeight = 0
  let slabStep = 24

  const disposeSlabs = () => {
    slabGroups.forEach((group) => slabScene.remove(group))
    slabGroups.length = 0
    slabDisposables.forEach((item) => item.dispose())
    slabDisposables.length = 0
  }

  const buildSlabs = () => {
    if (!terminal || !object) return
    const nextWidth = terminal.offsetWidth
    const nextHeight = terminal.offsetHeight
    if (nextWidth === slabWidth && nextHeight === slabHeight && slabGroups.length) return
    disposeSlabs()
    slabWidth = nextWidth
    slabHeight = nextHeight
    slabStep = parseFloat(getComputedStyle(object).getPropertyValue('--cine-step')) || 24
    if (slabWidth < 40 || slabHeight < 40) return

    const geometry = new ExtrudeGeometry(roundedRect(slabWidth - SLAB_BEVEL * 2, slabHeight - SLAB_BEVEL * 2, 13), {
      depth: SLAB_DEPTH,
      bevelEnabled: true,
      bevelThickness: SLAB_BEVEL,
      bevelSize: SLAB_BEVEL,
      bevelSegments: 3,
      curveSegments: 8,
    })
    geometry.translate(0, 0, -SLAB_DEPTH / 2)
    slabDisposables.push(geometry)

    const labelStyle = labels[0] ? getComputedStyle(labels[0]) : null
    for (let index = 0; index < 3; index++) {
      const group = new Group()
      group.add(new Mesh(geometry, slabMaterial))
      // The slab carries its real file name, read from the DOM label it replaces.
      const name = labels[index]?.textContent?.trim()
      if (name && labelStyle) {
        const scale = 3
        const font = `${11 * scale}px ${labelStyle.fontFamily}`
        const sheet = document.createElement('canvas')
        const context = sheet.getContext('2d')
        if (context) {
          context.font = font
          sheet.width = Math.ceil(context.measureText(name).width) + 8 * scale
          sheet.height = 18 * scale
          context.font = font
          context.fillStyle = '#9aa1b8'
          context.textBaseline = 'middle'
          context.fillText(name, 4 * scale, sheet.height / 2)
          const texture = new CanvasTexture(sheet)
          texture.colorSpace = SRGBColorSpace
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
          const material = new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })
          const plane = new PlaneGeometry(sheet.width / scale, sheet.height / scale)
          const label = new Mesh(plane, material)
          label.position.set(slabWidth / 2 - 14 - sheet.width / scale / 2, slabHeight / 2 - slabStep / 2, SLAB_DEPTH / 2 + SLAB_BEVEL + 0.6)
          group.add(label)
          slabDisposables.push(texture, material, plane)
        }
      }
      // The face prints values read from the file, dim, so there is something true behind the glass to bend.
      const excerpt = sheets[index]?.dataset.excerpt
      if (excerpt && labelStyle) {
        const scale = 2
        const page = document.createElement('canvas')
        page.width = Math.round(slabWidth * scale)
        page.height = Math.round(slabHeight * scale)
        const context = page.getContext('2d')
        if (context) {
          context.font = `${11 * scale}px ${labelStyle.fontFamily}`
          context.fillStyle = '#6b7590'
          context.textBaseline = 'top'
          excerpt.split('\n').forEach((line, row) => {
            const y = (slabStep + 16 + row * 19) * scale
            if (y < page.height - 24 * scale) context.fillText(line, 20 * scale, y)
          })
          const texture = new CanvasTexture(page)
          texture.colorSpace = SRGBColorSpace
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
          const material = new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })
          const plane = new PlaneGeometry(slabWidth, slabHeight)
          const face = new Mesh(plane, material)
          face.position.z = SLAB_DEPTH / 2 + SLAB_BEVEL + 0.4
          group.add(face)
          slabDisposables.push(texture, material, plane)
        }
      }
      slabScene.add(group)
      slabGroups.push(group)
    }
  }

  /* ---- build path instruments: one per step, shared materials ---- */
  const bodyMaterial = new MeshStandardMaterial({ color: 0x5a647c, roughness: 0.4, metalness: 0.25 })
  const accentMaterial = new MeshStandardMaterial({ color: 0x10b981, roughness: 0.35, metalness: 0.2, emissive: 0x10b981, emissiveIntensity: 0.35 })
  const toolScene = new Scene()
  addLights(toolScene, 4, 5)
  const toolCamera = new PerspectiveCamera(26, 1, 0.5, 30)
  toolCamera.position.set(0, 0.12, 7.4)
  toolCamera.lookAt(0, 0.12, 0)
  const kit = buildInstruments(bodyMaterial, accentMaterial)
  const pivots = kit.groups.map((group) => {
    const pivot = new Group()
    pivot.add(group)
    pivot.visible = false
    toolScene.add(pivot)
    return pivot
  })
  const turn = pivots.map(() => 0)
  const show = pivots.map(() => 0)

  /* ---- sizing ---- */
  const resize = () => {
    width = document.documentElement.clientWidth
    height = window.innerHeight
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height, true)
    fieldTarget.setSize(Math.max(2, Math.round(width * dpr * FIELD_SCALE)), Math.max(2, Math.round(height * dpr * FIELD_SCALE)))
    fieldMaterial.uniforms.uResolution.value.set(width, height)
    compositeMaterial.uniforms.uViewport.value.set(width, height)
    compositeMaterial.uniforms.uDpr.value = dpr
    buildSlabs()
  }

  const scissor = (left: number, top: number, right: number, bottom: number) => {
    const l = Math.max(0, left)
    const t = Math.max(0, top)
    const r = Math.min(width, right)
    const b = Math.min(height, bottom)
    if (r - l < 1 || b - t < 1) return false
    renderer.setScissor(l, height - b, r - l, b - t)
    return true
  }

  /* ---- the frame ---- */
  let ticking = false
  let lost = false
  let announced = false
  let visibleScenes = 0

  const frame = (_time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs, 50) / 1000
    const follow = 1 - Math.exp(-dt * 6)
    intro = Math.min(1, intro + dt / 1.2)
    fan += (ease(clamp01(state.opening * 2.8)) - fan) * follow
    closeLevel += (state.close - closeLevel) * follow
    lookX += (pointerX - lookX) * follow
    lookY += (pointerY - lookY) * follow
    // Flow speed follows scroll progress and the one-shot pulse; time is integrated so a pause never jumps.
    fieldTime += dt * (0.03 + 0.05 * state.opening + 0.05 * closeLevel + 0.22 * state.pulse)

    renderer.setRenderTarget(null)
    renderer.setScissorTest(false)
    renderer.setViewport(0, 0, width, height)
    renderer.clear()

    /* 1. signal field */
    const drawn = regions.map((region) => region.rect()).map((rect) => (rect && rect[3] > 0 && rect[1] < height ? rect : null))
    if (drawn.some(Boolean)) {
      fieldMaterial.uniforms.uTime.value = fieldTime
      fieldMaterial.uniforms.uScroll.value = window.scrollY * 0.35
      renderer.setRenderTarget(fieldTarget)
      renderer.render(fieldScene, flatCamera)
      renderer.setRenderTarget(null)
      renderer.setViewport(0, 0, width, height)
      renderer.setScissorTest(true)
      const uniforms = compositeMaterial.uniforms
      regions.forEach((region, index) => {
        const rect = drawn[index]
        if (!rect || !scissor(rect[0], rect[1], rect[2], rect[3])) return
        uniforms.uRect.value.set(rect[0], rect[1], rect[2], rect[3])
        uniforms.uFeather.value.set(...region.feather)
        uniforms.uLevel.value = region.level()
        uniforms.uGold.value = region.gold
        uniforms.uCover.value = region.cover
        uniforms.uQuiet.value.set(...region.quiet())
        renderer.render(compositeScene, flatCamera)
      })
    }

    /* 2. artifact stage */
    if (terminal && opening && slabGroups.length) {
      const rect = terminal.getBoundingClientRect()
      const stage = opening.getBoundingClientRect()
      const viewWidth = rect.width + SLAB_MARGIN * 2
      const viewHeight = rect.height + SLAB_MARGIN * 2
      const left = rect.left - SLAB_MARGIN
      const top = rect.top - SLAB_MARGIN
      renderer.setScissorTest(true)
      if (rect.bottom > -SLAB_MARGIN && scissor(0, Math.max(stage.top, top), width, Math.min(stage.bottom, top + viewHeight))) {
        const distance = viewHeight / 2 / Math.tan((slabCamera.fov / 2) * DEG)
        const aspect = viewWidth / viewHeight
        if (slabCamera.aspect !== aspect || slabCamera.far !== distance * 3) {
          slabCamera.aspect = aspect
          slabCamera.near = distance * 0.2
          slabCamera.far = distance * 3
          slabCamera.updateProjectionMatrix()
        }
        // The camera drifts a few degrees with scroll and a little with the pointer.
        const yaw = (4.5 * fan + 1.6 * lookX) * DEG
        const pitch = (-2.5 * fan + 1.1 * lookY) * DEG
        slabCamera.position.set(distance * Math.sin(yaw) * Math.cos(pitch), distance * Math.sin(pitch), distance * Math.cos(yaw) * Math.cos(pitch))
        slabCamera.lookAt(0, 0, 0)
        // The stack fans like a hand of cards: each slab swings about the terminal's lower left corner.
        const pivotX = -slabWidth / 2
        const pivotY = -slabHeight / 2
        slabGroups.forEach((group, i) => {
          const n = i + 1
          const swing = -2.4 * n * fan * DEG
          const restX = slabStep * n - pivotX
          const restY = slabStep * n - pivotY
          group.position.set(
            pivotX + restX * Math.cos(swing) - restY * Math.sin(swing) + 12 * n * fan,
            pivotY + restX * Math.sin(swing) + restY * Math.cos(swing) + 22 * n * fan,
            -26 * n - 22 * n * fan,
          )
          group.rotation.set(0, -1.5 * n * fan * DEG, swing)
        })
        renderer.setViewport(left, height - (top + viewHeight), viewWidth, viewHeight)
        renderer.clearDepth()
        renderer.render(slabScene, slabCamera)
      }
    }

    /* 3. instruments */
    for (let i = 0; i < pivots.length; i++) {
      const step = steps[i]
      const plate = plates[i]
      if (!step || !plate) continue
      const inline = step.style.opacity
      const opacity = inline === '' ? 1 : parseFloat(inline) || 0
      const focused = state.step < 0 || state.step === i
      turn[i] += ((focused ? 1 : 0) - turn[i]) * (1 - Math.exp(-dt * 4.5))
      show[i] += (opacity - show[i]) * (1 - Math.exp(-dt * 12))
      if (show[i] < 0.02) continue
      const rect = plate.getBoundingClientRect()
      renderer.setScissorTest(true)
      if (!scissor(rect.left, rect.top, rect.right, rect.bottom)) continue
      const pivot = pivots[i]
      // A quarter turn as the step takes focus; it comes to rest facing the reader.
      pivot.rotation.set(0.2 + 0.05 * lookY, -0.42 - (1 - ease(clamp01(turn[i]))) * (Math.PI / 2) + 0.08 * lookX, 0)
      pivot.scale.setScalar(0.6 + 0.4 * ease(clamp01(show[i])))
      pivot.visible = true
      renderer.setViewport(rect.left, height - rect.bottom, rect.width, rect.height)
      renderer.clearDepth()
      renderer.render(toolScene, toolCamera)
      pivot.visible = false
    }

    if (!announced) {
      announced = true
      hooks.onLive()
    }
  }

  const sync = () => {
    const shouldRun = !lost && visibleScenes > 0 && !document.hidden
    if (shouldRun === ticking) return
    ticking = shouldRun
    if (shouldRun) {
      clock.add(frame)
    } else {
      clock.remove(frame)
      if (!lost) {
        // Paused with nothing on screen: leave an empty canvas, never a stale frame.
        renderer.setRenderTarget(null)
        renderer.setScissorTest(false)
        renderer.clear()
      }
    }
  }

  /* ---- lifecycle ---- */
  const onScreen = new Map<Element, boolean>()
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => onScreen.set(entry.target, entry.isIntersecting))
      visibleScenes = 0
      onScreen.forEach((visible) => {
        if (visible) visibleScenes++
      })
      sync()
    },
    { rootMargin: '120px 0px' },
  )
  const watched = [header, ...Array.from(root.querySelectorAll<HTMLElement>('[data-scene="opening"], [data-scene="build-path"], [data-scene="routes"], [data-scene="mcp"], [data-scene="catalog"], [data-scene="close"]'))]
  watched.forEach((element) => {
    if (element) observer.observe(element)
  })

  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    pointerX = (event.clientX / Math.max(width, 1)) * 2 - 1
    pointerY = (event.clientY / Math.max(height, 1)) * 2 - 1
  }
  const onContextLost = (event: Event) => {
    event.preventDefault()
    lost = true
    announced = false
    sync()
    hooks.onLost()
  }
  const onContextRestored = () => {
    lost = false
    intro = 0
    sync()
  }

  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onPointer, { passive: true })
  document.addEventListener('visibilitychange', sync)
  canvas.addEventListener('webglcontextlost', onContextLost)
  canvas.addEventListener('webglcontextrestored', onContextRestored)
  // The file-name decals are drawn with the page's mono face; redraw once it has loaded.
  let disposed = false
  document.fonts?.ready.then(() => {
    if (disposed) return
    slabWidth = 0
    buildSlabs()
  })

  return {
    dispose() {
      disposed = true
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', sync)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      if (ticking) clock.remove(frame)
      ticking = false
      disposeSlabs()
      kit.geometries.forEach((geometry) => geometry.dispose())
      ;[triangle, fieldMaterial, compositeMaterial, fieldTarget, slabMaterial, bodyMaterial, accentMaterial].forEach((item) => item.dispose())
      renderer.dispose()
      // Hand the GPU context back now instead of waiting for garbage collection.
      renderer.forceContextLoss()
    },
  }
}
