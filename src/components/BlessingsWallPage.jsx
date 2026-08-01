import { useEffect } from "react";
import { useBlessings } from "../hooks/useBlessings";
import content from "../content";
import { HOME_HASH } from "../lib/routes";
import "./Blessings.css";
import "./BlessingsWallPage.css";

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

export default function BlessingsWallPage() {
  const { entries, status } = useBlessings();
  const { partner1, partner2 } = content.couple;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Blessings Wall";
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const goHome = () => {
    window.location.hash = HOME_HASH;
  };

  return (
    <div className="blessings-wall-page">
      <header className="blessings-wall-page__header">
        <button type="button" className="blessings-wall-page__back" onClick={goHome}>
          ← Back to the invitation
        </button>
        <span className="eyebrow">
          {partner1} &amp; {partner2}
        </span>
        <h1>Blessings Wall</h1>
        <p>Every blessing, newest first.</p>
      </header>

      <main className="blessings-wall-page__list">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <article className="blessings-wall-page__item" key={`${signature(entry)}-${index}`}>
              <p className="note__message">{entry.message}</p>
              <p className="note__author">
                — {entry.name}
                {entry.side ? `, ${entry.side}` : ""}
              </p>
              <p className="note__date">{formatDate(entry.timestamp)}</p>
            </article>
          ))
        ) : (
          <p className="blessings-wall-page__empty">
            {status === "error"
              ? "Couldn't load blessings right now — please try again shortly."
              : "No blessings yet — be the first to leave one!"}
          </p>
        )}
      </main>
    </div>
  );
}
