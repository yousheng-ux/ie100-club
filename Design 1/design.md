# IE100 Club — Design System & Guidelines

> Design language derived from the `Design1 Ref` reference set (a premium real-asset
> investment manager site). Adapted for **IE100 Club** — a private, high-end business
> community for global Chinese entrepreneurs.

---

## 1. Design Principles

| Principle | Description |
|-----------|-------------|
| **Quiet luxury** | Restraint over decoration. Whitespace, calm color, no clutter. |
| **Editorial** | Large, light-weight headlines. Reads like a premium print magazine. |
| **Trust & permanence** | Deep navy + serif/clean sans conveys stability and exclusivity. |
| **Image-led** | Full-bleed photography carries the emotion; text stays minimal. |
| **Considered motion** | Subtle fades / slow reveals on scroll. Never flashy. |

---

## 2. Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--navy` | `#16344F` | Primary brand, hero overlay, cards, CTA section |
| `--navy-deep` | `#0E2438` | Footer, darkest accents |
| `--steel` | `#3E6488` | Secondary blue, hover states, card variants |
| `--ink` | `#1A1A1A` | Body headings on light backgrounds |
| `--slate` | `#5C6770` | Body copy, captions |
| `--cream` | `#F7F6F2` | Section background (warm off-white) |
| `--white` | `#FFFFFF` | Base background, card text |
| `--line` | `#E3E1DB` | Hairline dividers, borders |
| `--gold` | `#B79256` | *Optional* accent — exclusivity cue (use sparingly) |

The reference is almost monochrome navy + white. We add a faint **gold** as an
exclusivity signal appropriate to a members-only club. Use it only on small
details (member tier marks, thin underlines), never as a fill.

---

## 3. Typography

> **Important (CJK):** the site is Chinese-primary. A Latin display serif like
> Cormorant has **no Chinese glyphs**, so Chinese headlines silently fall back to a
> different font and lose their personality. We therefore commit to a real CJK serif.

**Headings (`--serif`):** `"Noto Serif SC"` (思源宋体) — an elegant CJK serif used by
many premium Chinese brands. Weight 500 for headlines.
**Latin-only display (`--display`):** `"Cormorant Garamond"` — used **only** for the
`IE100` wordmark / pure-Latin accents where it renders beautifully.
**Body / UI (`--sans`):** `"Inter"` + `"Noto Sans SC"` fallback for Chinese.

**CJK rules:**
- Do **not** apply `letter-spacing` to Chinese body/headlines (it looks gappy/cheap).
  Keep it only on Latin labels.
- Use generous `line-height` for Chinese: ~1.75 body, ~1.4 headings.
- Avoid `text-transform: uppercase` on Chinese (it does nothing useful).

| Element | Size (desktop) | Weight | Notes |
|---------|----------------|--------|-------|
| Hero H1 | 56–72px | 300–400 | Tight leading, max ~14 words |
| Section statement | 30–40px | 300 | Centered, generous line-height (1.5) |
| Section eyebrow | 13px | 600 | UPPERCASE, letter-spacing 0.15em, slate |
| Card title | 22px | 500 | |
| Body | 16–18px | 400 | line-height 1.7, color slate |
| Nav / buttons | 14px | 500 | letter-spacing 0.04em |

---

## 4. Layout & Spacing

- **Max content width:** 1240px, centered, 24px side gutters (mobile) / 48px (desktop).
- **Vertical rhythm:** sections separated by 100–140px padding (desktop), 64px (mobile).
- **Grid:** 12-col mental model; cards use 3-up on desktop, 1-up on mobile.
- **Generous whitespace** is the signature — do not crowd.

---

## 5. Components

### Navigation (fixed, transparent over hero → solid on scroll)
- Left: **IE100** wordmark / logo.
- Center: links — *Home · About Us · Philosophy · Membership · Events · Contact*.
- Right: dark pill **"Apply / Contact"** button.
- Mobile: hamburger → full-screen overlay menu.

### Hero (首屏 KV)
- Full-viewport background image (KV photography) with navy gradient overlay.
- Overlay text bottom-left or upper-left: brand name + slogan.
- Optional thin outlined geometric motif (ref No.1 has a wireframe building).

### Core Advantages — Image Cards w/ Text Overlay (ref No.4 / No.5)
- 3 **image** cards (KV photography), tall (~460px), `overflow:hidden`.
- Navy gradient overlay (darker at bottom) keeps overlaid text legible.
- Layout: icon pinned **top-left**, title + description + "了解更多 →" anchored
  **bottom-left** (icon uses `margin-bottom:auto` to split top/bottom).
- Hover: image slow-zooms, gold top-rule sweeps in, icon border turns gold.
- This replaced the old flat solid-navy cards (which read as dated/机械).

### Statement Block
- Centered large light-weight paragraph, often a quote (ref No.4).
- Plenty of margin; can use two-tone text (active vs muted).

### Feature — Full-bleed Image + Caption Row (ref No.3 / No.5 / No.7)
- Large image (~580px), `overflow:hidden`, slow-zoom on hover.
- **Eyebrow + headline overlaid top-left** in white, over a diagonal navy gradient.
- **Caption row beneath:** left = metadata list (label↔value, hairline-divided rows:
  活动形式 / 举办城市 / 准入方式), right = bold lead `<h4>` + body paragraph.
