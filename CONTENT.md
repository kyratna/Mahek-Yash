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

- Wedding date: `[ December 06, 2026 ]`
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

Event details are presented as interactive 3D flip cards (2x2 grid with the 5th card centered). Front shows the event name, date, and time. Tapping/clicking the card flips it to reveal the event's one-liner description, attire, venue, and extra notes.

- Card auto-flip back timer (in seconds, default 20): `[ 20 ]`

**Haldi**
- Date: `[ December 05, 2026 ]`
- Time: `[ 1:00 PM ]`
- One-liner Description: `[ A joyful and vibrant ceremony of turmeric blessings, love, and sunny smiles. ]`
- Attire / Dress Code: `[ Shades of Pink ]`
- Venue / Location: `[ Poolside Lawn ]`
- Additional Note: `[ Get ready for color, music, and haldi fun! ]`

**Engagement**
- Date: `[ December 05, 2026 ]`
- Time: `[ 6:00 PM — TODO: confirm, currently a placeholder ]`
- One-liner Description: `[ An enchanting evening celebrating the exchange of rings and eternal promises. ]`
- Attire / Dress Code: `[ Cocktail / Indo-Western ]`
- Venue / Location: `[ Grand Ballroom ]`
- Additional Note: `[ Followed by dinner, music & celebration. ]`

**Baarat**
- Date: `[ December 06, 2026 ]`
- Time: `[ 11:30 AM — TODO: confirm, currently a placeholder ]`
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

## 8. Photos

Photos aren't typed into this file — instead, just send me (or drop into
`public/images/...`) the actual image files for each slot below, and tell me
which is which:

- [x] Gallery photos (as many as you'd like — currently set up for 6) — placeholders in place, swap in real photos whenever ready
- [x] Couple vector illustration (centered on the boundary between the two profile cards) — added
- [x] Background music track — added (`public/audio/background-music.mp3`)

## 9. FAQ

Edit, delete, or add to these as needed:

- **What is the dress code?**
  `[ Dress code of Haldi Ceremony - 'Shades of Pink'
     Other Events are open for all the dressings ]`
- **What are parking arrangement?**
  '[ Parking is available at the venue ]'
- **Where to reach after coming to venue?**
  '[ Reach the main reception as soon as you arrive the venue ]'
 
## 10. Blessings & RSVP Backend (optional, technical)

Only fill this in once you've deployed the Google Apps Script backend
described in `README.md` → "Blessings & RSVP backend setup" (now expects
**four** sheet tabs — `BLESSINGS_BRIDE`, `BLESSINGS_GROOM`, `RSVP_BRIDE`,
`RSVP_GROOM` — see README for the exact header rows):

- Apps Script Web App URL: `[ https://script.google.com/macros/s/AKfycbwLKJNqckuWiLrTj71ygs7BN20bANPoLyVenQIb9r7gEAkBzveBnfcVXODrCTAHExYF9w/exec ]`
- WhatsApp number for the RSVP "Share via WhatsApp" button (optional, include country code, e.g. `919876543210`; leave blank to let guests pick a contact instead): `[ ]`

---

Once this is filled in, just tell me — I don't need you to touch any code,
I'll take it from here.
