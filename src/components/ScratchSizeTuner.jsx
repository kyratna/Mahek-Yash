import { useState } from "react";
import "./ScratchSizeTuner.css";

const PRESETS = [
  { label: "17px Both", heading: 17, subtitle: 17 },
  { label: "Compact", heading: 18, subtitle: 12 },
  { label: "Standard", heading: 22, subtitle: 14 },
  { label: "Prominent", heading: 26, subtitle: 16 },
];

export default function ScratchSizeTuner({
  headingSize,
  labelSize,
  onHeadingSizeChange,
  onLabelSizeChange,
  onReset,
}) {
  const [isOpen, setIsOpen] = useState(false);

  function applyPreset(preset) {
    onHeadingSizeChange(preset.heading);
    onLabelSizeChange(preset.subtitle);
  }

  return (
    <div className="scratch-tuner">
      <button
        type="button"
        className="scratch-tuner__toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label="Adjust font sizes for scratch card"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span>Adjust Font Sizes</span>
      </button>

      {isOpen && (
        <div className="scratch-tuner__panel" role="region" aria-label="Font Size Tuner">
          <div className="scratch-tuner__header">
            <h4 className="scratch-tuner__title">Scratch Card Font Sizes</h4>
            <button
              type="button"
              className="scratch-tuner__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close tuner"
            >
              &times;
            </button>
          </div>

          <div className="scratch-tuner__row">
            <div className="scratch-tuner__label-wrap">
              <span className="scratch-tuner__label">SAVE THE DATE</span>
              <span className="scratch-tuner__badge">{headingSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="34"
              step="1"
              value={headingSize}
              onChange={(e) => onHeadingSizeChange(Number(e.target.value))}
              className="scratch-tuner__slider"
              aria-label="SAVE THE DATE font size slider"
            />
          </div>

          <div className="scratch-tuner__row">
            <div className="scratch-tuner__label-wrap">
              <span className="scratch-tuner__label">Scratch to reveal</span>
              <span className="scratch-tuner__badge">{labelSize}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="22"
              step="1"
              value={labelSize}
              onChange={(e) => onLabelSizeChange(Number(e.target.value))}
              className="scratch-tuner__slider"
              aria-label="Scratch to reveal font size slider"
            />
          </div>

          <div className="scratch-tuner__presets-wrap">
            <span className="scratch-tuner__presets-title">Quick Presets</span>
            <div className="scratch-tuner__presets">
              {PRESETS.map((p) => {
                const isActive = headingSize === p.heading && labelSize === p.subtitle;
                return (
                  <button
                    key={p.label}
                    type="button"
                    className={`scratch-tuner__preset-btn ${isActive ? "scratch-tuner__preset-btn--active" : ""}`}
                    onClick={() => applyPreset(p)}
                  >
                    {p.label} ({p.heading}px)
                  </button>
                );
              })}
            </div>
          </div>

          <div className="scratch-tuner__footer">
            <span className="scratch-tuner__hint">Updates live on card</span>
            <button type="button" className="scratch-tuner__reset" onClick={onReset}>
              Reset Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
