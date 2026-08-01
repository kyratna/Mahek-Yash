// Fast-start, decelerating scroll to a section — a plain CSS
// `scroll-behavior: smooth` doesn't give control over the easing curve, so
// this animates window.scrollTo manually with an ease-out timing function.
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function smoothScrollTo(targetId, { offset = 0, duration = 700 } = {}) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const startY = window.scrollY;
  const targetY = target.getBoundingClientRect().top + startY - offset;
  const distance = targetY - startY;
  let startTime = null;

  function step(timestamp) {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(progress));
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
