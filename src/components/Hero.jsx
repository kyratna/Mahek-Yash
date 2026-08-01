import content from "../content";
import Countdown from "./Countdown";
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
        <p className="hero__date">{wedding.displayDate}</p>
        <Countdown targetDate={wedding.dateTimeISO} />
      </div>
    </section>
  );
}
