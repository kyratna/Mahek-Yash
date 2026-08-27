import { smoothScrollTo } from "../lib/smoothScroll";

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomeButton({ onReopenEnvelope }) {
  const handleClick = () => {
    if (onReopenEnvelope) {
      onReopenEnvelope();
    } else {
      smoothScrollTo("shree-ganesh", { offset: 0 });
    }
  };

  return (
    <button
      type="button"
      className="icon-button"
      onClick={handleClick}
      aria-label="View Envelope Invitation"
      title="View Envelope Invitation"
    >
      <EnvelopeIcon />
    </button>
  );
}
