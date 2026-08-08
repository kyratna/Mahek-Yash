import { useState } from "react";
import content, { asset } from "../content";
import "./EnvelopeIntro.css";

// Config: tapping the seal chains four beats, each timed by its own
// setTimeout below. Durations are deliberately unhurried — this should read
// as a real hand slowly opening a real envelope, not a UI transition. If
// you retune any of these, keep the matching CSS `transition` durations in
// EnvelopeIntro.css in sync — there's no shared config file.
const FLAP_OPEN_DURATION = 900; // ms — flap tilting open
const CARD_RISE_DELAY = 300; // ms — card waits a beat after the flap starts before it lifts
const CARD_RISE_DURATION = 900; // ms — card lifting out of the envelope
const OPEN_DURATION = Math.max(FLAP_OPEN_DURATION, CARD_RISE_DELAY + CARD_RISE_DURATION);
const PAUSE_DURATION = 1000; // ms — card sits still, front showing, so it can be read
const CARD_FLIP_DURATION = 700; // ms — card turning over to its back face
const BACK_PAUSE_DURATION = 500; // ms — back face (seal) sits still before flying
const CARD_FLY_DURATION = 750; // ms — card rushing toward the viewer, out of the screen
const SCENE_FADE_DURATION = 700; // ms — the rest of the scene dissolving behind it
const FLYING_DURATION = Math.max(CARD_FLY_DURATION, SCENE_FADE_DURATION);

// A deep-maroon envelope scene shown before the site: tap the seal and the
// flap peels back, a beat later a card lifts out of the envelope
// announcing the wedding — after a pause to actually read it, the card
// flips over to a darker, monogrammed back face, and — after a beat to
// register the seal — that back face rushes toward the viewer as if
// flying out of the screen, dissolving the scene behind it to reveal the
// (already-mounted) page underneath.
export default function EnvelopeIntro({ onOpen }) {
  const [phase, setPhase] = useState("closed"); // closed -> open -> flipped -> flying
  const { couple, wedding, mapAddress } = content;

  function handleOpen() {
    if (phase !== "closed") return;
    setPhase("open");
    const flippedAt = OPEN_DURATION + PAUSE_DURATION;
    const flyingAt = flippedAt + CARD_FLIP_DURATION + BACK_PAUSE_DURATION;
    setTimeout(() => setPhase("flipped"), flippedAt);
    setTimeout(() => setPhase("flying"), flyingAt);
    setTimeout(() => onOpen(), flyingAt + FLYING_DURATION);
  }

  const isClosed = phase === "closed";
  const hasOpened = phase !== "closed";
  const isFlipped = phase === "flipped" || phase === "flying";
  const isFlying = phase === "flying";

  return (
    <div className={`envelope-intro ${!isClosed ? "envelope-intro--open" : ""}`}>
      <div className="envelope-intro__backdrop" aria-hidden="true" />
      <div
        className={`envelope-intro__content ${isFlying ? "envelope-intro__content--flying" : ""}`}
      >
        <img
          src={asset("/images/lordganesh/lordganesh-clean-220.png")}
          alt=""
          className="envelope-intro__ganesh"
          aria-hidden="true"
        />
        <p className="envelope-intro__overline">{content.hero.tagline}</p>

        <div className="envelope-box">
          <div className="envelope-box__body" />
          {/* Static, never animates — sits behind the triangular lid below so
              the side wedges beside the triangle (and the whole area once the
              lid rotates away) stay envelope-colored instead of exposing the
              backdrop. Same fill as the lid, so while closed the two are
              indistinguishable and read as one seamless surface. */}
          <div className="envelope-box__flap-backing" aria-hidden="true" />
          <div className={`envelope-box__flap ${hasOpened ? "envelope-box__flap--open" : ""}`}>
            <div className="envelope-box__flap-surface">
              <svg viewBox="0 0 288 130" preserveAspectRatio="none" aria-hidden="true">
                <polygon points="0,0 288,0 144,130" className="envelope-box__flap-shape" />
                <polygon
                  points="0,0 288,0 144,130"
                  fill="url(#envelope-flap-shade)"
                  fillOpacity="0.18"
                />
                <polyline
                  points="0,0 144,130 288,0"
                  fill="none"
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                <defs>
                  <linearGradient id="envelope-flap-shade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <button
              type="button"
              className="envelope-box__seal"
              onClick={handleOpen}
              aria-label="Open the invitation"
              tabIndex={isClosed ? 0 : -1}
            >
              <img
                src={asset("/images/monogram/monogramseal-on-blush.png")}
                alt=""
                className="envelope-box__seal-monogram"
                aria-hidden="true"
              />
            </button>
          </div>

          <div
            className={`envelope-box__card ${hasOpened ? "envelope-box__card--risen" : ""} ${
              isFlying ? "envelope-box__card--flying" : ""
            }`}
            aria-hidden={isClosed}
          >
            <div
              className={`envelope-box__card-inner ${isFlipped ? "envelope-box__card-inner--flipped" : ""}`}
            >
              <div className="envelope-box__card-face envelope-box__card-face--front">
                <span className="envelope-box__card-eyebrow">The Wedding Of</span>
                <span className="envelope-box__card-names">
                  {couple.partner1} &amp; {couple.partner2}
                </span>
                <span className="envelope-box__card-divider" aria-hidden="true" />
                <span className="envelope-box__card-date">{wedding.displayDate}</span>
                <span className="envelope-box__card-venue">{mapAddress}</span>
              </div>
              <div className="envelope-box__card-face envelope-box__card-face--back">
                <img
                  src={asset("/images/monogram/monogramseal-on-wine.png")}
                  alt={`${couple.partner1} & ${couple.partner2}`}
                  className="envelope-box__card-seal"
                />
              </div>
            </div>
          </div>
        </div>

        <p className="envelope-intro__invocation">‖ Shree Ganeshay Namah ‖</p>

        <p className={`envelope-intro__hint ${hasOpened ? "envelope-intro__hint--hidden" : ""}`}>
          Tap the seal to open your invitation
        </p>
      </div>
    </div>
  );
}
