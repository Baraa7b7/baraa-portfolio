import { WORKS } from '../content.js';
import { getLocale, onLocaleChange } from '../i18n.js';

export function initWork() {
  const section = document.getElementById('work');
  if (!section) return;

  const grid = section.querySelector('.work-grid');
  if (!grid) return;

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

    grid.appendChild(card);
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

  // Reveal on scroll
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

  io.observe(section);
}
