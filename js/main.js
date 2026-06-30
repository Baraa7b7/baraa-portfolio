// ─────────────────────────────────────────────────────────────────────────────
// main.js — Section 01 (Entry / Cold Open) sequence.
// Vanilla JS only — no GSAP yet, CSS animations drive the sequence.
// Remaining sections built after Section 01 is approved.
// ─────────────────────────────────────────────────────────────────────────────

import { IDENTITY } from './content.js';

const entry = document.getElementById('entry');
const scrollCue = document.getElementById('scrollCue');
const tagline = document.getElementById('entryTagline');

tagline.textContent = IDENTITY.tagline;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let scrollUnlocked = prefersReducedMotion;

function lockScroll() {
  if (prefersReducedMotion) return;
  document.body.style.overflow = 'hidden';
}

function unlockScroll() {
  scrollUnlocked = true;
  document.body.style.overflow = '';
}

function blockScrollWhileLocked(e) {
  if (!scrollUnlocked) e.preventDefault();
}

function runSequence() {
  if (prefersReducedMotion) {
    entry.classList.add('is-lit', 'is-named', 'is-tagline', 'is-unlocked');
    return;
  }

  lockScroll();
  window.addEventListener('wheel', blockScrollWhileLocked, { passive: false });
  window.addEventListener('touchmove', blockScrollWhileLocked, { passive: false });

  // 2s silence on full black, then smoke + headlight sweep begin together
  setTimeout(() => {
    entry.classList.add('is-lit', 'is-sweeping');
  }, 2000);

  // Name revealed as the headlight passes over it (~mid-sweep)
  setTimeout(() => {
    entry.classList.add('is-named');
  }, 3400);

  // Tagline fades in after the light has exited
  setTimeout(() => {
    entry.classList.add('is-tagline');
  }, 5200);

  // Scroll unlocks once the sequence settles
  setTimeout(() => {
    entry.classList.add('is-unlocked');
    unlockScroll();
    window.removeEventListener('wheel', blockScrollWhileLocked);
    window.removeEventListener('touchmove', blockScrollWhileLocked);
  }, 6200);
}

runSequence();

scrollCue.addEventListener('click', () => {
  if (!scrollUnlocked) return;
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
});
