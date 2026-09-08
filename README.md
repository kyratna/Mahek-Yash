# Mahek & Yash — Luxury Wedding Invitation Website

A high-performance, single-page luxury Indian wedding invitation built with React, Vite, and Firebase Firestore, integrated with Google Sheets, Telegram Bot moderation, and dynamic Google Drive gallery streaming.

---

## ✨ Features & Architecture

- **Interactive 3D Envelope Intro**: Realistic 3D flap rotation, card emergence, wax seal flip, and smooth fly-in animation to the invitation.
- **Sacred Invocation (`#shree-ganesh`)**: Lord Ganesha crest with ambient golden rose glow and sacred Devanagari Sanskrit shlokas (*Vakratunda Mahakaya...* across 2 rhythmic lines & *Mangalam Bhagwan Vishnuh...*).
- **Wedding Invitation (`#invitation`)**: Dedicated invitation screen, clean multi-line parents lineage, and monogrammed scratch-to-reveal card with live countdown, confetti celebration, and synchronized global date reveal.
- **Navigation Drawer**: Distraction-free viewport with glassmorphic top-left floating menu and quick section jumping.
- **Meet the Families (`#couple`)**: Traditional royal Indian wedding lineage cards with classical Sanskrit shloka (*Twameva Mata Cha Pita Twameva...*), `॥ मंगलम् ॥` (*Auspicious Beginning*) & `॥ युग्म ॥` (*Sacred Union*) symbols with burgundy-accented consonants (**म** & **य**), unified Cormorant Garamond italic typography across all contextual lines, and luxury double borders with burgundy inner dashed accents.
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
- **FAQ & Footer (`#faq`)**: Curated 6-question accordion covering exact travel routes & distances, complimentary parking, dress codes, December weather breakdown, 12:00 PM check-in on Dec 5 & 10:00 AM check-out on Dec 7 with mandatory Aadhaar ID requirements, hospitality coordinators, 24/7 snacks availability, official wedding hashtags (`#MahekWedsYash` & `#YashKiMahek`), and interactive action buttons for venue navigation and gallery jumps.
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

## 🖼️ Dynamic Google Drive Gallery & Guest Uploads

The gallery is built on a strictly separated two-tier Google Drive & Google Sheets architecture that ensures host curation integrity while welcoming guest participation:

### 1. Curated Host Gallery (Live Website Stream)
- **Dedicated Folder**: `Wedding Invite Photo Gallery`
  - Folder Link: `https://drive.google.com/drive/folders/1n0l1dZEb3eQE9qn9CZyZVhLZ9wC6fqtz?usp=sharing`
  - Folder ID: `1n0l1dZEb3eQE9qn9CZyZVhLZ9wC6fqtz`
- **One-Way Host Pipeline**:
  - Hosts upload curated high-resolution wedding photos directly into the Drive folder.
  - Automatically synchronizes to the dedicated **`GALLERY`** tab in Google Sheets, generating live `=IMAGE(...)` 60px thumbnail previews, file IDs, direct links, and timestamps.
  - Streams directly into the website's 3D coverflow gallery.
- **Dynamic Deletion Reflection**:
  - Removing or trashing any photo in the Drive folder automatically clears it from the `GALLERY` sheet and instantly purges it from the live website without stale cache.

### 2. Isolated Guest Uploads (`Guest Uploaded Gallery`)
- **Dedicated Folder**: `Guest Uploaded Gallery` (created automatically as a sibling folder in Google Drive).
- **Guest Upload Modal (`#gallery`)**:
  - Guided by the elegant subtext: *"Share your captured memories with us"*, placed directly above the **`📸 Upload Photos & Videos`** button.
  - Form includes Ceremony selector (Haldi, Engagement & Sangeet, Godh Bharai & Sagai, Baraat & Ghurchari, Jaimaal, Phere, Other) and Guest Name input (with example placeholder `Rahul & Sunita Gupta`).
  - Guests can select multiple photos/videos or capture shots live using their camera.
  - **100% Write-Only Protection**: Guests never get direct write or delete permissions to Google Drive, ensuring total security and privacy.
  - **Real-Time Progress Tracking**: Displays live counter (`Uploading photo 2 of 5 (40%)`), animated progress bar, and per-file checkmarks (`✓`).
