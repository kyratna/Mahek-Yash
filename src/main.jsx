import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import BlessingsWallPage from "./components/BlessingsWallPage.jsx";
import { useBlessings } from "./hooks/useBlessings";
import { BLESSINGS_WALL_HASH } from "./lib/routes";

function Root() {
  const [hash, setHash] = useState(() => window.location.hash);
  const blessings = useBlessings();

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Shared once here (rather than each page fetching its own copy) so
  // navigating from the main site to the Blessings Wall reuses data that's
  // already loaded instead of triggering a fresh, visibly slow Apps Script
  // round-trip.
  return hash === BLESSINGS_WALL_HASH ? (
    <BlessingsWallPage {...blessings} />
  ) : (
    <App {...blessings} />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
