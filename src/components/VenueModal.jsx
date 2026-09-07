import { useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./VenueModal.css";

export default function VenueModal({ isOpen, onClose, venue }) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    // Auto-close modal after configured seconds (default 30s)
    const autoCloseSeconds = venue?.modalAutoCloseSeconds ?? 30;
    const autoCloseMs = autoCloseSeconds * 1000;

    const timerId = setTimeout(() => {
      if (onCloseRef.current) {
        onCloseRef.current();
      }
    }, autoCloseMs);

    // Keyboard listener for Escape
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (onCloseRef.current) onCloseRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Lock body scroll while modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timerId);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, venue?.modalAutoCloseSeconds]);

  if (!isOpen || !venue) return null;

  const seconds = venue?.modalAutoCloseSeconds ?? 30;

  return (
    <div
      className="venue-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="venue-modal-title"
    >
      <div
        className="venue-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Top Progress Timer Bar */}
        <div
          className="venue-modal__timer-bar"
          style={{
            animationDuration: `${seconds}s`,
          }}
          onAnimationEnd={onClose}
          aria-hidden="true"
        />

        {/* Pinned Top Right Close Button */}
        <button
          type="button"
          className="venue-modal__close-btn"
          onClick={onClose}
          aria-label="Close venue details popup"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Scrollable Modal Body */}
        <div className="venue-modal__body">
          {/* Header */}
          <div className="venue-modal__header">
            <span className="eyebrow">Location &amp; Travel Guide</span>
            <h3 id="venue-modal-title" className="venue-modal__title">
              How to Reach the Venue
            </h3>
            <div className="venue-modal__divider" aria-hidden="true" />
            <p className="venue-modal__resort-name">{venue.name}</p>
            <p className="venue-modal__resort-addr">{venue.address}</p>
            {venue.phone && (
              <p className="venue-modal__resort-phone">
                <span>Helpdesk:</span> {venue.phone}
              </p>
            )}
          </div>

          {/* QR Code & Navigation Action */}
          <div className="venue-modal__action-box">
            <div className="venue-modal__qr-frame">
              <QRCodeSVG
                value={venue.qrUrl}
                size={124}
                level="M"
                fgColor="#2e2b28"
                bgColor="#ffffff"
              />
              <span className="venue-modal__qr-hint">Scan with camera for location</span>
            </div>

            <div className="venue-modal__directions-action">
              <p className="venue-modal__action-desc">
                Open exact venue pin and live turn-by-turn navigation directly on your device:
              </p>
              <a
                href={venue.directionsUrl || venue.qrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="venue-modal__btn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Get Directions
              </a>
            </div>
          </div>

          {/* Textual Travel Guide */}
          {venue.howToReach && venue.howToReach.length > 0 && (
            <div className="venue-modal__guide">
              <h4 className="venue-modal__guide-heading">Travel Options</h4>
              <div className="venue-modal__guide-list">
                {venue.howToReach.map((item, index) => (
                  <div key={index} className="venue-modal__guide-item">
                    <div className="venue-modal__guide-badge">
                      <span className="venue-modal__guide-mode">{item.mode}</span>
                    </div>
                    <div className="venue-modal__guide-body">
                      <p className="venue-modal__guide-text">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
