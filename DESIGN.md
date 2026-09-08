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
- **Full-Screen Coverage**: Every section (`.section`, `.shree-ganesh`, `.invitation`, `.footer`) occupies a full viewport screen (`min-height: 100vh; min-height: 100dvh; min-height: 100svh; display: flex; flex-direction: column; justify-content: center; align-items: center; box-sizing: border-box; scroll-snap-align: start;`).
- **Scroll Snapping**: `scroll-snap-type: y proximity` on `html` gently aligns each section cleanly to the viewport during wheel, touch, and button navigation.
- **Section Spacing**: Balanced internal padding (`1.75rem 1rem`) and compact component margins ensure all headings, cards, and interactive widgets fit completely within the viewport height without unnecessary scrollbar spillover.
- **Section Alternation**: Alternating sections (Event Details, Gallery, Blessings) use `.section--surface` — white background with a hairline top/bottom border — to contrast gracefully with the ivory page sections.
- **Section Headings**: Centered eyebrow label above an `h2`, `1.25rem` margin below.

## 5. Page Structure (top to bottom)

0. **Envelope Intro** — full-screen gate shown once per session, before everything else is interactive (see §6 for detail)
1. **Shree Ganesh** (`#shree-ganesh`) — full-height sacred invocation screen with Lord Ganesh crest & shlokas
2. **Invitation** (`#invitation`) — standalone wedding invitation, lineage, and scratch card date reveal
3. **Meet the Couple** (`#couple`)
4. **Event Details** (`#details`) — 2x3 interactive flip cards grid + "How to reach the venue?" popup
5. **Gallery** (`#gallery`) — 3D coverflow carousel
6. **Blessings** (`#blessings`) — guest blessings display
7. **Blessings and RSVP** (`#blessings-rsvp`) — interactive RSVP & blessing form
8. **FAQ & Footer** (`#faq`) — frequently asked questions accordion with the footer signature (`Mahek & Yash` and wedding date) integrated at the bottom of the final page

Each section is a full-screen "frame" you can jump to directly — every section above has a stable `id`, used both by the Nav links and by the section frame-nav (below).

### Section frame-nav (home / up / down arrows)

The bottom-right floating control cluster (`FloatingControls.jsx`), top to bottom: an **Envelope button** (`HomeButton.jsx`) with an envelope icon — reopens the interactive 3D Envelope invitation intro; a pair of stacked up/down arrow buttons (`src/components/SectionNav.jsx`); then the music mute button. Clicking up/down jumps to the previous/next section's top edge using the same eased scroll as the Nav links. The current section is tracked from scroll position; the up arrow disables at the first section (Shree Ganesh), the down arrow disables at the last (FAQ & Footer). A short animation lock (~750ms, matching the scroll duration) ignores further clicks mid-scroll.

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
  - **"SAVE THE DATE"** title (`17px`, `Playfair Display` 600 with `0.14em` letter-spacing) and **"Scratch to reveal"** subtitle (`17px`, `Cormorant Garamond` italic 400) below the logo.
  - **Scratch Physics**: Scratching clears both the paper texture and monogram logo with organic debris particle flakes falling away.
- **Revealed Card View**:
  - Framed with an elegant **burgundy border** (`1.5px solid var(--color-burgundy)`), `0.75rem` rounded corners, glassmorphic ivory background (`rgba(255, 255, 255, 0.95)`), and soft burgundy elevation shadow.
  - **Wedding Date**: `1.85rem` `Playfair Display` serif (`December 6, 2026`).
  - **Live Countdown**: Days, Hours, Minutes, Seconds in single row (numbers `1.35rem`, unit labels `0.70rem`).
  - Automatically triggers celebratory **Confetti Burst** on reveal.

### Meet the Couple / Family Section (`#couple`, `MeetFamilies.jsx` / `MeetCouple.jsx`)
- **Sacred Family Shloka & Quote Header**:
  - Sanskrit Shloka (`॥ त्वमेव माता च पिता त्वमेव, त्वमेव बन्धुश्च सखा त्वमेव ॥`) rendered in `var(--color-burgundy)` in `Tiro Devanagari Sanskrit`.
  - Editorial translation quote below in `Cormorant Garamond` italic.
