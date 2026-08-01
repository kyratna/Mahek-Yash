import { useRef, useState } from "react";
import { smoothScrollTo } from "../lib/smoothScroll";
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
  const navRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (event, href) => {
    event.preventDefault();
    const offset = (navRef.current?.offsetHeight || 0) + 8;
    smoothScrollTo(href.slice(1), { offset });
    setIsOpen(false);
  };

  return (
    <nav className="nav" ref={navRef}>
      <div className="nav__bar">
        <button
          type="button"
          className="nav__toggle"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className={`nav__toggle-bar ${isOpen ? "nav__toggle-bar--open" : ""}`} />
          <span className={`nav__toggle-bar ${isOpen ? "nav__toggle-bar--open" : ""}`} />
          <span className={`nav__toggle-bar ${isOpen ? "nav__toggle-bar--open" : ""}`} />
        </button>
        <ul className={`nav__list ${isOpen ? "nav__list--open" : ""}`}>
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
