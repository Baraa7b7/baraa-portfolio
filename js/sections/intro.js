// ─────────────────────────────────────────────────────────────────────────────
// js/sections/intro.js — Section 01 sequence
//
// Timeline:
//   0.0s    Pure black
//   1.2s    Lamp on — brightness surge (0.36s CSS animation)
//   1.56s   Push-in — scale 1.0 → 1.03 over 1.0s, easeOutQuart
//   2.56s   Shake — dual-layer lerp-smoothed tremor (1.5s envelope)
//   4.06s   Hard stop → breathing loop starts (infinite rAF sin-wave)
//   4.2s    intro:complete dispatched
// ─────────────────────────────────────────────────────────────────────────────

import { getLocale, onLocaleChange } from '../i18n.js';

// Locale-specific intro backgrounds; the device's pair is preloaded from
// index.html so the swap during a language switch never shows a loading
// flash. The <picture> in index.html picks desktop vs mobile — JS only
// swaps the locale on both sources.
const INTRO_IMAGES = {
  ar: {
    desktop: 'images/intro/intro-bg-ar.webp',
    mobile: 'images/intro/intro-bg-ar-mobile.webp',
  },
  en: {
    desktop: 'images/intro/intro-bg-en.webp',
    mobile: 'images/intro/intro-bg-en-mobile.webp',
  },
};

// ── Easing functions ──────────────────────────────────────────────────────

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function sinEnvelope(elapsed, duration) {
  return Math.sin(Math.PI * elapsed / duration);
}

function cubicEaseInOut(p) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

// ── Helpers ───────────────────────────────────────────────────────────────

function rand(scale) {
  const v = (Math.random() - 0.5) * 2 * scale;
  const min = scale * 0.25;
  return v >= 0 ? Math.max(v, min) : Math.min(v, -min);
}

function interpolateAnchors(anchors, t) {
  for (let i = 0; i < anchors.length - 1; i++) {
    const [t0, x0, y0] = anchors[i];
    const [t1, x1, y1] = anchors[i + 1];
    if (t >= t0 && t <= t1) {
      const p = cubicEaseInOut((t - t0) / (t1 - t0));
      return [x0 + (x1 - x0) * p, y0 + (y1 - y0) * p];
    }
  }
  return [0, 0];
}

function setTransform(frame, dx, dy, scale) {
  frame.style.transform =
    `translate(calc(-50% + ${dx.toFixed(3)}px), calc(-50% + ${dy.toFixed(3)}px)) scale(${scale.toFixed(4)})`;
}

// ── Phase 1: Push-in ──────────────────────────────────────────────────────

function runPushIn(frame, { onComplete } = {}) {
  const DURATION   = 1000;
  const FROM_SCALE = 1.0;
  const TO_SCALE   = 1.03;
  const start      = performance.now();

  function tick(now) {
    const t     = Math.min((now - start) / DURATION, 1);
    const scale = FROM_SCALE + (TO_SCALE - FROM_SCALE) * easeOutQuart(t);
    setTransform(frame, 0, 0, scale);
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      if (onComplete) onComplete();
    }
  }
  requestAnimationFrame(tick);
}

// ── Phase 2: Shake ────────────────────────────────────────────────────────