- This is the signature editorial pattern from the reference — text *on* the image
  plus a structured metadata band, not a plain image with a caption.

### Events / Opportunities Grid
- Asymmetric editorial masonry (ref No.6): mixed image + text cards.
- Each event: image, title, meta (date/scale), short copy, "Learn More".

### Leadership Grid
- Alternating portrait + bio blocks (ref No.9), 2-col staggered.
- Portrait, name, role, short bio, "Read More".

### CTA — "Get in touch"
- Full navy band (ref No.8): big headline + light "Contact" pill button +
  multi-column link footer beneath.

### Footer
- Navy-deep. Logo, nav columns, contact, copyright, ICP/备案 line, privacy.

---

## 6. Imagery (available assets)

| File | Best use |
|------|----------|
| `KV Image/ChineseBusiness2.jpg` | **Hero** — premium lounge, skyline, Chinese entrepreneurs |
| `KV Image/Rooftop2.jpg` | Events hero / networking section |
| `KV Image/Rooftop.jpg` | Events grid card |
| `KV Image/ChineseBusiness1.jpg` | About / lounge feature |
| `KV Image/ChineseBusiness3.jpg` | Membership / lifestyle feature |
| `KV Image/ChineseBusiness4.jpg` | Philosophy / workspace feature |

Treatment: subtle navy gradient overlay on hero for text legibility; images
otherwise full-color, high quality, slightly cool grade to match navy palette.

---

## 7. Interaction & Motion

**Direction: sharp editorial luxury (Chanel/Aesop), with rich smooth motion.**

- **Shape:** `border-radius: 0` everywhere — crisp, intentional. Depth comes from
  hairline borders/dividers and image, **not** shadows or rounded corners.
- **Easing:** all transitions use `--ease: cubic-bezier(0.22, 1, 0.36, 1)` (confident
  settle). Never plain `ease`/`linear` — that reads mechanical.
- Nav: transparent → solid white after 60px; links get a gold underline that scales in.
- Hero: content drifts up (~0.18×) and fades on scroll (parallax); slides crossfade
  with a slow Ken Burns zoom.
- Cards: uniform navy with a gold top-rule that sweeps in on hover + slight lift.
- Buttons: smooth fill-sweep (color flood from bottom), no lift.
- Images (events / leaders / feature): slow zoom on hover inside an `overflow:hidden`
  `.media` wrapper; leader portraits go grayscale → color on hover.
- Reveals: fade-up (~0.9s) on scroll-in, **staggered** across grid children.
- Respect `prefers-reduced-motion` — disable parallax, Ken Burns, and reveals.

---

## 8. Responsive Breakpoints

Desktop-first. Base styles target laptops/desktops (≥1024px); `min-width` queries
enhance big screens, `max-width` queries adapt down to phones. Fluid `clamp()` is used
for the page gutter and most type so sizes scale *between* breakpoints, not just at them.

| Breakpoint | Target devices | Behavior |
|------------|----------------|----------|
| ≥ 1920px | 4K / ultra-wide | `--maxw` 1560px, larger hero, taller section padding |
| ≥ 1600px | Large monitors | `--maxw` 1440px, more breathing room (avoids thin column) |
| 1200–1599px | Desktop / large laptop | Base layout, `--maxw` 1240px |
| 1024–1199px | Laptop / iPad landscape | Base grids, slightly reduced section padding |
| ≤ 1023px | iPad portrait | Cards → 1-col, footer → 2-col, feature image shorter |
| ≤ 900px | Small tablet / large phone | **Hamburger nav**, leadership & CTA → 1-col |
| ≤ 768px | Tablet portrait / phablet | Events & feature-caption → 1-col |
| ≤ 640px | Phones | All grids 1-col, tighter cards, smaller portraits/images |
| ≤ 480px | Small phones | Full-width hero CTAs, stacked action rows |
| ≤ 360px | iPhone SE etc. | Reduced headline sizes, meta rows stack |

**Cross-device fixes baked in:**
- Hero uses `min-height: 100svh` (with `100vh` fallback) — no jump from mobile
  browser chrome.
- `overflow-x: hidden` on `body` prevents any stray horizontal scroll.
- Nav collapses at **900px** (5 Chinese links crowd before then).
- `prefers-reduced-motion` disables parallax / Ken Burns / reveals.

---

## 9. Page Map (per brief)

1. **Home** (this index.html) — Hero → Core Advantages → Statement → Events preview → Leadership → CTA → Footer
2. About Us — philosophy, strengths, team
3. Enterprise Philosophy — vision / mission / values
4. Membership — benefits, eligibility, process, application form
5. Events — categorized activity list + detail pages
6. Contact — methods, address, inquiry form

---

## 10. Voice & Content Notes

- Tone: confident, understated, exclusive. Short sentences.
- English primary in this sample; bilingual (中/EN) intended for production.
- Placeholders used now — real copy, member tiers, team bios, and contact
  details to be supplied later.
