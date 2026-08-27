import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import ShreeGanesh from "./components/ShreeGanesh";
import Invitation from "./components/Invitation";
import MeetCouple from "./components/MeetCouple";
import EventDetails from "./components/EventDetails";
import Gallery from "./components/Gallery";
import Blessings from "./components/Blessings";
import BlessingsRSVP from "./components/BlessingsRSVP";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import FloatingControls from "./components/FloatingControls";
import EnvelopeIntro from "./components/EnvelopeIntro";
import PageSparkles from "./components/PageSparkles";
import CursorSparkleTrail from "./components/CursorSparkleTrail";

function App({ entries, status, myBlessingKey, addLocalBlessing }) {
  // Remembered per-session so navigating to/from the Blessings Wall page
  // (which remounts App via the hash route in main.jsx) doesn't replay it.
  const [opened, setOpened] = useState(
    () => sessionStorage.getItem("envelopeOpened") === "true"
  );

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  function handleOpen() {
    sessionStorage.setItem("envelopeOpened", "true");
    setOpened(true);
  }

  function handleReopenEnvelope() {
    sessionStorage.removeItem("envelopeOpened");
    setOpened(false);
  }

  return (
    <>
      {!opened && <EnvelopeIntro onOpen={handleOpen} />}
      <PageSparkles />
      <CursorSparkleTrail />
      <Nav />
      <ShreeGanesh />
      <Invitation />
      <MeetCouple />
      <EventDetails />
      <Gallery />
      <Blessings entries={entries} status={status} myBlessingKey={myBlessingKey} />
      <BlessingsRSVP onBlessingSent={addLocalBlessing} />
      <FAQ />
      <Footer />
      <FloatingControls onReopenEnvelope={handleReopenEnvelope} />
    </>
  );
}

export default App;
