import { useEffect, useRef, useState } from "react";
import content from "../content";
import "./Gallery.css";

const AUTO_ADVANCE_MS = 4000;
const VISIBLE_RANGE = 3; // covers beyond +/-3 slots from center are hidden

// Signed distance from `index` to `activeIndex`, wrapped the short way
// around the deck so the coverflow always turns in whichever direction is
// closer instead of unwinding all the way around on wrap.
function wrappedOffset(index, activeIndex, count) {
  let diff = index - activeIndex;
  if (diff > count / 2) diff -= count;
  if (diff < -count / 2) diff += count;
  return diff;
}

export default function Gallery() {
  const { gallery } = content;
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const timerRef = useRef(null);

  // Auto-advances left to right; selecting a photo (cover click, or
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

        <div className="coverflow">
          <button
            type="button"
            className="coverflow__nav coverflow__nav--prev"
            onClick={showPrev}
            aria-label="Previous photo"
          >
            &#8249;
          </button>

          <div className="coverflow__stage">
            {gallery.map((photo, index) => {
              const offset = wrappedOffset(index, activeIndex, gallery.length);
              const abs = Math.abs(offset);
              const isActive = offset === 0;
              const hidden = abs > VISIBLE_RANGE;
              return (
                <button
                  key={photo.src}
                  type="button"
                  className={`coverflow__cover ${isActive ? "is-active" : ""}`}
                  style={{
                    zIndex: gallery.length - abs,
                    transform: `translateX(${offset * 52}%) translateZ(${-abs * 130}px) rotateY(${offset * -38}deg) scale(${isActive ? 1 : 0.76})`,
                    opacity: hidden ? 0 : 1,
                    pointerEvents: hidden ? "none" : "auto",
                  }}
                  onClick={() => (isActive ? openLightbox() : selectTile(index))}
                  aria-label={isActive ? `View ${photo.alt} enlarged` : `Show ${photo.alt}`}
                >
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="coverflow__nav coverflow__nav--next"
            onClick={showNext}
            aria-label="Next photo"
          >
            &#8250;
          </button>
        </div>

        <div className="coverflow__dots">
          {gallery.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className={`coverflow__dot ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => selectTile(index)}
              aria-label={`Show ${photo.alt}`}
            />
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
