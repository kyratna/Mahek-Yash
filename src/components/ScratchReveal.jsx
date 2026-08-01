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

      // Base metallic-foil gradient.
      const gradient = ctx.createLinearGradient(0, 0, logicalWidth, logicalHeight);
      gradient.addColorStop(0, "#cdbca2");
      gradient.addColorStop(0.5, "#e6d9c0");
      gradient.addColorStop(1, "#cdbca2");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      // Fine diagonal hatching, like a brushed-foil texture.
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      for (let x = -logicalHeight; x < logicalWidth; x += 6) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + logicalHeight, logicalHeight);
        ctx.stroke();
      }

      // Random speckles for an authentic scratch-off card grain.
      const speckleCount = Math.floor((logicalWidth * logicalHeight) / 45);
      for (let i = 0; i < speckleCount; i++) {
        const x = Math.random() * logicalWidth;
        const y = Math.random() * logicalHeight;
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.25)" : "rgba(50,40,25,0.1)";
        ctx.fillRect(x, y, 1.3, 1.3);
      }

      ctx.fillStyle = "#5f564a";
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
