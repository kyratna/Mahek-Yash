import { useState } from "react";
import content from "../content";
import GaneshArt from "./GaneshArt";
import "./EnvelopeIntro.css";

// Config: the flap-open rotation and the gate's slide-down both start the
// instant the seal is tapped (not sequenced), so the motion reads as one
// continuous "opening" gesture instead of two separate beats. The slide is
// intentionally the slower, more deliberate of the two. If you retune
// SLIDE_DURATION, update the matching `transition` duration on
// `.envelope__gate` in EnvelopeIntro.css to keep the two in sync.
const FLAP_DURATION = 700; // ms — flap rotating open
const SLIDE_DURATION = 1500; // ms — gate sliding down off-screen

// A full-screen envelope gate shown before the site: tap the center seal to
// open the flap — which stays pinned at the top and only rotates/fades in
// place, like a lid swinging open — while, independently, the paper "gate"
// underneath (background, Ganesh art, seal) slides down to land on the page
// beneath (already mounted, just hidden behind this overlay).
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
      <div className={`envelope__flap ${isOpen ? "envelope__flap--open" : ""}`} />
      <div className={`envelope__gate ${isOpen ? "envelope__gate--open" : ""}`}>
        <div className="envelope__ganesh" aria-hidden="true">
          <GaneshArt className="envelope__ganesh-art" />
        </div>
        {phase === "closed" && (
          <button className="envelope__seal" onClick={handleOpen} aria-label="Open the invitation">
            <span className="envelope__seal-shine" aria-hidden="true" />
            <span className="envelope__seal-label">{initials}</span>
          </button>
        )}
      </div>
      {phase === "closed" && <p className="envelope-intro__hint">Tap to open</p>}
    </div>
  );
}
