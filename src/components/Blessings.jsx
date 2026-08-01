import { useMemo, useState } from "react";
import content from "../content";
import { useIsWide } from "../hooks/useIsWide";
import { useElementSize } from "../hooks/useElementWidth";
import { BLESSINGS_WALL_HASH } from "../lib/routes";
import "./Blessings.css";

const NOTE_COLORS = ["note--blush", "note--sage", "note--butter", "note--sky"];
const GOLDEN_ANGLE = 137.508; // degrees — produces an even, organic circular spread
const CLOUD_BREAKPOINT = 700; // below this width, fall back to a plain grid
const MIN_NOTE_WIDTH = 70;
const MAX_NOTE_WIDTH = 170;
const SHRINK_AFTER = 5; // notes start shrinking from MAX_NOTE_WIDTH once there are more than this many
const NOTE_ASPECT = 0.72; // note height ÷ width, with the message clamped to 2 lines (see .cloud-item .note)
const EDGE_MARGIN = 10; // px kept clear between the outermost note's edge and the container edge
const HUB_MARGIN = 12; // px kept clear between the ring's innermost note and the hub content
// Used before the hub is measured (briefly on mount, or if ResizeObserver
// never fires — e.g. a backgrounded tab). Sized for the hub's worst case
// (the "mine" note present, not just the button) rather than its smallest,
// so that window never renders an overlap.
const FALLBACK_HUB_RADIUS = 150;
const SPACING_SAFETY = 0.72; // buffer over the theoretical golden-angle nearest-neighbor step (see note below)
const FALLBACK_CONTAINER_WIDTH = 700; // used for one frame before ResizeObserver reports the real size

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

function getBaseNoteWidth(total) {
  if (total <= SHRINK_AFTER) return MAX_NOTE_WIDTH;
  const shrunk = MAX_NOTE_WIDTH - (total - SHRINK_AFTER) * 4.5;
  return Math.max(MIN_NOTE_WIDTH, shrunk);
}

