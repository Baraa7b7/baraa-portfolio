// ─────────────────────────────────────────────────────────────────────────────
// js/smooth.js — Lenis smooth scroll wired into GSAP ScrollTrigger
//
// Registers ScrollTrigger, then drives Lenis from the GSAP ticker so both
// share one clock. Reduced motion (or a blocked CDN) → native scroll only.
// ─────────────────────────────────────────────────────────────────────────────

let lenis = null;

export function getLenis() {
  return lenis;
}

export function initSmooth() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.Lenis) return;

  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
