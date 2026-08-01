# Design Spec

This file is the source of truth for the site's visual design. Edit any
value here and tell me to apply it — I'll update the actual CSS/components
to match. (This file is documentation only; changing it doesn't change the
site by itself.)

Content — names, date, venue, FAQ text, RSVP link — lives separately in
`src/content.js`, not here. This file is about how things *look*, not what
they *say*.

---

## 1. Color Palette

| Token | Hex | Used for |
|---|---|---|
| `--color-bg` | `#faf7f2` (soft ivory) | Page background, RSVP form background |
| `--color-surface` | `#ffffff` | Alternate section background (Details, Gallery) |
| `--color-text` | `#2e2b28` (warm near-black) | Headings, body text |
| `--color-text-muted` | `#6f6a63` | Secondary text — dates, addresses, FAQ answers, nav eyebrow labels |
| `--color-accent` | `#b08968` (muted gold / terracotta) | Links, event times, FAQ +/− icons, hover states |
| `--color-border` | `#e6ddd2` | Hairline borders, section dividers, hero fallback background |

Design intent: warm, neutral, editorial — no bright/saturated colors. One
accent color used sparingly, not as a background fill anywhere.

## 2. Typography

| Role | Font | Notes |
|---|---|---|
| Headings (h1/h2/h3) | **Playfair Display** | Falls back to Georgia, Times New Roman, serif. Weight 400 (not bold), `letter-spacing: 0.02em` |
| Body text | **Cormorant Garamond** | Falls back to Georgia, serif |

Loaded via Google Fonts `<link>` in `index.html` (no npm font package).

