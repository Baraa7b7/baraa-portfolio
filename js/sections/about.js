import { IDENTITY } from '../content.js';

export function initAbout() {
  const section = document.getElementById('about');
  if (!section) return;

  // Populate content from data
  const heading = section.querySelector('.about-heading');
  if (heading) heading.textContent = IDENTITY.role;

  // IntersectionObserver — trigger once when 30% visible
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          section.classList.add('is-visible');
          io.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );

  io.observe(section);

  // Subtle parallax: text drifts up, image drifts down at different rates
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
      if (visualCol) visualCol.style.transform = `translateY(${centered * 12}px) translateY(0px)`;
    }

    // Only attach during scroll, passive for perf
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}
