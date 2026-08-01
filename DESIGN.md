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
- **Section alternation**: every other section (Event Details, Gallery, Blessings) uses `.section--surface` — white background with a hairline top/bottom border — to break up the ivory page background. Hero, Meet the Couple, Blessings & RSVP, FAQ sit on the plain ivory background.
- **Section heading**: centered, eyebrow label above an `h2`, `--space-4` margin below (`--space-3` on mobile)

## 5. Page Structure (top to bottom)

1. **Nav** — fixed (floats over Hero)
2. **Hero** (`#hero`) — full-height intro, scratch-to-reveal date + countdown
3. **Meet the Couple** (`#couple`)
4. **Event Details** (`#details`, includes map)
5. **Gallery** (`#gallery`)
6. **Blessings** (`#blessings`)
7. **Blessings and RSVP** (`#blessings-rsvp`)
8. **FAQ** (`#faq`)
9. **Footer** (`#footer`)

Each section is a "frame" you can jump to directly — every section above has a
stable `id`, used both by the Nav links and by the section frame-nav (below).

### Section frame-nav (up/down arrows)

A pair of stacked up/down arrow buttons (`src/components/SectionNav.jsx`),
part of the same bottom-right floating control cluster as the music button
(see `FloatingControls.jsx`). Clicking either one jumps to the previous/next
section's top edge using the same eased scroll as the Nav links. The current
section is tracked from scroll position (a section "becomes current" once its
top has scrolled to roughly the upper third of the viewport); the up arrow
disables at the first section (Hero), the down arrow disables at the last
(Footer). A short animation lock (~750ms, matching the scroll duration)
ignores further clicks mid-scroll so rapid clicking can't miscompute the
target off a stale scroll position.

---

## 6. Section-by-Section Detail

### Nav
- **Fixed** to the top of the viewport (`position: fixed`, not sticky) so it floats transparently over the Hero photo from the very first frame, rather than reserving its own space above it
- Semi-transparent ivory background (`rgba(250,247,242,0.9)`) with backdrop blur, so content scrolling underneath is softly visible
- Hairline border on bottom edge
- Links: The Couple, Details, Gallery, Blessings, RSVP, FAQ
- **Desktop (>700px)**: links shown centered in a single row
- **Mobile (≤700px)**: links collapse behind a hamburger button (top-right); tapping it opens a full-width dropdown list below the bar; the icon animates into an × while open; tapping a link closes the menu automatically
- Hover: text turns accent color
- Each link has a 44px min-height tap target (mobile accessibility)
- Clicking any nav link doesn't jump instantly — it triggers a custom eased scroll (`src/lib/smoothScroll.js`, ease-out-cubic, ~700ms): fast at first, decelerating into the target section, offset by the nav's own height so the section isn't hidden underneath it

### Hero
- Full viewport height (`min-height: 100svh`), content centered both axes; the fixed Nav floats transparently over it (see above) instead of pushing it down
- Background: full-bleed photo (`hero.backgroundImage` in content.js), `background-size: cover`
- A soft ivory gradient overlay sits on top of the photo (`20%` opacity at top → `55%` at bottom) so the photo is visible but text stays legible
- Text also has a soft ivory text-shadow/glow for extra contrast insurance against busy photos
- **Glitter effect**: ~16 small soft sparkles scattered across the photo, each twinkling on its own staggered timer (fade + scale via `@keyframes sparkle-twinkle`), plus a slow diagonal light-shimmer band that sweeps across the whole hero on a ~9s loop. Both are `pointer-events: none` (decorative only) and disabled under `prefers-reduced-motion`
- Content, top to bottom: eyebrow tagline → couple's names (h1) → the scratch-reveal card (date + countdown, see below)
- Max content width 40rem, centered

### Scratch Reveal
- A realistic scratch-off card (`src/components/ScratchReveal.jsx`) covers **both** the wedding date and the countdown together — scratching it away reveals them as one unit, not the countdown separately
- Sized generously ("big"): the card's content area has roomy padding (`--space-3`/`--space-4`) and a `min-width` so it reads as a proper card, not a tight label
- Realistic scratch-off texture: a metallic-foil gradient base, fine diagonal hatching, and randomized speckle grain drawn onto the canvas — not a flat single color
- The revealed date is intentionally **smaller** than before (`clamp(1.1rem, 2.5vw, 1.4rem)`) since it now sits above the countdown rather than standing alone
- Countdown: four stat blocks in a row (Days / Hours / Minutes / Seconds), wraps on narrow screens; big serif numerals (`clamp(1.75rem, 5vw, 2.75rem)`), small uppercase muted label underneath each; updates live every second
- After the wedding date passes, replaces the whole countdown with a single "We're married!" line

### Meet the Couple
- Three-column layout: bride card | small vector illustration | groom card (`grid-template-columns: 1fr auto 1fr`)
- Cards have a visible boundary with rounded corners (`border`, `border-radius: 1.25rem`, white surface background) rather than sitting directly on the page background
- **Stays a multi-column layout at every width, including mobile** — it does not stack into one column like other two-column sections. Below 700px, font sizes, image sizing, padding, and the vector art shrink instead of reflowing to a single column, so bride/groom remain side-by-side even on small phones
- Each card shows, top to bottom: photo → name → grandparentage line ("Granddaughter/Grandson of ...") → parentage line ("Daughter/Son of ..." ) — two separate lines, not combined
- Photos: portrait aspect ratio (3:4), `object-fit: cover`, rounded corners
- Center vector art: `content.coupleVectorArt` (currently `public/images/bridengroom/bridengroom_vector.png`), scales from ~144px wide on desktop down to ~48px on the smallest phones

