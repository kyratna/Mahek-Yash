import "./GaneshArt.css";

// Shared Ganesh silhouette icon — same artwork used in the Envelope Intro,
// the Hero section, and the browser tab favicon (public/favicon.svg), so
// changing the mark means editing all of those, not just this one.
export default function GaneshArt({ className }) {
  return (
    <svg viewBox="0 0 120 136" className={`ganesh-art ${className || ""}`} aria-hidden="true">
      <ellipse cx="26" cy="54" rx="20" ry="26" />
      <ellipse cx="94" cy="54" rx="20" ry="26" />
      <ellipse cx="60" cy="58" rx="26" ry="28" />
      <path d="M60 18 L52 32 L68 32 Z" />
      <circle cx="60" cy="14" r="4" />
      <path
        d="M60 78 Q54 94 66 102 Q75 108 68 119 Q63 125 55 122"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M76 72 L87 78 L78 83 Z" />
      <circle cx="50" cy="54" r="3" className="ganesh-art__eye" />
      <circle cx="70" cy="54" r="3" className="ganesh-art__eye" />
      <path d="M28 122 Q60 133 92 122 L92 126 Q60 137 28 126 Z" />
    </svg>
  );
}
