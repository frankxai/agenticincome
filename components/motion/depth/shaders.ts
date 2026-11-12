/**
 * GLSL for the signal field. Written for this page; no third-party shader code.
 *
 * three.js compiles a ShaderMaterial as GLSL ES 3.00 and maps gl_FragColor,
 * attribute, varying and texture2D for us (node_modules/three/src/renderers/webgl/WebGLProgram.js),
 * so the sources below use those names.
 *
 * Pass 1 (FIELD_FRAGMENT) renders two layers of slow domain-warped value noise
 * into a half-resolution target: a far layer of broad, soft masses (g, cyan)
 * and a near layer of long ribbons with bright folds (r, emerald), plus a gold
 * mass (b). The two layers drift at different speeds and take scroll and the
 * pointer at different rates, which is what gives the field its depth.
 * Pass 2 (COMPOSITE_FRAGMENT) tints them with the brand palette over obsidian,
 * per on-screen region. It holds the light back under text (uHold), gathers it
 * toward a point (uGather), carries the one-shot wavefront (uWave) and draws
 * the thin gold edge of the close (uGate), with a dither against banding.
 */

export const FULLSCREEN_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const FIELD_FRAGMENT = /* glsl */ `
varying vec2 vUv;
uniform vec2 uResolution; // css px
uniform float uTime;
uniform float uScroll;    // css px scrolled
uniform vec2 uLook;       // pointer, -1 to 1

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * noise(p);
    p = mat2(1.6, 1.2, -1.2, 1.6) * p + 7.3;
    amp *= 0.5;
  }
  return sum;
}

// Two octaves: the far layer is out of focus, so it carries no fine detail.
float soft(vec2 p) {
  return 0.62 * noise(p) + 0.38 * noise(mat2(1.6, 1.2, -1.2, 1.6) * p + 7.3);
}

void main() {
  vec2 px = vUv * uResolution;
  px.y = uResolution.y - px.y; // css orientation: y grows downward
  float t = uTime;

  // Far layer. Broad masses, about one across the viewport, drifting slowly up and to the left.
  // It takes a quarter of the scroll and almost none of the pointer, so it sits deep.
  vec2 pf = (px + vec2(0.0, uScroll * 0.25) - uLook * 6.0) / 1040.0;
  pf += vec2(0.42, 0.2) * t;
  vec2 wf = vec2(soft(pf + vec2(0.0, t * 0.3)), soft(pf + vec2(5.2, 1.3) - t * 0.22));
  float far = soft(pf * 1.3 + 2.2 * wf);
  float farMass = smoothstep(0.36, 0.78, far);
  farMass *= farMass;

  // Near layer. Long ribbons running lower left to upper right, moving about three times as fast,
  // taking most of the scroll and more of the pointer.
  vec2 pn = px + vec2(0.0, uScroll * 0.62) - uLook * 22.0;
  pn = mat2(0.829, -0.559, 0.559, 0.829) * pn / 600.0;
  pn.x *= 0.46;
  pn += vec2(1.25, 0.0) * t;
  vec2 q = vec2(fbm(pn + vec2(0.0, t * 0.5)), fbm(pn + vec2(5.2, 1.3) - t * 0.35));
  vec2 r = vec2(fbm(pn + 2.6 * q + vec2(1.7, 9.2) + t * 0.3), fbm(pn + 2.6 * q + vec2(8.3, 2.8) - t * 0.25));
  float f = fbm(pn + 2.8 * r);
  float body = smoothstep(0.3, 0.82, f);
  body *= body;
  // Bright folds where the warped field turns over: the light has edges, it is not a wash.
  float fold = pow(1.0 - abs(2.0 * f - 1.0), 5.0) * smoothstep(0.28, 0.6, r.x);

  float emerald = body * (0.3 + 0.7 * smoothstep(0.25, 0.75, r.x)) + 0.85 * fold + 0.06 * farMass;
  float cyan = 0.8 * farMass + 0.3 * fold * smoothstep(0.4, 0.7, q.y) + 0.15 * body * smoothstep(0.5, 0.8, q.y);
  float gold = smoothstep(0.5, 0.86, r.y) * smoothstep(0.3, 0.7, f);

  gl_FragColor = vec4(clamp(vec3(emerald, cyan, gold), 0.0, 1.0), 1.0);
}
`

