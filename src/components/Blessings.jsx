import { useEffect, useState } from "react";
import content from "../content";
import "./Blessings.css";

const NOTE_COLORS = ["note--blush", "note--sage", "note--butter", "note--sky"];
const GOLDEN_ANGLE = 137.508; // degrees — produces an even, organic circular spread
const CLOUD_BREAKPOINT = 700; // below this width, fall back to a plain grid
const VIEW_ALL_THRESHOLD = 15; // show a "view all" button once the wall has more than this many
const MIN_NOTE_WIDTH = 90;
const MAX_NOTE_WIDTH = 170;
const SHRINK_AFTER = 6; // start shrinking notes once there are more than this many

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
// hand-placing each one. The cloud itself stays a fixed size (see
// .blessings-cloud) — notes shrink instead of the circle growing.
function getCloudPosition(index, total) {
  const angle = index * GOLDEN_ANGLE * (Math.PI / 180);
  const radius = Math.sqrt((index + 0.5) / total) * 40; // percent, leaves edge margin
  return {
    left: `${50 + radius * Math.cos(angle)}%`,
    top: `${50 + radius * Math.sin(angle)}%`,
  };
}

function getNoteWidth(total) {
  if (total <= SHRINK_AFTER) return MAX_NOTE_WIDTH;
  const shrunk = MAX_NOTE_WIDTH - (total - SHRINK_AFTER) * 4;
  return Math.max(MIN_NOTE_WIDTH, shrunk);
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
  const [showAll, setShowAll] = useState(false);
  const isWide = useIsWide(CLOUD_BREAKPOINT);

  const mine = entries.find((entry) => signature(entry) === myBlessingKey);
  const others = entries.filter((entry) => signature(entry) !== myBlessingKey);
  const noteWidth = getNoteWidth(others.length);
  const noteScale = noteWidth / MAX_NOTE_WIDTH;

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
              {isWide ? (
                <div className="blessings-cloud__spin">
                  {others.map((entry, index) => {
                    const colorClass = NOTE_COLORS[index % NOTE_COLORS.length];
                    const pos = getCloudPosition(index, others.length);
                    return (
                      <div
                        className="cloud-item"
                        style={{ left: pos.left, top: pos.top, width: noteWidth, "--note-scale": noteScale }}
                        key={`${signature(entry)}-${index}`}
                      >
                        <div className="cloud-item__counter-spin">
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
                      </div>
                    );
                  })}
                </div>
              ) : (
                others.map((entry, index) => (
                  <NoteCard
                    key={`${signature(entry)}-${index}`}
                    entry={entry}
                    colorClass={NOTE_COLORS[index % NOTE_COLORS.length]}
                    onOpen={openNote}
                  />
                ))
              )}
            </div>

            {entries.length > VIEW_ALL_THRESHOLD && (
              <div className="blessings-view-all">
                <button type="button" className="button" onClick={() => setShowAll(true)}>
                  View All Blessings ({entries.length})
                </button>
              </div>
            )}
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

      {showAll && (
        <div className="blessings-all-overlay" onClick={() => setShowAll(false)}>
          <div className="blessings-all-panel" onClick={(e) => e.stopPropagation()}>
            <div className="blessings-all-panel__header">
              <h3>All Blessings</h3>
              <button
                type="button"
                className="note-lightbox__close blessings-all-panel__close"
                onClick={() => setShowAll(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="blessings-all-panel__list">
              {entries.map((entry, index) => (
                <div className="blessings-all-panel__item" key={`${signature(entry)}-${index}`}>
                  <p className="note__message">{entry.message}</p>
                  <p className="note__author">
                    — {entry.name}
                    {entry.side ? `, ${entry.side}` : ""}
                  </p>
                  <p className="note__date">{formatDate(entry.timestamp)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
