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
| `--color-accent` | `#b08968` (muted gold / terracotta) | Links, event times, FAQ +/− icons, hover states, `&` connectors, dividers |
| `--color-burgundy` | `#8f3350` (royal burgundy) | Couple names, scratch card border, nav trigger, drawer highlights |
| `--color-border` | `#e6ddd2` | Hairline borders, section dividers, card frames |

Design intent: warm, neutral, editorial — luxury royal Indian wedding aesthetic. Rich burgundy and muted gold accents used intentionally across typography, frames, and icons.

## 2. Typography

| Role | Font | Notes |
|---|---|---|
| Couple Names | **Alex Brush** | Cursive script (`var(--font-cursive)`), used for bride & groom names on the Invitation, Nav drawer, and Footer |
| Headings (h1/h2/h3) & Accents | **Playfair Display** | Serif (`var(--font-heading)`). Weight 400/600, used for titles, `&` connector, and revealed date |
| Body & Lineage | **Cormorant Garamond** | Classic editorial serif (`var(--font-body)`), used for translations, parentage, and body text |
| Sanskrit shloka (Shree Ganesh) | **Tiro Devanagari Sanskrit** | Falls back to `--font-heading`, serif — see Shree Ganesh below |
| Numeric / Date Figures | **Lining Figures (`lining-nums`)** | Applied globally (`font-variant-numeric: lining-nums`) so all digits (0–9), dates, event times, and countdown counters sit on a uniform baseline with equal cap-height proportions |

Loaded via Google Fonts `<link>` in `index.html` (no npm font package).

### Invitation Typography Scale
- **Tagline**: `0.95 rem` (`Playfair Display`, uppercase, tracked)
- **Intro text**: `1.25 rem` (`Playfair Display`, italic)
- **Couple Names**: `4.20 rem` (`Alex Brush`, cursive, burgundy `#8f3350`)
- **Relation ("Daughter of / Son of")**: `1.10 rem` (`Cormorant Garamond`, italic)
- **Parents Names**: `0.90 rem` (`Cormorant Garamond`, weight 500)
- **Connector `&`**: `2.40 rem` (`Playfair Display`, italic, gold `#b08968`)
- **Revealed Date**: `1.85 rem` (`Playfair Display`, serif)
- **Countdown Numbers**: `1.35 rem` (`Playfair Display`)
- **Countdown Unit Labels**: `0.70 rem` (uppercase, tracked)

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
- **Section padding**: asymmetric — `--space-3` (32px) top, `--space-5` (96px) bottom, `--space-2` (16px) sides on desktop (top is intentionally tighter than bottom, so there isn't a large gap between a section's top divider and its heading); drops to `--space-2` (16px) top / `--space-4` (64px) bottom on screens ≤600px
- **Section alternation**: every other section (Event Details, Gallery, Blessings) uses `.section--surface` — white background with a hairline top/bottom border — to break up the ivory page background. Shree Ganesh, Invitation, Meet the Couple, Blessings & RSVP, FAQ sit on the plain ivory background.
- **Section heading**: centered, eyebrow label above an `h2`, `--space-4` margin below (`--space-3` on mobile)

## 5. Page Structure (top to bottom)

0. **Envelope Intro** — full-screen gate shown once per session, before everything else is interactive (see §6 for detail)
1. **Shree Ganesh** (`#shree-ganesh`) — full-height sacred invocation screen with Lord Ganesh crest & shlokas
2. **Invitation** (`#invitation`) — standalone wedding invitation, lineage, and scratch card date reveal
3. **Meet the Couple** (`#couple`)
4. **Event Details** (`#details`, includes map)
5. **Gallery** (`#gallery`)
6. **Blessings** (`#blessings`)
7. **Blessings and RSVP** (`#blessings-rsvp`)
8. **FAQ** (`#faq`)
9. **Footer** (`#footer`)

Each section is a "frame" you can jump to directly — every section above has a stable `id`, used both by the Nav links and by the section frame-nav (below).

### Section frame-nav (home / up / down arrows)

