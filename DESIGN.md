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
- **Fixed** to the top of the viewport (`position: fixed`), but starts **hidden** (`opacity: 0`) while the Hero is in view — it fades softly in (`opacity` transition, ~0.4s) once you've scrolled roughly one Hero-height down, so the Hero photo is uninterrupted at first glance. Toggled via a scroll listener comparing `scrollY` against the Hero's height, not CSS alone
- An initials monogram "logo" sits in the bar (e.g. "M & Y", derived from `content.couple`) — clicking/tapping it scrolls straight back to the Hero
- Semi-transparent ivory background (`rgba(250,247,242,0.9)`) with backdrop blur, so content scrolling underneath is softly visible
- Hairline border on bottom edge
- Links: The Couple, Details, Gallery, Blessings, RSVP, FAQ
- **Desktop (>700px)**: logo on the left, links in a row on the right (`justify-content: space-between`)
- **Mobile (≤700px)**: logo centered, hamburger button on the right; tapping the hamburger opens a full-width dropdown list below the bar; the icon animates into an × while open; tapping a link closes the menu automatically
- Hover: text turns accent color
- Each link/the logo has a 44px min-height tap target (mobile accessibility)
- Clicking any nav link (or the logo) doesn't jump instantly — it triggers a custom eased scroll (`src/lib/smoothScroll.js`, ease-out-cubic, ~700ms): fast at first, decelerating into the target section, offset by the nav's own height so the section isn't hidden underneath it

### Hero
- Full viewport height (`min-height: 100svh`), content centered both axes; the Nav is invisible here (see above) so the photo reads uninterrupted
- Background: full-bleed photo (`hero.backgroundImage` in content.js), `background-size: cover`
- A soft ivory gradient overlay sits on top of the photo (`20%` opacity at top → `55%` at bottom) so the photo is visible but text stays legible
- Text also has a soft ivory text-shadow/glow for extra contrast insurance against busy photos
- **Glitter effect**: ~16 small soft sparkles scattered across the photo, each twinkling on its own staggered timer (fade + scale via `@keyframes sparkle-twinkle`), plus a slow diagonal light-shimmer band that sweeps across the whole hero on a ~9s loop. Both are `pointer-events: none` (decorative only) and disabled under `prefers-reduced-motion`
- Content, top to bottom: eyebrow tagline → couple's names (h1) → the scratch-reveal card (date + countdown, see below)
- Max content width 40rem, centered