- **File Naming Format**: `UploaderName_timestamp_ceremony_originalName` (e.g., `Rohan_Gupta_20260907_Haldi_photo1.jpg`).
- **Google Sheets Logging**: Uploads are appended to the dedicated **`GUEST_UPLOADS`** sheet tab with full metadata.
- **Consolidated Telegram Alerts**: Dispatches a consolidated Telegram alert to the host group once each batch completes.

---

## 💌 Backend Integrations (Firebase, Google Sheets & Telegram)

### 1. Firebase Firestore (Live Web Tier)
- Real-time Firestore collections (`blessings` and `rsvp`) provide instant 0-latency updates for guests and live heart reaction counts (❤️).

### 2. Google Sheets ('Wedding Admin System' Tier)
- Spreadsheet Workbook: **'Wedding Admin System'**
- Apps Script Project: **'WeddingAdminScript'**
- Web App Endpoint: `https://script.google.com/macros/s/AKfycbw1uFiMAmvqL0L16zuvRrlnwO1E8ERHGyUCTLd_uySpWYbG3DU0DHxsaURlJyKqpCzAHQ/exec`
- Automatically synchronized with Firebase every 1 minute and on real-time sheet edits with permanent data protection.
- Dedicated Tabs:
  - `BLESSINGS_BRIDE` & `BLESSINGS_GROOM`: `Name | Side | Message | Timestamp | Hearts (❤️) | FirebaseDocID`
  - `RSVP_BRIDE` & `RSVP_GROOM`: `Name | Side | Attending | Guests | Parking Required | Timestamp | FirebaseDocID`
  - `GALLERY`: `IMAGE_URL | PHOTO_CAPTION | DRIVE_FILE_ID | DATE_ADDED | PREVIEW` (with `=IMAGE(...)` thumbnail formula)
  - `GUEST_UPLOADS`: `BATCH_ID | FILE_NAME | UPLOADER_NAME | CEREMONY | TOTAL_COUNT | FILE_INDEX | UPLOAD_DATE | UPLOAD_TIME | DRIVE_FILE_ID | DRIVE_FILE_URL | STATUS`

### 3. Telegram Bot Notifications & In-App Moderation
- Instant Telegram group notifications for every Blessing, RSVP, and completed Guest Upload batch.
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
  content.js          ← Central copy, event details, venue & backend configuration
  index.css           ← Global design tokens, CSS variables, and typography rules
  lib/
    firebase.js       ← Real-time Firestore configuration
    smoothScroll.js   ← Eased navigation scrolling
  hooks/
    useBlessings.js   ← Live Firestore listener and sync hook
    useCountdown.js   ← Live countdown timer logic
  components/         ← Interactive section components:
    EnvelopeIntro.jsx       ← 3D envelope opening experience with wax seal
    ShreeGanesh.jsx         ← Sacred Ganesha invocation with golden rose glow & Sanskrit shlokas
    Invitation.jsx          ← Dedicated invitation screen with parents lineage
    ScratchReveal.jsx       ← Monogrammed scratch-to-reveal card with live countdown
    MeetFamilies.jsx        ← Royal Indian family lineage cards with Sanskrit shloka
    EventsGrid.jsx          ← 2-column, 3-row 3D flip cards with perimeter countdown timer
    VenueModal.jsx          ← Venue travel directions popup with QR code & transit options
    Gallery.jsx             ← 3D coverflow carousel with adaptive matting & caricature fallback
    GalleryUploadModal.jsx  ← Guest photo/video upload modal with batch progress & ceremony picker
    Blessings.jsx           ← Curated blessings wall cards with live heart reactions (❤️)
    BlessingsRSVP.jsx       ← Tabbed blessings submission & RSVP form
    FAQ.jsx                 ← Interactive accordion with route, dress code & stay guides
    FloatingControls.jsx    ← Music player, envelope re-opener & section navigation arrows
public/
  images/             ← Static vector artwork, caricature fallbacks, and monogram assets
  flaticons/          ← Traditional Indian wedding motifs
  audio/              ← Background wedding music track
google-apps-script/
  Code.gs             ← Google Sheets, Google Drive dual-gallery & Telegram bot automation
  appsscript.json     ← Apps Script manifest and OAuth scopes
```