The bottom-right floating control cluster (`FloatingControls.jsx`), top to bottom: an **Envelope button** (`HomeButton.jsx`) with an envelope icon — reopens the interactive 3D Envelope invitation intro; a pair of stacked up/down arrow buttons (`src/components/SectionNav.jsx`); then the music mute button. Clicking up/down jumps to the previous/next section's top edge using the same eased scroll as the Nav links. The current section is tracked from scroll position; the up arrow disables at the first section (Shree Ganesh), the down arrow disables at the last (Footer). A short animation lock (~750ms, matching the scroll duration) ignores further clicks mid-scroll.

---

## 6. Section-by-Section Detail

### Envelope Intro
- Full-viewport scene (`EnvelopeIntro.jsx`, `position: fixed`, `z-index: 1000`) shown once per browser session before any content is interactive; page scroll is locked (`body { overflow: hidden }`, toggled in `App.jsx` off of `opened` state) while it's up. Persisted via `sessionStorage`, so it doesn't replay when navigating to/from the Blessings Wall page.
- Opens with realistic 3D flap rotation (`rotateX(150deg)`), card emergence, 180° flip to the monogrammed back face, and smooth fly-in animation to the invitation.
- **Envelope Specifications**: Width `min(18rem, 80vw)` (`288px`), Height `14rem` (`224px`), Lord Ganesh crest `165px`, Monogram wax seal `72px`.
- **Revealed Card Specifications**: Inset `20px`, Height `150px`, Top offset `-34px`, Names: **Playfair Display** `1.4rem` in deep wine burgundy (`#6b1d33`), Divider spacing `10px`, Venue: `0.6rem` uppercase across two lines (*Winsome Resorts and Spa* / *Jim Corbett*) in crisp black (`#000000`), Back face monogram seal `62%`.

### Navigation Drawer (Nav)
- **Top bar is completely hidden** across all pages for a clean, distraction-free aesthetic.
- **Floating Hamburger Button**: Appears smoothly at the top-left of the viewport (`top: 1.25rem; left: 1.25rem; position: fixed`) starting from the 2nd screen (`#invitation`) onwards when scrolled past Shree Ganesh. Styled as a glassmorphic circular icon button with gold border.
- **Slide-out Navigation Drawer**:
  - Drawer slides in smoothly from the left (`max-width: 320px`, glassmorphic ivory background with blur).
  - Header displays the circular monogram logo, couple title (**Mahek** *[Alex Brush]* **&** *[Playfair gold italic]* **Yash** *[Alex Brush]*), and a circular close button.
  - Links list with gold chevron indicators:
    1. **Shree Ganesh** (`#shree-ganesh`)
    2. **Invitation** (`#invitation`)
    3. **The Couple** (`#couple`)
    4. **Events** (`#details`)
    5. **Gallery** (`#gallery`)
    6. **Blessings** (`#blessings`)
    7. **RSVP** (`#blessings-rsvp`)
    8. **FAQ** (`#faq`)
  - Clicking any link smoothly scrolls to the target with zero offset and auto-closes the drawer.

### Shree Ganesh (`#shree-ganesh`, `ShreeGanesh.jsx`)
- **Sacred Invocation Screen**: Pure spiritual focus on Lord Ganesha and Lord Vishnu blessings.
- **Ganesh Crest**: Centered image (`230px`, `public/images/lordganesh/ganeshWithoutBackground.png`).
- **Glow Aura**: `🌸 Golden Rose` halo (`.shree-ganesh__ganesh-glow`, `inset: -20%`, radial gradient with `rgba(230, 155, 165, 0.75)` core and `rgba(216, 150, 76, 0.5)` mid, `filter: blur(5px)`), pulsing softly with a tranquil `5.5s` breathing rhythm (`opacity: 0.75`, `scale: 1.0`).
- **Devanagari Shlokas**:
  1. Ganesha shloka (*Vakratunda Mahakaya...*) with English translation.
  2. Ornamental gold diamond divider line (`.shree-ganesh__shlok-divider`).
  3. Vishnu Mangalam verse (*Mangalam Bhagwan Vishnuh...*) with English translation.
