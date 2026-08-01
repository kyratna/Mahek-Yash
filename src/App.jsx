import Nav from "./components/Nav";
import Hero from "./components/Hero";
import MeetCouple from "./components/MeetCouple";
import EventDetails from "./components/EventDetails";
import Gallery from "./components/Gallery";
import Blessings from "./components/Blessings";
import BlessingsRSVP from "./components/BlessingsRSVP";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import FloatingControls from "./components/FloatingControls";

function App({ entries, status, myBlessingKey, addLocalBlessing }) {
  return (
    <>
      <Nav />
      <Hero />
      <MeetCouple />
      <EventDetails />
      <Gallery />
      <Blessings entries={entries} status={status} myBlessingKey={myBlessingKey} />
      <BlessingsRSVP onBlessingSent={addLocalBlessing} />
      <FAQ />
      <Footer />
      <FloatingControls />
    </>
  );
}

export default App;
