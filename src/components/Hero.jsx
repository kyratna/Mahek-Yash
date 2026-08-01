import content from "../content";
import Countdown from "./Countdown";
import ScratchReveal from "./ScratchReveal";
import "./Hero.css";

export default function Hero() {
  const { couple, wedding, hero } = content;

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${hero.backgroundImage})` }}
    >
      <div className="hero__overlay">
        <span className="eyebrow">{hero.tagline}</span>
        <h1 className="hero__names">
          {couple.partner1} &amp; {couple.partner2}
        </h1>
        <ScratchReveal label="Scratch to reveal the date">
          <p className="hero__date hero__date--big">{wedding.displayDate}</p>
        </ScratchReveal>
        <Countdown targetDate={wedding.dateTimeISO} />
      </div>
    </section>
  );
}