- **Bouncing Gold Scroll-Down Button**: Centered circular button at the bottom that smoothly scrolls directly to the Invitation screen (`#invitation`).

### Invitation (`#invitation`)
- **Dedicated 2nd View**: Extracted as a standalone component (`Invitation.jsx`) top-aligned with no dead space.
- **Header**: Tagline (`hero.tagline`, "With All The Blessings").
- **Body**:
  - Invitation phrase: *"We cordially invite you on the auspicious union of"*
  - Bride block: **Mahek** (`4.2rem` Alex Brush cursive) &rarr; *"Daughter of"* (`1.1rem` Cormorant Garamond italic) &rarr; *"Smt Deepa Gupta and Shri Rajeev Gupta"* (`0.9rem` Cormorant Garamond 500).
  - Center connector: **`&`** (`2.4rem` Playfair Display italic in gold accent `#b08968`).
  - Groom block: **Yash** (`4.2rem` Alex Brush cursive) &rarr; *"Son of"* (`1.1rem` Cormorant Garamond italic) &rarr; *"Smt Renu Gupta and Shri Sandeep Kumar Gupta"* (`0.9rem` Cormorant Garamond 500).
- **Divider**: Thin gold lines with centered diamond marker.
- **Scratch-to-Reveal Card**: Covers the wedding date and live countdown.

### Scratch Reveal (`ScratchReveal.jsx`)
- **Unrevealed Canvas View**:
  - Deep crimson paper-grain texture with fine diagonal fibers and speckles.
  - Delicate gold inner border frame.
  - **Couple's Initials Monogram Logo** (`public/images/monogram/monogramCircularWithoutBg.png`) rendered in the center (`78px` × `78px`).
  - **"SAVE THE DATE"** title (`10px`, `Playfair Display` 600) and **"Scratch to reveal"** subtitle (`12px`, `Cormorant Garamond` italic 400) below the logo.
  - **Scratch Physics**: Scratching clears both the paper texture and monogram logo with organic debris particle flakes falling away.
- **Revealed Card View**:
  - Framed with an elegant **burgundy border** (`1.5px solid var(--color-burgundy)`), `0.75rem` rounded corners, glassmorphic ivory background (`rgba(255, 255, 255, 0.95)`), and soft burgundy elevation shadow.
  - **Wedding Date**: `1.85rem` `Playfair Display` serif (`December 6, 2026`).
  - **Live Countdown**: Days, Hours, Minutes, Seconds in single row (numbers `1.35rem`, unit labels `0.70rem`).
  - Automatically triggers celebratory **Confetti Burst** on reveal.

### Meet the Couple
- Bride and groom cards sit side by side (`.couple-profiles__cards`, `grid-template-columns: 1fr 1fr`) — **no photo** in either card
- Each card shows: name (h3), then a **grandparentage block** and a **parentage block**, each rendered as 4 lines (`Lineage` component in `MeetCouple.jsx`) — a label ("Granddaughter/Grandson of", "Daughter/Son of"), the first person's name, a small muted "&", then the second person's name. Data for this lives at `content.coupleProfiles.bride/groom.grandparentage/parentage`, each an object `{ label, person1, person2 }` rather than a single string
- Cards have a visible boundary with rounded corners (`border`, `border-radius: 1.25rem`, white surface background) rather than sitting directly on the page background
- **Cards stay side-by-side at every width, including mobile** — they do not stack into one column like other two-column sections. Below 700px, font sizes and padding shrink instead of reflowing to a single column
- Vector illustration (`content.coupleVectorArt`, currently `public/images/bridengroom/brideNgroom_No_Bg_Vector.png` — a transparent-background PNG, no picture-frame/holder box around it) is **absolutely centered on the shared boundary between the two cards** (`position: absolute; left/top: 50%`, relative to `.couple-profiles__cards`), straddling the bride card's right edge and the groom card's left edge, vertically centered against the cards' height. Sized generously (~256px wide on desktop, ~160px on mobile) — large enough that it does overlap some of the lineage text on narrow screens, which reads as intentional layering rather than a bug

