import HomeButton from "./HomeButton";
import SectionNav from "./SectionNav";
import MusicPlayer from "./MusicPlayer";
import "./FloatingControls.css";

export default function FloatingControls({ onReopenEnvelope, onOpenFontStudio }) {
  return (
    <div className="floating-controls">
      {onOpenFontStudio && (
        <button
          type="button"
          className="icon-button font-studio-trigger-btn"
          onClick={onOpenFontStudio}
          title="Font Studio (Pick Fonts & Date Proportions)"
          aria-label="Open Font Studio"
        >
          <span className="font-studio-icon-label" aria-hidden="true">Aa</span>
        </button>
      )}
      <HomeButton onReopenEnvelope={onReopenEnvelope} />
      <SectionNav />
      <MusicPlayer />
    </div>
  );
}
