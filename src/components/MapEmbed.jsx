import "./MapEmbed.css";

export default function MapEmbed({ address }) {
  const query = encodeURIComponent(address);
  const src = `https://maps.google.com/maps?q=${query}&z=15&output=embed`;

  return (
    <div className="map-embed">
      <iframe
        title="Venue location map"
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
