import HomeButton from "./HomeButton";
import SectionNav from "./SectionNav";
import MusicPlayer from "./MusicPlayer";
import "./FloatingControls.css";

export default function FloatingControls({ onReopenEnvelope }) {
  return (
    <div className="floating-controls">
      <HomeButton onReopenEnvelope={onReopenEnvelope} />
      <SectionNav />
      <MusicPlayer />
    </div>
  );
}
