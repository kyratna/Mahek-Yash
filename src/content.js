// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE to customize the wedding site. No other files
// need to change for basic content updates (names, date, venue,
// FAQ, photos, RSVP link). See README.md for step-by-step help.
// ─────────────────────────────────────────────────────────────

const content = {
  couple: {
    partner1: "PARTNER ONE", // TODO: replace
    partner2: "PARTNER TWO", // TODO: replace
  },

  wedding: {
    // ISO 8601 with a timezone offset (not "Z") so the countdown is
    // accurate for every guest regardless of their own timezone.
    dateTimeISO: "2026-12-31T16:00:00-05:00", // TODO: replace with real date/time
    displayDate: "December 31, 2026", // human-readable, shown in Hero
  },

  hero: {
    tagline: "We're getting married!", // TODO: replace
    backgroundImage: "/images/hero/placeholder-hero.svg",
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

  ourStory: {
    heading: "Our Story",
    paragraphs: [
      "PLACEHOLDER: This is where you'll tell guests how you met. Replace this paragraph with your own story.",
      "PLACEHOLDER: Add a second paragraph about your journey together, the proposal, or anything else you'd like to share.",
    ],
    photos: [
      { src: "/images/story/placeholder-story-1.svg", alt: "Placeholder story photo 1" },
      { src: "/images/story/placeholder-story-2.svg", alt: "Placeholder story photo 2" },
    ],
  },

  gallery: [
    { src: "/images/gallery/placeholder-01.svg", alt: "Placeholder photo 1" },
    { src: "/images/gallery/placeholder-02.svg", alt: "Placeholder photo 2" },
    { src: "/images/gallery/placeholder-03.svg", alt: "Placeholder photo 3" },
    { src: "/images/gallery/placeholder-04.svg", alt: "Placeholder photo 4" },
    { src: "/images/gallery/placeholder-05.svg", alt: "Placeholder photo 5" },
    { src: "/images/gallery/placeholder-06.svg", alt: "Placeholder photo 6" },
  ],

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

  rsvp: {
    heading: "RSVP",
    subtext: "PLACEHOLDER: Please respond by [date].",
    // TODO: replace with your own embeddable Google Form URL.
    // Google Forms → Send → the "<>" embed tab → copy the iframe src.
    googleFormEmbedUrl:
      "https://docs.google.com/forms/d/e/PLACEHOLDER_FORM_ID/viewform?embedded=true",
  },
};

export default content;
