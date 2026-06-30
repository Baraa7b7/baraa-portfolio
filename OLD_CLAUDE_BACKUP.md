# CLAUDE.md — Design Constitution
# Baraa Abdul Wahab Portfolio

This file governs every visual, typographic, motion, and structural decision in this project.
Read it fully before touching any file.

---

## 1. Project Brief

Personal portfolio for **Baraa Abdul Wahab**, On-Set Technical Consultant
specializing in camera systems and stabilization (DJI Ronin, ARRI Trinity) for
high-end film, TV, and commercial production in Saudi Arabia.

Primary audience: festival accreditation officers, embassy officials, international
production companies. The site must read as world-class within 10 seconds.

---

## 2. Stack

- Vanilla HTML5 / CSS3 / JavaScript (ES modules)
- GSAP 3 + ScrollTrigger (CDN)
- No frameworks. No build step. No preprocessors.
- Google Fonts: Cormorant Garamond (Light 300, Regular 400) + DM Mono (Regular 400)

---

## 3. Colour Palette

| Token          | Value     | Usage rule                                    |
|----------------|-----------|-----------------------------------------------|
| `--bg`         | `#0A0A08` | Page background. Never deviate.               |
| `--surface`    | `#111110` | Lifted panels, overlays                       |
| `--text-pri`   | `#F0EDE6` | All primary reading text                      |
| `--text-sec`   | `#8A8880` | Captions, secondary labels                   |
| `--accent`     | `#B8935A` | Bronze. One use per chapter maximum.          |
| `--rule`       | `#222220` | Hairline borders, dividers                    |

No other colours. No blue, green, red, purple. Bronze is the sole chromatic note.

---

## 4. Typography

| Role         | Face               | Weight | Size (desktop) | Treatment                    |
|--------------|--------------------|--------|----------------|------------------------------|
| Display      | Cormorant Garamond | 300    | clamp(56px,8vw,120px) | tracking +0.15em, uppercase |
| Heading      | Cormorant Garamond | 300    | clamp(32px,4vw,56px)  | tracking +0.1em              |
| Mono label   | DM Mono            | 400    | 11–13px        | tracking +0.08em, uppercase  |
| Mono body    | DM Mono            | 400    | 13–15px        | tracking +0.04em             |
| Link         | DM Mono            | 400    | 13px           | no underline default, bronze on hover |

Line-height: display 0.95–1.0; body 1.6.
Never set text in a sans-serif for display purposes.

---

## 5. Motion Principles

- All animation is scroll-driven via GSAP ScrollTrigger unless stated otherwise.
- Enter animations: opacity 0→1, y 30–40px→0, duration 0.8–1.0s, ease "power2.out".
- No bounce. No spring. No elastic. No playful easing anywhere.
- The signature element: a 1px bronze horizontal rule that draws from left to right
  (width 0→100%) between the Hero and Work chapters. This is the sole decorative animation.
- Hero: video loop as atmospheric base. On scroll — scale 1.0→0.9, name fades in.
- Equipment spec lines: stagger 0.1s, like a terminal loading sequence.
- Character-by-character reveal only for the name in Hero. Nowhere else.
- Reduced-motion: wrap all GSAP in `if (!prefersReducedMotion)`. Static states must
  still be beautiful.

---

## 6. Layout System

- Max content width: 1440px
- Side padding: clamp(24px, 6vw, 120px)
- Chapter height: minimum 100vh, often taller for scroll scenes
- Grid: 12-column with 24px gutters (desktop), 4-column (mobile)
- Mobile breakpoint: 768px
- No horizontal scroll anywhere.

---

## 7. Imagery

- All images: object-fit cover, desaturated 15–25% (CSS filter: saturate(0.8) on dark overlay)
- Placeholder images: dark gradient SVGs until real assets are supplied
- Video: autoplay, muted, loop, playsinline. Poster = hero.jpg. No controls shown.
- Never stretch or distort images.

---

## 8. File Architecture

```
baraa-portfolio/
├── index.html          ← structure only, no inline content
├── CLAUDE.md           ← this file
├── css/
│   ├── reset.css       ← minimal reset (box-sizing, margin, padding)
│   ├── tokens.css      ← CSS custom properties (colours, type scale, spacing)
│   └── main.css        ← all layout and visual styles
├── js/
│   ├── content.js      ← ALL editable content (text, links, data arrays)
│   └── main.js         ← GSAP animations, DOM injection from content.js
└── assets/
    ├── hero/
    │   ├── hero.mp4    ← replace with real clip
    │   └── hero.jpg    ← poster / photo fallback
    ├── work/           ← work[0-3].jpg placeholders
    └── equipment/      ← equipment[0-2].jpg placeholders
```

content.js is the single source of truth for all text and data.
No text strings in HTML or main.js — only tokens/IDs.

---

## 9. Self-Critique Ritual

After completing each chapter, ask three questions:

1. **Does anything compete with the focal point?** If yes, remove it.
2. **Is any element purely decorative without earning its place?** If yes, remove it.
3. **Would a Rolls-Royce art director approve this spacing?** If not, add space.

Document what was removed or changed as a result.

---

## 10. Anti-Patterns (never do these)

- No gradient text (webkit-background-clip tricks)
- No box shadows on text
- No more than 2 font families on any page
- No animations on page load (only on scroll)
- No hover effects that move layout (no scale that affects flow)
- No Lorem Ipsum visible in production build
- No social media icons (text handles only)
- No more than one bronze element per chapter
- No JavaScript frameworks, no React, no Vue
- No CDN-loaded CSS frameworks (Bootstrap, Tailwind, etc.)

---

## 11. Content Data (seed values — edit in content.js)

### Works (4 entries)
1. "Al-Qiddiya — Live Event" / 2024 / Technical Stabilizer Consultant
2. "NEOM Campaign" / 2023 / Camera Systems Lead
3. "Saudi Cup — Broadcast" / 2023 / On-Set Technical Director
4. "MBC Drama Series" / 2022 / Steadicam & Ronin Operator

### Equipment (3 systems)
1. DJI Ronin 4D — Payload 8kg, 4-axis, 6 years experience
2. ARRI Trinity — 3-axis, gyro-stabilized, 5 years experience
3. Camera Systems — ARRI Alexa, RED V-Raptor, Sony VENICE

### Collaborations (4 entries)
1. BBC Arabic — 2024
2. MBC Group — 2023
3. Saudi Broadcasting Authority — 2023
4. NEOM Media — 2022

### Contact
- Email: baraa@example.com (replace)
- Instagram: @baraa_abdul_wahab
