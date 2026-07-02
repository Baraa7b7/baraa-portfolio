import { CLIENTS } from '../content.js';

export function initClients() {
  const section = document.getElementById('clients');
  if (!section) return;

  const grid = section.querySelector('.clients-grid');
  if (!grid) return;

  // Render logos
  CLIENTS.forEach((client, i) => {
    const item = document.createElement('div');
    item.className = 'client-logo';
    // Stagger each logo independently via transition-delay
    item.style.transitionDelay = `${i * 0.07}s`;

    item.innerHTML = `
      <img
        src="${client.logo}"
        alt="${client.name}"
        loading="lazy"
        decoding="async"
        title="${client.name}"
      >
    `;

    grid.appendChild(item);
  });

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
