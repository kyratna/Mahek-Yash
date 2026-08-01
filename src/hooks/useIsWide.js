import { useEffect, useState } from "react";

export function useIsWide(minWidth) {
  const [isWide, setIsWide] = useState(
    () => typeof window !== "undefined" && window.innerWidth > minWidth
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${minWidth + 1}px)`);
    const handleChange = () => setIsWide(mql.matches);
    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [minWidth]);

  return isWide;
}
