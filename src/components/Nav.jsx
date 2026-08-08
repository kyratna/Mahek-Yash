import { useEffect, useRef, useState } from "react";
import { smoothScrollTo } from "../lib/smoothScroll";
import content, { asset } from "../content";
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
  const [isVisible, setIsVisible] = useState(false);

  const { partner1, partner2 } = content.couple;

  useEffect(() => {
    function updateVisibility() {
      const hero = document.getElementById("hero");
      const navHeight = navRef.current?.offsetHeight || 0;
      const threshold = hero ? hero.offsetHeight - navHeight : 0;
      setIsVisible(window.scrollY > threshold);
    }
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  const scrollTo = (id, offset) => {
    smoothScrollTo(id, { offset });
    setIsOpen(false);
  };

  const handleLinkClick = (event, href) => {
    event.preventDefault();
    scrollTo(href.slice(1), (navRef.current?.offsetHeight || 0) + 8);
  };

  const handleLogoClick = () => scrollTo("hero", 0);

  return (
    <nav className={`nav ${isVisible ? "nav--visible" : ""}`} ref={navRef}>
      <div className="nav__bar">
        <button type="button" className="nav__logo" onClick={handleLogoClick} aria-label="Back to top">
          <img
            src={asset("/images/monogram/monogramseal-clean-180.png")}
            alt={`${partner1} & ${partner2}`}
            className="nav__logo-img"
          />
        </button>
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
