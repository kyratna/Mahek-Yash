# Our Wedding Website

A React + Vite single-page wedding invitation site: hero with a scratch-to-reveal
date and countdown, a "Meet the Couple" section, event details with a map,
photo gallery, a live Blessings wall, a combined Blessings & RSVP form, and FAQ.

## Running it locally

```
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Customizing the content

Almost everything on the site — names, date, venue, couple profiles, FAQ
answers, photo paths — lives in one file: **`src/content.js`**. Open it and
replace every value marked `// TODO: replace`. No other files need to change
for basic content edits.

### 1. Names & date

Edit `content.couple` and `content.wedding`. Keep `dateTimeISO` in the format
`YYYY-MM-DDTHH:MM:SS±HH:MM` (an explicit timezone offset, not `Z`) so the
countdown timer is accurate for guests in other timezones. The date is
revealed by a scratch card in the Hero — guests scratch it to reveal
`wedding.displayDate`.

### 2. Meet the Couple

Edit `content.coupleProfiles.bride` and `.groom` — each has a `name`,
a `grandparentage` line (e.g. "Granddaughter of ..."), a `parentage` line
(e.g. "Daughter of ..."), and a `photo`. There's also a small illustration
between the two cards, set via `content.coupleVectorArt`.

### 3. Photos

Photos live in `public/images/` and are referenced by path in `content.js`:

```
public/images/hero/       → hero.backgroundImage
public/images/story/      → coupleProfiles.bride.photo / groom.photo
public/images/gallery/    → gallery
```

To swap in your own photos, drop your image files into the matching folder
and update the `src`/`photo` paths in `content.js` to point at your new
filenames (any image format works — jpg, png, etc.). You can add, remove, or
reorder as many gallery photos as you like by editing the `gallery` array.

The placeholder images shipped in this repo are free-to-use stock photos
(via [Lorem Picsum](https://picsum.photos), sourced from Unsplash's
royalty-free library) just so the layout renders correctly before you add
real photos of your own.

### 4. Events & map

Edit `content.events` — each entry just has a `name`, `date`, and `time`
(venue/address aren't shown on the event cards by design, only on the map
below them). Edit `content.mapAddress` for the map itself, a key-free Google
Maps embed — no API key needed. If you want a precisely pinned location
instead of an address search, go to Google Maps → Share → Embed a map, copy
the `src` URL, and use it directly in `src/components/MapEmbed.jsx`.

### 5. FAQ

Edit the `content.faq` array — add, remove, or edit any question/answer
pairs.

### 6. Background music

There's a mute/unmute button built into the site (bottom-right corner, next
to the section up/down arrows) that controls a looping background track —
currently set to `public/audio/background-music.mp3`. To swap it for a
different track: unlike the stock photos, music carries real copyright risk,
so make sure whatever you use is properly licensed or royalty-free. Some
sources for genuinely free-to-use instrumental music:

- [Pixabay Music](https://pixabay.com/music/) — free license, no
  attribution required
- [Free Music Archive](https://freemusicarchive.org/) — filter by CC0 /
  public domain
- A track you already own the rights to (e.g. purchased or licensed)

Once you have a file:

1. Drop it in `public/audio/` (e.g. `public/audio/background-music.mp3`)
2. Set `content.music.src` in `src/content.js` to
   `asset("/audio/background-music.mp3")`

Leave `content.music.src` blank (the default) and the mute button doesn't
render at all. Browsers block autoplay-with-sound until the visitor
interacts with the page, so playback actually starts on their first
click/tap anywhere on the site — this is standard browser behavior, not a
bug.

## Blessings & RSVP backend setup

The Blessings wall (a live wall of guest messages) and the Blessings & RSVP
form are both custom-built — no Google Form embed. They talk to a Google
Sheet through a small Google Apps Script "Web App," which is free and uses
only your own Google account. Until you set this up, the Blessings wall just
shows its empty state, and the form shows a friendly "not connected yet"
message instead of submitting.

**1. Create the Sheet**

Create a new Google Sheet with two tabs, each with a header row exactly as
below (case-sensitive, this is what the script expects):

- Tab **`Blessings`**: `Name | Side | Message | Timestamp`
- Tab **`RSVP`**: `Name | Side | Attending | Guests | Dietary | Timestamp`

**2. Add the script**

In the Sheet, go to **Extensions → Apps Script**. Delete any starter code,
then paste in the contents of [`google-apps-script/Code.gs`](google-apps-script/Code.gs)
from this repo. Save the project.

**3. Deploy as a Web App**

Click **Deploy → New deployment**. For "Select type," choose **Web app**.
Set:
- Execute as: **Me**
- Who has access: **Anyone**

Click **Deploy**, authorize the permissions Google asks for (it'll warn you
it's an unverified app — that's expected for a personal script; click
Advanced → Go to \[project name] to proceed), then copy the **Web app URL**
it gives you (ends in `/exec`).

**4. Connect it to the site**

Paste that URL into `content.integrations.appsScriptUrl` in `src/content.js`,
then rebuild/redeploy the site. Blessings submitted through the form appear
on the wall instantly for the sender, and the page also polls in the
background every 10s so other visitors' blessings show up without a manual
refresh. RSVPs land as new rows in the `RSVP` tab of your Sheet.

**Note:** every time you edit the script in the Apps Script editor, you need
to create a **new deployment** (or manage/update the existing one) for the
changes to take effect — saving alone isn't enough.

## Building for production

```
npm run build
```

This produces a `dist/` folder of plain static files (HTML/CSS/JS) that can
be deployed to any static host — no server or environment variables needed.

- **Netlify / Vercel**: point the build command at `npm run build` and the
  publish directory at `dist`. Both auto-detect Vite projects.
- **GitHub Pages**: this repo is already configured for it — `vite.config.js`
  sets `base: '/Mahek-Yash/'` to match the GitHub Pages project URL, and a
  GitHub Actions workflow (`.github/workflows/deploy.yml`) rebuilds and
  redeploys automatically on every push to `main`.
- **Anywhere else**: upload the contents of `dist/` to any static file host.

## Project structure

```
src/
  content.js         ← edit this for all copy/data
  index.css           global design tokens (colors, fonts, spacing)
  hooks/
    useCountdown.js   countdown timer logic
    useBlessings.js   Blessings wall fetch/poll/optimistic-update logic
  lib/
    smoothScroll.js   eased nav-link scrolling
  components/         one component per section (Hero, Gallery, FAQ, ...)
public/
  images/             your photos live here
  audio/              your background music track goes here (see above)
google-apps-script/
  Code.gs             backend for the Blessings wall & RSVP form (see above)
```
