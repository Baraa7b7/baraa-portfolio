// ─────────────────────────────────────────────────────────────────────────────
// js/sections/work.js — Section 03 (Work)
//
// Pinned horizontal gallery. The section's height is stretched by the
// horizontal travel distance; while .work-sticky is pinned, vertical scroll
// progress maps 1:1 onto a translateX of the track — the visitor drives the
// dolly. Direction follows reading direction: AR (rtl) travels right→left,
// EN (ltr) travels left→right, and flips live with the language toggle.
//
// Mobile / prefers-reduced-motion: no pinning — the track is a native
// scroll-snap carousel (see section-3-work.css) and only the progress
// indicator is driven from here.
// ─────────────────────────────────────────────────────────────────────────────

import { WORKS } from '../content.js';
import { getLocale, onLocaleChange } from '../i18n.js';

export function initWork() {
  const section = document.getElementById('work');
  if (!section) return;

  const sticky = section.querySelector('.work-sticky');
  const viewport = section.querySelector('.work-track-viewport');
  const track = section.querySelector('.work-track');
  const counter = section.querySelector('.work-progress-counter');
  const fill = section.querySelector('.work-progress-fill');
  if (!sticky || !viewport || !track) return;

  const rendered = [];

  // Render cards from content data
  WORKS.forEach((project) => {
    const locale = getLocale();
    const card = document.createElement('article');
    card.className = 'work-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${project.title[locale]} — ${project.role[locale]}`);

    card.innerHTML = `
      <img
        class="work-card-img"
        src="${project.image}"
        alt="${project.title[locale]}"
        loading="lazy"
        decoding="async"
        width="800"
        height="500"
      >
      <div class="work-card-overlay" aria-hidden="true"></div>
      <div class="work-card-content">
        <div class="work-card-meta">${project.year}</div>
        <h3 class="work-card-title">${project.title[locale]}</h3>
        <div class="work-card-role">${project.role[locale]}</div>
      </div>
    `;

    // Keyboard activation
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    track.appendChild(card);
    rendered.push({ card, project });
  });

  // Swap card text when the locale changes
  onLocaleChange((locale) => {
    rendered.forEach(({ card, project }) => {
      card.setAttribute('aria-label', `${project.title[locale]} — ${project.role[locale]}`);
      card.querySelector('.work-card-img').alt = project.title[locale];
      card.querySelector('.work-card-title').textContent = project.title[locale];
      card.querySelector('.work-card-role').textContent = project.role[locale];
    });
  });

  // Reveal on scroll — observe the pinned frame, not the stretched section
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          section.classList.add('is-visible');
          io.disconnect();
        }
      });
    },
    { threshold: 0.15 }
  );

  io.observe(sticky);

  // ── Horizontal scroll engine ──────────────────────────────────────────

  const total = rendered.length;
  const mqMobile = window.matchMedia('(max-width: 768px)');
  const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isNative = () => mqMobile.matches || mqReduced.matches;

  let maxShift = 0;
  let ticking = false;

  const pad2 = (n) => String(n).padStart(2, '0');

  function setProgress(p) {
    const clamped = Math.min(Math.max(p, 0), 1);
    if (fill) fill.style.width = `${(clamped * 100).toFixed(2)}%`;
    if (counter && total > 0) {
      const idx = total > 1 ? Math.round(clamped * (total - 1)) + 1 : 1;
      counter.textContent = `${pad2(idx)} / ${pad2(total)}`;
    }
  }

  function updatePinned() {
    const range = section.offsetHeight - window.innerHeight;
    if (range <= 0 || maxShift <= 0) {
      track.style.transform = '';
      setProgress(0);
      return;
    }
    const progress = Math.min(Math.max(-section.getBoundingClientRect().top / range, 0), 1);
    // rtl: track overflows leftward, positive X reveals it; ltr: the mirror
    const sign = document.documentElement.dir === 'rtl' ? 1 : -1;
    track.style.transform = `translate3d(${(sign * progress * maxShift).toFixed(2)}px, 0, 0)`;
    setProgress(progress);
  }

  function updateNative() {
    const range = viewport.scrollWidth - viewport.clientWidth;
    // scrollLeft is negative in rtl
    setProgress(range > 0 ? Math.abs(viewport.scrollLeft) / range : 0);
  }

  function update() {
    if (isNative()) {
      updateNative();
    } else {
      updatePinned();
    }
  }

  function layout() {
    if (isNative()) {
      section.style.height = '';
      track.style.transform = '';
      maxShift = 0;
    } else {
      // Undo any focus-induced scrolling of the hidden-overflow containers
      sticky.scrollLeft = 0;
      viewport.scrollLeft = 0;
      maxShift = Math.max(track.offsetWidth - viewport.clientWidth, 0);
      section.style.height = `${window.innerHeight + maxShift}px`;
    }
    update();
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', layout);
  viewport.addEventListener('scroll', requestUpdate, { passive: true });

  mqMobile.addEventListener('change', layout);
  mqReduced.addEventListener('change', layout);

  // dir flips with the language toggle — remeasure after the reflow
  onLocaleChange(() => requestAnimationFrame(layout));

  // Keyboard users: tabbing to a card drives the window scroll so the card
  // lands in view (the browser tries to scroll the clipped containers instead)
  track.addEventListener('focusin', (e) => {
    if (isNative()) return;
    sticky.scrollLeft = 0;
    viewport.scrollLeft = 0;
    const card = e.target.closest('.work-card');
    if (!card) return;
    const i = rendered.findIndex((r) => r.card === card);
    if (i < 0) return;
    const range = section.offsetHeight - window.innerHeight;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const target = total > 1 ? (i / (total - 1)) * range : 0;
    window.scrollTo({ top: sectionTop + target });
  });

  layout();
}
