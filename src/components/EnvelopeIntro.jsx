import { useEffect, useState } from "react";
import content from "../content";
import GaneshArt from "./GaneshArt";
import "./EnvelopeIntro.css";

// Ported from the InteractiveWeddingInvite prototype's Envelope.tsx (React +
// Tailwind + Framer Motion) and rebuilt in this project's plain JS/CSS style
// — no new dependencies added. Two independent animations fire the instant
// either tap target (the peeking card or the seal) is tapped: the card
// flies straight up off-screen, while the whole dark scene (card included,
// since it's a child) fades/scales out slightly behind it, started a beat
// later so the card is already mid-flight before the scene starts to go.
// If you retune these, keep the matching CSS `transition` durations in
// EnvelopeIntro.css in sync — there's no shared config file.
const CARD_FLY_DURATION = 900; // ms — peeking card flying up off-screen
const CONTENT_FADE_DURATION = 700; // ms — dark scene dissolving
const CONTENT_FADE_DELAY = 250; // ms — scene fade starts just after the card leaves
const HINT_DELAY = 3200; // ms — "tap to open" hint appears after a pause

const TOTAL_OPEN_DURATION = Math.max(
  CARD_FLY_DURATION,
  CONTENT_FADE_DELAY + CONTENT_FADE_DURATION
);

// A dark, full-screen envelope scene shown before the site: a peeking
// invitation card and a monogram seal are both valid tap targets to open.
export default function EnvelopeIntro({ onOpen }) {
  const [phase, setPhase] = useState("closed"); // closed -> open
  const [showHint, setShowHint] = useState(false);
  const { couple, wedding, hero } = content;
  const initials = `${couple.partner1[0]} & ${couple.partner2[0]}`;

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), HINT_DELAY);
    return () => clearTimeout(timer);
  }, []);

  function handleOpen() {
    if (phase !== "closed") return;
    setPhase("open");
    setTimeout(() => onOpen(), TOTAL_OPEN_DURATION);
  }

  const isOpen = phase === "open";

  return (
    <div className={`envelope-intro ${isOpen ? "envelope-intro--open" : ""}`}>
      <div className="envelope-intro__backdrop" aria-hidden="true" />
      <div
        className={`envelope-intro__content ${
          isOpen ? "envelope-intro__content--open" : ""
        }`}
      >
        <GaneshArt className="envelope-intro__ganesh" />
        <p className="envelope-intro__overline">{hero.tagline}</p>

        <div className="envelope-box">
          <div className="envelope-box__body" />
          <svg
            className="envelope-box__flap"
            viewBox="0 0 288 130"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="0,0 288,0 144,120" className="envelope-box__flap-shape" />
            <polygon points="0,0 288,0 144,120" fill="url(#envelope-flap-shade)" fillOpacity="0.4" />
            <defs>
              <linearGradient id="envelope-flap-shade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>

          <button
            type="button"
            className={`envelope-box__card ${isOpen ? "envelope-box__card--open" : ""}`}
            onClick={handleOpen}
            aria-label="Open the invitation"
          >
            <span className="envelope-box__card-names">
              {couple.partner1} &amp; {couple.partner2}
            </span>
            <span className="envelope-box__card-date">{wedding.displayDate}</span>
          </button>

          <button
            type="button"
            className="envelope-box__seal"
            onClick={handleOpen}
            aria-label="Open the invitation"
          >
            {initials}
          </button>
        </div>

        {showHint && (
          <div className="envelope-intro__hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>tap to open</span>
          </div>
        )}
      </div>
    </div>
  );
}
