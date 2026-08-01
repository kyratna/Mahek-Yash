import content from "../content";
import "./MeetCouple.css";

function Lineage({ className, lineage }) {
  return (
    <p className={className}>
      {lineage.label}
      <br />
      {lineage.person1}
      <br />
      <span className="couple-profile__amp">&amp;</span>
      <br />
      {lineage.person2}
    </p>
  );
}

export default function MeetCouple() {
  const { bride, groom } = content.coupleProfiles;
  const { coupleVectorArt } = content;

  return (
    <section id="couple" className="section">
      <div className="section__inner">
        <div className="section__heading">
          <span className="eyebrow">Meet</span>
          <h2>The Bride &amp; Groom</h2>
        </div>
        <div className="couple-profiles">
          <div className="couple-profiles__cards">
            <article className="couple-profile">
              <h3>{bride.name}</h3>
              <Lineage className="couple-profile__grandparentage" lineage={bride.grandparentage} />
              <Lineage className="couple-profile__parentage" lineage={bride.parentage} />
            </article>

            <article className="couple-profile">
              <h3>{groom.name}</h3>
              <Lineage className="couple-profile__grandparentage" lineage={groom.grandparentage} />
              <Lineage className="couple-profile__parentage" lineage={groom.parentage} />
            </article>

            {coupleVectorArt && (
              <img className="couple-profiles__vector" src={coupleVectorArt} alt="" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