### Event Details
- White/surface section (visually distinct from the ivory sections around it)
- Events shown as a vertical **timeline**: a thin center line runs top to bottom, each event connects to it via a small circular marker, and event cards alternate left/right of the line (1st event left, 2nd right, 3rd left, ...)
- Each card: event name (h3) → date (small, uppercase, muted) → time (accent color, larger) only — **no venue name or address on the cards themselves**; the shared map below covers location for all events
- **Mobile (≤700px)**: the line moves to the left edge, every card sits full-width to its right (no more alternating), markers align to the line — a standard single-column timeline
- Vertical spacing between items is intentionally tight (`--space-2` gap, `--space-2`/`--space-3` card padding) since cards are now short (3 lines) — this was widened back down after removing venue/address left too much dead space at the old spacing
- Below the timeline: an embedded Google Map (key-free, built from `content.mapAddress`), bordered, 320px tall (220px on mobile)

### Gallery
- White/surface section
- Responsive grid, each tile min 140px, auto-fills as many columns as fit
- Square (1:1) photo tiles, `object-fit: cover`, subtle zoom-in on hover (`scale(1.05)`)
- Clicking a photo opens a fullscreen lightbox: dark overlay (`rgba(20,18,16,0.92)`), photo scaled to fit (max 90vw / 85vh), with close (×) and prev/next (‹ ›) controls, all ≥44px tap targets

### Blessings
- White/surface section. Guest messages shown as individual sticky notes (4 rotating pastel colors, slight rotation per note, soft drop shadow), each showing the message, "— name, side" attribution, and a small muted date
- Data comes from a shared `useBlessings` hook (`src/hooks/useBlessings.js`): fetches from the Apps Script backend on mount, then polls every **10s** in the background so guests see new blessings from others without refreshing
- The most recent blessing submitted *by the current visitor this session* ("mine") is shown enlarged (~1.08× scale, no rotation, stronger shadow) and centered above the rest of the wall in its own row — tracked client-side only, not a permanent property of the data, so it resets on a fresh page load
- When a guest submits a blessing (see below), it appears on the wall immediately (optimistic local update) rather than waiting for the next poll; once the background poll confirms it's saved, the optimistic copy is seamlessly swapped for the real server copy (matched by name+message) without visual flicker
- **Layout — floating circular cloud (>700px)**: the non-"mine" notes are arranged in a golden-angle spiral (`getCloudPosition` in `Blessings.jsx`) within a square container, so they spread organically around a center point rather than sitting in a grid; each note also gently bobs up and down on its own staggered, randomized-ish timer (`@keyframes note-float`, disabled under `prefers-reduced-motion`). Scales naturally as more blessings arrive since the spiral radius grows with the count
- **Layout — mobile fallback (≤700px)**: falls back to the original responsive grid (`repeat(auto-fill, minmax(220px, 1fr))`) instead of the cloud — absolute-positioned circular packing doesn't work at narrow widths, so this switches automatically via a `matchMedia` check (`useIsWide` hook), not a CSS-only media query, since the notes' positions are computed in JS
- Clicking any note opens it enlarged in a centered lightbox (dark overlay, no rotation, larger text), reusing that exact note's own color (not always the first palette color) so it doesn't visually swap when opened; closes via the × button or clicking outside the note
- No cap on the number of notes — layout naturally grows as more blessings come in
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
- **Meet the Couple is the one exception to "stack on mobile"** — it deliberately keeps bride/groom side-by-side at every width, shrinking sizes instead of stacking (see Meet the Couple section above)
- Blessings switches from the circular floating cloud to a plain grid ≤700px (see Blessings section above)
- The floating bottom-right controls (section arrows + music button) shift slightly closer to the corner (`--space-1` instead of `--space-2`) on screens ≤480px
- All interactive elements maintain a 44px minimum touch target

## 8. Images

Current placeholder photos are free-to-use stock images (via Lorem Picsum,
sourced from Unsplash's royalty-free library) — soft sky, desert dunes,
misty forest, calla lily, ocean waves, a lighthouse, a map, the Eiffel
Tower. No copyrighted/trademarked imagery. See `README.md` for how to swap
in real photos.

## 9. Background Music

- Site-wide looping background audio (`src/components/MusicPlayer.jsx`), controlled by a circular mute/unmute button, part of the bottom-right `FloatingControls` stack (see §5's section frame-nav) alongside the up/down arrows — shared `.icon-button` style (44px, white surface, hairline border, soft shadow, accent-colored icon)
- Attempts to autoplay on load; if the browser blocks autoplay-with-sound (standard behavior until the visitor interacts with the page), it starts on the visitor's first click/tap anywhere on the site
- Button icon swaps between a sound-on and sound-off (crossed-out) speaker glyph based on mute state
- Hidden entirely — no button rendered at all — until a real audio file is configured (`content.music.src`), same "absent until configured" pattern as the Blessings backend. Currently set to `public/audio/background-music.mp3`. See `README.md` → "Background music" for where to legally source a track if you swap it out (music carries real copyright risk, unlike the stock photos above, so nothing was bundled by default originally)

---

## How to request a change

Edit the value(s) above (e.g. change the accent color hex, swap a font,
adjust a spacing number, change a section's layout description) and tell
me what you changed — I'll translate it into the actual CSS/component edits
and rebuild.
