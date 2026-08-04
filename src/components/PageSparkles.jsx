import "./PageSparkles.css";

// Fixed positions/timings for the twinkle sparkles — deterministic (no
// Math.random on every render) but spread out enough to look organic.
// Uses position:fixed (viewport-relative) so this reads as a single
// site-wide effect visible over every section, not just the Hero photo.
const SPARKLES = [
  { top: "10%", left: "15%", delay: "0s", duration: "3.4s" },
  { top: "24%", left: "82%", delay: "1.1s", duration: "3.8s" },
  { top: "38%", left: "6%", delay: "2s", duration: "3.2s" },
  { top: "46%", left: "60%", delay: "0.6s", duration: "4s" },
  { top: "58%", left: "30%", delay: "1.6s", duration: "3.6s" },
  { top: "66%", left: "90%", delay: "0.3s", duration: "3.9s" },
  { top: "78%", left: "48%", delay: "2.4s", duration: "3.5s" },
  { top: "88%", left: "18%", delay: "1.3s", duration: "3.7s" },
  { top: "14%", left: "50%", delay: "0.8s", duration: "3.3s" },
  { top: "92%", left: "70%", delay: "1.9s", duration: "4.1s" },
];

export default function PageSparkles() {
  return (
    <div className="page-sparkles" aria-hidden="true">
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="page-sparkle"
          style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.duration }}
        />
      ))}
    </div>
  );
}
