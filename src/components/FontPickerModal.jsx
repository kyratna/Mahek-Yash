import { useState, useEffect } from "react";
import "./FontPickerModal.css";

export const FONT_PRESETS = [
  {
    id: "default-regal",
    name: "Regal Playfair (Default)",
    description: "Classic British/Editorial serif with flowing Alex Brush cursive",
    heading: "'Playfair Display', Georgia, serif",
    body: "'Cormorant Garamond', Georgia, serif",
    cursive: "'Alex Brush', cursive",
    numeric: "lining-nums",
  },
  {
    id: "royal-roman",
    name: "Royal Roman (Crisp Lining Numbers)",
    description: "Inscriptional Roman capitals with crisp, perfectly aligned numerals",
    heading: "'Cinzel', serif",
    body: "'EB Garamond', Georgia, serif",
    cursive: "'Great Vibes', cursive",
    numeric: "lining-nums",
  },
  {
    id: "vogue-luxury",
    name: "Prata Haute Couture",
    description: "High-contrast Didone elegance with romantic Pinyon Script",
    heading: "'Prata', Georgia, serif",
    body: "'Lora', Georgia, serif",
    cursive: "'Pinyon Script', cursive",
    numeric: "lining-nums",
  },
  {
    id: "italian-bodoni",
    name: "Bodoni Moda Elegance",
    description: "Italian high-fashion serif with slender Italianno script",
    heading: "'Bodoni Moda', serif",
    body: "'Spectral', Georgia, serif",
    cursive: "'Italianno', cursive",
    numeric: "lining-nums",
  },
  {
    id: "imperial-marcellus",
    name: "Marcellus Imperial",
    description: "Graceful Roman proportions with subtle flared serifs & Allura script",
    heading: "'Marcellus', Georgia, serif",
    body: "'Cormorant Garamond', Georgia, serif",
    cursive: "'Allura', cursive",
    numeric: "lining-nums",
  },
  {
    id: "romantic-dm",
    name: "DM Serif Romance",
    description: "Warm, sculptural display serif paired with Parisienne cursive",
    heading: "'DM Serif Display', serif",
    body: "'EB Garamond', Georgia, serif",
    cursive: "'Parisienne', cursive",
    numeric: "lining-nums",
  },
  {
    id: "baroque-cinzel",
    name: "Cinzel Decorative Baroque",
    description: "Ornate royal titling with grand MonteCarlo calligraphy",
    heading: "'Cinzel Decorative', 'Cinzel', serif",
    body: "'Cardo', Georgia, serif",
    cursive: "'MonteCarlo', cursive",
    numeric: "lining-nums",
  },
  {
    id: "antique-cormorant",
    name: "Cormorant Antique (Oldstyle Numbers)",
    description: "Vintage Renaissance numerals where digits naturally ascend/descend",
    heading: "'Cormorant Garamond', Georgia, serif",
    body: "'Cormorant Garamond', Georgia, serif",
    cursive: "'Tangerine', cursive",
    numeric: "oldstyle-nums",
  },
];

export const HEADING_FONTS = [
  { name: "Playfair Display", value: "'Playfair Display', Georgia, serif", style: "Editorial Serif" },
  { name: "Cinzel", value: "'Cinzel', serif", style: "Royal Roman Lining" },
  { name: "Marcellus", value: "'Marcellus', Georgia, serif", style: "Flared Roman" },
  { name: "Prata", value: "'Prata', Georgia, serif", style: "High Contrast Didone" },
  { name: "Bodoni Moda", value: "'Bodoni Moda', serif", style: "Italian Luxury" },
  { name: "Lora", value: "'Lora', Georgia, serif", style: "Contemporary Balanced" },
  { name: "DM Serif Display", value: "'DM Serif Display', serif", style: "Sculptural Display" },
  { name: "Spectral", value: "'Spectral', Georgia, serif", style: "Clean Warm Serif" },
  { name: "Cardo", value: "'Cardo', Georgia, serif", style: "Renaissance Classical" },
  { name: "Cinzel Decorative", value: "'Cinzel Decorative', serif", style: "Ornate Royal" },
  { name: "Cormorant Garamond", value: "'Cormorant Garamond', Georgia, serif", style: "Oldstyle Antique" },
];

export const CURSIVE_FONTS = [
  { name: "Alex Brush", value: "'Alex Brush', cursive", style: "Flowing Elegance" },
  { name: "Great Vibes", value: "'Great Vibes', cursive", style: "Formal Calligraphy" },
  { name: "Pinyon Script", value: "'Pinyon Script', cursive", style: "Romantic Vintage" },
  { name: "Italianno", value: "'Italianno', cursive", style: "Slender Italian" },
  { name: "Allura", value: "'Allura', cursive", style: "Smooth Feminine" },
  { name: "Parisienne", value: "'Parisienne', cursive", style: "Chic Parisian" },
  { name: "Tangerine", value: "'Tangerine', cursive", style: "Delicate Handwritten" },
  { name: "MonteCarlo", value: "'MonteCarlo', cursive", style: "Baroque Flourish" },
];

