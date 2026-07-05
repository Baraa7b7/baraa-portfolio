// ─────────────────────────────────────────────────────────────────────────────
// js/sections/about.js — Section 02 (About)
//
// Reveal is GSAP-owned: ScrollTrigger fires at 25% visibility, the heading
// splits into words (SplitType) with a 0.04s stagger, the rest fades up.
// The CSS is-visible path stays as the no-GSAP / reduced-motion fallback.
// ─────────────────────────────────────────────────────────────────────────────

import { onLocaleChange, t } from '../i18n.js';

export function initAbout() {
  const section = document.getElementById('about');
  if (!section) return;

  const label = section.querySelector('.about-label');
  const heading = section.querySelector('.about-heading');
  const body = section.querySelector('.about-body');
  const credits = section.querySelector('.about-credits');
  const visual = section.querySelector('.about-visual');
  const portrait = section.querySelector('.about-portrait-wrap');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = window.gsap && window.ScrollTrigger;

  if (reduce || !hasGsap) {
    // Fallback: the original CSS transition reveal
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
  } else {
    // GSAP owns the reveal — neutralize the CSS transition path first
    [label, heading, body, credits, visual].forEach((el) => {
      if (el) el.style.transition = 'none';
    });
    section.classList.add('is-visible');

    // Heading — word split; rebuilt on locale change because applyStatic()
    // rewrites the textContent and destroys the split spans
    let split = null;
    let headingTween = null;

    function buildHeadingReveal() {
      if (headingTween) {
        if (headingTween.scrollTrigger) headingTween.scrollTrigger.kill();
        headingTween.kill();
        headingTween = null;
      }
      if (split) {
        split.revert();
        split = null;
      }
      if (!window.SplitType || !heading) return;

      // revert() restores the HTML captured at the previous split — which is
      // the previous locale's text. Re-apply the current translation on top.
      heading.textContent = t('about.heading');
      split = new SplitType(heading, { types: 'words' });
      headingTween = gsap.from(split.words, {
        opacity: 0,
        y: 26,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.04,
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
      });
    }

    buildHeadingReveal();
    onLocaleChange(() => setTimeout(buildHeadingReveal, 0));

    // Everything else — the portrait wrap animates instead of .about-visual,
    // which the parallax below owns via inline transforms
    gsap.from([label, body, credits, portrait].filter(Boolean), {
      opacity: 0,
      y: 26,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: section, start: 'top 75%', once: true },
    });
  }

  // Subtle parallax: text drifts up, image drifts down at different rates
  if (!reduce) {
    const textCol = section.querySelector('.about-text');
    const visualCol = section.querySelector('.about-visual');

    function onScroll() {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 when section top hits viewport bottom, 1 when section bottom exits top
      const progress = 1 - (rect.bottom / (vh + rect.height));
      if (progress < 0 || progress > 1) return;

      const centered = (progress - 0.5) * 2; // -1..1
      if (textCol) textCol.style.transform = `translateY(${centered * -18}px)`;
      if (visualCol) visualCol.style.transform = `translateY(${centered * 12}px)`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }
}