### Event Details
- White/surface section (visually distinct from the ivory sections around it)
- Events shown as interactive **3D Flip Cards** arranged in a centered 2-column grid (`.events-grid`), with the 5th (last) event card placed in the center of the 3rd row.
- **Card Front**: Centered event title (`Playfair Display`, Burgundy `#8f3350`), subtle gold divider line, event date (uppercase, muted), and event time (`Playfair Display`, Gold `#b08968`), with a "Tap for details" hint icon.
- **Card Back**: Tapping/clicking smoothly flips the card 180° (`rotateY(180deg)`) to reveal a one-liner event description, plus metadata rows for **Attire**, **Venue**, and **Note**. An animated burgundy boundary timer stroke (`.event-flip-card__border-timer`, `#8f3350`) traces around the perimeter of the card showing the countdown until it flips back (default 20 seconds, or immediately on tap).
- **Mobile (≤680px)**: Retains the 2-column, 3-row layout with compact sizing, typography, and margins so all 5 cards fit cleanly on mobile screens with the 5th card centered on the 3rd row.
- **"How to reach the venue?" Button**: Sits centered below the event cards (`.event-details__venue-btn`, burgundy pill with map-pin icon).
- **Venue & Travel Popup Modal (`VenueModal.jsx`)**:
  - Opens on clicking "How to reach the venue?".
  - **Auto-Close**: Closes automatically after **30 seconds** (visualized via a subtle top progress timer bar), or immediately when tapping the top-right `✕` close button, clicking the backdrop overlay, or pressing `Escape`.
  - **Content**:
    - Header with venue resort name & address.
    - **QR Code** (`qrcode.react` SVG, scanning navigates to Google Maps location `https://share.google/xZAuCAlAAjEHdfEsY`).
    - **"Get Directions" Button** (opens Google Maps turn-by-turn navigation in a new tab).
    - **Travel Options Guide**: Detailed instructions for **By Road / Cab**, **By Train** (Ramnagar Railway Station), and **By Air** (Pantnagar / Delhi airports).

### Gallery
- White/surface section, rebuilt as a **3D coverflow**, not a slideshow or plain grid
- Photos fan out in perspective around the active one: the centered photo sits large and flat, neighbors recede to either side (`rotateY` + `translateZ` + `scale`, distance-based), farther photos shrink and dim further. Distance-to-center wraps the "short way around" so cycling past the last photo turns whichever direction is closer rather than unwinding all the way back
- Click a side cover to bring it to center; click the centered cover to open the existing fullscreen lightbox (dark overlay, close × and prev/next ‹ › controls, all ≥44px tap targets). Explicit prev/next chevron buttons flank the coverflow, and small dot indicators (one per photo) sit below it — no thumbnail strip
- **Auto-advances** left to right on its own (every 4s) when left untouched; selecting a cover (click, dot, or prev/next inside the lightbox) resets that timer so it restarts counting from whatever you just picked, and it pauses entirely while the lightbox is open
- On narrow screens the coverflow's stage height and 3D perspective shrink and covers widen slightly, but the fan-out mechanic stays the same at every width — it never collapses to a stacked column

