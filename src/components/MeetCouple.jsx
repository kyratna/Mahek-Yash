import content from "../content";
import "./MeetCouple.css";

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
          {coupleVectorArt && (
            <img className="couple-profiles__vector" src={coupleVectorArt} alt="" aria-hidden="true" />
          )}

          <div className="couple-profiles__cards">
            <article className="couple-profile">
              <img src={bride.photo} alt={bride.name} />
              <h3>{bride.name}</h3>
              <p className="couple-profile__grandparentage">{bride.grandparentage}</p>
              <p className="couple-profile__parentage">{bride.parentage}</p>
            </article>

            <article className="couple-profile">
              <img src={groom.photo} alt={groom.name} />
              <h3>{groom.name}</h3>
              <p className="couple-profile__grandparentage">{groom.grandparentage}</p>
              <p className="couple-profile__parentage">{groom.parentage}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