export const COMPOSITE_FRAGMENT = /* glsl */ `
varying vec2 vUv;
uniform sampler2D uField;
uniform vec2 uViewport;  // css px
uniform float uDpr;
uniform vec4 uRect;      // region in css px: left, top, right, bottom
uniform vec4 uFeather;   // fade distance in css px: left, top, right, bottom (0 = hard edge)
uniform float uLevel;    // overall brightness of the light
uniform float uGold;     // gold trace weight
uniform float uCover;    // how much of the page behind is replaced by obsidian
uniform vec4 uHold[4];   // boxes of text in css px (left, top, right, bottom) where the light is held back
uniform vec4 uHoldAmount; // how far it is held back in each box, 0 to 1
uniform vec4 uHoldSoft;  // how far outside each box the hold fades out, css px
uniform vec4 uHoldRound; // corner radius of each box, css px
uniform vec4 uGather;    // x, y in css px, radius, amount: the light collects around this point
uniform vec4 uWave;      // x, y in css px, radius, strength: the one-shot wavefront
uniform vec4 uGate;      // x0, x1, y in css px, strength: the thin gold edge

const vec3 OBSIDIAN = vec3(5.0, 6.0, 10.0) / 255.0;
const vec3 EMERALD = vec3(16.0, 185.0, 129.0) / 255.0;
const vec3 CYAN = vec3(6.0, 182.0, 212.0) / 255.0;
const vec3 GOLD = vec3(245.0, 158.0, 11.0) / 255.0;

float hash(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}

float edge(float distance, float feather) {
  return feather <= 0.0 ? step(0.0, distance) : smoothstep(0.0, feather, distance);
}

// 1 inside the box, falling to 0 over "reach" px outside it.
float inside(vec2 p, vec4 box, float reach, float radius) {
  vec2 centre = (box.xy + box.zw) * 0.5;
  vec2 d = abs(p - centre) - (box.zw - box.xy) * 0.5 + radius;
  float outside = max(length(max(d, 0.0)) - radius, 0.0);
  return 1.0 - smoothstep(0.0, max(reach, 1.0), outside);
}

void main() {
  vec2 css = vec2(gl_FragCoord.x / uDpr, uViewport.y - gl_FragCoord.y / uDpr);
  float fade = edge(css.x - uRect.x, uFeather.x) * edge(css.y - uRect.y, uFeather.y)
             * edge(uRect.z - css.x, uFeather.z) * edge(uRect.w - css.y, uFeather.w);

  // Gathering: the field is sampled a little further out from the gather point, and less so as the
  // amount rises, so the structure is seen to draw inward as the scene arrives.
  vec2 away = css - uGather.xy;
  float reach = length(away) / max(uGather.z, 1.0);
  vec2 uv = vUv + (away / uViewport) * vec2(1.0, -1.0) * 0.22 * (1.0 - uGather.w) * step(0.5, uGather.z);
  vec3 mass = texture2D(uField, clamp(uv, 0.0, 1.0)).rgb;

  // Text sits in the held boxes: the light falls to near black there so copy keeps its contrast.
  float hold = 1.0;
  for (int i = 0; i < 4; i++) {
    hold *= 1.0 - uHoldAmount[i] * inside(css, uHold[i], uHoldSoft[i], uHoldRound[i]);
  }
  float pool = uGather.z > 0.5 ? mix(1.0, 0.2 + 1.15 * exp(-reach * reach * 1.6), uGather.w) : 1.0;

  // The wavefront: a ring of light that leaves the terminal once, when the answer resolves.
  float ring = 0.0;
  if (uWave.w > 0.001) {
    float d = length(css - uWave.xy) - uWave.z;
    ring = uWave.w * (exp(-d * d / 5200.0) + 0.5 * exp(-d * d / 90000.0) * step(d, 0.0));
  }

  float level = uLevel * hold * pool;
  vec3 light = EMERALD * mass.r * 0.8 + CYAN * mass.g * 0.42 + GOLD * mass.b * (1.0 - mass.r) * 0.3 * uGold;
  light *= level;
  light += (EMERALD * 0.5 + CYAN * 0.3) * ring * hold * (0.45 + 0.55 * max(mass.r, mass.g));
  // Soft shoulder: the brightest folds roll off instead of clipping to a flat patch.
  light = 1.0 - exp(-light * 1.25);

  // The gold edge: one thin warm line with a faint glow under it, brightest at its middle.
  if (uGate.w > 0.001) {
    float along = smoothstep(uGate.x, mix(uGate.x, uGate.y, 0.3), css.x) * (1.0 - smoothstep(mix(uGate.x, uGate.y, 0.86), uGate.y, css.x));
    float dy = css.y - uGate.z;
    float line = exp(-dy * dy / 0.9) + 0.16 * exp(-dy * dy / 260.0) * step(0.0, dy);
    light += GOLD * line * along * uGate.w;
  }

  vec3 color = OBSIDIAN + light;

  // Triangular dither, one 8-bit step wide: dark gradients band badly without it.
  float d = (hash(gl_FragCoord.xy) + hash(gl_FragCoord.xy + 17.0) - 1.0) / 255.0;
  color += d;

  float alpha = fade * uCover;
  gl_FragColor = vec4(color * alpha, alpha);
}
`
