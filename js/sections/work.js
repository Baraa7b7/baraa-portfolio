// ─────────────────────────────────────────────────────────────────────────────
// js/sections/work.js — Section 03 (Work)
//
// Pinned horizontal gallery of large cinematic frames, driven by GSAP
// ScrollTrigger (pin + scrub). Direction follows reading direction
// (AR right→left, EN left→right) and rebuilds live on the language toggle.
// Each card image counter-moves slightly against the track for depth.
//
// Mobile / prefers-reduced-motion: no pinning — native scroll-snap carousel
// (see section-3-work.css); progress + parallax still driven from here.
// ─────────────────────────────────────────────────────────────────────────────

import { WORKS } from '../content.js';
import { getLocale, onLocaleChange } from '../i18n.js';

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

function localizeDigits(value, locale) {
  const str = String(value);
  return locale === 'ar' ? str.replace(/\d/g, (d) => AR_DIGITS[+d]) : str;
}

function formatIndex(n, locale) {
  return localizeDigits(String(n).padStart(2, '0'), locale);
}

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

  // Render slides from content data
  WORKS.forEach((project, i) => {
    const locale = getLocale();

    const slide = document.createElement('div');
    slide.className = 'work-slide';

    const index = document.createElement('span');
    index.className = 'work-slide-index';
    index.setAttribute('aria-hidden', 'true');
    index.textContent = formatIndex(i + 1, locale);

    const card = document.createElement('article');
    card.className = 'work-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${project.title[locale]} — ${project.role[locale]}`);

    card.innerHTML = `
      <div class="work-card-media">
        <img
          class="work-card-img"
          src="${project.image}"
          alt="${project.title[locale]}"
          loading="lazy"
          decoding="async"
          width="1200"
          height="675"
        >
      </div>
      <div class="work-card-overlay" aria-hidden="true"></div>
      <div class="work-card-content">
        <h3 class="work-card-title">${project.title[locale]}</h3>
        <div class="work-card-meta">
          <span class="work-card-meta-item">${project.client}</span>
          <span class="work-card-meta-dot" aria-hidden="true">·</span>
          <span class="work-card-meta-item work-card-meta-role">${project.role[locale]}</span>
          <span class="work-card-meta-dot" aria-hidden="true">·</span>
          <span class="work-card-meta-item work-card-meta-year">${localizeDigits(project.year, locale)}</span>
        </div>
      </div>
    `;

    // Keyboard activation
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    slide.appendChild(index);
    slide.appendChild(card);
    track.appendChild(slide);

    rendered.push({
      slide,
      card,
      index,
      img: card.querySelector('.work-card-img'),
      project,
    });
  });

  // Swap card text when the locale changes
  onLocaleChange((locale) => {
    rendered.forEach(({ card, index, img, project }, i) => {
      card.setAttribute('aria-label', `${project.title[locale]} — ${project.role[locale]}`);
      index.textContent = formatIndex(i + 1, locale);
      img.alt = project.title[locale];
      card.querySelector('.work-card-title').textContent = project.title[locale];
      card.querySelector('.work-card-meta-role').textContent = project.role[locale];
      card.querySelector('.work-card-meta-year').textContent = localizeDigits(project.year, locale);
    });
  });

  // Reveal on scroll — observe the pinned frame, not the stretched section
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          section.classList.add('is-visible');
          revealObserver.disconnect();
        }
      });
    },
    { threshold: 0.15 }
  );
  revealObserver.observe(sticky);

  // ── Horizontal scroll engine — ScrollTrigger pin + scrub ───────────────

  const total = rendered.length;
  const mqMobile = window.matchMedia('(max-width: 768px)');
  const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isNative = () => mqMobile.matches || mqReduced.matches;
  const hasGsap = () => window.gsap && window.ScrollTrigger;

  const PARALLAX = 0.055; // image counter-shift as a fraction of center offset

  function setProgress(p) {
    const clamped = Math.min(Math.max(p, 0), 1);
    if (fill) fill.style.width = `${(clamped * 100).toFixed(2)}%`;
    if (counter && total > 0) {
      const locale = getLocale();
      const idx = total > 1 ? Math.round(clamped * (total - 1)) + 1 : 1;
      counter.textContent = `${formatIndex(idx, locale)} / ${formatIndex(total, locale)}`;
    }
  }

  // Subtle depth: each image counter-moves against the track direction,
  // proportional to how far its card sits from the viewport center.
  function applyParallax() {
    if (mqReduced.matches) return;
    const vw = window.innerWidth;
    rendered.forEach(({ card, img }) => {
      const r = card.getBoundingClientRect();
      if (r.right < -80 || r.left > vw + 80) return;
      const offset = r.left + r.width / 2 - vw / 2;
      img.style.transform = `translate3d(${(-offset * PARALLAX).toFixed(1)}px, 0, 0) scale(1.12)`;
    });
  }

  const maxShift = () => Math.max(track.offsetWidth - viewport.clientWidth, 0);

  let tween = null;

  function teardown() {
    if (!tween) return;
    if (tween.scrollTrigger) tween.scrollTrigger.kill(true);
    tween.kill();
    tween = null;
    gsap.set(track, { clearProps: 'x' });
  }

  function buildPinned() {
    teardown();
    // rtl: track overflows leftward, positive X reveals it; ltr: the mirror
    const sign = document.documentElement.dir === 'rtl' ? 1 : -1;
    // Undo any focus-induced scrolling of the hidden-overflow containers
    sticky.scrollLeft = 0;
    viewport.scrollLeft = 0;

    tween = gsap.to(track, {
      x: () => sign * maxShift(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${maxShift()}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          setProgress(self.progress);
          applyParallax();
        },
      },
    });

    setProgress(tween.scrollTrigger.progress);
    applyParallax();
  }

  function updateNative() {
    const range = viewport.scrollWidth - viewport.clientWidth;
    // scrollLeft is negative in rtl
    setProgress(range > 0 ? Math.abs(viewport.scrollLeft) / range : 0);
    applyParallax();
  }

  function setMode() {
    if (!hasGsap() || isNative()) {
      if (tween) teardown();
      updateNative();
    } else {
      buildPinned();
    }
    if (hasGsap()) ScrollTrigger.refresh();
  }

  viewport.addEventListener('scroll', updateNative, { passive: true });
  mqMobile.addEventListener('change', setMode);
  mqReduced.addEventListener('change', setMode);

  // dir flips with the language toggle — rebuild after the reflow
  onLocaleChange(() => setTimeout(setMode, 0));

  // Keyboard users: tabbing to a card drives the window scroll so the card
  // lands in view (the browser tries to scroll the clipped containers instead)
  track.addEventListener('focusin', (e) => {
    if (isNative() || !tween || !tween.scrollTrigger) return;
    sticky.scrollLeft = 0;
    viewport.scrollLeft = 0;
    const card = e.target.closest('.work-card');
    if (!card) return;
    const i = rendered.findIndex((r) => r.card === card);
    if (i < 0) return;
    const st = tween.scrollTrigger;
    const target = total > 1 ? st.start + (i / (total - 1)) * (st.end - st.start) : st.start;
    window.scrollTo({ top: target });
  });

  setMode();
}
