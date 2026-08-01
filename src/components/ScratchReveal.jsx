import { useEffect, useRef, useState } from "react";
import "./ScratchReveal.css";

const REVEAL_THRESHOLD = 0.5;
const BRUSH_RADIUS = 26;
const DEBRIS_COLORS = ["#7a1f1a", "#932823", "#5c1512", "#a8362f"];

export default function ScratchReveal({ children, label = "Scratch to reveal" }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const isPointerDown = useRef(false);
  const debrisIdRef = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const [debris, setDebris] = useState([]);

  useEffect(() => {
    if (revealed) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // NOTE: after ctx.setTransform(ratio, ...) below, all drawing must use
    // *logical* (CSS) pixel coordinates — the transform already handles the
    // device-pixel-ratio scaling. Using canvas.width/height (physical
    // pixels) here would double-scale everything.
    function paintOverlay(logicalWidth, logicalHeight) {
      ctx.globalCompositeOperation = "source-over";

      // Base red paper-like gradient.
      const gradient = ctx.createLinearGradient(0, 0, logicalWidth, logicalHeight);
      gradient.addColorStop(0, "#8f231f");
      gradient.addColorStop(0.5, "#b5322f");
      gradient.addColorStop(1, "#7a1a17");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      // Fine diagonal fiber lines, like textured paper.
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      for (let x = -logicalHeight; x < logicalWidth; x += 5) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + logicalHeight, logicalHeight);
        ctx.stroke();
      }

      // Random speckles for authentic paper grain.
      const speckleCount = Math.floor((logicalWidth * logicalHeight) / 40);
      for (let i = 0; i < speckleCount; i++) {
        const x = Math.random() * logicalWidth;
        const y = Math.random() * logicalHeight;
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,235,225,0.18)" : "rgba(40,10,8,0.15)";
        ctx.fillRect(x, y, 1.3, 1.3);
      }

      ctx.fillStyle = "#faf1ea";
      ctx.font = `600 ${Math.max(13, Math.min(18, logicalWidth * 0.055))}px var(--font-body, serif)`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, logicalWidth / 2, logicalHeight / 2);
    }

    function resize() {
      const rect = container.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      paintOverlay(rect.width, rect.height);
    }

    function getPoint(event) {
      const rect = canvas.getBoundingClientRect();
      const source = event.touches ? event.touches[0] : event;
      return { x: source.clientX - rect.left, y: source.clientY - rect.top };
    }

    function scratchAt(x, y) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    function spawnDebris(x, y) {
      if (Math.random() > 0.45) return; // throttle so it doesn't flood the DOM
      const id = debrisIdRef.current++;
      const piece = {
        id,
        x,
        y,
        dx: (Math.random() - 0.5) * 50,
        rotation: (Math.random() - 0.5) * 220,
        size: 3 + Math.random() * 5,
        color: DEBRIS_COLORS[Math.floor(Math.random() * DEBRIS_COLORS.length)],
      };
      setDebris((current) => [...current, piece]);
      setTimeout(() => {
        setDebris((current) => current.filter((p) => p.id !== id));
      }, 900);
    }

    function measureCleared() {
      const rect = container.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      const w = Math.round(rect.width * ratio);
      const h = Math.round(rect.height * ratio);
      if (!w || !h) return 0;
      const pixels = ctx.getImageData(0, 0, w, h).data;
      let cleared = 0;
      let sampled = 0;
      for (let i = 3; i < pixels.length; i += 4 * 16) {
        sampled += 1;
        if (pixels[i] === 0) cleared += 1;
      }
      return sampled ? cleared / sampled : 0;
    }

    function handleMove(event) {
      if (!isPointerDown.current) return;
      if (event.touches) event.preventDefault();
      const { x, y } = getPoint(event);
      scratchAt(x, y);
      spawnDebris(x, y);
      if (measureCleared() > REVEAL_THRESHOLD) {
        setRevealed(true);
      }
    }

    function handleDown(event) {
      isPointerDown.current = true;
      const { x, y } = getPoint(event);
      scratchAt(x, y);
      spawnDebris(x, y);
    }

    function handleUp() {
      isPointerDown.current = false;
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousedown", handleDown);
    canvas.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    canvas.addEventListener("touchstart", handleDown, { passive: true });
    canvas.addEventListener("touchmove", handleMove, { passive: false });
    canvas.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", handleDown);
      canvas.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      canvas.removeEventListener("touchstart", handleDown);
      canvas.removeEventListener("touchmove", handleMove);
      canvas.removeEventListener("touchend", handleUp);
    };
  }, [revealed, label]);

  return (
    <div className="scratch-reveal" ref={containerRef}>
      <div className="scratch-reveal__content">{children}</div>
      {!revealed && (
        <canvas className="scratch-reveal__canvas" ref={canvasRef} aria-hidden="true" />
      )}
      {debris.map((p) => (
        <span
          key={p.id}
          className="scratch-debris"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.color,
            "--debris-dx": `${p.dx}px`,
            "--debris-rotation": `${p.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
}