### Blessings
- White/surface section. Guest messages shown as individual sticky notes with **rounded corners** (`border-radius: 0.85rem`), 4 rotating pastel colors, soft drop shadow, each showing the message, then "— name" and, on its own line below, "(side)" in parentheses, then a small muted date
- Data comes from a shared `useBlessings` hook (`src/hooks/useBlessings.js`), called **once** at the top of the app (`main.jsx`) and passed down as props — both this section and the Blessings Wall page (below) read the same fetched data rather than each fetching their own copy, so navigating between them never re-triggers the slow Apps Script round-trip. Fetches on mount, then polls every **10s** in the background so guests see new blessings from others without refreshing
- **Layout — tiled wall, not a circular cloud**: a plain CSS grid (`.blessings-tiles`), so non-overlap is guaranteed by the browser's own grid layout rather than any position math. `grid-template-columns: repeat(auto-fill, minmax(...))` naturally lands around **2-3 tiles per row on phones, 4-5 per row at the ≥700px breakpoint** — no per-breakpoint column count is hard-coded. Tiles sit with a few of them offset a handful of pixels up/down (`nth-child` pattern) for a loosely "interlocking," floating look — nothing animates or actually moves
- **Font size scales with message length** (`getMessageScale()` in `Blessings.jsx`): short messages render larger, long ones smaller, so each note reads well without needing a fixed truncation point; a 4-line clamp is just a backstop for unusually long messages
- **At most 15 tiles show at once** (`TILE_CAP`) — the most recent blessings, since `entries` is already newest-first. This keeps the wall itself compact; the full list always lives on the dedicated Blessings Wall page
- **Center hub**: a tile inserted at the midpoint of the tile order (not absolutely positioned — just where it naturally falls in the grid) and spanning the **full width of the grid row** (`grid-column: 1 / -1`), so it's always dead-center horizontally regardless of which column its position would otherwise land on. Holds two things stacked: the visitor's own just-submitted blessing this session ("mine" — tracked client-side only, resets on reload), shown with a soft gold ring rather than the usual rotation/shadow; and directly below it, a **"View All Blessings" button with a slow, permanent glow pulse**, linking to the Blessings Wall page. The button is always present at the hub position, including when there's no "mine" yet or no blessings at all
- Clicking any note opens it enlarged in a centered lightbox (dark overlay, larger text), reusing that exact note's own color; closes via the × button or clicking outside the note
- Empty state: "No blessings yet — be the first to leave one!" above the (button-only) hub tile, with a button linking to the Blessings & RSVP section
- **Blessings Wall page** (`src/components/BlessingsWallPage.jsx`, route `#/blessings-wall`): a dedicated page — not a modal — reached via the "View All Blessings" button, titled "Blessings Wall" (both the `<h1>` and the browser tab title). Same tiled-grid treatment (2-3/row mobile, 4-5/row wide) but with **every** blessing, no cap, newest first. Shows a "Loading blessings…" line during the initial fetch (only relevant if this page is opened directly, e.g. a shared link — reached from elsewhere on the site it renders instantly, since the data's already loaded, see above). A "← Back to the invitation" link returns home. Routed with a minimal hash check in `main.jsx` (no router library — the site has exactly one extra route) rather than a real path, since GitHub Pages can't serve a fallback for arbitrary paths on refresh

### Blessings and RSVP
- White/surface section. A custom-built form (not a Google Form embed) with 2 tabs — "Send Blessings" and "RSVP" — sharing one bordered container, submitting to the same Apps Script backend as the Blessings wall
- Both tabs include a Bride Side / Groom Side radio selection
- RSVP fields: name, side, attending (Joyfully accept / Regretfully decline), number of guests, and **"Parking required?" (Yes/No)** — replaced an earlier free-text dietary-restrictions field
- On successful blessing submission: the form holds on a "Thank you" message for **2 seconds** (so it's actually readable), then automatically navigates to the Blessings Wall page, where the guest's own note is already visible (see above)
- On successful RSVP submission: inline confirmation message, plus a **"Share via WhatsApp"** button — pre-fills a `wa.me` message with the submitted name/side/attending/guests/parking so the guest can forward their RSVP directly. Opens `content.integrations.whatsappNumber`'s chat if set, otherwise opens WhatsApp's contact picker
- **Confetti** (see §10) fires a one-shot burst on every successful submission, blessing or RSVP alike — each submission triggers its own burst independently, so back-to-back submissions each get one
- If the Apps Script backend isn't configured (`content.integrations.appsScriptUrl` empty), both forms fail gracefully with an inline "not connected yet" message rather than erroring

### FAQ
- Ivory section, content narrowed to 40rem and centered (narrower than the 1000px page max-width, since Q&A reads better in a tighter column)
- Accordion: each question is a full-width button with a +/− indicator (accent color) on the right; only the answer for the clicked question is shown, clicking again collapses it
- Hairline divider under each question

### Footer
- Simple centered sign-off: couple's names (`Alex Brush` cursive in burgundy `#8f3350`, with `Playfair Display` italic gold `&`) + wedding date (`Playfair Display` serif `#2e2b28`)
- Generous top/bottom padding (`--space-4`)

---

## 7. Responsive Behavior

- Mobile-first breakpoints, primarily at `480px`, `600px`, and `700px` — since most guests are expected to open this on a phone, mobile is treated as the primary layout, not an afterthought
- Nav collapses to a hamburger menu ≤700px (see Nav section above)
- Event Details maintains a centered 2-column, 3-row flip card grid (with the 5th card centered on the 3rd row) across mobile, tablet, and desktop (see Event Details section above)
- Gallery's coverflow shrinks its stage height/perspective and widens covers slightly on narrow screens, but keeps the same fan-out mechanic (no reflow to a stacked column) at any width
- **Meet the Couple is the one exception to "stack on mobile"** — it deliberately keeps bride/groom side-by-side at every width, shrinking sizes instead of stacking (see Meet the Couple section above)
- Blessings switches from the circular floating cloud to a plain grid ≤700px (see Blessings section above)
- The floating bottom-right controls (section arrows + music button) shift slightly closer to the corner (`--space-1` instead of `--space-2`) on screens ≤480px
- All interactive elements maintain a 44px minimum touch target

## 8. Images

Current placeholder photos are 6 free-to-use stock images (via Lorem
Picsum, sourced from Unsplash's royalty-free library) at
`public/images/gallery/placeholder-01.jpg` through `placeholder-06.jpg`,
random landscape/scenery shots — no copyrighted/trademarked imagery. See
`README.md` for how to swap in real photos.

## 9. Background Music

- Site-wide looping background audio (`src/components/MusicPlayer.jsx`), controlled by a circular mute/unmute button, part of the bottom-right `FloatingControls` stack (see §5's section frame-nav) alongside the up/down arrows — shared `.icon-button` style (44px, white surface, hairline border, soft shadow, accent-colored icon)
- Attempts to autoplay on load; if the browser blocks autoplay-with-sound (standard behavior until the visitor interacts with the page), it starts on the visitor's first click/tap anywhere on the site
- Button icon swaps between a sound-on and sound-off (crossed-out) speaker glyph based on mute state
- Hidden entirely — no button rendered at all — until a real audio file is configured (`content.music.src`), same "absent until configured" pattern as the Blessings backend. Currently set to `public/audio/background-music.mp3`. See `README.md` → "Background music" for where to legally source a track if you swap it out (music carries real copyright risk, unlike the stock photos above, so nothing was bundled by default originally)

## 10. Sparkle & Celebration Effects

Three small decorative components, layered on top of the page content, independent of any one section. All are `pointer-events: none` (never block clicks) and disabled outright under `prefers-reduced-motion`.

- **Page Sparkles** (`PageSparkles.jsx`) — ~10 small twinkle dots at fixed positions scattered across the full viewport, each fading/scaling in on its own staggered timer, visible no matter which section is scrolled into view. Distinct from Shree Ganesh's own sacred ambient shimmer and sparkles
- **Cursor Sparkle Trail** (`CursorSparkleTrail.jsx`) — small gold star-shaped sparkles spawn at the pointer as it moves and fade out over ~700ms, capped at ~20 concurrent so it stays light. Skipped entirely on touch/coarse-pointer devices (no hover cursor to trail)
- **Confetti Burst** (`ConfettiBurst.jsx`) — a one-shot, full-viewport burst of ~90 pieces (mixed accent/ivory/dark tones, matching the palette) that fall and fade over ~3.6s. Fires on successful Blessing or RSVP submission (see Blessings and RSVP above) and on scratching the Invitation scratch card fully open; each trigger fires its own independent burst

---

## How to request a change

Edit the value(s) above (e.g. change the accent color hex, swap a font,
adjust a spacing number, change a section's layout description) and tell
me what you changed — I'll translate it into the actual CSS/component edits
and rebuild.
