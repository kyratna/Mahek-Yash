import { useEffect, useRef, useState } from "react";

// Tracks an element's rendered pixel size via ResizeObserver. Used where a
// layout needs to reason in real pixels (e.g. guaranteeing non-overlapping
// positions) rather than CSS percentages alone.
export function useElementSize(active) {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!active) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const rect = el.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [active]);

  return [ref, size];
}

// Convenience wrapper for callers that only need the width.
export function useElementWidth(active) {
  const [ref, size] = useElementSize(active);
  return [ref, size.width];
}
