import { useEffect, useState } from "react";
import content from "../content";
import "./Blessings.css";

const NOTE_COLORS = ["note--blush", "note--sage", "note--butter", "note--sky"];
const GOLDEN_ANGLE = 137.508; // degrees — produces an even, organic circular spread
const CLOUD_BREAKPOINT = 700; // below this width, fall back to a plain grid

function signature(entry) {
  return `${entry.name}||${entry.message}`;
}

function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Sunflower-seed spiral: spreads N items evenly across a circle without
// hand-placing each one, and scales naturally as more blessings arrive.
function getCloudPosition(index, total) {
  const angle = index * GOLDEN_ANGLE * (Math.PI / 180);
  const radius = Math.sqrt((index + 0.5) / total) * 40; // percent, leaves edge margin
  return {
    left: `${50 + radius * Math.cos(angle)}%`,
    top: `${50 + radius * Math.sin(angle)}%`,
  };
}

function useIsWide(minWidth) {
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

function NoteCard({ entry, colorClass, isMine, onOpen }) {
  return (
    <button
      type="button"
      id={isMine ? "my-blessing" : undefined}
      className={`note ${colorClass} ${isMine ? "note--mine" : ""}`}
      onClick={() => onOpen(entry, colorClass)}
    >
      <p className="note__message">{entry.message}</p>
      <p className="note__author">
        — {entry.name}
        {entry.side ? `, ${entry.side}` : ""}
      </p>
      <p className="note__date">{formatDate(entry.timestamp)}</p>
    </button>
  );
}

export default function Blessings({ entries, status, myBlessingKey }) {
  const { blessings } = content;
  const [active, setActive] = useState(null); // { entry, colorClass }
  const isWide = useIsWide(CLOUD_BREAKPOINT);

  const mine = entries.find((entry) => signature(entry) === myBlessingKey);
  const others = entries.filter((entry) => signature(entry) !== myBlessingKey);

  const openNote = (entry, colorClass) => setActive({ entry, colorClass });

  return (
    <section id="blessings" className="section section--surface">
      <div className="section__inner">
        <div className="section__heading">
          <span className="eyebrow">With Love</span>
          <h2>{blessings.heading}</h2>
          <p>{blessings.subtext}</p>
        </div>

        {entries.length > 0 ? (
          <>
            {mine && (
              <div className="blessings-wall__mine">
                <NoteCard entry={mine} colorClass={NOTE_COLORS[0]} isMine onOpen={openNote} />
              </div>
            )}

            <div className={isWide ? "blessings-cloud" : "blessings-wall"}>
              {others.map((entry, index) => {
                const colorClass = NOTE_COLORS[index % NOTE_COLORS.length];
                if (!isWide) {
                  return (
                    <NoteCard
                      key={`${signature(entry)}-${index}`}
                      entry={entry}
                      colorClass={colorClass}
                      onOpen={openNote}
                    />
                  );
                }
                const pos = getCloudPosition(index, others.length);
                return (
                  <div
                    className="cloud-item"
                    style={{ left: pos.left, top: pos.top }}
                    key={`${signature(entry)}-${index}`}
                  >
                    <div
                      className="cloud-item__float"
                      style={{
                        animationDelay: `${(index % 6) * 0.4}s`,
                        animationDuration: `${4.5 + (index % 4) * 0.6}s`,
                      }}
                    >
                      <NoteCard entry={entry} colorClass={colorClass} onOpen={openNote} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="blessings-empty">
            <p>
              {status === "error"
                ? "Couldn't load blessings right now — be the first to leave one below!"
                : "No blessings yet — be the first to leave one!"}
            </p>
            <a className="button" href="#blessings-rsvp">
              Send Blessings
            </a>
          </div>
        )}
      </div>

      {active && (
        <div className="note-lightbox" onClick={() => setActive(null)}>
          <button
            type="button"
            className="note-lightbox__close"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <div
            className={`note note-lightbox__note ${active.colorClass}`}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="note__message">{active.entry.message}</p>
            <p className="note__author">
              — {active.entry.name}
              {active.entry.side ? `, ${active.entry.side}` : ""}
            </p>
            <p className="note__date">{formatDate(active.entry.timestamp)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
