import { useState } from "react";
import content from "../content";
import "./Blessings.css";

const NOTE_COLORS = ["note--blush", "note--sage", "note--butter", "note--sky"];

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

function NoteCard({ entry, colorClass, isMine, onClick }) {
  return (
    <button
      type="button"
      id={isMine ? "my-blessing" : undefined}
      className={`note ${colorClass} ${isMine ? "note--mine" : ""}`}
      onClick={() => onClick(entry)}
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
  const [activeEntry, setActiveEntry] = useState(null);

  const mine = entries.find((entry) => signature(entry) === myBlessingKey);
  const others = entries.filter((entry) => signature(entry) !== myBlessingKey);

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
                <NoteCard
                  entry={mine}
                  colorClass={NOTE_COLORS[0]}
                  isMine
                  onClick={setActiveEntry}
                />
              </div>
            )}
            <div className="blessings-wall">
              {others.map((entry, index) => (
                <NoteCard
                  key={`${signature(entry)}-${index}`}
                  entry={entry}
                  colorClass={NOTE_COLORS[index % NOTE_COLORS.length]}
                  onClick={setActiveEntry}
                />
              ))}
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

      {activeEntry && (
        <div className="note-lightbox" onClick={() => setActiveEntry(null)}>
          <button
            type="button"
            className="note-lightbox__close"
            onClick={() => setActiveEntry(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <div
            className={`note note-lightbox__note ${NOTE_COLORS[0]}`}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="note__message">{activeEntry.message}</p>
            <p className="note__author">
              — {activeEntry.name}
              {activeEntry.side ? `, ${activeEntry.side}` : ""}
            </p>
            <p className="note__date">{formatDate(activeEntry.timestamp)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
