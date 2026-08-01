import HomeButton from "./HomeButton";
import SectionNav from "./SectionNav";
import MusicPlayer from "./MusicPlayer";
import "./FloatingControls.css";

export default function FloatingControls() {
  return (
    <div className="floating-controls">
      <HomeButton />
      <SectionNav />
      <MusicPlayer />
    </div>
  );
}
