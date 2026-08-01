import content from "../content";
import "./Footer.css";

export default function Footer() {
  const { couple, wedding } = content;

  return (
    <footer id="footer" className="footer">
      <p className="footer__names">
        {couple.partner1} &amp; {couple.partner2}
      </p>
      <p className="footer__date">{wedding.displayDate}</p>
    </footer>
  );
}