export const NUMERIC_MODES = [
  { id: "lining-nums", label: "Lining Numbers (Uniform)", desc: "All digits share the exact same height and align on the baseline" },
  { id: "oldstyle-nums", label: "Oldstyle Numbers (Antique)", desc: "Digits have ascenders (6, 8) and descenders (3, 4, 5, 7, 9) like lowercase letters" },
  { id: "tabular-nums", label: "Tabular Numbers (Equal Width)", desc: "Fixed digit widths, ideal for countdown timers" },
  { id: "normal", label: "Default Font Proportions", desc: "Native numeric glyphs defined by the font designer" },
];

export default function FontPickerModal({ isOpen, onClose }) {
  const [selectedHeading, setSelectedHeading] = useState(
    () => localStorage.getItem("site_font_heading") || "'Playfair Display', Georgia, serif"
  );
  const [selectedBody, setSelectedBody] = useState(
    () => localStorage.getItem("site_font_body") || "'Cormorant Garamond', Georgia, serif"
  );
  const [selectedCursive, setSelectedCursive] = useState(
    () => localStorage.getItem("site_font_cursive") || "'Alex Brush', cursive"
  );
  const [selectedNumeric, setSelectedNumeric] = useState(
    () => localStorage.getItem("site_font_numeric") || "lining-nums"
  );
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("presets");

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--font-heading", selectedHeading);
    root.style.setProperty("--font-body", selectedBody);
    root.style.setProperty("--font-cursive", selectedCursive);
    root.style.setProperty("font-variant-numeric", selectedNumeric);
    
    localStorage.setItem("site_font_heading", selectedHeading);
    localStorage.setItem("site_font_body", selectedBody);
    localStorage.setItem("site_font_cursive", selectedCursive);
    localStorage.setItem("site_font_numeric", selectedNumeric);
  }, [selectedHeading, selectedBody, selectedCursive, selectedNumeric]);

  if (!isOpen) return null;

  function applyPreset(preset) {
    setSelectedHeading(preset.heading);
    setSelectedBody(preset.body);
    setSelectedCursive(preset.cursive);
    setSelectedNumeric(preset.numeric);
  }

  function handleReset() {
    applyPreset(FONT_PRESETS[0]);
  }

  function handleCopyConfig() {
    const config = `/* Applied Font Configuration */
--font-heading: ${selectedHeading};
--font-body: ${selectedBody};
--font-cursive: ${selectedCursive};
font-variant-numeric: ${selectedNumeric};`;
    navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="font-studio-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="font-studio-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="font-studio__header">
          <div className="font-studio__title-wrap">
            <span className="font-studio__eyebrow">Interactive Typography Studio</span>
            <h3 className="font-studio__title">Font &amp; Date Proportions Picker</h3>
          </div>
          <button
            type="button"
            className="font-studio__close-btn"
            onClick={onClose}
            aria-label="Close Font Studio"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Live Specimen Preview Box */}
        <div className="font-studio__preview-stage">
          <div className="font-studio__preview-header">
            <span className="font-studio__preview-tag">Live Real-Time Preview</span>
            <span className="font-studio__preview-font-name">
              Heading: {selectedHeading.split(",")[0].replace(/'/g, "")} • Numeric: {selectedNumeric}
            </span>
          </div>

          <div
            className="font-studio__preview-content"
            style={{
              fontVariantNumeric: selectedNumeric,
            }}
          >
            <div className="font-studio__preview-names" style={{ fontFamily: selectedCursive }}>
              Mahek &amp; Yash
            </div>

            <div className="font-studio__preview-date" style={{ fontFamily: selectedHeading }}>
              December 06, 2026
            </div>

            <div className="font-studio__preview-times" style={{ fontFamily: selectedHeading }}>
              <span>Haldi 1:00 PM</span>
              <span className="font-studio__dot">•</span>
              <span>Jaimaal 12:30 PM</span>
              <span className="font-studio__dot">•</span>
              <span>Phere 5:00 PM</span>
            </div>

            <div className="font-studio__preview-digits" style={{ fontFamily: selectedHeading }}>
              <span className="font-studio__digits-label">Digits 0-9:</span>
              <span className="font-studio__digits-row">0 1 2 3 4 5 6 7 8 9</span>
            </div>

            <div className="font-studio__preview-timer" style={{ fontFamily: selectedHeading }}>
              <div className="font-studio__timer-unit"><strong>280</strong><small>DAYS</small></div>
              <span className="font-studio__timer-sep">:</span>
              <div className="font-studio__timer-unit"><strong>14</strong><small>HOURS</small></div>
              <span className="font-studio__timer-sep">:</span>
              <div className="font-studio__timer-unit"><strong>32</strong><small>MINS</small></div>
              <span className="font-studio__timer-sep">:</span>
              <div className="font-studio__timer-unit"><strong>08</strong><small>SECS</small></div>
            </div>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="font-studio__tabs">
          <button
            type="button"
            className={`font-studio__tab ${activeTab === "presets" ? "is-active" : ""}`}
            onClick={() => setActiveTab("presets")}
          >
            Curated Font Pairings
          </button>
          <button
            type="button"
            className={`font-studio__tab ${activeTab === "custom" ? "is-active" : ""}`}
            onClick={() => setActiveTab("custom")}
          >
            Customize Individual Fonts
          </button>
          <button
            type="button"
            className={`font-studio__tab ${activeTab === "numeric" ? "is-active" : ""}`}
            onClick={() => setActiveTab("numeric")}
          >
            Date &amp; Number Proportions
          </button>
        </div>

        {/* Tab 1: Presets */}
        {activeTab === "presets" && (
          <div className="font-studio__tab-panel">
            <p className="font-studio__section-desc">
              Select any curated luxury pairing to test its complete look live across the website:
            </p>
            <div className="font-studio__presets-grid">
              {FONT_PRESETS.map((preset) => {
                const isActive =
                  selectedHeading === preset.heading &&
                  selectedCursive === preset.cursive &&
                  selectedNumeric === preset.numeric;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={`font-studio__preset-card ${isActive ? "is-selected" : ""}`}
                    onClick={() => applyPreset(preset)}
                  >
                    <div className="font-studio__preset-top">
                      <strong className="font-studio__preset-name">{preset.name}</strong>
                      {isActive && <span className="font-studio__active-badge">Active</span>}
                    </div>
                    <p className="font-studio__preset-desc">{preset.description}</p>
                    <div className="font-studio__preset-samples">
                      <span
                        className="font-studio__sample-cursive"
                        style={{ fontFamily: preset.cursive }}
                      >
                        Mahek &amp; Yash
                      </span>
                      <span
                        className="font-studio__sample-heading"
                        style={{
                          fontFamily: preset.heading,
                          fontVariantNumeric: preset.numeric,
                        }}
                      >
                        Dec 06, 2026 • 12:30 PM
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Custom Fonts */}
        {activeTab === "custom" && (
          <div className="font-studio__tab-panel">
            <div className="font-studio__custom-group">
              <label className="font-studio__group-title">
                Headings, Dates &amp; Times Font
              </label>
              <div className="font-studio__font-chips">
                {HEADING_FONTS.map((font) => (
                  <button
                    key={font.name}
                    type="button"
                    className={`font-studio__font-chip ${selectedHeading === font.value ? "is-selected" : ""}`}
                    onClick={() => setSelectedHeading(font.value)}
                  >
                    <span className="font-studio__chip-name" style={{ fontFamily: font.value }}>
                      {font.name}
                    </span>
                    <span className="font-studio__chip-style">{font.style}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="font-studio__custom-group">
              <label className="font-studio__group-title">
                Couple Names &amp; Monogram Cursive Script
              </label>
              <div className="font-studio__font-chips">
                {CURSIVE_FONTS.map((font) => (
                  <button
                    key={font.name}
                    type="button"
                    className={`font-studio__font-chip ${selectedCursive === font.value ? "is-selected" : ""}`}
                    onClick={() => setSelectedCursive(font.value)}
                  >
                    <span className="font-studio__chip-name" style={{ fontFamily: font.value, fontSize: "1.25rem" }}>
                      {font.name}
                    </span>
                    <span className="font-studio__chip-style">{font.style}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Numeric Proportions */}
        {activeTab === "numeric" && (
          <div className="font-studio__tab-panel">
            <p className="font-studio__section-desc">
              Control how dates and numbers render across all event cards, the countdown timer, and the wedding date reveal:
            </p>
            <div className="font-studio__numeric-options">
              {NUMERIC_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`font-studio__numeric-card ${selectedNumeric === mode.id ? "is-selected" : ""}`}
                  onClick={() => setSelectedNumeric(mode.id)}
                >
                  <div className="font-studio__numeric-header">
                    <strong className="font-studio__numeric-label">{mode.label}</strong>
                    {selectedNumeric === mode.id && (
                      <span className="font-studio__active-badge">Active</span>
                    )}
                  </div>
                  <p className="font-studio__numeric-desc">{mode.desc}</p>
                  <div
                    className="font-studio__numeric-sample"
                    style={{
                      fontFamily: selectedHeading,
                      fontVariantNumeric: mode.id,
                    }}
                  >
                    <span>0 1 2 3 4 5 6 7 8 9</span>
                    <span>December 06, 2026 — 12:30 PM</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="font-studio__footer">
          <button
            type="button"
            className="font-studio__btn font-studio__btn--secondary"
            onClick={handleReset}
          >
            Reset to Default
          </button>

          <div className="font-studio__footer-right">
            <button
              type="button"
              className="font-studio__btn font-studio__btn--copy"
              onClick={handleCopyConfig}
            >
              {copied ? "✓ Copied Config!" : "Copy CSS Config"}
            </button>
            <button
              type="button"
              className="font-studio__btn font-studio__btn--primary"
              onClick={onClose}
            >
              Done &amp; Preview Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
