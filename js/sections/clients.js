// ─────────────────────────────────────────────────────────────────────────────
// js/sections/clients.js — Section 05 (Clients)
//
// Continuous monochrome logo marquee. Two identical groups inside one track
// make the CSS loop seamless (the second is aria-hidden). Drift direction
// follows reading direction via CSS; duration scales with the logo count.
// Reveal is GSAP-owned (ScrollTrigger at 25% visibility); the CSS is-visible
// path stays as the no-GSAP / reduced-motion fallback.
// ─────────────────────────────────────────────────────────────────────────────

import { CLIENTS } from '../content.js';

const SECONDS_PER_LOGO = 4.4;

function buildGroup(hidden) {
  const group = document.createElement('div');
  group.className = 'clients-group';
  if (hidden) group.setAttribute('aria-hidden', 'true');

  CLIENTS.forEach((client) => {
    const item = document.createElement('div');
    item.className = 'client-logo';
    item.innerHTML = `
      <img
        src="${client.logo}"
        alt="${hidden ? '' : client.name}"
        loading="lazy"
        decoding="async"
        title="${client.name}"
      >
    `;
    group.appendChild(item);
  });

  return group;
}

export function initClients() {
  const section = document.getElementById('clients');
  if (!section) return;

  const track = section.querySelector('.clients-track');
  if (!track) return;

  track.style.setProperty('--marquee-duration', `${(CLIENTS.length * SECONDS_PER_LOGO).toFixed(1)}s`);
  track.appendChild(buildGroup(false));
  track.appendChild(buildGroup(true));

  const header = section.querySelector('.clients-header');
  const marquee = section.querySelector('.clients-marquee');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = window.gsap && window.ScrollTrigger;

  if (reduce || !hasGsap) {
    if (hasGsap) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: () => section.classList.add('is-visible'),
      });
    } else {
      section.classList.add('is-visible');
    }
    return;
  }

  // GSAP owns the reveal — neutralize the CSS transition path first
  [header, marquee].forEach((el) => {
    if (el) el.style.transition = 'none';
  });
  section.classList.add('is-visible');

  if (header) {
    gsap.from(header, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 75%', once: true },
    });
  }

  if (marquee) {
    gsap.from(marquee, {
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 75%', once: true },
    });
  }
}
