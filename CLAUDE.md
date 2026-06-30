# CLAUDE.md — Baraa Abdulwahab Portfolio

This file is the permanent memory of this project. Read it fully before making any change. Every decision below was deliberately chosen — do not replace it with generic defaults.

---

## 1. Who This Is For

Baraa Abdulwahab — On-Set Technical Consultant & Camera Stabilization Specialist (DJI Ronin, ARRI Trinity). Credits include Arabs Got Talent S7, Boulevard Al-Mawaheb (MBC), and commercial work with Netflix, Pepsi, Toyota. Building this portfolio to support an industry accreditation application for the 74th San Sebastián International Film Festival (Sept 2026) and an anchored Spanish visa application.

**Audience:** Festival accreditation reviewers, consulate officers, and potential clients/DOPs/directors — international, professional, judging credibility fast.

---

## 2. The Concept — "The Person Before the Work"

This is not a portfolio that lists work. It is a site that makes the visitor *feel* Baraa's presence before seeing a single project.

**Core principle:** Every motion, every light change, every element exists for a reason rooted in cinematography — never decoration for its own sake.

**Master line (hero tagline):**
> "بين الثبات والحركة — القصة"

**Emotional target:** Dopamine through anticipation-then-reveal, not constant stimulation.

---

## 3. Site Structure — One continuous scroll

### Section 01 — Entry (Cold Open)
- Scroll locked until sequence completes. Full black, 2s silence.
- Faint light source motivates thin smoke drifting across the dark.
- A car headlight sweeps in from the left — reveals the smoke, then the name: **BARAA ABDULWAHAB**, lit only by the passing light.
- Light exits, name remains faint. Tagline fades in beneath.
- Down-arrow pulses once, scroll unlocks.

### Section 02 — Hero
- Dissolve transition. Background: real BTS night shot, Tungsten-warm, Baraa working with a Ronin.
- Parallax: image still, text slower. Day for Night mood.
- Title fades progressively: "On-Set Technical Consultant" / "Camera Stabilization Specialist".
- Crosshair follows cursor, warm grain overlay.

### Section 03 — About
- Magic Hour warmth bleeds in from edges.
- Left: 3-4 lines of text. Right: portrait + equipment lit by desk lamp, partially shadowed.
- Differential parallax (text up, image down at different speeds).

### Section 04 — Work
- Blue Hour enters abruptly. **Scroll shifts vertical → horizontal**, returns to vertical after last project.
- Each project = its own lighting environment (AGT S7 = bright stage; Boulevard = warm/golden; commercial = clean studio).
- Name+year+role in darkness; hover reveals image like a photo developing.
- Click → internal project detail view (not external IMDb link).
- Shutter-flash transition between projects.

### Section 05 — Clients
- Overcast, neutral. Logos (not names), fading in one at a time, organic sizing.
- Smoke returns, echoing Section 01.

### Section 06 — Contact
- Deep Tungsten returns. Screen darkens progressively.
- Single lamp glow. Line: "الكادر التالي — لك". Email/IMDb/WhatsApp fade in one at a time.
- Horizon line beneath. Timecode stops here.

---

## 4. Lighting System

| Section | Mood | Background | Accent |
|---|---|---|---|
| 01 Entry | Tungsten | #1A0F00 | #C8A05A |
| 02 Hero | Day for Night | #0A0A0F | #F0EDE8 |
| 03 About | Magic Hour | #0D0805 | #A07040 |
| 04 Work | Blue Hour | #050810 | #4A6080 |
| 05 Clients | Overcast | #0F0F12 | #6A6A7A |
| 06 Contact | Deep Tungsten | #120A00 | #C8A05A |

Cross-dissolve ~200px between sections, except 03→04 (intentionally abrupt). Color rule: 90% dark base / 8% off-white+gray / 2% gold (gold appears only 2-3 times total).

---

## 5. Secondary Elements — each must justify its presence

- **Focus crosshair** — follows cursor like a focus reticle.
- **Film grain** — subtle, warm.
- **Shutter flash** — sub-frame flash between Work projects.
- **Horizon line** — thin line shifting with scroll.
- **Timecode** — monospace counter, genuinely incrementing.
- **Smoke** — only Sections 01 & 05, motivated by light.
- **Headlight sweep** — only once, Section 01.
- **Desk lamp** — Sections 03 & 06, bookend motif.

---

## 6. Typography
- Display: Cormorant Garamond
- Body: Inter or DM Sans
- Technical/data: JetBrains Mono

## 7. Buttons
No fills, no rounded corners, no shadows. Text + thin underline, extends on hover like pulling focus.

---

## 8. Image, Video & Asset System

### 8.1 Folder structure


### 8.2 Naming: `[section]-[description]-[number].[ext]`, lowercase, hyphenated.

### 8.3 Reference via raw GitHub URLs:
`https://raw.githubusercontent.com/<username>/<repo>/main/images/identity/hero-bts-01.jpg`

### 8.4 Image categories
| Category | Source | Where | Job |
|---|---|---|---|
| Identity | Real BTS/portraits | Entry, Hero, About | Build trust |
| Mood | CSS/JS coded, not photographed | All transitions | Atmosphere |
| Project | Real production stills | Work only | Proof |
| Equipment | Ronin/Trinity, shadowed | About, 1-2 max | "Technical consultant" subtly |

Budget: ~10-15 real images total.

### 8.5 Video
Minimal: one ambient muted BTS loop in Hero max, optional clip per project detail. Muted, autoplay only if looped+silent, playsinline, compressed.

### 8.6 Baraa's portrait as design element
Transparent PNG cutout → duotone re-tinted per section's lighting mood → soft mask blend into background → slow breathing parallax → cursor-proximity spotlight on his silhouette.

---

## 9. Tokens

```css
--bg-entry: #1A0F00       --accent-gold: #C8A05A
--bg-hero: #0A0A0F        --text-primary: #F0EDE8
--bg-about: #0D0805       --accent-warm: #A07040
--bg-work: #050810        --accent-cool: #4A6080
--bg-clients: #0F0F12     --text-secondary: #8A8A9A
--bg-contact: #120A00
--font-display: 'Cormorant Garamond', serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

---

## 10. Technical Constraints
- Vanilla HTML/CSS/JS only. No React, no build tooling, no npm deps in repo. GitHub-Pages-deployable.
- Bilingual AR/EN toggle, RTL support, same voice not literal translation.
- CDN-only animation libs: GSAP, AOS, Swiper.js if needed.
- Respect `prefers-reduced-motion`.
- Mobile: horizontal Work section degrades to vertical stacking.
- Installed skills (`frontend-design`, `ui-ux-pro-max` + bundle) execute these decisions — this file overrides their generic defaults.

---

## 11. What "Done Right" Looks Like
Visitor scrolls once, in silence, ends thinking "I want to work with this person." Convince through restraint + 2-3 unforgettable moments, not constant motion. If unsure about adding anything: does it serve a person who controls light and motion for a living? If not, cut it.
