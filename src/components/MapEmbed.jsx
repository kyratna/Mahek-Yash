import "./MapEmbed.css";

export default function MapEmbed({ address }) {
  const query = encodeURIComponent(address);
  const src = `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <div className="map-embed">
      <iframe
        title="Venue location map"
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        className="button button--primary map-embed__directions"
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Get Directions
      </a>
    </div>
  );
}
