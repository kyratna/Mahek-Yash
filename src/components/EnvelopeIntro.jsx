import { useState } from "react";
import content from "../content";
import "./EnvelopeIntro.css";

// Config: the flap-open rotation and the gate's slide-down both start the
// instant the seal is tapped (not sequenced), so the motion reads as one
// continuous "opening" gesture instead of two separate beats. The slide is
// intentionally the slower, more deliberate of the two. If you retune
// SLIDE_DURATION, update the matching `transition` duration on
// `.envelope-intro` in EnvelopeIntro.css to keep the two in sync.
const FLAP_DURATION = 700; // ms — flap rotating open
const SLIDE_DURATION = 1500; // ms — whole gate sliding down off-screen

// A full-screen envelope gate shown before the site: tap the center seal to
// open the flap while the entire gate slides down together to land on the
// page beneath (already mounted, just hidden behind this overlay).
export default function EnvelopeIntro({ onOpen }) {
  const [phase, setPhase] = useState("closed"); // closed -> open
  const { couple } = content;
  const initials = `${couple.partner1[0]} & ${couple.partner2[0]}`;

  function handleOpen() {
    if (phase !== "closed") return;
    setPhase("open");
    setTimeout(() => onOpen(), Math.max(FLAP_DURATION, SLIDE_DURATION));
  }

  const isOpen = phase === "open";

  return (
    <div className={`envelope-intro ${isOpen ? "envelope-intro--open" : ""}`}>
      <div className="envelope">
        <div className={`envelope__flap ${isOpen ? "envelope__flap--open" : ""}`} />
        <div className="envelope__ganesh" aria-hidden="true">
          <div className="envelope__ganesh-glow" />
          <svg viewBox="0 0 120 136" className="envelope__ganesh-art">
            <ellipse cx="26" cy="54" rx="20" ry="26" />
            <ellipse cx="94" cy="54" rx="20" ry="26" />
            <ellipse cx="60" cy="58" rx="26" ry="28" />
            <path d="M60 18 L52 32 L68 32 Z" />
            <circle cx="60" cy="14" r="4" />
            <path
              d="M60 78 Q54 94 66 102 Q75 108 68 119 Q63 125 55 122"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path d="M76 72 L87 78 L78 83 Z" />
            <circle cx="50" cy="54" r="3" className="envelope__ganesh-eye" />
            <circle cx="70" cy="54" r="3" className="envelope__ganesh-eye" />
            <path d="M28 122 Q60 133 92 122 L92 126 Q60 137 28 126 Z" />
          </svg>
        </div>
        {phase === "closed" && (
          <button className="envelope__seal" onClick={handleOpen} aria-label="Open the invitation">
            {initials}
          </button>
        )}
      </div>
      {phase === "closed" && <p className="envelope-intro__hint">Tap to open</p>}
    </div>
  );
}
