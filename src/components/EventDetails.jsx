import content from "../content";
import MapEmbed from "./MapEmbed";
import "./EventDetails.css";

export default function EventDetails() {
  const { events, mapAddress } = content;

  return (
    <section id="details" className="section section--surface">
      <div className="section__inner">
        <div className="section__heading">
          <span className="eyebrow">Join Us</span>
          <h2>Event Details</h2>
        </div>
        <div className="timeline">
          <div className="timeline__line" />
          {events.map((event, index) => (
            <div
              className={`timeline__item ${
                index % 2 === 0 ? "timeline__item--left" : "timeline__item--right"
              }`}
              key={event.name}
            >
              <span className="timeline__marker" />
              <div className="event-card">
                <h3>{event.name}</h3>
                <p className="event-card__date">{event.date}</p>
                <p className="event-card__time">{event.time}</p>
                <p className="event-card__venue">{event.venueName}</p>
                <p className="event-card__address">{event.address}</p>
              </div>
            </div>
          ))}
        </div>
        <MapEmbed address={mapAddress} />
      </div>
    </section>
  );
}
