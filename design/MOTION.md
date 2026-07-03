# Agentic Income Motion System

## Motion Thesis

Motion should make compounding visible. It should show attention moving through comparison, recurring tools, owned audience, and direct products.

## Personality

- Precise.
- Quiet.
- Directional.
- Causal.
- Trust-building.

## Tokens

```text
duration.micro: 120ms
duration.fast: 180ms
duration.base: 260ms
duration.slow: 420ms
duration.signature: 900ms
stagger.tight: 28ms
stagger.base: 56ms
distance.micro: 3px
distance.base: 12px
distance.large: 32px
easing.standard: power3.out
easing.signature: power2.inOut
```

## Runtime

- CSS for hover, focus, and small state changes.
- GSAP for the signature flow trace and measured reveal choreography.
- No pinning, vortexes, spinning, or long parallax.

## Reduced Motion

When `prefers-reduced-motion` is active:

- Disable the flow trace animation.
- Disable scroll reveal choreography.
- Keep the static diagram, proof, and CTAs visible.
- Preserve all meaning without motion.

## QA

- Motion has a named job.
- Text remains stable and readable.
- No layout shift.
- Desktop and mobile both preserve the first-read hierarchy.
