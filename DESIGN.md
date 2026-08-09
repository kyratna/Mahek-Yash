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
| Sanskrit shloka (Hero) | **Tiro Devanagari Sanskrit** | Falls back to `--font-heading`, serif — see Hero below |

Loaded via Google Fonts `<link>` in `index.html` (no npm font package).

| Element | Size |
|---|---|
| `h1` (couple's names in Hero) | `clamp(2.5rem, 6vw, 4rem)` — scales with viewport, min 40px, max 64px |
| `h2` (section titles) | `clamp(1.75rem, 4vw, 2.5rem)` |
| `h3` | `1.4rem` |
| Body text | `1.15rem`, line-height `1.6` |
| Eyebrow labels (e.g. "HOW IT STARTED") | `0.8rem`, uppercase, `letter-spacing: 0.2em` |
| Nav links | `0.95rem`, uppercase, `letter-spacing: 0.04em` (same size on mobile) |

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
- **Section alternation**: every other section (Event Details, Gallery, Blessings) uses `.section--surface` — white background with a hairline top/bottom border — to break up the ivory page background. Hero, Meet the Couple, Blessings & RSVP, FAQ sit on the plain ivory background.
- **Section heading**: centered, eyebrow label above an `h2`, `--space-4` margin below (`--space-3` on mobile)

## 5. Page Structure (top to bottom)

0. **Envelope Intro** — full-screen gate shown once per session, before everything else is interactive (see §6 for detail)
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

### Section frame-nav (home / up / down arrows)

The bottom-right floating control cluster (`FloatingControls.jsx`), top to
bottom: a **Home button** (`HomeButton.jsx`) — scrolls straight back to the
Hero, same house-icon treatment as the other controls; a pair of stacked
up/down arrow buttons (`src/components/SectionNav.jsx`); then the music
mute button. Clicking up/down jumps to the previous/next section's top edge
using the same eased scroll as the Nav links. The current section is tracked
from scroll position (a section "becomes current" once its top has scrolled
to roughly the upper third of the viewport); the up arrow disables at the
first section (Hero), the down arrow disables at the last (Footer). A short
animation lock (~750ms, matching the scroll duration) ignores further clicks
mid-scroll so rapid clicking can't miscompute the target off a stale scroll
position.

---

## 6. Section-by-Section Detail

### Envelope Intro
- Full-viewport scene (`EnvelopeIntro.jsx`, `position: fixed`, `z-index: 1000`) shown once per browser session before any content is interactive; page scroll is locked (`body { overflow: hidden }`, toggled in `App.jsx` off of `opened` state) while it's up. Persisted via `sessionStorage`, so it doesn't replay when navigating to/from the Blessings Wall page
- **Design/animation reference**: modeled on two separate reference sources rather than one — a dusty-rose envelope-opening reel (a competitor product's demo, `adorableinviteswebsites1.netlify.app`) for the choreography, and a still photo of a deep-maroon envelope with a ring-bordered monogram seal for the final color/shape treatment. Rebuilt from scratch in this project's plain JS/CSS, plus two commissioned raster images (see Assets below) — no code copied
- **Deep-maroon envelope, no photo asset**: unlike the rest of the site (which dropped its one background photo, see Hero above), this scene is intentionally the one dark, saturated moment on the whole site — every maroon envelope surface is a single flat `--envelope-maroon-1` (see `--envelope-surface` below — no gradient, that was removed as a source of banding) sitting on a near-black warm backdrop (`--envelope-backdrop-1/2`), with the same inline SVG `feTurbulence` grain trick used elsewhere on the site for paper texture (`--envelope-noise`) standing in for a photographed backdrop

#### Assets: commissioned art
The couple's monogram (an "MY" ligature with a laurel/heart flourish) and the Ganesh crest are AI-generated source images in `public/images/monogram/` and `public/images/lordganesh/`, genuinely alpha-transparent (confirmed via `sips -g hasAlpha`) — no checkerboard-fake-transparency or pre-flattening workaround needed, unlike an earlier generation of these assets. Delivered at 4096px; downsized in place via `sips --resampleHeightWidthMax` to ~500–600px before use (comfortably sharper than any on-page render size while cutting file size roughly two orders of magnitude) rather than kept at full resolution.

Four files, each used in exactly one shape/context, referenced through the `asset()` helper in `content.js` so they resolve under Vite's `base` path:
- `ganeshCutoutWithoutBg.png` — the crest above the envelope in the Envelope Intro (`.envelope-intro__ganesh`, 165px)
- `ganeshWithoutBackground.png` — Hero's own Ganesh mark (`.hero__ganesh-art`, replacing an earlier hand-built SVG icon — see Hero below); a separate, tighter cutout of the same source art than the Envelope Intro's crest above
- `monogramCircularWithoutBg.png` — already cropped onto its own circular blush disc (transparent only outside the circle) — the flap's seal button, and the nav-bar logo
- `monogramWithoutBg.png` — the monogram + flourish only, no disc, genuinely transparent — the card's back face, composited live onto `--card-back-fill` rather than pre-flattened onto one fixed color, so that fill can be retuned freely without re-exporting the art

- **Flap and body read as one solid rounded card, not two stacked shapes, and the card is only ever visible through the flap's own triangular silhouette** — not the flap's full rectangular bounding box. Structure: `.envelope-box__flap-backing` sits full-width under everything, so the top band is always envelope-colored no matter what; on top of it, `.envelope-box__flap` is a separate `<div>` that owns the open animation. Its actual triangle silhouette (flat top edge, point at the envelope's vertical center) is `.envelope-box__flap-fill`, a plain `<div>` shaped via `clip-path`, sitting behind a small `<svg>` that draws a darker V outline stroke (`rgba(0,0,0,0.4)`, `strokeWidth: 4`) along the fold's two diagonal edges only — not the flat top edge — on top of it, rather than a full rectangle: a rectangle here was tried and rejected, since it let the card become visible the instant the flap started lifting, regardless of shape, instead of peeking through a point that widens as the flap opens, which is what actually reads as "envelope" rather than "lid." **The lid's base is deliberately held back from both top corners** (`--flap-corner-inset: 5%`, slightly wider than `--card-radius`'s ~4.2% of this box), so no lid geometry ever reaches the envelope's rounded corners — the crease polyline's endpoints are inset to match. This is the third attempt at that corner and the only one that holds: `.envelope-box__flap-surface`'s own `border-radius` + `overflow: hidden` stops clipping once `.envelope-box__flap` sets `transform-style: preserve-3d` (children get their own 3D rendering context and escape the parent's clip), and moving the `border-radius` onto `.envelope-box__flap-fill` itself still left a sliver, because a rounded corner drawn in the lid's *local* space is foreshortened by `cos(150°)` once rotated and so can never trace the backing's un-rotated corner. Simply keeping the lid out of the corner sidesteps the mismatch entirely, and is invisible while closed since the backing behind it is the identical colour. `.envelope-box__flap` (the element that owns the `rotateX`) sets `transform-style: preserve-3d` so its children genuinely rotate in 3D rather than being flattened into the parent's plane. **`.envelope-box__flap-surface` deliberately does NOT set `backface-visibility: hidden`** — an earlier pass did, which made the lid pop out of existence the moment it passed 90°, so the animation read as the flap falling *into* the screen and left the seal apparently floating free of the envelope. Showing the backface is both physically right (you see the underside of a real flap once it's past vertical) and artifact-free here, because the lid is a left-right symmetric triangle in one flat color with a symmetric crease, so its mirror image is identical to its front. `.envelope-box__flap-backing` — the envelope's inside back wall — is a **static full rectangle** that never animates or changes shape, which is what a real envelope shows once its flap swings away. An earlier version animated it down into a triangle in step with the lid; that caused two bugs at once (a second, rectangular thing appeared to "open" alongside the lid, and its narrowing lower corners turned transparent right where the risen card sits, so the envelope looked like it vanished behind the card) and is deliberately not reinstated. The fold depth (`--flap-apex`) is a classic banker-style **50%** — the crease point reaches the envelope's exact vertical center, where the seal sits directly on top of it, covering the tip
- **One surface token, no per-surface shading — this is what "seamless" depends on.** Every maroon face of the envelope (the body, the inside back wall, and the lid) sets exactly `background: var(--envelope-surface)` plus the matching `background-blend-mode: overlay, normal`, and nothing else. `--envelope-surface` is a flat `--envelope-maroon-1` with `--envelope-paper-grain` (a tiled `feTurbulence` data-URI) blended over it. Three separate things had to be removed to get here, each of which had been reintroducing visible banding on the closed envelope:
  1. the body ran a `maroon-1 → maroon-2` **gradient** while the lid above it was flat `maroon-1`, so the two never matched at their shared edge;
  2. the lid carried a black `linear-gradient` **shade overlay** (`envelope-flap-shade`) darkening it toward the fold, making it read as a different tone again;
  3. grain was drawn per-element with an **SVG `feTurbulence` filter**, whose `baseFrequency` is evaluated in each element's *own* local coordinate space — the identical filter therefore rendered finer grain on the lid's wide `288`-unit viewBox than on the body's `100`-unit one. A plain tiled raster `background-image` has no such per-element rescaling.
  If a surface ever needs to look different, change the token, not one caller — any gradient, tint, or shading overlay added on top of `--envelope-surface` brings the banding straight back.
