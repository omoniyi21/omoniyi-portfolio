import "./footer.css";
import SleepingStardust from "../../../assets/branding/stardust-creature-kit/png/512/footer-sleeping.png";

export default function Footer() {
  return (
    <footer className="site-footer">
      <img
        className="site-footer__stardust"
        src={SleepingStardust}
        alt="SD sleeping at the end of the page"
      />
      <span className="site-footer__trail" aria-hidden="true">✦ · · · ✦</span>
      <p className="site-footer__issue">Issue No. 01<br />Dallas • Texas<br />Designed by Omoniyi</p>
      <p>Omoniyi Alimi <span aria-hidden="true">©</span></p>
    </footer>
  );
}
