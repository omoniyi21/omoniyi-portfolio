import "./footer.css";
import SleepingStardust from "../../../assets/branding/sd-variants/sd-sleeping.webp";
import { GithubIcon, PinterestIcon, LinkedInIcon } from "../icons/BrandIcons";
import { contact } from "../../../data/contact";
import MotionToggle from "../MotionToggle";

const PINTEREST_URL = "https://www.pinterest.com/omoniyi21/product-design-ui-omoniyi/";
const GITHUB_URL = "https://github.com/omoniyi21";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__left">
      <div className="site-footer__issue">
        <div className="site-footer__social" aria-label="Social links">
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedInIcon size={16} />
          </a>
          <a href={PINTEREST_URL} target="_blank" rel="noreferrer" aria-label="Pinterest">
            <PinterestIcon size={16} />
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GithubIcon size={16} />
          </a>
        </div>
        <p>Issue No. 01<br />Dallas • Texas<br />Designed by Omoniyi</p>
        <p className="site-footer__credit">
          Icons: <a href="https://github.com/webalys-hq/streamline-vectors" target="_blank" rel="noreferrer">Guidance by Streamline</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
        </p>
        <MotionToggle className="site-footer__motion" />
      </div>
      <p>Omoniyi Alimi <span aria-hidden="true">©</span></p>
      </div>
      <span className="site-footer__trail" aria-hidden="true">✦ · · · ✦</span>
      <img loading="lazy" decoding="async"
        className="site-footer__stardust"
        src={SleepingStardust}
        alt="SD sleeping at the end of the page"
      />
    </footer>
  );
}
