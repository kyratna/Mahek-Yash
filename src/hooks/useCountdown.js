import { useState, useEffect } from "react";

function getTimeRemaining(targetISO) {
  const total = new Date(targetISO).getTime() - Date.now();
  const isPast = total <= 0;
  const clamped = Math.max(total, 0);
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
    isPast,
  };
}

export function useCountdown(targetISO) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetISO));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetISO));
    }, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  return timeLeft;
}
