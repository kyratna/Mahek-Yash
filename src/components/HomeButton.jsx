import { smoothScrollTo } from "../lib/smoothScroll";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 11.5L12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomeButton() {
  return (
    <button
      type="button"
      className="icon-button"
      onClick={() => smoothScrollTo("hero", 0)}
      aria-label="Back to top"
    >
      <HomeIcon />
    </button>
  );
}
