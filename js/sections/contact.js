import { CONTACT } from '../content.js';

export function initContact() {
  const section = document.getElementById('contact');
  if (!section) return;

  const linksContainer = section.querySelector('.contact-links');
  const timecode = section.querySelector('.contact-timecode');

  // Build links from content
  const items = [
    { label: 'EMAIL', text: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { label: 'IMDB',  text: 'IMDb Profile', href: CONTACT.imdb },
    { label: 'WA',    text: 'WhatsApp', href: CONTACT.whatsapp },
  ];

  if (linksContainer) {
    items.forEach((item, i) => {
      const a = document.createElement('a');
      a.className = 'contact-link';
      a.href = item.href;
      a.style.transitionDelay = `${0.2 + i * 0.12}s`;
      if (item.href.startsWith('mailto') || item.href.startsWith('https')) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
      a.innerHTML = `
        <span class="contact-link-label">${item.label}</span>
        <span>${item.text}</span>
      `;
      linksContainer.appendChild(a);
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
