import content from "../content";
import "./RSVP.css";

export default function RSVP() {
  const { rsvp } = content;

  return (
    <section id="rsvp" className="section section--surface">
      <div className="section__inner">
        <div className="section__heading">
          <span className="eyebrow">We Can't Wait</span>
          <h2>{rsvp.heading}</h2>
          <p>{rsvp.subtext}</p>
        </div>
        <div className="rsvp-form">
          <iframe title="RSVP form" src={rsvp.googleFormEmbedUrl}>
            Loading…
          </iframe>
        </div>
      </div>
    </section>
  );
}
