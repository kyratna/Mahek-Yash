import { useLayoutEffect, useRef, useState } from "react";

// The largest a shlok line is ever allowed to render at — the ceiling the
// fixed clamp() on .hero__shlok used to provide. Never grows past this on
// wide screens; shrinks below it only as far as each line actually needs.
const MAX_FONT_PX = 23; // 1.3rem at the site's 16px root

// Keeps each Devanagari line (passed as one array entry per line) on its
// own single line at any viewport width, instead of wrapping once a fixed
// min-font-size floor is hit. Measures each line's natural (unwrapped)
// width against the available container width and solves directly for
// the font-size at which the widest line exactly fits — one measurement
// pass, no iterative shrink loop, and it self-corrects back up toward
// MAX_FONT_PX if the viewport grows again.
export default function FitDevanagari({ lines, className, lang = "sa" }) {
  const containerRef = useRef(null);
  const lineRefs = useRef([]);
  const [fontSize, setFontSize] = useState(MAX_FONT_PX);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function fit() {
      const available = container.clientWidth;
      if (!available) return;
      let target = MAX_FONT_PX;
      lineRefs.current.forEach((el) => {
        if (!el) return;
        // Natural width scales linearly with font-size, so this ratio
        // gives the exact fitting size regardless of what size the line
        // happens to be rendered at right now.
        const currentSize = parseFloat(getComputedStyle(el).fontSize);
        const natural = el.scrollWidth;
        if (natural > available) {
          target = Math.min(target, (available / natural) * currentSize);
        }
      });
      // Small safety margin so the line doesn't sit flush against the edge.
      setFontSize(Math.max(10, target * 0.97));
    }

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    return () => observer.disconnect();
  }, [lines]);

  return (
    <p className={className} lang={lang} ref={containerRef} style={{ fontSize }}>
      {lines.map((line, i) => (
        <span
          key={i}
          ref={(el) => (lineRefs.current[i] = el)}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}
