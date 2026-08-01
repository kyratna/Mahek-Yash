import "./Nav.css";

const LINKS = [
  { href: "#couple", label: "The Couple" },
  { href: "#details", label: "Details" },
  { href: "#gallery", label: "Gallery" },
  { href: "#blessings", label: "Blessings" },
  { href: "#blessings-rsvp", label: "RSVP" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  return (
    <nav className="nav">
      <ul className="nav__list">
        {LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
