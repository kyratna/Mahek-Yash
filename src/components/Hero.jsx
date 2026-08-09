import { useState } from "react";
import content, { asset } from "../content";
import Countdown from "./Countdown";
import ScratchReveal from "./ScratchReveal";
import ConfettiBurst from "./ConfettiBurst";
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
        <p className="hero__shlok" lang="sa">
          वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ ।
          <br />
          निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
        </p>
        <p className="hero__shlok-translation">
          O Lord Ganesha, of the curved trunk and massive body, with the brilliance of a
          million suns — please make all my endeavors free of obstacles, always.
        </p>
        <span className="eyebrow">{hero.tagline}</span>
        <h1 className="hero__names">
          {couple.partner1} &amp; {couple.partner2}
        </h1>
        <p className="hero__invite">
          We cordially invite you on the auspicious union of
          <br />
          <span className="hero__invite-name">{bride.name}</span>
          <br />
          {bride.parentage.person1} &amp; {bride.parentage.person2}
          <br />
          <span className="hero__invite-and">&amp;</span>
          <br />
          <span className="hero__invite-name">{groom.name}</span>
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
      <ConfettiBurst trigger={revealed} />
    </section>
  );
}
