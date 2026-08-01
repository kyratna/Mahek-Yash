import { useEffect, useRef, useState } from "react";
import { smoothScrollTo } from "../lib/smoothScroll";
import "./SectionNav.css";

// Matches smoothScrollTo's default animation duration, plus a small buffer,
// so a click mid-animation can't recompute the target off a stale scroll
// position and jump somewhere unexpected.
const SCROLL_LOCK_MS = 750;

const SECTION_IDS = [
  "hero",
  "couple",
  "details",
  "gallery",
  "blessings",
  "blessings-rsvp",
  "faq",
  "footer",
];

function UpArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SectionNav() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    function updateIndex() {
      const probe = window.scrollY + window.innerHeight / 3;
      let index = 0;
      SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) index = i;
      });
      setCurrentIndex(index);
    }
    updateIndex();
    window.addEventListener("scroll", updateIndex, { passive: true });
    window.addEventListener("resize", updateIndex);
    return () => {
      window.removeEventListener("scroll", updateIndex);
      window.removeEventListener("resize", updateIndex);
    };
  }, []);

  const goTo = (index) => {
    if (isAnimatingRef.current) return;
    const id = SECTION_IDS[index];
    if (!id) return;
    const navHeight = document.querySelector(".nav")?.offsetHeight || 0;
    isAnimatingRef.current = true;
    smoothScrollTo(id, { offset: navHeight + 8 });
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, SCROLL_LOCK_MS);
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === SECTION_IDS.length - 1;

  return (
    <div className="section-nav">
      <button
        type="button"
        className="icon-button"
        onClick={() => goTo(currentIndex - 1)}
        disabled={isFirst}
        aria-label="Previous section"
      >
        <UpArrowIcon />
      </button>
      <button
        type="button"
        className="icon-button"
        onClick={() => goTo(currentIndex + 1)}
        disabled={isLast}
        aria-label="Next section"
      >
        <DownArrowIcon />
      </button>
    </div>
  );
}