// Sunflower-seed spiral (golden-angle placement, radius ∝ √index) spreads N
// items across a ring without hand-placing each one, and — uniquely for the
// golden angle — keeps the nearest-neighbor distance between any two points
// close to a constant equal to the radial step size. That lets us solve for
// the largest note size that still keeps every pair of notes' bounding boxes
// apart, and keeps the outermost note inside the container edge, given the
// hub's actual measured size (hubSize — see .blessings-cloud__hub): shrink
// the note size (not the ring, which stays fixed — see .blessings-cloud)
// until both fit.
function buildCloudLayout(total, containerWidth, hubSize) {
  const width = containerWidth > 0 ? containerWidth : FALLBACK_CONTAINER_WIDTH;
  const hubRadius =
    hubSize && (hubSize.width > 0 || hubSize.height > 0)
      ? 0.5 * Math.sqrt(hubSize.width ** 2 + hubSize.height ** 2) + HUB_MARGIN
      : FALLBACK_HUB_RADIUS;

  // Half the diagonal of a note's bounding box, per pixel of note width —
  // the (empirically tuned, via SPACING_SAFETY) center-to-center distance
  // two same-size notes need to stay apart regardless of the angle between
  // them.
  const diagonalPerWidth = Math.sqrt(1 + NOTE_ASPECT * NOTE_ASPECT);
  const outerSteps = Math.sqrt(Math.max(total - 1 + 0.5, 0));
  const baseWidth = getBaseNoteWidth(total);

  // Solve for the note width W where the outermost note's own edge
  // (+ W/2) still lands inside the container edge (− EDGE_MARGIN):
  //   hubRadius + SAFETY·diag(W)·outerSteps + W/2  <=  width/2 − EDGE_MARGIN
  const outerBudget = width / 2 - EDGE_MARGIN - hubRadius;
  const safeWidth =
    outerSteps > 0
      ? outerBudget / (SPACING_SAFETY * diagonalPerWidth * outerSteps + 0.5)
      : outerBudget * 2;

  const noteWidth = Math.max(MIN_NOTE_WIDTH, Math.min(baseWidth, safeWidth));
  const spacingStep = SPACING_SAFETY * diagonalPerWidth * noteWidth;

  // When MIN_NOTE_WIDTH has to override a smaller safeWidth (very high
  // counts), the no-clip guarantee above no longer holds by construction —
  // so cap the radius directly as a hard backstop. Notes clamped to this
  // ceiling lose the guaranteed no-overlap spacing between each other, but
  // never get cut off by the container edge, which reads worse.
  const maxRadius = Math.max(width / 2 - EDGE_MARGIN - noteWidth / 2, hubRadius);

  const positions = [];
  for (let index = 0; index < total; index++) {
    const angle = index * GOLDEN_ANGLE * (Math.PI / 180);
    const radius = Math.min(hubRadius + spacingStep * Math.sqrt(index + 0.5), maxRadius);
    const radiusPercent = (radius / width) * 100;
    positions.push({
      left: `${50 + radiusPercent * Math.cos(angle)}%`,
      top: `${50 + radiusPercent * Math.sin(angle)}%`,
    });
  }

  return { noteWidth, noteHeight: noteWidth * NOTE_ASPECT, positions };
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
  const [cloudRef, cloudSize] = useElementSize(isWide);
  const mine = entries.find((entry) => signature(entry) === myBlessingKey);
  const [hubRef, hubSize] = useElementSize(isWide);

  const others = entries.filter((entry) => signature(entry) !== myBlessingKey);

  const cloudLayout = useMemo(
    () => buildCloudLayout(others.length, cloudSize.width, hubSize),
    [others.length, cloudSize.width, hubSize.width, hubSize.height]
  );
  const noteScale = cloudLayout.noteWidth / MAX_NOTE_WIDTH;

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
          isWide ? (
            <div className="blessings-cloud" ref={cloudRef}>
              <div className="blessings-cloud__spin">
                {others.map((entry, index) => {
                  const colorClass = NOTE_COLORS[index % NOTE_COLORS.length];
                  const pos = cloudLayout.positions[index] || { left: "50%", top: "50%" };
                  return (
                    <div
                      className="cloud-item"
                      style={{
                        left: pos.left,
                        top: pos.top,
                        width: cloudLayout.noteWidth,
                        height: cloudLayout.noteHeight,
                        "--note-scale": noteScale,
                      }}
                      key={signature(entry)}
                    >
                      <div className="cloud-item__counter-spin">
                        <div
                          className="cloud-item__float"
                          style={{
                            animationDelay: `${(index % 6) * 0.4}s`,
                            animationDuration: `${6 + (index % 4) * 0.5}s`,
                          }}
                        >
                          <NoteCard entry={entry} colorClass={colorClass} onOpen={openNote} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="blessings-cloud__hub">
                <div className="blessings-cloud__hub-content" ref={hubRef}>
                  {mine && (
                    <div className="blessings-cloud__hub-note">
                      <NoteCard entry={mine} colorClass={NOTE_COLORS[0]} isMine onOpen={openNote} />
                    </div>
                  )}
                  <a className="button blessings-cloud__hub-button" href={BLESSINGS_WALL_HASH}>
                    View All Blessings
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <>
              {mine && (
                <div className="blessings-wall__mine">
                  <NoteCard entry={mine} colorClass={NOTE_COLORS[0]} isMine onOpen={openNote} />
                </div>
              )}
              <div className="blessings-wall">
                {others.map((entry, index) => (
                  <NoteCard
                    key={signature(entry)}
                    entry={entry}
                    colorClass={NOTE_COLORS[index % NOTE_COLORS.length]}
                    onOpen={openNote}
                  />
                ))}
              </div>
              <div className="blessings-view-all">
                <a className="button" href={BLESSINGS_WALL_HASH}>
                  View All Blessings
                </a>
              </div>
            </>
          )
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
