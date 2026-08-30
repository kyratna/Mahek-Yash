import content from "../content";
import "./Footer.css";

export default function Footer({ isDateRevealed = false }) {
  const { couple, wedding } = content;

  return (
    <footer id="footer" className="footer">
      <div className="footer__divider" aria-hidden="true" />
      <p className="footer__names">
        <span className="footer__name">{couple.partner1}</span>
        <span className="footer__amp">&amp;</span>
        <span className="footer__name">{couple.partner2}</span>
      </p>
      <p
        className="footer__date"
        style={{ visibility: isDateRevealed ? "visible" : "hidden" }}
      >
        {wedding.displayDate}
      </p>
    </footer>
  );
}
