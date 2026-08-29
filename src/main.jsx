import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { useBlessings } from "./hooks/useBlessings";

function Root() {
  const blessings = useBlessings();
  return <App {...blessings} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
