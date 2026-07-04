// ─────────────────────────────────────────────────────────────────────────────
// js/sections/numbers.js — Section 04 (Numbers / استعراض القوة)
//
// Four stats that count up from zero the first time the section enters the
// viewport (~1.8s, eased, staggered). Numerals follow the locale: Arabic-Indic
// (٠١٢٣) in Arabic, Western in English. Years-active is computed from 2021;
// the other figures are placeholders until Baraa supplies the real ones.
// ─────────────────────────────────────────────────────────────────────────────

import { t, getLocale, onLocaleChange } from '../i18n.js';

const START_YEAR = 2021;

const STATS = [
  {
    key: 'years',
    value: () => Math.max(new Date().getFullYear() - START_YEAR, 1),
    suffix: '',
  },
  // TODO(baraa): placeholder — replace with the real production count
  { key: 'productions', value: () => 40, suffix: '+' },
  // TODO(baraa): placeholder — replace with the real on-set hours figure
  { key: 'hours', value: () => 5000, suffix: '+' },
  // TODO(baraa): placeholder — replace with the real client/entity count
  { key: 'clients', value: () => 12, suffix: '+' },
];

const DURATION = 1800;   // ms per count-up
const STAGGER = 120;     // ms between stats starting

function easeOutExpo(p) {
  return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
}

function formatNumber(n, locale) {
  return n.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US');
}

export function initNumbers() {
  const section = document.getElementById('numbers');
  if (!section) return;

  const grid = section.querySelector('.numbers-grid');
  if (!grid) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let played = false;

  const rendered = STATS.map((stat, i) => {
    const item = document.createElement('div');
    item.className = 'stat';
    item.style.transitionDelay = `${i * 0.1}s`;
    item.innerHTML = `
      <div class="stat-value" dir="ltr">
        <span class="stat-num">${formatNumber(0, getLocale())}</span><span class="stat-suffix">${stat.suffix}</span>
      </div>
      <div class="stat-label">${t(`numbers.stats.${stat.key}`)}</div>
    `;
    grid.appendChild(item);
    return {
      stat,
      num: item.querySelector('.stat-num'),
      label: item.querySelector('.stat-label'),
      shown: 0, // last value written, so locale switches re-render faithfully
    };
  });

  function countUp() {
    rendered.forEach((r, i) => {
      const target = r.stat.value();
      const begin = performance.now() + i * STAGGER;

      function tick(now) {
        const p = Math.min(Math.max((now - begin) / DURATION, 0), 1);
        const v = Math.round(easeOutExpo(p) * target);
        if (v !== r.shown) {
          r.shown = v;
          r.num.textContent = formatNumber(v, getLocale());
        }
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function showFinal() {
    rendered.forEach((r) => {
      r.shown = r.stat.value();
      r.num.textContent = formatNumber(r.shown, getLocale());
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        section.classList.add('is-visible');
        if (!played) {
          played = true;
          if (reduceMotion) {
            showFinal();
          } else {
            countUp();
          }
        }
        io.disconnect();
      });
    },
    { threshold: 0.35 }
  );
  io.observe(section);

  // Locale change: re-render labels and the current value in the new numerals
  onLocaleChange((locale) => {
    rendered.forEach((r) => {
      r.label.textContent = t(`numbers.stats.${r.stat.key}`);
      r.num.textContent = formatNumber(r.shown, locale);
    });
  });
}
