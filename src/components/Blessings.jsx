import { useState } from "react";
import content from "../content";
import { BLESSINGS_WALL_HASH } from "../lib/routes";
import "./Blessings.css";

export const NOTE_COLORS = ["note--blush", "note--sage", "note--butter", "note--sky"];
const TILE_CAP = 15; // max blessing tiles shown at once in this section, most recent first

export function signature(entry) {
  return `${entry.name}||${entry.message}`;
}

export function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Longer messages get a smaller font so they fit their tile on their own
// terms instead of every note sharing one size regardless of length.
function getMessageScale(message) {
  const length = message?.length || 0;
  if (length <= 40) return 1.15;
  if (length <= 90) return 1;
  if (length <= 150) return 0.88;
  return 0.78;
}

export function NoteCard({ entry, colorClass, isMine, onOpen, tile = false }) {
  const scale = getMessageScale(entry.message);
  return (
    <button
      type="button"
      id={isMine ? "my-blessing" : undefined}
      className={`note ${colorClass} ${isMine ? "note--mine" : ""} ${tile ? "note--tile" : ""}`}
      style={{ "--message-scale": scale }}
      onClick={() => onOpen(entry, colorClass)}
    >
      <p className="note__message">{entry.message}</p>
      <p className="note__author">— {entry.name}</p>
      {entry.side && <p className="note__side">({entry.side})</p>}
      <p className="note__date">{formatDate(entry.timestamp)}</p>
    </button>
  );
}

export default function Blessings({ entries, status, myBlessingKey }) {
  const { blessings } = content;
  const [active, setActive] = useState(null); // { entry, colorClass }

  const mine = entries.find((entry) => signature(entry) === myBlessingKey);
  const others = entries.filter((entry) => signature(entry) !== myBlessingKey);

  const othersCap = Math.max(mine ? TILE_CAP - 1 : TILE_CAP, 0);
  const visibleOthers = others.slice(0, othersCap);

  const openNote = (entry, colorClass) => setActive({ entry, colorClass });

  const hubTile = (
    <div className="blessings-tile blessings-tile--hub" key="hub">
      {mine && (
        <div className="blessings-hub__note">
          <NoteCard entry={mine} colorClass={NOTE_COLORS[0]} isMine onOpen={openNote} tile />
        </div>
      )}
      <a className="button button--primary blessings-hub__button" href={BLESSINGS_WALL_HASH}>
        View All Blessings
      </a>
    </div>
  );

  // The hub (the visitor's own note, if any, plus the button into the full
  // wall) sits at the middle of the tile order — not absolutely positioned,
  // just inserted into the grid's natural flow — so it reads as roughly
  // centered in the tiled wall without needing any manual placement math.
  const middle = Math.floor(visibleOthers.length / 2);
  const before = visibleOthers.slice(0, middle);
  const after = visibleOthers.slice(middle);

  const renderNote = (entry, index) => (
    <NoteCard
      key={signature(entry)}
      entry={entry}
      colorClass={NOTE_COLORS[index % NOTE_COLORS.length]}
      onOpen={openNote}
      tile
    />
  );

  return (
    <section id="blessings" className="section section--surface">
      <div className="section__inner">
        <div className="section__heading">
          <span className="eyebrow">With Love</span>
          <h2>{blessings.heading}</h2>
          <p>{blessings.subtext}</p>
        </div>

        {entries.length === 0 && (
          <div className="blessings-empty-hint">
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

        <div className="blessings-tiles">
          {before.map((entry, index) => renderNote(entry, index))}
          {hubTile}
          {after.map((entry, index) => renderNote(entry, index + middle))}
        </div>
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
            <p className="note__author">— {active.entry.name}</p>
            {active.entry.side && <p className="note__side">({active.entry.side})</p>}
            <p className="note__date">{formatDate(active.entry.timestamp)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
