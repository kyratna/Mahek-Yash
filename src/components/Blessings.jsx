import { useEffect, useState } from "react";
import content from "../content";
import "./Blessings.css";

const NOTE_COLORS = ["note--blush", "note--sage", "note--butter", "note--sky"];

export default function Blessings() {
  const { blessings, integrations } = content;
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | loaded | error

  useEffect(() => {
    if (!integrations.appsScriptUrl) return;

    setStatus("loading");
    fetch(integrations.appsScriptUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setEntries(Array.isArray(data.blessings) ? data.blessings : []);
        setStatus("loaded");
      })
      .catch(() => setStatus("error"));
  }, [integrations.appsScriptUrl]);

  return (
    <section id="blessings" className="section section--surface">
      <div className="section__inner">
        <div className="section__heading">
          <span className="eyebrow">With Love</span>
          <h2>{blessings.heading}</h2>
          <p>{blessings.subtext}</p>
        </div>

        {entries.length > 0 ? (
          <div className="blessings-wall">
            {entries.map((entry, index) => (
              <div
                className={`note ${NOTE_COLORS[index % NOTE_COLORS.length]}`}
                key={`${entry.name}-${index}`}
              >
                <p className="note__message">{entry.message}</p>
                <p className="note__author">
                  — {entry.name}
                  {entry.side ? `, ${entry.side}` : ""}
                </p>
              </div>
            ))}
          </div>
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
    </section>
  );
}
