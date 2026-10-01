import { BrandIcon, Icon } from "../shared/icons/Icon";

import RecommendationForm from "./RecommendationForm";
import ThinkingSD from "../../assets/branding/sd-variants/sd-thinking.webp";
import "./contact.css";

const LINKEDIN_URL = "https://www.linkedin.com/in/omoniyi-alimi-08428782";

export default function WriteMe() {
  return (
    <section className="write-me" id="contact" aria-labelledby="write-me-title">
      <div className="write-me__intro">
        <div className="write-me__meta">
          <span>03</span>
          <span>Write me</span>
          <span aria-hidden="true">✦</span>
        </div>
        <div className="write-me__heading">
          <h2 id="write-me-title">Let’s chat!</h2>
          <div className="write-me__stardust-side">
            <span className="write-me__stardust-trail" aria-hidden="true">✦ · · ✦</span>
            <img loading="lazy" decoding="async"
              className="write-me__stardust"
              src={ThinkingSD}
              alt="Stardust thinking"
            />
          </div>
        </div>
        <p>Tell me what you’re inspired by or building. I love hearing what people are excited about.</p>
        <p className="write-me__availability">
          <span className="write-me__availability-dot" aria-hidden="true" />
          Open to senior product design roles, and to fractional or contract work through{" "}
          <a href="/studio">Omoniyi Studio</a>.
        </p>

        <div className="write-me__links" aria-label="Contact links">
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            <BrandIcon name="linkedin" size={18} />
            <span>LinkedIn</span>
            <Icon name="arrow-up-right" size={14} strokeWidth={1.5} />
          </a>
          <a href="mailto:contact@omoniyialimi.com">
            <Icon name="mail" size={19} />
            <span>contact@omoniyialimi.com</span>
            <Icon name="arrow-up-right" size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <RecommendationForm />
    </section>
  );
}
