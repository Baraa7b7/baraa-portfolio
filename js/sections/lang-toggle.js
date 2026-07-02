// ─────────────────────────────────────────────────────────────────────────────
// js/sections/lang-toggle.js — AR | EN switcher
//
// Fades section content out (240ms), swaps locale + document direction at the
// midpoint, fades back in. The intro section is image-only and excluded from
// the fade so its animation is never touched.
// ─────────────────────────────────────────────────────────────────────────────

import { getLocale, setLocale, t } from '../i18n.js';

const FADE_MS = 240;

export function initLangToggle() {
  const toggle = document.querySelector('.lang-toggle');
  if (!toggle) return;

  const buttons = toggle.querySelectorAll('button[data-lang]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let switching = false;

  function sync() {
    toggle.setAttribute('aria-label', t('langToggle.ariaLabel'));
    buttons.forEach((btn) => {
      const active = btn.dataset.lang === getLocale();
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.lang;
      if (next === getLocale() || switching) return;

      if (reduceMotion) {
        setLocale(next);
        sync();
        return;
      }

      switching = true;
      document.body.classList.add('is-lang-switching');

      setTimeout(() => {
        setLocale(next);
        sync();
        // Two frames so the new text paints while still transparent
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.body.classList.remove('is-lang-switching');
            switching = false;
          });
        });
      }, FADE_MS);
    });
  });

  sync();
}
