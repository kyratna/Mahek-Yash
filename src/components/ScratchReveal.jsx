import { useEffect, useRef, useState } from "react";
import { asset } from "../content";
import "./ScratchReveal.css";

const REVEAL_THRESHOLD = 0.5;
const BRUSH_RADIUS = 26;
const DEBRIS_COLORS = ["#7a1f1a", "#932823", "#5c1512", "#a8362f"];

export default function ScratchReveal({
  children,
  logoSrc = asset("/images/monogram/monogramCircularWithoutBg.png"),
  heading = "SAVE THE DATE",
  label = "Scratch to reveal",
  onReveal,
  forceRevealed = false,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const isPointerDown = useRef(false);
  const debrisIdRef = useRef(0);
  const hasRevealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [debris, setDebris] = useState([]);
  const logoImgRef = useRef(null);
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  const isActuallyRevealed = revealed || forceRevealed;

  useEffect(() => {
    if (isActuallyRevealed) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");

    // Preload logo image
    const img = new Image();
    img.src = logoSrc;
    img.onload = () => {
      logoImgRef.current = img;
      if (!isActuallyRevealed && container) {
        const rect = container.getBoundingClientRect();
        paintOverlay(rect.width, rect.height);
      }
    };

    function paintOverlay(logicalWidth, logicalHeight) {
      if (!logicalWidth || !logicalHeight) return;
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

      // Delicate gold inner border frame
      ctx.strokeStyle = "rgba(216, 178, 126, 0.35)";
      ctx.lineWidth = 1;
      ctx.strokeRect(8, 8, logicalWidth - 16, logicalHeight - 16);

      const isCompact = logicalWidth < 380;
      const targetLogoSize = isCompact ? 68 : 74;
      const headingSize = 17;
      const labelSize = 17;
      const spacing = isCompact ? 13 : 15;

      const logoX = (logicalWidth - targetLogoSize) / 2;
      const totalBlockHeight = targetLogoSize + spacing + headingSize + (labelSize * 1.3);
      const startY = (logicalHeight - totalBlockHeight) / 2;
      const logoY = startY;

      // Draw Initials Monogram Logo in center of scratch card
      if (logoImgRef.current && logoImgRef.current.complete && logoImgRef.current.naturalWidth > 0) {
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
        ctx.shadowBlur = 6;
        ctx.drawImage(logoImgRef.current, logoX, logoY, targetLogoSize, targetLogoSize);
        ctx.restore();
      }

      // Heading: "SAVE THE DATE"
      ctx.fillStyle = "#faf1ea";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if ("letterSpacing" in ctx) {
        ctx.letterSpacing = "0.14em";
      }
      ctx.font = `600 ${headingSize}px "Playfair Display", Georgia, serif`;
      const headingY = logoY + targetLogoSize + spacing + headingSize / 2;
      ctx.fillText(heading, logicalWidth / 2, headingY);

      // Subtitle: "Scratch to reveal"
      ctx.fillStyle = "rgba(250, 241, 234, 0.85)";
      if ("letterSpacing" in ctx) {
        ctx.letterSpacing = "0.04em";
      }
      ctx.font = `italic 400 ${labelSize}px "Cormorant Garamond", Georgia, serif`;
      const subtitleY = headingY + headingSize / 2 + labelSize / 2 + 7;
      ctx.fillText(label, logicalWidth / 2, subtitleY);
      if ("letterSpacing" in ctx) {
        ctx.letterSpacing = "0px";
      }
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
      if (measureCleared() > REVEAL_THRESHOLD && !hasRevealedRef.current) {
        hasRevealedRef.current = true;
        setRevealed(true);
        onRevealRef.current?.();
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
  }, [isActuallyRevealed, logoSrc, heading, label]);

  return (
    <div
      className={`scratch-reveal ${isActuallyRevealed ? "scratch-reveal--revealed" : ""}`}
      ref={containerRef}
    >
      <div className="scratch-reveal__content">{children}</div>
      {!isActuallyRevealed && (
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