### Scratch Reveal
- A realistic scratch-off card (`src/components/ScratchReveal.jsx`) covers **both** the wedding date and the countdown together — scratching it away reveals them as one unit, not the countdown separately
- Sized generously ("big"): the card's content area has roomy padding (`--space-3`/`--space-4`) and a `min-width` so it reads as a proper card, not a tight label
- **Red paper-like texture**: a deep-red gradient base (`#8f231f` → `#b5322f` → `#7a1a17`), fine diagonal fiber lines, and randomized speckle grain drawn onto the canvas — reads as textured paper, not a flat foil color
- **Falling debris**: while scratching, small colored fragments (matching the paper's red tones) spawn at the scratch point and animate falling downward with a slight rotation and fade-out (~0.9s, CSS `@keyframes`), like actual scratch-off flakes coming loose. Spawned probabilistically per scratch move so it doesn't flood the DOM; skipped under `prefers-reduced-motion`
- The revealed date is now the **larger** element (`clamp(1.75rem, 4.5vw, 2.75rem)`, serif) with the countdown shown smaller beneath it (`clamp(1.1rem, 3vw, 1.5rem)` per digit) — the reverse of an earlier iteration
- Countdown: four stat blocks in a row (Days / Hours / Minutes / Seconds), wraps on narrow screens; small uppercase muted label underneath each; updates live every second
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
- Below the timeline: an embedded Google Map (key-free, built from `content.mapAddress`, currently "Winsome Resorts and Spa, Jim Corbett"), bordered, 320px tall (220px on mobile)
- A **"Get Directions"** button sits below the map — links to `google.com/maps/dir/?api=1&destination=<mapAddress>`, opens in a new tab, drops the visitor straight into turn-by-turn navigation

### Gallery
- White/surface section, rebuilt as a **slideshow**, not a plain grid
- A large main frame (max-width 40rem, 4:3 aspect ratio) shows the currently-featured photo; clicking it opens the existing fullscreen lightbox (dark overlay, close × and prev/next ‹ › controls, all ≥44px tap targets)
- A horizontally-scrollable strip of small thumbnails (64×64px) sits below the main frame — clicking one instantly features that photo in the main frame; the active thumbnail gets an accent-colored border and full opacity, others sit at reduced opacity
- **Auto-advances** left to right on its own (every 4s) when left untouched; selecting a photo (thumbnail click, or prev/next inside the lightbox) resets that timer so it restarts counting from whatever you just picked, and it pauses entirely while the lightbox is open

### Blessings
- White/surface section. Guest messages shown as individual sticky notes with **rounded corners** (`border-radius: 0.85rem` — no longer sharp-cornered), 4 rotating pastel colors, slight rotation per note, soft drop shadow, each showing the message, "— name, side" attribution, and a small muted date
- Data comes from a shared `useBlessings` hook (`src/hooks/useBlessings.js`): fetches from the Apps Script backend on mount, then polls every **10s** in the background so guests see new blessings from others without refreshing
- **Layout — floating circular cloud (>700px)**: non-"mine" notes are arranged in a golden-angle spiral within a **fixed-size** square container (`.blessings-cloud`, capped at 700px, doesn't grow). The whole ring, the note size, and the empty center all solve for one thing — every note's edge stays clear of every other note's edge and of the center hub, with the outermost note staying inside the container edge (`buildCloudLayout()` in `Blessings.jsx`, using the ring's actual measured pixel size, not just CSS percentages). Note size shrinks (down to a floor) as the count climbs so this keeps holding rather than clipping or overlapping; font size and padding scale down proportionally via a `--note-scale` CSS variable. Each note's message is clamped to 2 lines so its footprint is predictable regardless of message length — full text is one tap away via the lightbox
- **Slow clockwise orbit, gentle bob**: the whole ring continuously rotates as one unit (`.blessings-cloud__spin`, `rotate(360deg)` over 130s, `linear infinite`). Each note has a counter-rotating wrapper (`.cloud-item__counter-spin`, the same duration in reverse) so its own text stays upright — only its orbital position sweeps around the circle. Notes are keyed by their own signature (not their index in the list), so a note's DOM element — and its counter-spin timer — survives the list reordering itself as new blessings arrive; keying by index instead caused already-rendered notes to remount and visibly snap to the wrong rotation. Layered on top is each note's independent, light up/down bob (`.cloud-item__float`, ±5px, not a big float)
- **Center hub**: a non-spinning zone at the exact middle of the cloud, sized from its own measured content so the ring always leaves it clear. Holds two things, stacked: the visitor's own just-submitted blessing this session ("mine" — tracked client-side only, resets on reload), shown static with a soft gold glow ring around it rather than joining the orbit; and a **"View All Blessings"** button that's always present, linking to the dedicated Blessings Wall page (see below)
- **Layout — mobile fallback (≤700px)**: falls back to the original responsive grid (`repeat(auto-fill, minmax(220px, 1fr))`) instead of the cloud — absolute-positioned circular packing (and the orbit) doesn't work at narrow widths, so this switches automatically via a `matchMedia` check (`useIsWide` hook), not a CSS-only media query, since the notes' positions are computed in JS. "Mine" (if present) shows enlarged above the grid in its own row; "View All Blessings" sits as a button below it
- Clicking any note opens it enlarged in a centered lightbox (dark overlay, no rotation, larger text), reusing that exact note's own color (not always the first palette color) so it doesn't visually swap when opened; closes via the × button or clicking outside the note
- Empty state: "No blessings yet — be the first to leave one!" with a button linking to the Blessings & RSVP section
- **Blessings Wall page** (`src/components/BlessingsWallPage.jsx`, route `#/blessings-wall`): a dedicated page — not a modal — reached via the "View All Blessings" button, titled "Blessings Wall" (both the `<h1>` and the browser tab title), listing *every* blessing in a simple bordered-card list, newest first (reuses the `entries` array as already ordered by the backend/hook). A "← Back to the invitation" link returns home. Routed with a minimal hash check in `main.jsx` (no router library — the site has exactly one extra route) rather than a real path, since GitHub Pages can't serve a fallback for arbitrary paths on refresh

### Blessings and RSVP
- White/surface section. A custom-built form (not a Google Form embed) with 2 tabs — "Send Blessings" and "RSVP" — sharing one bordered container, submitting to the same Apps Script backend as the Blessings wall
- Both tabs include a Bride Side / Groom Side radio selection
- RSVP fields: name, side, attending (Joyfully accept / Regretfully decline), number of guests, and **"Parking required?" (Yes/No)** — replaced an earlier free-text dietary-restrictions field
- On successful blessing submission: the page auto-scrolls (smooth, centered) up to the guest's new note on the Blessings wall via `scrollIntoView`, so they immediately see their own message featured
- On successful RSVP submission: inline confirmation message, plus a **"Share via WhatsApp"** button — pre-fills a `wa.me` message with the submitted name/side/attending/guests/parking so the guest can forward their RSVP directly. Opens `content.integrations.whatsappNumber`'s chat if set, otherwise opens WhatsApp's contact picker
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
- Gallery's thumbnail strip scrolls horizontally rather than reflowing, so it works the same way at any width
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
