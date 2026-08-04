import { useEffect, useRef, useState } from "react";
import "./CursorSparkleTrail.css";

const SPAWN_INTERVAL = 70; // min ms between sparkles while the pointer moves
const LIFETIME = 700; // ms a single sparkle stays mounted
const MAX_SPARKLES = 20;

let nextId = 0;

// Trails a handful of small gold sparkles behind the pointer. Skipped
// entirely on touch/coarse-pointer devices (no hover cursor to trail) and
// when the user prefers reduced motion.
export default function CursorSparkleTrail() {
  const [sparkles, setSparkles] = useState([]);
  const lastSpawn = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || coarsePointer) return;

    function handleMove(e) {
      const now = performance.now();
      if (now - lastSpawn.current < SPAWN_INTERVAL) return;
      lastSpawn.current = now;

      const id = nextId++;
      setSparkles((prev) => [
        ...prev.slice(-(MAX_SPARKLES - 1)),
        {
          id,
          x: e.clientX,
          y: e.clientY,
          size: 6 + Math.random() * 7,
          rotation: Math.random() * 360,
        },
      ]);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, LIFETIME);
    }

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div className="cursor-sparkle-trail" aria-hidden="true">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="cursor-sparkle"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            "--sparkle-rotation": `${s.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
}