- **The one sanctioned exception is the open lid — and, matching it, the triangular patch of backing directly behind it.** `.envelope-box__flap--open .envelope-box__flap-fill` swaps in `--envelope-flap-shadow` (a deeper maroon) over `FLAP_OPEN_DURATION`, so the lid darkens exactly as it lifts — once swung past vertical it is showing the viewer its underside, angled away from the light, and that shading is what makes the open envelope read as a real object with an inside and an outside rather than a flat cutout. It is scoped strictly to the open state: while closed the lid renders plain `--envelope-surface` like every other face, which is what keeps the closed envelope seamless. Without a matching change, though, the newly-exposed wall behind the lid (`.envelope-box__flap-backing`) stayed the light closed-envelope tone, so the open envelope read as the lid darkening while the interior right behind it — and behind the risen card, whose whole vertical span sits inside the backing's height — did not. `.envelope-box__flap-backing-shade`, a child of the backing, fixes this: same `--envelope-paper-grain` + `--envelope-flap-shadow` recipe as the lid's own darkened fill, fading in via `opacity` (not `background-color`, since it's a separate layer stacked on top rather than a replacement) over the same `FLAP_OPEN_DURATION`. **It's shaped as a triangle** (`clip-path: polygon(0% 0%, 100% 0%, 50% 100%)`, no `--flap-corner-inset` needed — unlike the lid, this layer is static and never rotates in 3D, so the parent's ordinary `border-radius` + `overflow: hidden` already clips its corners correctly) matching *only* the footprint the lid itself covers, not the full backing rectangle — the backing also extends into the two side "wedges" beside that triangle purely as safety-net coverage for the lid's rotating bounding box (see the lid's own construction note above), which were never meant to read as real interior surface and stay the normal lighter tone in both states.
- **Closed-state edge shadow**: `.envelope-box__flap-fill` also carries `filter: drop-shadow(0 3px 4px rgba(0,0,0,0.45))` while closed, so the flush, colour-matched flap reads as a physical piece of paper resting on the envelope rather than flat artwork. `filter: drop-shadow`, not `box-shadow` — box-shadow follows the element's rectangular box, ignoring `clip-path`, so it would shadow the full rectangle instead of the triangle; drop-shadow traces the actual clipped silhouette. The downward offset on a shape that's wide at the top and narrows to a point means the shadow only shows up along the two diagonal fold edges (falling onto the side wedges/body beside the lid) — the flat top edge casts effectively none, since the shifted copy's top region stays covered by the original shape, so there's no halo around the envelope's own outer silhouette. Removed (`filter: none`) in the same `--open` rule as the darkening above, transitioning together over `FLAP_OPEN_DURATION` — a flat 2D filter doesn't track the lid's 3D perspective tilt once it's rotating, and the open state already has the darkened-underside cue to read as physical.
- **Closed-state fold outline**: the fold `<polyline>` (see above) is deliberately stroked only along the two diagonal edges, which meet at roughly 90° at the fold's apex — the flat top edge stays unstroked, since it's not part of the fold and the drop-shadow above already seams it against the body. Paired with the drop-shadow, this is what sells the flap as a distinct, physically-folded piece of paper rather than a flat triangle painted on the envelope.
- The body also carries a thin decorative `<polyline>` V (`.envelope-box__body-seam-line`, very low-alpha) tracing where a real diamond-flap envelope's tucked side flaps would seam. That polyline's wrapping `<svg>` needs an explicit CSS `width: 100%` (not just `inset-inline: 0`) — an absolutely positioned SVG root with an intrinsic ratio computes an "auto" width from that ratio times its explicit height rather than stretching to fill its container, so without it the svg rendered as a square clipped to the left edge, leaving the right ~57% of the body untouched by whatever it was drawing
- **The flap opens up and toward the viewer, not back into the screen** — `rotateX(150deg)` (positive), hinged at `transform-origin: top center`, staying fully opaque throughout (no opacity fade — it's a solid piece of paper, not a fading ghost). An earlier pass used a negative angle, which tipped the flap away from the viewer like a trapdoor; real hands lift a flap up and toward themselves, so the sign was flipped
- **The seal lifts together with the flap instead of just vanishing**: the seal `<button>` is nested *inside* `.envelope-box__flap` (not a sibling positioned independently), anchored to the flap's own bottom edge (`top: 100%` of the flap box, not `--flap-apex` again — that would double-apply the envelope-relative percentage). Being a child, it inherits the flap's `rotateX` **in full** — deliberately *not* counter-rotated — so it travels with the fold edge the way wax stuck to paper would, and stays mounted (not conditionally unmounted) so it's there to animate; clicks past the first tap are already blocked by `.envelope-intro--open { pointer-events: none }` on the root, so no extra guard is needed. An earlier version cancelled the parent rotation (`rotateX(-150deg)`) to keep the monogram flat and readable, but paired with the lid vanishing at 90° (see above) that left the seal apparently detached, sailing up the screen on its own. Since it does turn away from the viewer as the lid passes vertical, `.envelope-box__flap--open .envelope-box__seal` fades it out over `FLAP_OPEN_DURATION` rather than letting it linger as a mirrored, foreshortened disc — by then the card is rising and the seal has served its purpose
- Structure, all siblings inside `.envelope-intro__content`: the **Ganesh crest** (`ganeshCutoutWithoutBg.png`, 165px) → the tagline as an overline → the **envelope box** described above (nudged down from the crest with its own `margin-top`, rather than sitting flush) with the couple's monogram seal at the fold and a card tucked inside, invisible until opened → a Sanskrit invocation ("‖ Shree Ganeshay Namah ‖") → a "tap the seal to open your invitation" hint (italic, no icon)
- **The seal** (`.envelope-box__seal`) is a blush-colored disc (`--seal-fill: #f1dfd4`, chosen distinct from the site's ivory `--color-bg`) sized to sit proportionally at the fold rather than dominate the envelope (72px — a quarter of the envelope's width), ringed with a 3px border in `--card-back-fill` (a darker shade of the envelope itself, not a new one-off color — like a rim pressed into wax), showing the couple's monogram artwork (`monogramCircularWithoutBg.png`, its own circular blush disc already baked in — see Assets above). Its glow is a bright, saturated gold (`rgba(255,207,64,…)`) rather than the site's own muted `--color-accent` (`#b08968`) — a deliberate one-off, since this is the intro's single tap target and is allowed to shine rather than stay tonally polite — and **breathes** rather than sitting static: `@keyframes envelope-seal-glow` pulses the glow layer of its `box-shadow` between a resting and a bloomed spread/blur/opacity on a 2.6s loop, so the seal reads as inviting/tappable before the "tap the seal" hint text is even noticed. The pulse pauses (`animation-play-state: paused`) the instant the flap opens, in the same rule that fades the seal out, and is disabled entirely under `prefers-reduced-motion`
- **Card faces are gold-bordered "invitation card" cardstock, not plain color blocks** — both faces share one ornament system: a thin double-line border (two inset frame elements, `border: 1px solid currentColor`) plus one hand-drawn corner-scroll flourish (`#card-corner-flourish`, a `<symbol>` defined once, reused via `<use>` at all 4 corners and *mirrored* per corner — `scaleX(-1)`/`scaleY(-1)`/`scale(-1,-1)` — rather than rotated, since the motif hugs two edges and isn't radially symmetric). Each face sets its own `color` (`--card-front-frame` bronze, `--card-back-frame` bright gold), which drives both the border and the flourish via `currentColor` — one declaration recolors the whole ornament per face, no duplicated markup. Same `feTurbulence` paper-grain technique as the envelope shell (§ above), tuned subtler here so text/monogram stay crisp
- **Card copy matches the reference photo/reel's structure**, values swapped for this couple's real data: an eyebrow ("The Wedding Of") → names ("Mahek & Yash", from `content.couple`) → a thin divider rule → the wedding date (`content.wedding.displayDate`) → the venue (`content.mapAddress`, uppercase/tracked). The front face's own background is a warm mustard-gold gradient (`--card-front-fill-1/2`), not `--seal-fill` or the site's plain ivory `--color-bg` — matching a reference photo of gold cardstock. The divider, which used to sit on `--color-border` (near-white), now uses `currentColor` (the face's own frame color) instead, since near-white would nearly vanish against gold
- **The card has two faces and flips between them** before flying out — not just a single face that flies away. `.envelope-box__card` is a plain position/transform shell (rise, fly) with `perspective` on it, sitting at `z-index: 5` — above the flap's `z-index: 3` at all times, not only once flying, since the flap's rotated silhouette otherwise pokes over the card's own top corners as it swings past. `.envelope-box__card-inner` is the actual flipping element (`transform-style: preserve-3d`, `rotateY(180deg)` when `.--flipped`), holding two absolutely-stacked `.envelope-box__card-face` children (`backface-visibility: hidden` on both, so only one is ever showing): `--face--front` is the eyebrow/names/date/venue card described above, `--face--back` is a brighter crimson-maroon (`--card-back-fill: #7c1f36`, matching a reference photo — brighter than the envelope's own maroons, not reused, so it reads as turning the card over to a different surface) showing the couple's monogram (`monogramWithoutBg.png`, genuinely transparent, composited live rather than pre-flattened — see Assets above, this is what makes recoloring `--card-back-fill` safe)
- **One tap target — the seal — drives a 5-beat sequence**, each beat timed by its own `setTimeout` in `handleOpen`, deliberately unhurried so it reads as a hand actually opening an envelope rather than a UI transition. Re-tapping the seal mid-sequence is a no-op, guarded by a `hasStartedRef` ref (not `phase`, since `phase` doesn't move off `"closed"` until the first beat below has already elapsed):
  0. **Start delay** (`OPEN_START_DELAY`, 200ms): a pause after the tap, before `phase` changes to `"open"` and anything visibly moves — a beat to register the tap landed before the envelope reacts to it
  1. **Open**: the flap starts tilting up immediately (`rotateX(150deg)`, 900ms, `.envelope-box__flap--open`, seal riding along with it — uncounter-rotated, fading out as it turns away, see above); the card waits a longer beat (`CARD_RISE_DELAY`, 1100ms, a CSS `transition-delay` on `.envelope-box__card`) before it slides up and out at a slight angle and straightens as it settles (`translateY` + `scale` + `rotate(-7deg → 0)`, 900ms, `.envelope-box__card--risen`) — the stagger is what sells "pulled out from behind the flap" instead of both pieces moving in lockstep. The card starts from further inside the envelope than it used to (`translateY(6rem)`, up from `3.2rem`) and its `opacity` transition is now much shorter (0.3s) than its `transform` transition (0.9s, both delayed by `CARD_RISE_DELAY`) — becoming fully visible quickly, then spending the rest of the duration opaque and still moving, is what reads as a physical slide out of the envelope rather than the card fading/materializing into place
  2. **Pause** (`PAUSE_DURATION`, 1600ms): the card just sits there, front face showing, fully settled, so it's actually readable before anything else happens
  3. **Flipped** (`phase: "flipped"`, `CARD_FLIP_DURATION` 700ms + `BACK_PAUSE_DURATION` 800ms): `.envelope-box__card-inner` rotates 180° to the darker monogrammed back face, which then sits for a beat so the seal actually registers before flying
  4. **Flying** (`phase: "flying"`, `.envelope-box__card--flying`): the card — now showing its back face — rushes toward the viewer over `CARD_FLY_DURATION` (900ms), a big scale-up (`scale(7)`) that stays fully opaque and jumps to `z-index: 10`, above every other layer in the scene — it reads as a solid card rushing into the foreground and covering everything behind it, not a ghost fading through them. The rest of the scene (crest, tagline, envelope, hint) still fades and scales down slightly underneath it (`.envelope-intro__content--flying`), a subtler dissolve happening behind the card's own opaque cover. This composes correctly because the fly-out transform lives on the *outer* `.envelope-box__card`, independent of the inner flip transform — whichever face the flip left showing is whatever flies
- **Timing is a config item** at the top of `EnvelopeIntro.jsx`: `OPEN_START_DELAY` (200ms), `FLAP_OPEN_DURATION` (900ms), `CARD_RISE_DELAY` (1100ms), `CARD_RISE_DURATION` (900ms), `PAUSE_DURATION` (1600ms), `CARD_FLIP_DURATION` (700ms), `BACK_PAUSE_DURATION` (800ms), `CARD_FLY_DURATION` (900ms), `SCENE_FADE_DURATION` (700ms). `OPEN_START_DELAY`/`PAUSE_DURATION`/`BACK_PAUSE_DURATION` are pure JS `setTimeout` gaps, not tied to any CSS transition — safe to retune alone. Every other constant *does* have a matching CSS `transition` duration/delay (on `.envelope-box__flap`, `.envelope-box__card`/`.envelope-box__card--flying`, `.envelope-box__card-inner`, `.envelope-box__flap-backing-fill`, and `.envelope-intro__content`) that must be kept in sync by hand — there's no shared config file. The hint's own 3.2s reveal delay is *not* one of these JS constants — it's pure CSS (`animation-delay` on `.envelope-intro__hint`) — deliberately so: the hint is always mounted from first paint (reserving its layout space immediately) and purely fades in in place, rather than being mounted late by a `setTimeout` the way it originally was, which caused the whole scene to visibly reflow around it appearing mid-view
- Degrades to an instant, motion-free transition under `prefers-reduced-motion` (flap/card/card-flip/content transitions removed, hint appears immediately without its fade-in, and still fades out via `.envelope-intro__hint--hidden` once tapped)

### Nav
- **Fixed** to the top of the viewport (`position: fixed`), but starts **hidden** (`opacity: 0`) while the Hero is in view — it fades softly in (`opacity` transition, ~0.4s) once you've scrolled roughly one Hero-height down, so the Hero content is uninterrupted at first glance. Toggled via a scroll listener comparing `scrollY` against the Hero's height, not CSS alone
- The couple's monogram artwork sits in the bar as the logo (`monogramCircularWithoutBg.png`, same asset as the Envelope Intro's seal — see its Assets note), sized larger than an earlier pass (52px vs. an earlier 34px, bar/logo `min-height` bumped to 60px to frame it) — clicking/tapping it scrolls straight back to the Hero
- **Translucent burgundy background** (`rgba(143, 51, 80, 0.82)` — the RGB of a new global `--color-burgundy` token in `index.css`, same hex as the Envelope Intro's own `--envelope-maroon-1`, so the nav reads as the same material family as the envelope, not a second unrelated red), stronger backdrop blur (10px) than an earlier lighter-ivory pass, gold-tinted hairline border (`--color-accent`'s RGB at low opacity) instead of the site's near-white `--color-border`, which would be invisible against this background. Because the bar itself flipped from light to dark, link text (`.nav__list a`) and the hamburger's bars (`.nav__toggle-bar`) flipped from `--color-text` to `--color-bg` (light-on-dark) to stay legible; link hover stays the site's own muted gold (`--color-accent`), which already reads well gold-on-burgundy
- Links: The Couple, Events, Gallery, Blessings, RSVP, FAQ
- **Desktop (>700px)**: logo on the left, links in a row on the right (`justify-content: space-between`)
- **Mobile (≤700px)**: logo centered, hamburger button on the right; tapping the hamburger opens a full-width dropdown list below the bar (recolored to match the bar — a more opaque burgundy, `rgba(143, 51, 80, 0.96)`, since it's a solid panel over page content rather than a translucent strip); the icon animates into an × while open; tapping a link closes the menu automatically
- Each link/the logo has a 44px min-height tap target (mobile accessibility)
- Clicking any nav link (or the logo) doesn't jump instantly — it triggers a custom eased scroll (`src/lib/smoothScroll.js`, ease-out-cubic, ~700ms): fast at first, decelerating into the target section, offset by the nav's own height so the section isn't hidden underneath it

### Hero
- Full viewport height (`min-height: 100svh`), content centered both axes. **No background photo** — a plain `--color-bg` (ivory) background; `content.hero.backgroundImage` and the placeholder image file were removed entirely (nothing references them anymore)
- **Glitter effect**: ~16 small soft sparkles scattered across the section, each twinkling on its own staggered timer (fade + scale via `@keyframes sparkle-twinkle`), plus a slow diagonal light-shimmer band that sweeps across the whole hero on a ~9s loop. Both are `pointer-events: none` (decorative only) and disabled under `prefers-reduced-motion`. Sparkle color is warm gold (`rgba(176, 137, 104, ...)`) rather than near-white — against the flat ivory background a near-white dot barely registered; this was originally tuned for contrast against a busy photo that no longer exists
- Content, top to bottom:
  1. **Ganesh crest** (`.hero__ganesh`, now the same photographic asset as the Envelope Intro's own crest — `ganeshWithoutBackground.png`, see that section's Assets note — replacing an earlier hand-built inline SVG, `GaneshArt.jsx`, since removed), small (64px) and centered, with a soft warm radial glow behind it — a stronger/more saturated glow recipe than the same technique elsewhere on the site, since a softer version nearly disappeared against the very light `--color-bg`
  2. **Sanskrit shloka** (`.hero__shlok`, set in **Tiro Devanagari Sanskrit** — see §2 Typography) — the Ganesh mantra "वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥", hardcoded (not in `content.js` — it's fixed devotional text, not couple-specific data, same precedent as other static phrases already inline in Hero.jsx)
  3. **English translation** (`.hero__shlok-translation`) directly below it, italic, muted, narrower max-width for readability
  4. Eyebrow tagline (`hero.tagline`)
  5. Couple's first names (`h1`, e.g. "Mahek & Yash")
  6. **Invitation paragraph** (`.hero__invite`) — replaced the old shorter parentage line with a fuller formal invitation: "We cordially invite you on the auspicious union of", then the bride's full name (`.hero__invite-name`, styled slightly larger/darker to stand out) and her parents, an "&", then the groom's full name and his parents — all pulled from `content.coupleProfiles`
  7. The scratch-reveal card (date + countdown, see below)
- Max content width 40rem, centered

### Scratch Reveal
- A realistic scratch-off card (`src/components/ScratchReveal.jsx`) covers **both** the wedding date and the countdown together — scratching it away reveals them as one unit, not the countdown separately
- Sized generously ("big"): the card's content area has roomy padding (`--space-3`/`--space-4`) and a `min-width` so it reads as a proper card, not a tight label
- **Red paper-like texture**: a deep-red gradient base (`#8f231f` → `#b5322f` → `#7a1a17`), fine diagonal fiber lines, and randomized speckle grain drawn onto the canvas — reads as textured paper, not a flat foil color
- **Falling debris**: while scratching, small colored fragments (matching the paper's red tones) spawn at the scratch point and animate falling downward with a slight rotation and fade-out (~0.9s, CSS `@keyframes`), like actual scratch-off flakes coming loose. Spawned probabilistically per scratch move so it doesn't flood the DOM; skipped under `prefers-reduced-motion`
- The revealed date is now the **larger** element (`clamp(1.75rem, 4.5vw, 2.75rem)`, serif) with the countdown shown smaller beneath it (`clamp(1.1rem, 3vw, 1.5rem)` per digit) — the reverse of an earlier iteration
- Countdown: four stat blocks in a row (Days / Hours / Minutes / Seconds); small uppercase muted label underneath each; updates live every second. **Stays a single row at every width** — below 600px the blocks shrink to share the available width (`flex: 1 1 0`, `flex-wrap: nowrap`) instead of wrapping to two rows
- After the wedding date passes, replaces the whole countdown with a single hardcoded "We're married!" line (`Countdown.jsx`, no names interpolated)
- **The scratch-off surface itself shows two lines of canvas-drawn text** (not a single label): "Save the date" in a larger heading-weight line, and "Scratch to reveal the date" smaller beneath it. `ScratchReveal` takes both as props (`heading`, defaulting to "Save the date"; `label`, defaulting to "Scratch to reveal the date") — Hero doesn't override either, so it just uses the defaults

### Meet the Couple
- Bride and groom cards sit side by side (`.couple-profiles__cards`, `grid-template-columns: 1fr 1fr`) — **no photo** in either card
- Each card shows: name (h3), then a **grandparentage block** and a **parentage block**, each rendered as 4 lines (`Lineage` component in `MeetCouple.jsx`) — a label ("Granddaughter/Grandson of", "Daughter/Son of"), the first person's name, a small muted "&", then the second person's name. Data for this lives at `content.coupleProfiles.bride/groom.grandparentage/parentage`, each an object `{ label, person1, person2 }` rather than a single string
- Cards have a visible boundary with rounded corners (`border`, `border-radius: 1.25rem`, white surface background) rather than sitting directly on the page background
- **Cards stay side-by-side at every width, including mobile** — they do not stack into one column like other two-column sections. Below 700px, font sizes and padding shrink instead of reflowing to a single column
- Vector illustration (`content.coupleVectorArt`, currently `public/images/bridengroom/brideNgroom_No_Bg_Vector.png` — a transparent-background PNG, no picture-frame/holder box around it) is **absolutely centered on the shared boundary between the two cards** (`position: absolute; left/top: 50%`, relative to `.couple-profiles__cards`), straddling the bride card's right edge and the groom card's left edge, vertically centered against the cards' height. Sized generously (~256px wide on desktop, ~160px on mobile) — large enough that it does overlap some of the lineage text on narrow screens, which reads as intentional layering rather than a bug

### Event Details
- White/surface section (visually distinct from the ivory sections around it)
- Events shown as a vertical **timeline**: a thin center line runs top to bottom, each event connects to it via a small circular marker, and event cards alternate left/right of the line (1st event left, 2nd right, 3rd left, ...)
- Each card: event name (h3) → date (small, uppercase, muted) → time (accent color, larger) only — **no venue name or address on the cards themselves**; the shared map below covers location for all events
- **Mobile (≤700px)**: the line moves to the left edge, every card sits full-width to its right (no more alternating), markers align to the line — a standard single-column timeline
- Vertical spacing between items is intentionally tight (`--space-1` gap, `--space-1`/`--space-3` card padding) since cards are now short (3 lines) — this was widened back down after removing venue/address left too much dead space at the old spacing
- Below the timeline: an embedded Google Map (key-free, built from `content.mapAddress`, currently "Winsome Resorts and Spa, Jim Corbett"), bordered, 320px tall (220px on mobile)
- A **"Get Directions"** button sits below the map — links to `google.com/maps/dir/?api=1&destination=<mapAddress>`, opens in a new tab, drops the visitor straight into turn-by-turn navigation

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
- Simple centered sign-off: couple's names (serif, smaller than Hero) + wedding date (muted)
- Generous top/bottom padding (`--space-4`)

---

## 7. Responsive Behavior

- Mobile-first breakpoints, primarily at `480px`, `600px`, and `700px` — since most guests are expected to open this on a phone, mobile is treated as the primary layout, not an afterthought
- Nav collapses to a hamburger menu ≤700px (see Nav section above)
- Event Details collapses from an alternating left/right timeline to a single-column left-aligned timeline ≤700px (see Event Details section above)
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

- **Page Sparkles** (`PageSparkles.jsx`) — ~10 small twinkle dots at fixed positions scattered across the full viewport, each fading/scaling in on its own staggered timer, visible no matter which section is scrolled into view. Distinct from Hero's own denser "glitter" effect (§Hero above), which only lives on the Hero section itself
- **Cursor Sparkle Trail** (`CursorSparkleTrail.jsx`) — small gold star-shaped sparkles spawn at the pointer as it moves and fade out over ~700ms, capped at ~20 concurrent so it stays light. Skipped entirely on touch/coarse-pointer devices (no hover cursor to trail)
- **Confetti Burst** (`ConfettiBurst.jsx`) — a one-shot, full-viewport burst of ~90 pieces (mixed accent/ivory/dark tones, matching the palette) that fall and fade over ~3.6s. Fires on successful Blessing or RSVP submission (see Blessings and RSVP above) and on scratching the Hero card fully open (see Scratch Reveal above); each trigger fires its own independent burst

---

## How to request a change

Edit the value(s) above (e.g. change the accent color hex, swap a font,
adjust a spacing number, change a section's layout description) and tell
me what you changed — I'll translate it into the actual CSS/component edits
and rebuild.
