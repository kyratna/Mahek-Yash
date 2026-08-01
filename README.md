# Our Wedding Website

A React + Vite single-page wedding invitation site: hero with countdown, event
details with a map, our story, photo gallery, FAQ, and an RSVP form.

## Running it locally

```
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Customizing the content

Almost everything on the site — names, date, venue, story, FAQ answers, photo
paths, RSVP link — lives in one file: **`src/content.js`**. Open it and
replace every value marked `// TODO: replace`. No other files need to change
for basic content edits.

### 1. Names & date

Edit `content.couple` and `content.wedding`. Keep `dateTimeISO` in the format
`YYYY-MM-DDTHH:MM:SS±HH:MM` (an explicit timezone offset, not `Z`) so the
countdown timer is accurate for guests in other timezones.

### 2. Photos

Photos live in `public/images/` and are referenced by path in `content.js`:

```
public/images/hero/       → hero.backgroundImage
public/images/story/      → ourStory.photos
public/images/gallery/    → gallery
```

To swap in your own photos, drop your image files into the matching folder
and update the `src` paths in `content.js` to point at your new filenames
(any image format works — jpg, png, etc.). You can add, remove, or reorder as
many gallery photos as you like by editing the `gallery` array.

The placeholder images shipped in this repo are free-to-use stock photos
(via [Lorem Picsum](https://picsum.photos), sourced from Unsplash's
royalty-free library) just so the layout renders correctly before you add
real photos of your own.

### 3. Venue & map

Edit `content.events` and `content.mapAddress`. The map on the Details
section is a key-free Google Maps embed built from `mapAddress` — no API key
needed. If you want a precisely pinned location instead of an address
search, go to Google Maps → Share → Embed a map, copy the `src` URL, and use
it directly in `src/components/MapEmbed.jsx`.

### 4. RSVP form

1. Create a Google Form for RSVPs.
2. In the form editor, click **Send** → the `<>` (embed HTML) tab → copy the
   `src` URL from the `<iframe>` code.
3. Paste it into `content.rsvp.googleFormEmbedUrl` in `src/content.js`.

Responses will land in the linked Google Sheet — no backend required.

### 5. FAQ

Edit the `content.faq` array — add, remove, or edit any question/answer
pairs.

## Building for production

```
npm run build
```

This produces a `dist/` folder of plain static files (HTML/CSS/JS) that can
be deployed to any static host — no server or environment variables needed.

- **Netlify / Vercel**: point the build command at `npm run build` and the
  publish directory at `dist`. Both auto-detect Vite projects.
- **GitHub Pages**: if you deploy to a project page (e.g.
  `username.github.io/repo-name`), add `base: '/repo-name/'` to
  `vite.config.js` before building, then publish the `dist/` folder to the
  `gh-pages` branch (e.g. with the `gh-pages` npm package or a GitHub Actions
  workflow).
- **Anywhere else**: upload the contents of `dist/` to any static file host.

## Project structure

```
src/
  content.js        ← edit this for all copy/data
  index.css          global design tokens (colors, fonts, spacing)
  hooks/
    useCountdown.js  countdown timer logic
  components/        one component per section (Hero, Gallery, FAQ, ...)
public/
  images/            your photos live here
```