- **Two Side-by-Side Royal Indian Family Cards**:
  - Left: Bride's Family Card (The Gupta Family, location `Moradabad · The City of Brass`, invite phrases, parents in burgundy bold, bride name in Alex Brush cursive, relation tagline).
  - Right: Groom's Family Card (The Gupta Family, location `Moradabad · The City of Brass`, invite phrases, parents in burgundy bold, groom name in Alex Brush cursive, relation tagline).
- **Typography Consistency & Standardization**:
  - City origin standardized to `Moradabad · The City of Brass` (`पीतल नगरी` removed).
  - Relation lines `Their beloved daughter` and `Their beloved son` rendered in `Cormorant Garamond` italic (sentence case, not uppercase).
  - Unified typography across all 6 descriptive/connective card lines: *Auspicious Beginning*, *Moradabad · The City of Brass*, *Under the divine grace & blessings of revered grandparents*, *with their family and loved ones*, *request the pleasure of your company on the auspicious wedding of*, and *Their beloved daughter/son* — all using `font-family: var(--font-body)` (*Cormorant Garamond*), `font-style: italic`, and synchronized clamp sizing `clamp(0.9rem, 1.6vh, 1rem)`.
- **Luxury Double Border & Corner Flourishes**:
  - Outer rounded border (`1.2px solid rgba(176, 137, 104, 0.45)` with `1.25rem` radius).
  - Inset dashed gold inner border (`inset: 8px`).
  - Delicate SVG corner flourish ornaments at all 4 corners (TL, TR, BL, BR) with smooth corner arc loops and decorative ticks.
- **Center Divider with Sacred ॐ**:
  - Vertical golden hairline divider with gold `ॐ` (Om) symbol centered between the cards on desktop.
  - Smoothly converts to horizontal divider with centered `ॐ` when stacked on mobile screens.

### Event Details
- White/surface section (visually distinct from the ivory sections around it)
- Events shown as interactive **3D Flip Cards** arranged in a centered 2-column, 3-row grid (`.events-grid`, total 6 event cards):
  - Row 1: **Haldi** (Dec 5, 12:30 PM) &amp; **Engagement &amp; Sangeet** (Dec 5, 5:00 PM)
  - Row 2: **Godh Bharai &amp; Sagai** (Dec 5, 7:00 PM) &amp; **Baraat &amp; Ghurchari** (Dec 6, 10:30 AM)
  - Row 3: **Jaimaal** (Dec 6, 12:30 PM) &amp; **Phere** (Dec 6, 5:00 PM)
