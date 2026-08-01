import "./Nav.css";

const LINKS = [
  { href: "#story", label: "Our Story" },
  { href: "#details", label: "Details" },
  { href: "#gallery", label: "Gallery" },
  { href: "#faq", label: "FAQ" },
  { href: "#rsvp", label: "RSVP" },
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
