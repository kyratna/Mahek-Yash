import { useEffect, useRef, useState } from "react";
import "./ScratchReveal.css";

const REVEAL_THRESHOLD = 0.5;
const BRUSH_RADIUS = 26;

export default function ScratchReveal({ children, label = "Scratch to reveal" }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const isPointerDown = useRef(false);
  const [revealed, setRevealed] = useState(false);

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
      const gradient = ctx.createLinearGradient(0, 0, logicalWidth, logicalHeight);
      gradient.addColorStop(0, "#d9cdbb");
      gradient.addColorStop(1, "#c9b8a0");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);
      ctx.fillStyle = "#5f564a";
      ctx.font = `600 ${Math.max(14, logicalHeight * 0.22)}px var(--font-body, serif)`;
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
      if (measureCleared() > REVEAL_THRESHOLD) {
        setRevealed(true);
      }
    }

    function handleDown(event) {
      isPointerDown.current = true;
      const { x, y } = getPoint(event);
      scratchAt(x, y);
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
    </div>
  );
}
