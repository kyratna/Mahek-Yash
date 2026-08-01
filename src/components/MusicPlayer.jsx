import { useEffect, useRef, useState } from "react";
import content from "../content";

function SoundOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" strokeLinecap="round" />
      <path d="M19 6a9 9 0 0 1 0 12" strokeLinecap="round" />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
      <path d="M16 9l5 6M21 9l-5 6" strokeLinecap="round" />
    </svg>
  );
}

export default function MusicPlayer() {
  const { music } = content;
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!music.src) return;
    const audio = audioRef.current;

    const tryPlay = () => audio.play().catch(() => {});
    tryPlay();

    // Browsers block autoplay with sound until the visitor interacts with
    // the page — this catches the first click/tap anywhere and retries.
    const unlockOnInteraction = () => tryPlay();
    window.addEventListener("click", unlockOnInteraction, { once: true });
    window.addEventListener("touchstart", unlockOnInteraction, { once: true });

    return () => {
      window.removeEventListener("click", unlockOnInteraction);
      window.removeEventListener("touchstart", unlockOnInteraction);
    };
  }, [music.src]);

  if (!music.src) return null;

  const toggleMute = () => {
    const audio = audioRef.current;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
    if (!audio.muted) audio.play().catch(() => {});
  };

  return (
    <>
      <audio ref={audioRef} src={music.src} loop />
      <button
        type="button"
        className="icon-button"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute background music" : "Mute background music"}
      >
        {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
      </button>
    </>
  );
}
