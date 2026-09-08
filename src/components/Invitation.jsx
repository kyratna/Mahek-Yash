import { useMemo, useState } from "react";
import content from "../content";
import Countdown from "./Countdown";
import ScratchReveal from "./ScratchReveal";
import ScratchSizeTuner from "./ScratchSizeTuner";
import ConfettiBurst from "./ConfettiBurst";
import "./Invitation.css";

export default function Invitation({ isDateRevealed = false, onDateReveal }) {
  const { couple, wedding, hero, coupleProfiles } = content;
  const { bride, groom } = coupleProfiles;
  const [revealed, setRevealed] = useState(isDateRevealed);

  const [headingSize, setHeadingSize] = useState(() => {
    const saved = localStorage.getItem("saveTheDateHeadingSize");
    return saved ? parseInt(saved, 10) : 17;
  });

  const [labelSize, setLabelSize] = useState(() => {
    const saved = localStorage.getItem("saveTheDateLabelSize");
    return saved ? parseInt(saved, 10) : 17;
  });

  function handleHeadingSizeChange(size) {
    setHeadingSize(size);
    localStorage.setItem("saveTheDateHeadingSize", String(size));
  }

  function handleLabelSizeChange(size) {
    setLabelSize(size);
    localStorage.setItem("saveTheDateLabelSize", String(size));
  }

  function handleResetSizes() {
    setHeadingSize(17);
    setLabelSize(17);
    localStorage.removeItem("saveTheDateHeadingSize");
    localStorage.removeItem("saveTheDateLabelSize");
  }

  const unrevealedSizes = useMemo(
    () => ({ headingSize, labelSize }),
    [headingSize, labelSize]
  );

  function handleReveal() {
    setRevealed(true);
    onDateReveal?.();
  }

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
            <div className="invitation__parents">
              <span>{bride.parentage.person1}</span>
              <span>{bride.parentage.person2}</span>
            </div>
          </div>

          <div className="invitation__and-wrap">
            <span className="invitation__and">&amp;</span>
          </div>

          <div className="invitation__person">
            <span className="invitation__name">{couple.partner2}</span>
            <span className="invitation__relation">{groom.parentage.label}</span>
            <div className="invitation__parents">
              <span>{groom.parentage.person1}</span>
              <span>{groom.parentage.person2}</span>
            </div>
          </div>
        </div>

        <div className="invitation__scratch">
          <ScratchReveal
            forceRevealed={isDateRevealed}
            onReveal={handleReveal}
            unrevealedSizes={unrevealedSizes}
          >
            <div className="invitation__reveal-content">
              <p className="invitation__date invitation__date--reveal">
                {wedding.displayDate}
              </p>
              <Countdown targetDate={wedding.dateTimeISO} />
            </div>
          </ScratchReveal>

          {!revealed && !isDateRevealed && (
            <ScratchSizeTuner
              headingSize={headingSize}
              labelSize={labelSize}
              onHeadingSizeChange={handleHeadingSizeChange}
              onLabelSizeChange={handleLabelSizeChange}
              onReset={handleResetSizes}
            />
          )}
        </div>
      </div>
      <ConfettiBurst trigger={revealed} />
    </section>
  );
}
