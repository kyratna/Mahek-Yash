# Content to Fill In

Fill in the blanks below (replace everything inside `[ ]`) and tell me when
you're done — I'll copy it all into `src/content.js` and redeploy. Don't
worry about formatting it perfectly; rough answers are fine, I'll clean it up.

This file is about *content only* (names, dates, text). For anything about
how the site *looks*, use `DESIGN.md` instead.

---

## 1. The Couple (shown in the Invitation & Nav Drawer)

- Partner 1's first name: `[ Mahek ]`
- Partner 2's first name: `[ Yash ]`

*(Rendered in Alex Brush cursive on the Invitation and the floating Nav Drawer.)*

## 2. Wedding Date & Time

- Wedding date: `[ DECEMBER 06, 2026 ]`
- Ceremony start time: `[ 12:00 PM ]`
- City/timezone the wedding is in: `[ IST ]`

*(The timezone matters — it's used so the countdown timer is accurate for guests watching from other timezones.)*

## 3. Tagline

A short line shown above your names in the Invitation:

- Tagline: `[ With All The Blessings ]`

## 4. Meet the Bride & Groom

**Bride** — Mahek Gupta
- Grandparentage: "Granddaughter of" / "Shri Late __ Gupta" / & / "Smt Late __ Gupta"
- Parentage: "Daughter of" / "Smt Deepa Gupta and Shri Rajeev Gupta"

**Groom** — Yash Gupta
- Grandparentage: "Grandson of" / "Shri Late Shri Niwas Gupta" / & / "Smt Late Rama Gupta"
- Parentage: "Son of" / "Smt Renu Gupta and Shri Sandeep Kumar Gupta"

## 5. Event Details (3D Flip Cards)

Event details are presented as interactive 3D flip cards in a clean 2-column, 3-row grid (total 6 events). Front shows the event name, date, and time. Tapping/clicking the card flips it to reveal the event's one-liner description, attire, venue, and extra notes.

- Card auto-flip back timer (in seconds, default 20): `[ 20 ]`

**Haldi**
- Date: `[ December 05, 2026 ]`
- Time: `[ 12:30 PM ]`
- One-liner Description: `[ A joyful and vibrant ceremony of turmeric blessings, love, and sunny smiles. ]`
- Attire / Dress Code: `[ Shades of Pink ]`
- Venue / Location: `[ Poolside Lawn ]`
- Additional Note: `[ Get ready for color, music, and haldi fun! ]`

**Engagement & Sangeet**
- Date: `[ December 05, 2026 ]`
- Time: `[ 5:00 PM ]`
- One-liner Description: `[ An enchanting evening of music, dance performances, and celebration. ]`
- Attire / Dress Code: `[ Cocktail / Indo-Western ]`
- Venue / Location: `[ Grand Ballroom ]`
- Additional Note: `[ Followed by dinner, music & celebration. ]`

**Godh Bharai & Sagai**
- Date: `[ December 05, 2026 ]`
- Time: `[ 7:00 PM onwards ]`
- One-liner Description: `[ Traditional blessings and auspicious ring ceremony with family & loved ones. ]`
- Attire / Dress Code: `[ Traditional Elegance / Indo-Western ]`
- Venue / Location: `[ Grand Ballroom ]`
- Additional Note: `[ Celebration followed by music and dinner. ]`

**Baraat & Ghurchari**
- Date: `[ December 06, 2026 ]`
- Time: `[ 10:30 AM Onwards ]`
- One-liner Description: `[ The groom's royal dancing procession with festive dhol beats and celebration. ]`
- Attire / Dress Code: `[ Traditional Festive / Sherwani & Sarees ]`
- Venue / Location: `[ Resort Entrance to Mandap ]`
- Additional Note: `[ Join the groom's baraat procession! ]`

**Jaimaal**
- Date: `[ December 06, 2026 ]`
- Time: `[ 12:30 PM ]`
- One-liner Description: `[ The auspicious floral garland exchange marking the union of bride and groom. ]`
- Attire / Dress Code: `[ Traditional Festive ]`
- Venue / Location: `[ Central Mandap ]`
- Additional Note: `[ Shower the couple with flower petals. ]`

**Phere**
- Date: `[ December 06, 2026 ]`
- Time: `[ 5:00 PM ]`
- One-liner Description: `[ The seven sacred vows around the holy agni solemnizing our sacred marriage bond. ]`
- Attire / Dress Code: `[ Royal Indian Ethnic ]`
- Venue / Location: `[ Mandap by the Forest ]`
- Additional Note: `[ Dinner & reception to follow. ]`

## 5.1 Venue & "How to Reach the Venue" Popup

- Venue Resort Name: `[ Winsome Resort & Spa ]`
- Venue Full Address: `[ Village Nandpur, Ramnagar, Jim Corbett, Uttarakhand 244715 ]`
- Google Search / Location URL (for QR code): `[ https://share.google/xZAuCAlAAjEHdfEsY ]`
- Google Directions URL: `[ https://www.google.com/maps/dir/?api=1&destination=Winsome+Resorts+and+Spa%2C+Jim+Corbett ]`
- Popup auto-close timer (seconds): `[ 30 ]`
- By Road details: `[ Approx. 240 km (~5 to 6 hours drive) from Delhi NCR via NH9 through Hapur, Moradabad, Kashipur to Ramnagar. ]`
- By Train details: `[ Ramnagar Railway Station (RMR) is approx. 10 km (15–20 mins) from the resort. Direct trains run from Old Delhi & Anand Vihar. ]`
- By Air details: `[ Pantnagar Airport (PGH) is ~80 km (~2 hours drive). Alternatively, IGI Airport New Delhi is ~260 km away. ]`

## 6. Blessings Section Text

- Subtext under the "Blessings" heading (currently "Sweet wishes from our
  family & friends"): `[ ]`

## 7. Blessings & RSVP Section Text

- Subtext (currently "Send blessings and RSVP"): `[ ]`

## 8. Gallery Photos (Dynamic Google Drive Integration)

Gallery photos are dynamically loaded from Google Drive or `src/content.js`:

- **Option A (Recommended — Live Google Drive Folder)**:
  - Create a folder in Google Drive and set sharing to **"Anyone with the link can view"**.
  - In Google Sheet menu: click **`💌 Wedding Admin` → `🖼️ Set Gallery Google Drive Folder ID`** and paste your folder link/ID.
  - Uploading photos to your Drive folder updates the live website automatically without editing code!
- **Option B (Static Files)**:
  - Add image files to `public/images/gallery/` and list them in `content.gallery` inside `src/content.js`.

---

## 9. FAQ

- **What is the dress code?**
  `Dress code of Haldi Ceremony - 'Shades of Pink'. Other events are open for all traditional and formal attire.`
- **What are parking arrangements?**
  `Valet and self-parking are available at the resort venue.`
- **Where to reach after coming to the venue?**
  `Please proceed to the main resort reception desk as soon as you arrive for check-in and welcome assistance.`

---

## 10. Blessings, RSVP & Moderation Backend

- **Firebase Project ID**: `yashmahekwedding` (Real-Time 0-Latency Listener)
- **Google Spreadsheet**: **'Wedding Admin System'**
- **Google Apps Script Project**: **'WeddingAdminScript'**
- **Web App URL**:
  `https://script.google.com/macros/s/AKfycbxpqRj70zcCtJyCvzJVunfHMzmlyj1AyhAGhUw5yNDzJ8GWT7wq-plVgzgMHhrXHAG08w/exec`
- **Telegram Moderation Bot**:
  - Connected Telegram Group: `MKY Wedd: Blessings Wall and RSVP`
  - Real-time alerts with native `🗑️ Delete from Live Wall` button.
- **WhatsApp RSVP Contact** (optional): `[ ]`
