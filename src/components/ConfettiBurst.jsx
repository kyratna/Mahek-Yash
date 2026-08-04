import { useEffect, useState } from "react";
import "./ConfettiBurst.css";

const COLORS = ["#b08968", "#b5322f", "#8f231f", "#e6ddd2", "#faf7f2", "#2e2b28"];
const PIECE_COUNT = 90;
const VISIBLE_DURATION = 3600;

function makePieces() {
  return Array.from({ length: PIECE_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 2.6 + Math.random() * 1.6,
    rotation: Math.random() * 360,
    drift: (Math.random() - 0.5) * 160,
    size: 6 + Math.random() * 8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    round: Math.random() > 0.5,
  }));
}

// Fires a one-shot full-viewport confetti burst every time `trigger` changes
// to a truthy, new value (pass an incrementing counter so repeat submits
// re-fire even though the "on" state never itself changes). Uses
// position:fixed so it escapes the Hero's overflow:hidden and always covers
// the whole screen regardless of scroll position.
export default function ConfettiBurst({ trigger }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    setPieces(makePieces());
    const timer = setTimeout(() => setPieces([]), VISIBLE_DURATION);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (pieces.length === 0) return null;

  return (
    <div className="confetti-burst" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.4 + 2,
            background: p.color,
            borderRadius: p.round ? "50%" : "2px",
            "--confetti-rotation": `${p.rotation}deg`,
            "--confetti-drift": `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
