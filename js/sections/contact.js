import { CONTACT } from '../content.js';
import { t, onLocaleChange } from '../i18n.js';

// Thin-stroke icons, currentColor, consistent with the no-fill design language
const ICONS = {
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2.05 22l5.27-1.38a9.86 9.86 0 0 0 4.72 1.2c5.46 0 9.9-4.43 9.9-9.9 0-5.45-4.44-9.9-9.9-9.9Zm0 18.1c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.23 3.7 8.23 8.24 0 4.55-3.7 8.24-8.23 8.24Zm4.52-6.16c-.25-.13-1.47-.73-1.7-.81-.22-.08-.39-.12-.55.12-.17.25-.64.81-.78.97-.15.17-.29.19-.54.07-.25-.13-1.05-.39-2-1.23-.73-.66-1.23-1.47-1.37-1.72-.15-.25-.02-.38.1-.5.12-.12.25-.3.38-.44.12-.14.16-.25.24-.41.09-.17.05-.31-.02-.44-.06-.12-.55-1.33-.76-1.83-.2-.48-.4-.42-.55-.43h-.48c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.9 2.4 1.02 2.56.12.17 1.75 2.67 4.23 3.75.6.25 1.05.4 1.41.52.6.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.47-.3Z"/></svg>`,
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="14"/><path d="m3 7 9 6 9-6"/></svg>`,
  imdb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6" width="20" height="12" rx="2"/><text x="12" y="14.8" text-anchor="middle" fill="currentColor" stroke="none" font-size="6" font-family="inherit" font-weight="600" letter-spacing="0.4">IMDb</text></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="0.75" fill="currentColor" stroke="none"/></svg>`,
};

export function initContact() {
  const section = document.getElementById('contact');
  if (!section) return;

  const linksContainer = section.querySelector('.contact-links');
  const timecode = section.querySelector('.contact-timecode');
  const tagline = section.querySelector('.contact-tagline');

  // Tagline split reveal — GSAP owns it; rebuilt on locale change because
  // applyStatic() rewrites the textContent and destroys the split spans.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (tagline && !reduceMotion && window.gsap && window.ScrollTrigger && window.SplitType) {
    tagline.style.transition = 'none';
    tagline.style.opacity = '1';
    tagline.style.transform = 'none';

    let split = null;
    let tween = null;

    function buildTaglineReveal() {
      if (tween) {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
        tween = null;
      }
      if (split) {
        split.revert();
        split = null;
      }
      // revert() restores the HTML captured at the previous split — which is
      // the previous locale's text. Re-apply the current translation on top.
      tagline.textContent = t('contact.tagline');
      // Arabic is a connected script — per-character spans break letter
      // joining, so the AR locale splits on words instead of chars
      const types = document.documentElement.lang === 'ar' ? 'words' : 'chars';
      split = new SplitType(tagline, { types });
      tween = gsap.from(types === 'chars' ? split.chars : split.words, {
        opacity: 0,
        y: 12,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.02,
        scrollTrigger: { trigger: section, start: 'top 70%', once: true },
      });
    }

    buildTaglineReveal();
    onLocaleChange(() => setTimeout(buildTaglineReveal, 0));
  }

  // Build links from content — labels translate, values are universal data
  const items = [
    { key: 'whatsapp', href: CONTACT.whatsapp, text: CONTACT.whatsappDisplay, external: true },
    { key: 'email', href: `mailto:${CONTACT.email}`, text: CONTACT.email, external: false },
    { key: 'imdb', href: CONTACT.imdb, text: CONTACT.imdbDisplay, external: true },
    { key: 'instagram', href: CONTACT.instagram, text: CONTACT.instagramHandle, external: true },
  ];

  if (linksContainer) {
    items.forEach((item, i) => {
      const a = document.createElement('a');
      a.className = 'contact-link';
      a.href = item.href;
      a.style.transitionDelay = `${0.2 + i * 0.12}s`;
      if (item.external) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
      a.innerHTML = `
        <span class="contact-link-icon" aria-hidden="true">${ICONS[item.key]}</span>
        <span class="contact-link-label" data-key="${item.key}">${t(`contact.labels.${item.key}`)}</span>
        <span class="contact-link-text" dir="ltr">${item.text}</span>
      `;
      linksContainer.appendChild(a);
    });

    onLocaleChange(() => {
      linksContainer.querySelectorAll('.contact-link-label').forEach((el) => {
        el.textContent = t(`contact.labels.${el.dataset.key}`);
      });
    });
  }

  // Live timecode counter
  if (timecode) {
    const startTime = Date.now();
    function updateTimecode() {
      const elapsed = Date.now() - startTime;
      const h = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
      const m = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
      const f = Math.floor((elapsed % 1000) / (1000 / 24)).toString().padStart(2, '0');
      timecode.textContent = `${h}:${m}:${s}:${f}`;
    }

    // Only run timecode when visible
    let timecodeInterval = null;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            section.classList.add('is-visible');
            if (!timecodeInterval) {
              updateTimecode();
              timecodeInterval = setInterval(updateTimecode, 1000 / 24);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    io.observe(section);
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            section.classList.add('is-visible');
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    io.observe(section);
  }
}
