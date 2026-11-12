import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  TorusGeometry,
  type BufferGeometry,
  type Material,
} from 'three'

/**
 * The five build path instruments, one per step, built from primitive geometry
 * only: lens (audit), compass (architect), wrench (implement), check seal
 * (verify), key (human gate). They share two materials: a graphite body and one
 * emerald detail each, the same rule the SVG plates follow.
 *
 * Each instrument fits inside a sphere of radius about 1.2 around the origin.
 */

export type InstrumentKit = {
  groups: Group[]
  geometries: BufferGeometry[]
}

const HALF_PI = Math.PI / 2

export function buildInstruments(body: Material, accent: Material): InstrumentKit {
  const geometries: BufferGeometry[] = []
  const part = (
    parent: Group,
    geometry: BufferGeometry,
    material: Material,
    position: [number, number, number] = [0, 0, 0],
    rotation: [number, number, number] = [0, 0, 0],
  ) => {
    geometries.push(geometry)
    const mesh = new Mesh(geometry, material)
    mesh.position.set(...position)
    mesh.rotation.set(...rotation)
    parent.add(mesh)
    return mesh
  }

  /* 01 Audit: a lens. Ring, sight ring, handle. */
  const lens = new Group()
  part(lens, new TorusGeometry(0.62, 0.085, 16, 72), body, [-0.18, 0.2, 0])
  part(lens, new TorusGeometry(0.5, 0.022, 10, 72), accent, [-0.18, 0.2, 0])
  part(lens, new CylinderGeometry(0.075, 0.095, 0.86, 20), body, [0.57, -0.55, 0], [0, 0, Math.PI / 4])

  /* 02 Architect: a drawing compass. Hinge, grip, two tapered legs. */
  const compass = new Group()
  const spread = 0.27
  const leg = 0.86
  part(compass, new CylinderGeometry(0.115, 0.115, 0.15, 28), accent, [0, 0.72, 0], [HALF_PI, 0, 0])
  part(compass, new CylinderGeometry(0.055, 0.055, 0.34, 16), body, [0, 1.02, 0])
  for (const side of [-1, 1]) {
    part(
      compass,
      new CylinderGeometry(0.065, 0.018, leg * 2, 16),
      body,
      [side * Math.sin(spread) * leg, 0.72 - Math.cos(spread) * leg, 0],
      [0, 0, side * spread],
    )
  }

  /* 03 Implement: a wrench. Shaft, open jaw, ring end. */
  const wrench = new Group()
  const jawArc = 4.5
  part(wrench, new BoxGeometry(0.22, 1.34, 0.11), body)
  part(wrench, new TorusGeometry(0.3, 0.115, 14, 40, jawArc), body, [0, 0.9, 0], [0, 0, HALF_PI - (jawArc + Math.PI * 2) / 2])
  part(wrench, new TorusGeometry(0.21, 0.085, 14, 40), accent, [0, -0.86, 0])
  wrench.rotation.z = -0.6

  /* 04 Verify: a check seal. Two offset twelve-sided discs and a raised check. */
  const seal = new Group()
  part(seal, new CylinderGeometry(0.84, 0.84, 0.14, 12), body, [0, 0, 0], [HALF_PI, 0, 0])
  part(seal, new CylinderGeometry(0.84, 0.84, 0.14, 12), body, [0, 0, 0], [HALF_PI, Math.PI / 12, 0])
  part(seal, new CylinderGeometry(0.62, 0.62, 0.2, 48), body, [0, 0, 0], [HALF_PI, 0, 0])
  part(seal, new BoxGeometry(0.36, 0.115, 0.09), accent, [-0.2, -0.1, 0.12], [0, 0, -0.8])
  part(seal, new BoxGeometry(0.72, 0.115, 0.09), accent, [0.13, 0.04, 0.12], [0, 0, 0.87])

  /* 05 Human gate: a key. Bow, shaft, two teeth. */
  const key = new Group()
  part(key, new TorusGeometry(0.36, 0.105, 14, 48), body, [-0.72, 0, 0])
  part(key, new CylinderGeometry(0.078, 0.078, 1.32, 20), body, [0.3, 0, 0], [0, 0, HALF_PI])
  part(key, new BoxGeometry(0.11, 0.3, 0.11), accent, [0.82, -0.2, 0])
  part(key, new BoxGeometry(0.11, 0.22, 0.11), accent, [0.58, -0.16, 0])
  key.rotation.z = 0.35

  return { groups: [lens, compass, wrench, seal, key], geometries }
}