- **Card Front**: Centered event title (`Playfair Display`, Burgundy `#8f3350`), subtle gold divider line, event date (uppercase, muted), and event time (`Playfair Display`, Gold `#b08968`), with a "Tap for details" hint icon.
- **Card Back**: Tapping/clicking smoothly flips the card 180° (`rotateY(180deg)`) to reveal a one-liner event description, plus metadata rows for **Attire**, **Venue**, and **Note**. An animated burgundy boundary timer stroke (`.event-flip-card__border-timer`, `#8f3350`) traces around the perimeter of the card showing the countdown until it flips back (default 20 seconds, or immediately on tap).
- **Mobile (≤680px)**: Retains the 2-column, 3-row layout with compact sizing, typography, and margins so all 6 cards fit cleanly on mobile screens.
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
- White/surface section (`#gallery`), vertically distributed with the section heading anchored at the top, the photo stage in the vertical middle, and controls directly underneath.
- **3D Coverflow Perspective**: Centered active photo sits prominent, while neighbors fan out with calculated `rotateY`, `translateZ`, and `scale`. Distance-to-center wraps the "short way around" so cycling past the last photo turns in whichever direction is closer.
- **Burgundy Frame & Theme Matting**: Each card features a clean **2px solid Burgundy border (`var(--color-burgundy)`)** with a warm ivory/cream background fill (`#ffffff` to `#faf7f2`), perfectly matching the website aesthetic without black borders.
- **Adaptive Image Scaling**: Large DSLR / 4K phone photos in portrait, landscape, or square orientation are scaled down with `object-fit: contain; max-width: 96%; max-height: 96%;` without clipping faces or distortion.
- **Zero-Error Caricature Fallback**: If any image fails to load or while photos are being added, the card seamlessly renders an Indian wedding caricature artwork card (Couple, Mandap, or Sacred Hands) with a decorative caption.
- **Navigation Controls Below Gallery View**: Pill-shaped **‹ Prev** and **Next ›** buttons with SVG chevrons alongside interactive capsule-style pagination dots sit tightly grouped directly underneath the photos.
- **Auto-Advance**: Cycles automatically every 4.5s; user interaction or opening the fullscreen Lightbox pauses the timer.
- **Upload CTA Subtext**: Positioned directly above the upload button: *"Share your captured memories with us"* (`.gallery-upload-action__subtext`), set in `Cormorant Garamond` italic, `0.95rem`, `--color-text-muted`, centered.
- **Guest Upload Action Button**: Centered burgundy pill button (`.gallery-upload-btn`) with camera icon (**`📸 Upload Photos & Videos`**).
- **Guest Upload Modal (`GalleryUploadModal.jsx`)**:
  - Glassmorphic backdrop (`rgba(0, 0, 0, 0.6)`) with blur.
  - Burgundy framed container with ivory surface, gold accents, and close button.
  - Side-by-side Ceremony selector dropdown (Haldi, Engagement & Sangeet, etc.) and Guest Name input (placeholder: `Rahul & Sunita Gupta`).
  - File picker supporting multiple photos/videos and mobile camera capture.
  - Live upload progress bar with animated gold striping, progress counter (`Uploading photo 2 of 5 (40%)`), and file checkmarks (`✓`).

### Blessings
- Ivory/surface section (`#blessings`).
- **Compact 3-Tab Filter Bar**: "Bride's Side", "All Wishes", and "Groom's Side" filter pills with active burgundy indicator and streamlined 15px icons.
- **Curated 2x3 Grid (6 Cards)**: Displays 6 curated wish cards in a clean 2-column, 3-row layout (`--grid-gap: 0.5rem` desktop / `0.45rem` mobile).
- **Strict 3-Line Message Display**: Guaranteed 3-line max height cap with `...` (ellipsis) truncation and 2-line author name wrapping.
- **Interactive Heart Reaction (❤️)**: Guests can click the heart button on any card to increment reactions in real-time, instantly synchronized with Firebase and Google Sheets.
- **Full Text Lightbox**: Tapping on any card opens a centered reading modal with full blessing message.
- **"Tap Card to See Full Message" Hint**: Positioned directly above the bottom action button.
- **"Send Blessings & RSVP" Action Button**: Positioned at the bottom of the section with comfortable breathing room, navigating smoothly to the RSVP section.
- **Dedicated Blessings Wall Page** (`#/blessings-wall`): Reached via the "View All Blessings" link, displaying the complete chronological blessings wall.

### Blessings and RSVP
- White/surface section (`#blessings-rsvp`). Top-aligned layout (`padding-top: var(--space-4)`) anchoring the section heading and tab switcher firmly at the top of the viewport.
- A custom-built form with 2 tabs — "Send Blessings" and "RSVP" — connected directly to Firebase Firestore for 0-latency live updates and Google Sheets ('Wedding Admin System').
- Both tabs include Bride Side / Groom Side selection.
- RSVP fields: Name, Side, Attending (Joyfully accept / Regretfully decline), Guests count, and "Parking required?" (Yes/No).
- **Centered Confirmation Card**: On submission, a burgundy-framed luxury confirmation card is rendered directly in the center of the screen without causing header layout shift.
- **Instant Telegram Bot Integration**: Triggers real-time alerts to the wedding admin Telegram group with a native inline `🗑️ Delete from Live Wall` button.
- On successful RSVP: Confirmation message plus a **"Share via WhatsApp"** button pre-filled with the guest's RSVP details.
- **Confetti Burst**: Fires a celebratory burst of confetti on successful submission.

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
