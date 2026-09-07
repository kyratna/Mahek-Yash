import { useLayoutEffect, useMemo, useRef, useState } from "react";

// The largest a shlok line is ever allowed to render at — the ceiling the
// fixed clamp() on .hero__shlok used to provide. Never grows past this on
// wide screens; shrinks below it only as far as each line actually needs.
const MAX_FONT_PX = 23; // 1.3rem at the site's 16px root
const MIN_FONT_PX = 11;

// Keeps each Devanagari line on its own line while fitting within available container width.
// Uses a stable invariant ratio (available / scrollWidth * currentSize) so target size
// is strictly monotonic and does not oscillate between frames.
export default function FitDevanagari({ lines, className, lang = "sa" }) {
  const containerRef = useRef(null);
  const lineRefs = useRef([]);
  const [fontSize, setFontSize] = useState(MAX_FONT_PX);
  const currentFontSizeRef = useRef(MAX_FONT_PX);
  const lastWidthRef = useRef(0);

  const lineArray = useMemo(() => {
    if (Array.isArray(lines)) return lines;
    if (typeof lines === "string") {
      return lines.split("\n").map((l) => l.trim()).filter(Boolean);
    }
    return [];
  }, [lines]);

  const linesKey = lineArray.join("||");

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function fit() {
      const available = container.clientWidth;
      if (!available) return;
      lastWidthRef.current = available;

      let target = MAX_FONT_PX;
      let measuredAny = false;

      lineRefs.current.forEach((el) => {
        if (!el) return;
        const currentSize =
          parseFloat(getComputedStyle(el).fontSize) || currentFontSizeRef.current;
        const natural = el.scrollWidth;
        if (!natural || !currentSize) return;

        measuredAny = true;
        // Natural width scales linearly with font-size.
        // Safety margin (0.96) ensures the line doesn't sit flush against edge.
        const lineMaxFit = (available * 0.96 / natural) * currentSize;
        target = Math.min(target, lineMaxFit);
      });

      if (!measuredAny) return;

      const newSize = Math.max(MIN_FONT_PX, Math.min(MAX_FONT_PX, Math.floor(target)));
      if (newSize !== currentFontSizeRef.current) {
        currentFontSizeRef.current = newSize;
        setFontSize(newSize);
      }
    }

    fit();

    // Re-fit once web fonts finish loading so font metrics are accurate
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        fit();
      });
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        // Only re-fit if horizontal width changed by at least 2px (ignore height-only changes)
        if (width && Math.abs(width - lastWidthRef.current) >= 2) {
          fit();
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [linesKey]);

  return (
    <p
      className={className}
      lang={lang}
      ref={containerRef}
      style={{
        fontSize: `${fontSize}px`,
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {lineArray.map((line, i) => (
        <span key={i} style={{ display: "block", maxWidth: "100%" }}>
          <span
            ref={(el) => (lineRefs.current[i] = el)}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {line}
          </span>
        </span>
      ))}
    </p>
  );
}
