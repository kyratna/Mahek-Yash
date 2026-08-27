import { useState } from "react";
import content from "../content";
import Countdown from "./Countdown";
import ScratchReveal from "./ScratchReveal";
import ConfettiBurst from "./ConfettiBurst";
import "./Invitation.css";

export default function Invitation() {
  const { couple, wedding, hero, coupleProfiles } = content;
  const { bride, groom } = coupleProfiles;
  const [revealed, setRevealed] = useState(false);

  return (
    <section id="invitation" className="invitation">
      <div className="invitation__overlay">
        <div className="invitation__header">
          <span className="invitation__tagline">{hero.tagline}</span>
        </div>

        <div className="invitation__body">
          <p className="invitation__intro">
            We cordially invite you on the auspicious union of
          </p>

          <div className="invitation__person">
            <span className="invitation__name">{couple.partner1}</span>
            <span className="invitation__relation">{bride.parentage.label}</span>
            <p className="invitation__parents">
              {bride.parentage.person1} and {bride.parentage.person2}
            </p>
          </div>

          <div className="invitation__and-wrap">
            <span className="invitation__and">&amp;</span>
          </div>

          <div className="invitation__person">
            <span className="invitation__name">{couple.partner2}</span>
            <span className="invitation__relation">{groom.parentage.label}</span>
            <p className="invitation__parents">
              {groom.parentage.person1} and {groom.parentage.person2}
            </p>
          </div>
        </div>

        <div className="invitation__divider" aria-hidden="true">
          <span className="invitation__divider-line invitation__divider-line--left" />
          <span className="invitation__divider-diamond" />
          <span className="invitation__divider-line invitation__divider-line--right" />
        </div>

        <div className="invitation__scratch">
          <ScratchReveal onReveal={() => setRevealed(true)}>
            <div className="invitation__reveal-content">
              <p className="invitation__date invitation__date--reveal">
                {wedding.displayDate}
              </p>
              <Countdown targetDate={wedding.dateTimeISO} />
            </div>
          </ScratchReveal>
        </div>
      </div>
      <ConfettiBurst trigger={revealed} />
    </section>
  );
}
