// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE to customize the wedding site. No other files
// need to change for basic content updates (names, date, venue,
// FAQ, photos, RSVP link). See README.md for step-by-step help.
// ─────────────────────────────────────────────────────────────

// Prefixes image paths with Vite's base URL (see `base` in vite.config.js)
// so photos resolve correctly whether the site is hosted at a domain root
// or a subpath (e.g. GitHub Pages' username.github.io/repo-name/). Exported
// so components reaching into `public/` directly (not through this content
// object) can prefix their own paths the same way.
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

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
    displayDate: "DECEMBER 06, 2026", // human-readable, revealed by the scratch card
  },

  hero: {
    tagline: "With All The Blessings",
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
        person1: "Smt Deepa Gupta",
        person2: "Shri Rajeev Gupta",
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
        person1: "Smt Renu Gupta",
        person2: "Shri Sandeep Kumar Gupta",
      },
    },
  },

  coupleVectorArt: asset("/images/bridengroom/brideNgroom_No_Bg_Vector.png"),

  // Time in seconds after which a flipped event card automatically flips back to the front.
  eventCardAutoFlipSeconds: 20,

  // Event cards shown on the Event Details section (3D flip cards).
  // Front shows name, date, time; back reveals description, attire, location, and notes.
  events: [
    {
      name: "Haldi",
      date: "December 5, 2026",
      time: "12:30 PM",
      description: "A joyful and vibrant ceremony of turmeric blessings, love, and sunny smiles.",
      attire: "Shades of Pink",
      location: "Poolside Lawn",
      note: "Get ready for color, music, and haldi fun!",
    },
    {
      name: "Engagement & Sangeet",
      date: "December 5, 2026",
      time: "5:00 PM",
      description: "An enchanting evening of music, dance performances, and celebration.",
      attire: "Cocktail / Indo-Western",
      location: "Grand Ballroom",
      note: "Followed by dinner, music & celebration.",
    },
    {
      name: "Godh Bharai & Sagai",
      date: "December 5, 2026",
      time: "7:00 PM onwards",
      description: "Traditional blessings and auspicious ring ceremony with family & loved ones.",
      attire: "Traditional Elegance / Indo-Western",
      location: "Grand Ballroom",
      note: "Celebration followed by music and dinner.",
    },
    {
      name: "Baraat & Ghurchari",
      date: "December 6, 2026",
      time: "10:30 AM Onwards",
      description: "The groom's royal dancing procession with festive dhol beats and celebration.",
      attire: "Traditional Festive / Sherwani & Sarees",
      location: "Resort Entrance to Mandap",
      note: "Join the groom's baraat procession!",
    },
    {
      name: "Jaimaal",
      date: "December 6, 2026",
      time: "12:30 PM",
      description: "The auspicious floral garland exchange marking the union of bride and groom.",
      attire: "Traditional Festive",
      location: "Central Mandap",
      note: "Shower the couple with flower petals.",
    },
    {
      name: "Phere",
      date: "December 6, 2026",
      time: "5:00 PM",
      description: "The seven sacred vows around the holy agni solemnizing our sacred marriage bond.",
      attire: "Royal Indian Ethnic",
      location: "Mandap by the Forest",
      note: "Dinner & reception to follow.",
    },
  ],

  // Venue information & 'How to reach the venue?' popup details
  venue: {
    name: "Winsome Resort & Spa",
    address: "Village Nandpur, Ramnagar, Jim Corbett, Uttarakhand 244715",
    qrUrl: "https://share.google/xZAuCAlAAjEHdfEsY",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Winsome+Resorts+and+Spa%2C+Jim+Corbett",
    modalAutoCloseSeconds: 30,
    howToReach: [
      {
        mode: "By Road",
        title: "Self Drive / Cab",
        description:
          "Approx. 240 km (~5 to 6 hours drive) from Delhi NCR via NH9 through Hapur, Moradabad, Kashipur to Ramnagar.",
      },
      {
        mode: "By Train",
        title: "Nearest Railway Station",
        description:
          "Ramnagar Railway Station (RMR) is approx. 10 km (15–20 mins) from the resort. Direct trains run from Old Delhi & Anand Vihar.",
      },
      {
        mode: "By Air",
        title: "Nearest Airport",
        description:
          "Pantnagar Airport (PGH) is ~80 km (~2 hours drive). Alternatively, IGI Airport New Delhi is ~260 km away.",
      },
    ],
  },

  // Map destination address
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
    heading: "Blessings Wall",
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

  integrations: {
    // Google Sheets integration (fallback)
    appsScriptUrl:
      "https://script.google.com/macros/s/AKfycbxpqRj70zcCtJyCvzJVunfHMzmlyj1AyhAGhUw5yNDzJ8GWT7wq-plVgzgMHhrXHAG08w/exec",

    // Firebase Firestore integration (Real-time, 0 latency)
    firebase: {
      apiKey: "AIzaSyB-H7JyM-REapOa3PftjigCqhMBjaSOu3Y",
      authDomain: "yashmahekwedding.firebaseapp.com",
      projectId: "yashmahekwedding",
      storageBucket: "yashmahekwedding.firebasestorage.app",
      messagingSenderId: "965259334403",
      appId: "1:965259334403:web:a39a2f27c227082a7dcf36",
    },

    // Optional: a phone number (with country code, e.g. "919876543210") to
    // pre-address the RSVP "Share via WhatsApp" button at. Leave blank and
    // the button opens WhatsApp's contact picker instead.
    whatsappNumber: "",
  },
};

export default content;
