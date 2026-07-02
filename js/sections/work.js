import { WORKS } from '../content.js';

export function initWork() {
  const section = document.getElementById('work');
  if (!section) return;

  const grid = section.querySelector('.work-grid');
  if (!grid) return;

  // Render cards from content data
  WORKS.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'work-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${project.title} — ${project.role}`);

    card.innerHTML = `
      <img
        class="work-card-img"
        src="${project.image}"
        alt="${project.title}"
        loading="lazy"
        decoding="async"
        width="800"
        height="500"
      >
      <div class="work-card-overlay" aria-hidden="true"></div>
      <div class="work-card-content">
        <div class="work-card-meta">${project.year}</div>
        <h3 class="work-card-title">${project.title}</h3>
        <div class="work-card-role">${project.role}</div>
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
