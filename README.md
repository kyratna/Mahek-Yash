# Mahek & Yash — Luxury Wedding Invitation Website

A high-performance, single-page luxury Indian wedding invitation built with React, Vite, and Firebase Firestore, integrated with Google Sheets, Telegram Bot moderation, and dynamic Google Drive gallery streaming.

---

## ✨ Features & Architecture

- **Interactive 3D Envelope Intro**: Realistic 3D flap rotation, card emergence, wax seal flip, and smooth fly-in animation to the invitation.
- **Sacred Invocation (`#shree-ganesh`)**: Lord Ganesha crest with ambient golden rose glow and sacred Devanagari Sanskrit shlokas (*Vakratunda Mahakaya...* across 2 rhythmic lines & *Mangalam Bhagwan Vishnuh...*).
- **Wedding Invitation (`#invitation`)**: Dedicated invitation screen, clean multi-line parents lineage, and monogrammed scratch-to-reveal card with live countdown, confetti celebration, and synchronized global date reveal.
- **Navigation Drawer**: Distraction-free viewport with glassmorphic top-left floating menu and quick section jumping.
- **Meet the Families (`#couple`)**: Traditional royal Indian wedding lineage cards with classical Sanskrit shloka (*Twameva Mata Cha Pita Twameva...*), `॥ मंगलम् ॥` (*Auspicious Beginning*) & `॥ युग्म ॥` (*Sacred Union*) symbols with burgundy-accented consonants (**म** & **य**), and luxury double borders with burgundy inner dashed accents.
- **Event Details (`#details`)**: 2-column, 3-row 3D flip cards (total 6 events) with 20s animated burgundy perimeter timer strokes, plus an interactive "How to reach the venue?" popup with QR code, GPS directions, and transit guides.
- **Dynamic Memories Gallery (`#gallery`)**:
  - **Live Google Drive Integration**: Upload photos directly to a Google Drive folder to update the gallery in real-time.
  - **Zero-Error Caricature Fallback**: Automatically renders Indian wedding caricature artwork if any photo fails to load.
  - **Adaptive Matting**: Scales down 4K/DSLR portraits, landscapes, and square photos without cropping faces.
  - **3D Coverflow & Lightbox**: Perspective coverflow carousel with clean distraction-free high-res lightbox view.
- **Live Blessings Wall & RSVP (`#blessings`, `#blessings-rsvp`)**:
  - **Real-Time 0-Latency**: Powered by Firebase Firestore listeners with automatic Google Sheets bidirectional synchronization.
  - **Live Heart Reactions (❤️)**: Interactive heart reactions synchronized across all guests.
  - **Matching Royal Frame**: Harmonized luxury border design with burgundy inner dashed trim.
  - **Telegram Bot Notifications & Moderation**: Instant Telegram alerts for new blessings & RSVPs with native inline "🗑️ Delete from Live Wall" moderation buttons.
- **FAQ & Footer (`#faq`)**: Interactive Q&A accordion, couple sign-off, and scratch-synced wedding date (`DECEMBER 6, 2026`).
- **Floating Controls**: Ambient background music player, envelope re-opener, and section navigation arrows.

---

## 🚀 Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` to view the website.

---

## 🛠️ Content Configuration

All wedding details are centrally configured in **[`src/content.js`](src/content.js)**:

1. **Couple Names & Date**: `couple.partner1`, `couple.partner2`, and `wedding.dateTimeISO` (e.g. `2026-12-06T17:00:00+05:30`).
2. **Meet the Couple**: `coupleProfiles.bride` and `coupleProfiles.groom` (names, grandparentage, and parentage).
3. **Events Details**: `events` array containing all 6 wedding ceremonies (Haldi, Engagement & Sangeet, Godh Bharai & Sagai, Baraat & Ghurchari, Jaimaal, Phere).
4. **Venue & Directions**: `venue` (resort name, address, Google Maps QR link, turn-by-turn directions, and road/train/air travel guides).
5. **Background Music**: `music.src` (set to `asset("/audio/background-music.mp3")`).
6. **FAQ**: `faq` array of questions and answers.

---

## 🖼️ Dynamic Google Drive Gallery

To dynamically update gallery photos from Google Drive without touching code:

1. Create a folder in Google Drive and set its share settings to: **"Anyone with the link can view"**.
2. Open your Google Sheet top menu: **`💌 Wedding Admin` → `🖼️ Set Gallery Google Drive Folder ID`** and paste your Drive folder link or ID.
3. Every photo uploaded to that Drive folder will automatically stream to the live website gallery!

---

## 💌 Backend Integrations (Firebase, Google Sheets & Telegram)

### 1. Firebase Firestore (Live Web Tier)
- Real-time Firestore collections (`blessings` and `rsvp`) provide instant 0-latency updates for guests and live heart reaction counts (❤️).

### 2. Google Sheets ('Wedding Admin System' Tier)
- Spreadsheet Workbook: **'Wedding Admin System'**
- Apps Script Project: **'WeddingAdminScript'**
- Automatically synchronized with Firebase every 1 minute and on real-time sheet edits with permanent data protection.
- Tabs:
  - `BLESSINGS_BRIDE` & `BLESSINGS_GROOM`: `Name | Side | Message | Timestamp | Hearts (❤️) | FirebaseDocID`
  - `RSVP_BRIDE` & `RSVP_GROOM`: `Name | Side | Attending | Guests | Parking Required | Timestamp | FirebaseDocID`
  - `GALLERY`: `IMAGE_URL | PHOTO_CAPTION | DRIVE_FILE_ID | DATE_ADDED`

### 3. Telegram Bot Notifications & In-App Moderation
- Instant Telegram group notifications for every Blessing and RSVP.
- Native inline `🗑️ Delete from Live Wall` button: immediately answers callback queries and removes the blessing live from Firebase and Google Sheets.

---

## 📦 Production Build

```bash
npm run build
```

Generates optimized static production assets in the `dist/` directory ready for deployment to GitHub Pages, Vercel, Netlify, or Firebase Hosting.

---

## 📁 Project Structure

```text
src/
  content.js          ← Central copy and configuration
  index.css           ← Global design tokens and layout rules
  lib/
    firebase.js       ← Real-time Firestore configuration
    smoothScroll.js   ← Eased navigation scrolling
  hooks/
    useBlessings.js   ← Live Firestore listener and sync hook
    useCountdown.js   ← Live countdown timer logic
  components/         ← Interactive section components (ShreeGanesh, Invitation, EnvelopeIntro, Gallery, Blessings, FAQ, ...)
public/
  images/             ← Static vector artwork and monogram assets
  flaticons/          ← Traditional Indian wedding motifs
  audio/              ← Background wedding music track
google-apps-script/
  Code.gs             ← Google Sheets, Google Drive gallery & Telegram bot automation
```
