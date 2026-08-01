import content from "../content";
import "./OurStory.css";

export default function OurStory() {
  const { ourStory } = content;

  return (
    <section id="story" className="section">
      <div className="section__inner">
        <div className="section__heading">
          <span className="eyebrow">How It Started</span>
          <h2>{ourStory.heading}</h2>
        </div>
        <div className="our-story">
          <div className="our-story__text">
            {ourStory.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="our-story__photos">
            {ourStory.photos.map((photo) => (
              <img key={photo.src} src={photo.src} alt={photo.alt} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
