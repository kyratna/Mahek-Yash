import { useState } from "react";
import content, { asset } from "../content";
import Countdown from "./Countdown";
import ScratchReveal from "./ScratchReveal";
import ConfettiBurst from "./ConfettiBurst";
import FitDevanagari from "./FitDevanagari";
import "./Hero.css";

// Fixed positions/timings for the twinkle sparkles — deterministic (no
// Math.random on every render) but spread out enough to look organic.
const SPARKLES = [
  { top: "12%", left: "8%", delay: "0s", duration: "3.2s" },
  { top: "22%", left: "22%", delay: "0.8s", duration: "4s" },
  { top: "15%", left: "40%", delay: "1.6s", duration: "3.6s" },
  { top: "30%", left: "58%", delay: "0.4s", duration: "3.8s" },
  { top: "18%", left: "75%", delay: "1.2s", duration: "3.4s" },
  { top: "35%", left: "88%", delay: "2s", duration: "4.2s" },
  { top: "55%", left: "12%", delay: "0.6s", duration: "3.5s" },
  { top: "65%", left: "30%", delay: "1.8s", duration: "3.9s" },
  { top: "48%", left: "50%", delay: "1s", duration: "3.3s" },
  { top: "60%", left: "68%", delay: "2.4s", duration: "4.1s" },
  { top: "52%", left: "85%", delay: "0.2s", duration: "3.7s" },
  { top: "78%", left: "20%", delay: "1.4s", duration: "3.6s" },
  { top: "82%", left: "45%", delay: "0.9s", duration: "4s" },
  { top: "75%", left: "65%", delay: "2.2s", duration: "3.4s" },
  { top: "85%", left: "80%", delay: "1.6s", duration: "3.8s" },
  { top: "8%", left: "55%", delay: "2.6s", duration: "3.5s" },
];

export default function Hero() {
  const { couple, wedding, hero, coupleProfiles } = content;
  const { bride, groom } = coupleProfiles;
  const [revealed, setRevealed] = useState(false);

  return (
    <section id="hero" className="hero">
      {/* First screen: the invocation alone — Ganesh crest, the Sanskrit
          shlok, and its English translation. Nothing else competes for
          attention here; the couple's own announcement is a deliberate
          scroll away, on the second screen below. */}
      <div className="hero__view hero__view--intro">
        <div className="hero__shimmer" aria-hidden="true" />
        <div className="hero__sparkles" aria-hidden="true">
          {SPARKLES.map((s, i) => (
            <span
              key={i}
              className="sparkle"
              style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.duration }}
            />
          ))}
        </div>
        <div className="hero__overlay">
          <div className="hero__ganesh" aria-hidden="true">
            <div className="hero__ganesh-glow" />
            <img
              src={asset("/images/lordganesh/ganeshWithoutBackground.png")}
              alt=""
              className="hero__ganesh-art"
              aria-hidden="true"
            />
          </div>
          <FitDevanagari
            className="hero__shlok"
            lines={["वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ ।", "निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥"]}
          />
          <p className="hero__shlok-translation">
            O Lord Ganesha, of the curved trunk and massive body, with the brilliance of a
            million suns — please make all my endeavors free of obstacles, always.
          </p>
          <span className="hero__shlok-divider" aria-hidden="true" />
          <FitDevanagari
            className="hero__shlok"
            lines={["मंगलम् भगवान विष्णुः, मंगलम् गरुणध्वजः ।", "मंगलम् पुण्डरी काक्षः, मंगलाय तनो हरिः ॥"]}
          />
          <p className="hero__shlok-translation">
            Auspicious is Lord Vishnu, auspicious is He who bears the Garuda banner —
            auspicious is the lotus-eyed One; may Hari make every undertaking blessed.
          </p>
        </div>
      </div>
      {/* Second screen: the actual invitation — tagline, the couple's
          names with both sets of parents, and the scratch-to-reveal date/
          countdown. */}
      <div className="hero__view hero__view--invite">
        <div className="hero__overlay">
          <span className="eyebrow">{hero.tagline}</span>
          <p className="hero__invite">
            We cordially invite you on the auspicious union of
            <br />
            {bride.parentage.person1} &amp; {bride.parentage.person2}
            <br />
            <span className="hero__invite-name">{couple.partner1}</span>
            <br />
            <span className="hero__invite-and">&amp;</span>
            <br />
            <span className="hero__invite-name">{couple.partner2}</span>
            <br />
            {groom.parentage.person1} &amp; {groom.parentage.person2}
          </p>
          <ScratchReveal onReveal={() => setRevealed(true)}>
            <div className="hero__reveal-content">
              <p className="hero__date hero__date--reveal">{wedding.displayDate}</p>
              <Countdown targetDate={wedding.dateTimeISO} />
            </div>
          </ScratchReveal>
        </div>
      </div>
      <ConfettiBurst trigger={revealed} />
    </section>
  );
}
