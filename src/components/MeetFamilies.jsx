import content from "../content";
import FitDevanagari from "./FitDevanagari";
import "./MeetFamilies.css";

function SymbolHeader({ text, side }) {
  if (text?.includes("मंगलम्") || side === "bride") {
    return (
      <svg
        className="family-card__symbol-svg"
        viewBox="0 10 185 45"
        aria-label="॥ मंगलम् ॥"
        role="img"
      >
        <defs>
          <clipPath id="m-consonant-clip">
            <rect x="42.2" y="19" width="23.8" height="30" />
          </clipPath>
        </defs>
        <text x="5" y="45" className="family-card__symbol-svg-text" fill="var(--color-accent)">
          ॥ मंगलम् ॥
        </text>
        <text
          x="5"
          y="45"
          className="family-card__symbol-svg-text"
          fill="var(--color-burgundy)"
          clipPath="url(#m-consonant-clip)"
          aria-hidden="true"
        >
          ॥ मंगलम् ॥
        </text>
      </svg>
    );
  }

  if (text?.includes("युग्म") || side === "groom") {
    return (
      <svg
        className="family-card__symbol-svg"
        viewBox="0 10 150 45"
        aria-label="॥ युग्म ॥"
        role="img"
      >
        <defs>
          <clipPath id="y-consonant-clip">
            <rect x="42.2" y="18" width="22.8" height="27" />
          </clipPath>
        </defs>
        <text x="5" y="45" className="family-card__symbol-svg-text" fill="var(--color-accent)">
          ॥ युग्म ॥
        </text>
        <text
          x="5"
          y="45"
          className="family-card__symbol-svg-text"
          fill="var(--color-burgundy)"
          clipPath="url(#y-consonant-clip)"
          aria-hidden="true"
        >
          ॥ युग्म ॥
        </text>
      </svg>
    );
  }

  return <span>{text || "॥ श्री ॥"}</span>;
}

function FamilyCard({ family, side }) {
  const {
    symbol,
    symbolTranslation,
    familyTitle,
    location,
    grandparents,
    invitePhrase1,
    parents,
    invitePhrase2,
    name,
    relation,
  } = family;

  return (
    <article className={`family-card family-card--${side}`}>
      {/* Luxury Royal Double Border Frame */}
      <div className="family-card__frame" aria-hidden="true">
        <span className="family-card__inner-border" />
      </div>

      <div className="family-card__content">
        <div className="family-card__symbol" lang="sa">
          <SymbolHeader text={symbol} side={side} />
        </div>
        <p className="family-card__symbol-translation">
          {symbolTranslation || (side === "bride" ? "Auspicious Beginning" : "Sacred Union")}
        </p>
        <h3 className="family-card__title">{familyTitle}</h3>
        {location && <p className="family-card__location">{location}</p>}

        <div className="family-card__divider" aria-hidden="true" />

        {grandparents && grandparents.length > 0 && (
          <div className="family-card__blessing-box">
            <span className="family-card__blessing-tag">
              Under the divine grace &amp; blessings of revered grandparents
            </span>
            <div className="family-card__blessing-names">
              <span>{grandparents[0]}</span>
              <span className="family-card__amp-sub">&amp;</span>
              <span>{grandparents[1]}</span>
            </div>
          </div>
        )}

        <div className="family-card__group family-card__group--parents">
          <p className="family-card__sublabel">
            {invitePhrase1 || "with their family and loved ones"}
          </p>
          <div className="family-card__parents">
            <span className="family-card__parent-name">{parents[0]}</span>
            <span className="family-card__amp">&amp;</span>
            <span className="family-card__parent-name">{parents[1]}</span>
          </div>
        </div>

        <p className="family-card__request-phrase">
          {invitePhrase2 ||
            "request the pleasure of your company on the auspicious wedding of"}
        </p>

        <div className="family-card__name">{name}</div>
        <div className="family-card__relation">{relation}</div>
      </div>
    </article>
  );
}

export default function MeetFamilies() {
  const familyData = content.familySection || {};
  const { brideFamily, groomFamily, shloka, quote } = familyData;

  // Fallbacks if not fully populated
  const bride = brideFamily || {
    symbol: "॥ मंगलम् ॥",
    familyTitle: "THE GUPTA FAMILY",
    location: "Moradabad · पीतल नगरी · The City of Brass",
    grandparents: [
      content.coupleProfiles?.bride?.grandparentage?.person1 || "Late Shri Prem Shankar Gupta",
      content.coupleProfiles?.bride?.grandparentage?.person2 || "Late Smt. Sarla Devi Gupta",
    ],
    invitePhrase1: "with their family and loved ones",
    parents: [
      content.coupleProfiles?.bride?.parentage?.person1 || "Smt. Deepa Gupta",
      content.coupleProfiles?.bride?.parentage?.person2 || "Shri Rajeev Gupta",
    ],
    invitePhrase2: "request the pleasure of your company on the auspicious wedding of",
    name: content.couple?.partner1 || "Mahek",
    relation: "THEIR BELOVED DAUGHTER",
  };

  const groom = groomFamily || {
    symbol: "॥ युग्म ॥",
    familyTitle: "THE GUPTA FAMILY",
    location: "Moradabad · पीतल नगरी · The City of Brass",
    grandparents: [
      content.coupleProfiles?.groom?.grandparentage?.person1 || "Late Shri Niwas Gupta",
      content.coupleProfiles?.groom?.grandparentage?.person2 || "Late Smt. Rama Gupta",
    ],
    invitePhrase1: "with their family and loved ones",
    parents: [
      content.coupleProfiles?.groom?.parentage?.person1 || "Smt. Renu Gupta",
      content.coupleProfiles?.groom?.parentage?.person2 || "Shri Sandeep Kumar Gupta",
    ],
    invitePhrase2: "request the pleasure of your company on the auspicious wedding of",
    name: content.couple?.partner2 || "Yash",
    relation: "THEIR BELOVED SON",
  };

  return (
    <section id="couple" className="section family-section">
      <div id="families" style={{ position: "absolute", top: 0 }} />
      <div className="section__inner family-section__inner">
        <div className="section__heading family-section__heading">
          <span className="eyebrow">Meet</span>
          <h2>The Families</h2>
        </div>

        <div className="family-section__header">
          <FitDevanagari
            className="family-section__shloka"
            lines={
              Array.isArray(shloka)
                ? shloka
                : [shloka || "॥ त्वमेव माता च पिता त्वमेव, त्वमेव बन्धुश्च सखा त्वमेव ॥"]
            }
          />
          <p className="family-section__quote">
            {quote ||
              '"You alone are my mother and my father, my family and my friend — You alone are all of these to me."'}
          </p>
        </div>

        <div className="family-cards-container">
          <FamilyCard family={bride} side="bride" />

          <div className="family-cards__divider" aria-hidden="true">
            <span className="family-cards__divider-line family-cards__divider-line--top" />
            <span className="family-cards__divider-om" lang="sa">
              ॐ
            </span>
            <span className="family-cards__divider-line family-cards__divider-line--bottom" />
          </div>

          <FamilyCard family={groom} side="groom" />
        </div>
      </div>
    </section>
  );
}
