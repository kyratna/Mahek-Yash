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
    partner1: "PARTNER ONE", // TODO: replace
    partner2: "PARTNER TWO", // TODO: replace
  },

  wedding: {
    // ISO 8601 with a timezone offset (not "Z") so the countdown is
    // accurate for every guest regardless of their own timezone.
    dateTimeISO: "2026-12-31T16:00:00-05:00", // TODO: replace with real date/time
    displayDate: "December 31, 2026", // human-readable, revealed by the scratch card
  },

  hero: {
    tagline: "We're getting married!", // TODO: replace
    backgroundImage: asset("/images/hero/placeholder-hero.jpg"),
  },

  // Shown in the "Meet the Couple" section — one profile card per side.
  coupleProfiles: {
    bride: {
      name: "BRIDE NAME", // TODO: replace
      parentage: "Daughter of FATHER'S NAME & MOTHER'S NAME", // TODO: replace
      photo: asset("/images/story/placeholder-story-1.jpg"),
    },
    groom: {
      name: "GROOM NAME", // TODO: replace
      parentage: "Son of FATHER'S NAME & MOTHER'S NAME", // TODO: replace
      photo: asset("/images/story/placeholder-story-2.jpg"),
    },
  },

  events: [
    {
      name: "Ceremony",
      time: "4:00 PM",
      venueName: "PLACEHOLDER VENUE NAME", // TODO: replace
      address: "123 Placeholder St, City, ST 00000", // TODO: replace
    },
    {
      name: "Reception",
      time: "6:00 PM",
      venueName: "PLACEHOLDER VENUE NAME", // TODO: replace
      address: "123 Placeholder St, City, ST 00000", // TODO: replace
    },
  ],

  // Used to build the key-free Google Maps embed (see MapEmbed.jsx)
  mapAddress: "123 Placeholder St, City, ST 00000", // TODO: replace

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
    subtext: "PLACEHOLDER: Please respond by [date].",
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

  // The Blessings wall and the Blessings & RSVP form both talk to a Google
  // Sheet through a Google Apps Script Web App you deploy yourself — see
  // README.md "Blessings & RSVP backend setup" for step-by-step instructions.
  // Leave this blank and the Blessings wall just shows its empty state, and
  // form submissions will show a friendly error until it's configured.
  integrations: {
    appsScriptUrl: "", // TODO: paste your deployed Apps Script Web App URL here
  },
};

export default content;
