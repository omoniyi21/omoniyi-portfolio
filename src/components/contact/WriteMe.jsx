import { ArrowUpRight, Link, Mail } from "lucide-react";

import RecommendationForm from "./RecommendationForm";
import ContactWave from "../../assets/branding/stardust-creature-kit/png/512/contact-wave.png";
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
            <img
              className="write-me__stardust"
              src={ContactWave}
              alt="Stardust waving hello"
            />
          </div>
        </div>
        <p>Tell me what you’re inspired by or building. I love hearing what people are excited about.</p>

        <div className="write-me__links" aria-label="Contact links">
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            <Link aria-hidden="true" size={18} strokeWidth={1.8} />
            <span>LinkedIn</span>
            <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.8} />
          </a>
          <a href="mailto:contact@omoniyialimi.com">
            <Mail aria-hidden="true" size={18} strokeWidth={1.8} />
            <span>contact@omoniyialimi.com</span>
            <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.8} />
          </a>
        </div>
      </div>

      <RecommendationForm />
    </section>
  );
}
