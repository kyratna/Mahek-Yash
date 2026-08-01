import { useEffect, useRef, useState } from "react";
import content from "../content";
import "./Gallery.css";

const AUTO_ADVANCE_MS = 4000;

export default function Gallery() {
  const { gallery } = content;
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const timerRef = useRef(null);

  // Auto-advances left to right; selecting a photo (thumbnail click, or
  // lightbox prev/next) resets this effect via the activeIndex dependency,
  // so the "untouched" timer restarts from whatever you just picked.
  useEffect(() => {
    if (gallery.length <= 1 || lightboxOpen) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % gallery.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timerRef.current);
  }, [activeIndex, lightboxOpen, gallery.length]);

  const selectTile = (index) => setActiveIndex(index);
  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);
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

        <button
          type="button"
          className="gallery-main"
          onClick={openLightbox}
          aria-label={`View ${gallery[activeIndex].alt} enlarged`}
        >
          <img src={gallery[activeIndex].src} alt={gallery[activeIndex].alt} />
        </button>

        <div className="gallery-thumbs">
          {gallery.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className={`gallery-thumb ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => selectTile(index)}
              aria-label={`Show ${photo.alt}`}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <button
            type="button"
            className="lightbox__close"
            onClick={closeLightbox}
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