| Element | Size |
|---|---|
| `h1` (couple's names in Hero) | `clamp(2.5rem, 6vw, 4rem)` — scales with viewport, min 40px, max 64px |
| `h2` (section titles) | `clamp(1.75rem, 4vw, 2.5rem)` |
| `h3` | `1.4rem` |
| Body text | `1.15rem`, line-height `1.6` |
| Eyebrow labels (e.g. "HOW IT STARTED") | `0.8rem`, uppercase, `letter-spacing: 0.2em` |
| Nav links | `0.95rem`, uppercase, `letter-spacing: 0.04em` (`0.85rem` on mobile) |

## 3. Spacing Scale

A single scale used everywhere via CSS variables — no ad-hoc pixel values:

| Token | Value |
|---|---|
| `--space-1` | 0.5rem (8px) |
| `--space-2` | 1rem (16px) |
| `--space-3` | 2rem (32px) |
| `--space-4` | 4rem (64px) |
| `--space-5` | 6rem (96px) |

## 4. Layout Foundations

- **Content max-width**: `1000px`, centered (`--max-width`)
- **Section padding**: `--space-5` (96px) top/bottom, `--space-2` (16px) sides on desktop; drops to `--space-4` (64px) top/bottom on screens ≤600px
- **Section alternation**: every other section (Event Details, Gallery) uses `.section--surface` — white background with a hairline top/bottom border — to break up the ivory page background. Hero, Our Story, FAQ, RSVP sit on the plain ivory background.
- **Section heading**: centered, eyebrow label above an `h2`, `--space-4` margin below (`--space-3` on mobile)

## 5. Page Structure (top to bottom)

1. **Nav** — sticky
2. **Hero** — full-height intro, scratch-to-reveal date, countdown
3. **Meet Bride and Groom**
4. **Event Details** (includes map)
5. **Gallery**
6. **Blessings**
7. **Blessings and RSVP**
8. **FAQ**
9. **Footer**

---

## 6. Section-by-Section Detail

### Nav
- Sticky to top of viewport (`position: sticky; top: 0`), stays visible while scrolling
- Semi-transparent ivory background (`rgba(250,247,242,0.9)`) with backdrop blur, so content scrolling underneath is softly visible
- Hairline border on bottom edge
- Links: The Couple, Details, Gallery, Blessings, RSVP, FAQ
- **Desktop (>700px)**: links shown centered in a single row
- **Mobile (≤700px)**: links collapse behind a hamburger button (top-right); tapping it opens a full-width dropdown list below the bar; the icon animates into an × while open; tapping a link closes the menu automatically
- Hover: text turns accent color
- Each link has a 44px min-height tap target (mobile accessibility)
- Clicking any nav link doesn't jump instantly — it triggers a custom eased scroll (`src/lib/smoothScroll.js`, ease-out-cubic, ~700ms): fast at first, decelerating into the target section, offset to clear the sticky nav's own height

### Hero
- Full viewport height (`min-height: 100svh`), content centered both axes
- Background: full-bleed photo (`hero.backgroundImage` in content.js), `background-size: cover`
- A soft ivory gradient overlay sits on top of the photo (`20%` opacity at top → `55%` at bottom) so the photo is visible but text stays legible
- Text also has a soft ivory text-shadow/glow for extra contrast insurance against busy photos
- Content, top to bottom: eyebrow tagline → couple's names (h1) → wedding date → countdown timer
- Max content width 40rem, centered

### Countdown
- scratch to revel the date (big size)
- small countdown running below the date
- Four stat blocks in a row (Days / Hours / Minutes / Seconds), wraps on narrow screens
- Big serif numerals (`clamp(1.75rem, 5vw, 2.75rem)`), small uppercase muted label underneath each
- Updates live every second
- After the wedding date passes, replaces the whole countdown with a single "We're married!" line

### Meet Bride and Groom
- Two-column layout: left for the bride, right for the groom
- for bride: daughter of <names of parents>
- for groom: son of <name of parents>
- Photos: portrait aspect ratio (3:4), `object-fit: cover`
- Text: paragraph(s) from `content.js`, no character limit enforced in design

### Event Details
- White/surface section (visually distinct from the ivory sections around it)
- Events shown as a vertical **timeline**: a thin center line runs top to bottom, each event connects to it via a small circular marker, and event cards alternate left/right of the line (1st event left, 2nd right, 3rd left, ...)
- Each card: event name (h3) → date (small, uppercase, muted) → time (accent color, larger) → venue name (bold) → address (muted)
- **Mobile (≤700px)**: the line moves to the left edge, every card sits full-width to its right (no more alternating), markers align to the line — a standard single-column timeline
- Below the timeline: an embedded Google Map (key-free, built from the venue address), bordered, 320px tall (220px on mobile)

### Gallery
- White/surface section
- Responsive grid, each tile min 140px, auto-fills as many columns as fit
- Square (1:1) photo tiles, `object-fit: cover`, subtle zoom-in on hover (`scale(1.05)`)
- Clicking a photo opens a fullscreen lightbox: dark overlay (`rgba(20,18,16,0.92)`), photo scaled to fit (max 90vw / 85vh), with close (×) and prev/next (‹ ›) controls, all ≥44px tap targets

### Blessings
- White/surface section. Guest messages shown as individual sticky notes (4 rotating pastel colors, slight rotation per note, soft drop shadow), each showing the message, "— name, side" attribution, and a small muted date
- Data comes from a shared `useBlessings` hook (`src/hooks/useBlessings.js`): fetches from the Apps Script backend on mount, then polls every 30s in the background so guests see new blessings from others without refreshing
- The most recent blessing submitted *by the current visitor this session* ("mine") is shown enlarged (~1.08× scale, no rotation, stronger shadow) and centered above the rest of the wall in its own row — tracked client-side only, not a permanent property of the data, so it resets on a fresh page load
- When a guest submits a blessing (see below), it appears on the wall immediately (optimistic local update) rather than waiting for the next poll; once the background poll confirms it's saved, the optimistic copy is seamlessly swapped for the real server copy (matched by name+message) without visual flicker
- Clicking any note opens it enlarged in a centered lightbox (dark overlay, no rotation, larger text); closes via the × button or clicking outside the note
- No cap on the number of notes — the grid (`repeat(auto-fill, minmax(220px, 1fr))`) naturally grows as more blessings come in
- Empty state: "No blessings yet — be the first to leave one!" with a button linking to the Blessings & RSVP section

### Blessings and RSVP
- White/surface section. A custom-built form (not a Google Form embed) with 2 tabs — "Send Blessings" and "RSVP" — sharing one bordered container, submitting to the same Apps Script backend as the Blessings wall
- Both tabs include a Bride Side / Groom Side radio selection
- On successful blessing submission: the page auto-scrolls (smooth, centered) up to the guest's new note on the Blessings wall via `scrollIntoView`, so they immediately see their own message featured
- On successful RSVP submission: inline confirmation message, no scroll (nothing to visually feature)
- If the Apps Script backend isn't configured (`content.integrations.appsScriptUrl` empty), both forms fail gracefully with an inline "not connected yet" message rather than erroring

### FAQ
- Ivory section, content narrowed to 40rem and centered (narrower than the 1000px page max-width, since Q&A reads better in a tighter column)
- Accordion: each question is a full-width button with a +/− indicator (accent color) on the right; only the answer for the clicked question is shown, clicking again collapses it
- Hairline divider under each question

### Footer
- Simple centered sign-off: couple's names (serif, smaller than Hero) + wedding date (muted)
- Generous top/bottom padding (`--space-4`)

---

## 7. Responsive Behavior

- Mobile-first breakpoints, primarily at `480px`, `600px`, and `700px` — since most guests are expected to open this on a phone, mobile is treated as the primary layout, not an afterthought
- Nav collapses to a hamburger menu ≤700px (see Nav section above)
- Event Details collapses from an alternating left/right timeline to a single-column left-aligned timeline ≤700px (see Event Details section above)
- Grids (Gallery tiles) use `auto-fit`/`auto-fill` so they reflow naturally without hand-tuned breakpoints per screen size
- Meet the Couple's two-column layout collapses to a single stacked column below 700px
- All interactive elements maintain a 44px minimum touch target

## 8. Images

Current placeholder photos are free-to-use stock images (via Lorem Picsum,
sourced from Unsplash's royalty-free library) — soft sky, desert dunes,
misty forest, calla lily, ocean waves, a lighthouse, a map, the Eiffel
Tower. No copyrighted/trademarked imagery. See `README.md` for how to swap
in real photos.

## 9. Background Music

- Site-wide looping background audio (`src/components/MusicPlayer.jsx`), controlled by a circular mute/unmute button fixed to the bottom-right corner of the viewport on every page (not scoped to one section), 48px, ivory surface with a hairline border and soft shadow, accent-colored speaker icon
- Attempts to autoplay on load; if the browser blocks autoplay-with-sound (standard behavior until the visitor interacts with the page), it starts on the visitor's first click/tap anywhere on the site
- Button icon swaps between a sound-on and sound-off (crossed-out) speaker glyph based on mute state
- Hidden entirely — no button rendered at all — until a real audio file is configured (`content.music.src`), same "absent until configured" pattern as the Blessings backend. See `README.md` → "Background music" for where to source a properly licensed/royalty-free track (music carries real copyright risk, unlike the stock photos above, so nothing is bundled by default)

---

## How to request a change

Edit the value(s) above (e.g. change the accent color hex, swap a font,
adjust a spacing number, change a section's layout description) and tell
me what you changed — I'll translate it into the actual CSS/component edits
and rebuild.
