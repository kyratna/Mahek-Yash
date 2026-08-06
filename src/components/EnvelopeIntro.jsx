import { useEffect, useState } from "react";
import content from "../content";
import GaneshArt from "./GaneshArt";
import "./EnvelopeIntro.css";

// Config: tapping the seal chains three beats, each timed by its own
// setTimeout below. Durations are deliberately unhurried — this should read
// as a real hand slowly opening a real envelope, not a UI transition. If
// you retune any of these, keep the matching CSS `transition` durations in
// EnvelopeIntro.css in sync — there's no shared config file.
const FLAP_OPEN_DURATION = 900; // ms — flap tilting open
const CARD_RISE_DELAY = 300; // ms — card waits a beat after the flap starts before it lifts
const CARD_RISE_DURATION = 900; // ms — card lifting out of the envelope
const OPEN_DURATION = Math.max(FLAP_OPEN_DURATION, CARD_RISE_DELAY + CARD_RISE_DURATION);
const PAUSE_DURATION = 1000; // ms — card sits still, fully out, so it can be read
const CARD_FLY_DURATION = 750; // ms — card rushing toward the viewer, out of the screen
const SCENE_FADE_DURATION = 700; // ms — the rest of the scene dissolving behind it
const FLYING_DURATION = Math.max(CARD_FLY_DURATION, SCENE_FADE_DURATION);
const HINT_DELAY = 3200; // ms — "tap to open" hint appears after a pause

// A dusty-rose envelope scene shown before the site: tap the seal and the
// flap peels back, a beat later a card lifts out of the envelope
// announcing the wedding, and — after a pause to actually read it — the
// card rushes off toward the viewer as if flying out of the screen,
// dissolving the scene behind it to reveal the (already-mounted) page
// underneath.
export default function EnvelopeIntro({ onOpen }) {
  const [phase, setPhase] = useState("closed"); // closed -> open -> flying
  const [showHint, setShowHint] = useState(false);
  const { couple, wedding, mapAddress } = content;
  const initials = `${couple.partner1[0]} & ${couple.partner2[0]}`;

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), HINT_DELAY);
    return () => clearTimeout(timer);
  }, []);

  function handleOpen() {
    if (phase !== "closed") return;
    setPhase("open");
    setTimeout(() => setPhase("flying"), OPEN_DURATION + PAUSE_DURATION);
    setTimeout(() => onOpen(), OPEN_DURATION + PAUSE_DURATION + FLYING_DURATION);
  }

  const isClosed = phase === "closed";
  const hasOpened = phase !== "closed";
  const isFlying = phase === "flying";

  return (
    <div className={`envelope-intro ${!isClosed ? "envelope-intro--open" : ""}`}>
      <div className="envelope-intro__backdrop" aria-hidden="true" />
      <div
        className={`envelope-intro__content ${isFlying ? "envelope-intro__content--flying" : ""}`}
      >
        <GaneshArt className="envelope-intro__ganesh" />
        <p className="envelope-intro__overline">{content.hero.tagline}</p>

        <div className="envelope-box">
          <div className="envelope-box__body" />
          <svg
            className={`envelope-box__flap ${hasOpened ? "envelope-box__flap--open" : ""}`}
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

          <div
            className={`envelope-box__card ${hasOpened ? "envelope-box__card--risen" : ""} ${
              isFlying ? "envelope-box__card--flying" : ""
            }`}
            aria-hidden={isClosed}
          >
            <span className="envelope-box__card-eyebrow">The Wedding Of</span>
            <span className="envelope-box__card-names">
              {couple.partner1} &amp; {couple.partner2}
            </span>
            <span className="envelope-box__card-divider" aria-hidden="true" />
            <span className="envelope-box__card-date">{wedding.displayDate}</span>
            <span className="envelope-box__card-venue">{mapAddress}</span>
          </div>

          {isClosed && (
            <button
              type="button"
              className="envelope-box__seal"
              onClick={handleOpen}
              aria-label="Open the invitation"
            >
              {initials}
            </button>
          )}
        </div>

        {isClosed && showHint && (
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
