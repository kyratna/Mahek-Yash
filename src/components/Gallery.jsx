import { useState } from "react";
import content from "../content";
import "./Gallery.css";

export default function Gallery() {
  const { gallery } = content;
  const [activeIndex, setActiveIndex] = useState(null);

  const close = () => setActiveIndex(null);
  const showPrev = (e) => {
    e.stopPropagation();
    setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length);
  };
  const showNext = (e) => {
    e.stopPropagation();
    setActiveIndex((i) => (i + 1) % gallery.length);
  };

  return (
    <section id="gallery" className="section section--surface">
      <div className="section__inner">
        <div className="section__heading">
          <span className="eyebrow">Memories</span>
          <h2>Gallery</h2>
        </div>
        <div className="gallery-grid">
          {gallery.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className="gallery-grid__item"
              onClick={() => setActiveIndex(index)}
              aria-label={`View ${photo.alt}`}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <div className="lightbox" onClick={close}>
          <button
            type="button"
            className="lightbox__close"
            onClick={close}
            aria-label="Close"
          >
            &times;
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={showPrev}
            aria-label="Previous photo"
          >
            &#8249;
          </button>
          <img
            src={gallery[activeIndex].src}
            alt={gallery[activeIndex].alt}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={showNext}
            aria-label="Next photo"
          >
            &#8250;
          </button>
        </div>
      )}
    </section>
  );
}