function runShake(frame, baseScale, { onComplete } = {}) {
  const DURATION        = 1500;
  const MICRO_PEAK      = 1.5;
  const DRIFT_PEAK      = 4.0;
  const TARGET_INTERVAL = 175;
  const LERP            = 0.14;

  const numMid = Math.random() < 0.5 ? 1 : 2;
  const mids   = [];
  for (let i = 0; i < numMid; i++) {
    mids.push([350 + Math.random() * 750, rand(DRIFT_PEAK), rand(DRIFT_PEAK)]);
  }
  mids.sort((a, b) => a[0] - b[0]);
  const driftAnchors = [[0, 0, 0], ...mids, [DURATION, 0, 0]];

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let lastTargetChange = -Infinity;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    if (elapsed >= DURATION) {
      setTransform(frame, 0, 0, baseScale);
      if (onComplete) onComplete();
      return;
    }
    const env = sinEnvelope(elapsed, DURATION);
    if (elapsed - lastTargetChange >= TARGET_INTERVAL) {
      targetX = rand(MICRO_PEAK) * env;
      targetY = rand(MICRO_PEAK) * env;
      lastTargetChange = elapsed;
    }
    currentX += (targetX - currentX) * LERP;
    currentY += (targetY - currentY) * LERP;
    const [driftX, driftY] = interpolateAnchors(driftAnchors, elapsed);
    setTransform(frame, currentX + driftX, currentY + driftY, baseScale);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ── Phase 3: Breathing ────────────────────────────────────────────────────
//
// Primary:   Vertical rise/fall via translateY, amplitude ±5px, 4.5s/cycle.
//            sin() gives natural ease-in-out (slow at peaks, faster mid-cycle).
// Secondary: Horizontal sway via translateX, amplitude ±1.5px.
//            Phase-offset by 0.3π so it's loosely synced but not symmetric.
// Scale:     Stays fixed at baseScale (1.03) — no size pulse.
//            A barely-perceptible ±0.001 scale flutter is added as a third
//            layer only to prevent the frame feeling perfectly frozen.
//
// Runs indefinitely via rAF — no timeout, no CSS animation.

function runBreathing(frame, baseScale) {
  const Y_AMP    = 5;           // px vertical amplitude
  const X_AMP    = 1.5;         // px horizontal amplitude
  const CYCLE    = 4500;        // ms per full breath cycle
  const X_PHASE  = Math.PI * 0.3; // horizontal phase offset (loosely out-of-sync)
  const S_AMP    = 0.001;       // barely-there scale flutter (removed if zero)

  const start = performance.now();

  function tick(now) {
    const t     = now - start;
    const angle = (2 * Math.PI * t) / CYCLE;

    // Primary: belly-breath vertical sway
    const dy = -Math.sin(angle) * Y_AMP;           // negative = up on first inhale

    // Secondary: loose horizontal sway
    const dx = Math.sin(angle + X_PHASE) * X_AMP;

    // Tertiary: micro scale flutter (barely 0.1% range)
    const scale = baseScale + Math.sin(angle * 0.5) * S_AMP;

    frame.style.transform =
      `translate(calc(-50% + ${dx.toFixed(3)}px), calc(-50% + ${dy.toFixed(3)}px)) scale(${scale.toFixed(4)})`;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ── Main init ─────────────────────────────────────────────────────────────

export function initIntro() {
  const section = document.getElementById('intro');
  if (!section) return;

  const black = section.querySelector('.intro-black');
  const frame = section.querySelector('.intro-frame');
  if (!black || !frame) return;

  // Locale-driven background. The swap fires at the midpoint of the language
  // toggle's cross-fade (lang-toggle.css fades .intro-img alongside the text),
  // so the new image appears with the same subtle dissolve. Desktop/mobile
  // routing is the <picture>'s job — the browser re-evaluates it on resize.
  const img = section.querySelector('.intro-img');
  const source = section.querySelector('.intro-source');
  if (img) {
    const setLocaleImages = (locale) => {
      const images = INTRO_IMAGES[locale];
      if (!images) return;
      if (img.getAttribute('src') !== images.desktop) img.setAttribute('src', images.desktop);
      if (source && source.getAttribute('srcset') !== images.mobile) {
        source.setAttribute('srcset', images.mobile);
      }
    };
    setLocaleImages(getLocale());
    onLocaleChange(setLocaleImages);
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    black.classList.add('is-lifted');
    // Still image at push-in scale, no motion
    frame.style.transform = `translate(-50%, -50%) scale(1.03)`;
    return;
  }

  // 1.2s: lamp on
  setTimeout(() => {
    black.classList.add('is-lifted');
    frame.classList.add('is-lamp-on');
  }, 1200);

  // 1.56s: push-in starts
  setTimeout(() => {
    frame.classList.remove('is-lamp-on');

    runPushIn(frame, {
      onComplete() {
        // 2.56s: shake starts at scale(1.03)
        runShake(frame, 1.03, {
          onComplete() {
            // 4.06s: breathing loop starts (infinite)
            frame.classList.add('is-breathing'); // sets filter:brightness(1)
            runBreathing(frame, 1.03);

            setTimeout(() => {
              section.dispatchEvent(new CustomEvent('intro:complete', { bubbles: true }));
            }, 140);
          },
        });
      },
    });
  }, 1560);
}
