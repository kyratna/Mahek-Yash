// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE to customize the wedding site. No other files
// need to change for basic content updates (names, date, venue,
// FAQ, photos, RSVP link). See README.md for step-by-step help.
// ─────────────────────────────────────────────────────────────

// Prefixes image paths with Vite's base URL (see `base` in vite.config.js)
// so photos resolve correctly whether the site is hosted at a domain root
// or a subpath (e.g. GitHub Pages' username.github.io/repo-name/).
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const content = {
  couple: {
    partner1: "Mahek",
    partner2: "Yash",
  },

  wedding: {
    // ISO 8601 with a timezone offset (not "Z") so the countdown is
    // accurate for every guest regardless of their own timezone.
    // Set to the Phere (main ceremony) date/time, IST (+05:30).
    dateTimeISO: "2026-12-06T17:00:00+05:30",
    displayDate: "December 6, 2026", // human-readable, revealed by the scratch card
  },

  hero: {
    tagline: "Together with their families",
    backgroundImage: asset("/images/hero/placeholder-hero.jpg"),
  },

  // Shown in the "Meet the Couple" section — one profile card per side, no
  // photo. A vector illustration sits centered on the boundary between the
  // two cards (see coupleVectorArt).
  coupleProfiles: {
    bride: {
      name: "Mahek Gupta",
      grandparentage: {
        label: "Granddaughter of",
        person1: "Shri Late __ Gupta",
        person2: "Smt Late __ Gupta",
      },
      parentage: {
        label: "Daughter of",
        person1: "Shri Rajeev Gupta",
        person2: "Smt Deepa Gupta",
      },
    },
    groom: {
      name: "Yash Gupta",
      grandparentage: {
        label: "Grandson of",
        person1: "Shri Late Shri Niwas Gupta",
        person2: "Smt Late Rama Gupta",
      },
      parentage: {
        label: "Son of",
        person1: "Shri Sandeep Kumar Gupta",
        person2: "Smt Renu Gupta",
      },
    },
  },

  coupleVectorArt: asset("/images/bridengroom/brideNgroom_No_Bg_Vector.png"),

  // Venue/address aren't shown on the event cards (see DESIGN.md) — the
  // shared mapAddress below covers the map for all events.
  events: [
    { name: "Haldi", date: "December 5, 2026", time: "1:00 PM" },
    { name: "Engagement", date: "December 5, 2026", time: "6:00 PM" }, // TODO: confirm — placeholder time
    { name: "Baarat", date: "December 6, 2026", time: "11:30 AM" }, // TODO: confirm — placeholder time
    { name: "Jaimaal", date: "December 6, 2026", time: "12:30 PM" },
    { name: "Phere", date: "December 6, 2026", time: "5:00 PM" },
  ],

  // Used to build the key-free Google Maps embed and the "Get Directions"
  // button (see MapEmbed.jsx)
  mapAddress: "Winsome Resorts and Spa, Jim Corbett",

  gallery: [
    { src: asset("/images/gallery/placeholder-01.jpg"), alt: "Placeholder photo 1" },
    { src: asset("/images/gallery/placeholder-02.jpg"), alt: "Placeholder photo 2" },
    { src: asset("/images/gallery/placeholder-03.jpg"), alt: "Placeholder photo 3" },
    { src: asset("/images/gallery/placeholder-04.jpg"), alt: "Placeholder photo 4" },
    { src: asset("/images/gallery/placeholder-05.jpg"), alt: "Placeholder photo 5" },
    { src: asset("/images/gallery/placeholder-06.jpg"), alt: "Placeholder photo 6" },
  ],

  blessings: {
    heading: "Blessings",
    subtext: "Sweet wishes from our family & friends",
  },

  blessingsRsvp: {
    heading: "Blessings & RSVP",
    subtext: "Send blessings and RSVP",
  },

  faq: [
    {
      question: "What is the dress code?",
      answer: "PLACEHOLDER: e.g. Cocktail attire / Black tie optional.",
    },
    {
      question: "Are kids welcome?",
      answer:
        "PLACEHOLDER: e.g. We love your little ones, but this will be an adults-only celebration.",
    },
    {
      question: "Can I bring a plus-one?",
      answer:
        "PLACEHOLDER: Please refer to your invitation for the number of seats reserved in your honor.",
    },
    {
      question: "What about dietary restrictions?",
      answer:
        "PLACEHOLDER: Please note any dietary restrictions in the RSVP form below.",
    },
  ],

  // Background music, played site-wide with a mute button in the bottom
  // corner. Leave `src` blank (default) and the player is hidden entirely.
  // To enable it, add your own royalty-free/licensed audio file at
  // public/audio/background-music.mp3 and set src below — see README.md
  // "Background music" for details and where to legally source a track.
  music: {
    src: asset("/audio/background-music.mp3"),
  },

  // The Blessings wall and the Blessings & RSVP form both talk to a Google
  // Sheet through a Google Apps Script Web App you deploy yourself — see
  // README.md "Blessings & RSVP backend setup" for step-by-step instructions.
  // Leave this blank and the Blessings wall just shows its empty state, and
  // form submissions will show a friendly error until it's configured.
  integrations: {
    appsScriptUrl:
      "https://script.google.com/macros/s/AKfycbwLKJNqckuWiLrTj71ygs7BN20bANPoLyVenQIb9r7gEAkBzveBnfcVXODrCTAHExYF9w/exec",
    // Optional: a phone number (with country code, e.g. "919876543210") to
    // pre-address the RSVP "Share via WhatsApp" button at. Leave blank and
    // the button opens WhatsApp's contact picker instead.
    whatsappNumber: "",
  },
};

export default content;
