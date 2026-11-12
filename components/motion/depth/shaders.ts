/**
 * GLSL for the signal field. Written for this page; no third-party shader code.
 *
 * three.js compiles a ShaderMaterial as GLSL ES 3.00 and maps gl_FragColor,
 * attribute, varying and texture2D for us (node_modules/three/src/renderers/webgl/WebGLProgram.js),
 * so the sources below use those names.
 *
 * Pass 1 (FIELD_FRAGMENT) renders slow domain-warped value noise into a
 * half-resolution target as three light masses: r emerald, g cyan, b gold.
 * Pass 2 (COMPOSITE_FRAGMENT) tints them with the brand palette over obsidian,
 * per on-screen region, with a feathered edge and a dither against banding.
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
uniform float uScroll;    // css px, already scaled for parallax

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

void main() {
  vec2 px = vUv * uResolution;
  px.y -= uScroll;
  // Wide, slow structures: about one and a half cells across a 900px tall viewport.
  vec2 p = px / 760.0;
  p.x *= 0.72;
  float t = uTime;

  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.55)), fbm(p + vec2(5.2, 1.3) - t * 0.35));
  vec2 r = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2) + t * 0.4), fbm(p + 3.2 * q + vec2(8.3, 2.8) - t * 0.3));
  float f = fbm(p + 3.0 * r);

  // Thin bright seams where the warped field folds: light inside smoke, not a flat wash.
  float smoke = smoothstep(0.18, 0.92, f);
  smoke *= smoke;
  float seam = pow(1.0 - abs(2.0 * f - 1.0), 6.0);
  float emerald = smoke * (0.3 + 0.7 * smoothstep(0.2, 0.8, r.x)) + 0.4 * seam * r.x;
  float cyan = smoothstep(0.38, 0.92, q.y) * smoke + 0.3 * seam * q.x;
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
uniform vec2 uQuiet;     // x: css px where the quiet (text) side ends, y: how far light is held back there

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

void main() {
  vec2 css = vec2(gl_FragCoord.x / uDpr, uViewport.y - gl_FragCoord.y / uDpr);
  float fade = edge(css.x - uRect.x, uFeather.x) * edge(css.y - uRect.y, uFeather.y)
             * edge(uRect.z - css.x, uFeather.z) * edge(uRect.w - css.y, uFeather.w);

  vec3 mass = texture2D(uField, vUv).rgb;
  // Text sits on the quiet side: the light is held back there so copy keeps its contrast.
  float quiet = mix(1.0 - uQuiet.y, 1.0, smoothstep(uQuiet.x - 140.0, uQuiet.x + 260.0, css.x));
  float level = uLevel * quiet;

  vec3 light = EMERALD * mass.r * 0.5 + CYAN * mass.g * 0.36 + GOLD * mass.b * (1.0 - mass.r) * 0.3 * uGold;
  vec3 color = OBSIDIAN + light * level;

  // Triangular dither, one 8-bit step wide: dark gradients band badly without it.
  float d = (hash(gl_FragCoord.xy) + hash(gl_FragCoord.xy + 17.0) - 1.0) / 255.0;
  color += d;

  float alpha = fade * uCover;
  gl_FragColor = vec4(color * alpha, alpha);
}
`
