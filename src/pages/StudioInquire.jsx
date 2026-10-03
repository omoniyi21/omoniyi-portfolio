import BrandSignature from "../components/shared/BrandSignature";
import SpaceSwitcher from "../components/shared/SpaceSwitcher";
import { trackEvent } from "../lib/analytics";
import { useState } from "react";
import { FRACTIONAL, INVEST_BANDS } from "../data/studioOffers";
import { Link, useSearchParams } from "react-router-dom";

import "./studio.css";
import "./studio-inquire.css";
import { Icon } from "../components/shared/icons/Icon";

const CONTACT = "contact@omoniyialimi.com";
const CAL_LINK = "https://cal.com/omoniyi-studio/intake";

const TIMELINES = ["As soon as possible", "Within 1 month", "1–3 months", "3+ months", "Not sure yet"];

// Every inquiry is for Admission (the $500 diagnosis) unless it comes from
// the product-team link, which goes straight to Fractional Residency. Older
// links (?service=refine, build, transform, team, not-sure…) land on
// Admission or Fractional so nothing breaks.
function normalizeService(value) {
  return value === "fractional" || value === "team" ? "fractional" : "admission";
}

export default function StudioInquire() {
  const [searchParams] = useSearchParams();
  const service = normalizeService(searchParams.get("service"));
  const teamMode = service === "fractional";
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/.netlify/functions/studio-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          website: formData.get("website"),
          service,
          notWorking: formData.get("notWorking"),
          successLooksLike: formData.get("successLooksLike"),
          timeline: formData.get("timeline"),
          budget: formData.get("budget"),
          anythingElse: formData.get("anythingElse"),
          _hp: formData.get("_hp"),
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          "This form can only send once the site is deployed to the live server — it can’t reach the endpoint from a local preview. Please email me directly instead."
        );
      }

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "I couldn’t send that just yet. Please try again or email me directly.");
      }

      setStatus("success");
      trackEvent("generate_lead", { form_name: "studio_inquiry", service });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof TypeError
          ? "I couldn’t reach the server just now. Please check your connection and try again, or email me directly."
          : error.message || "Something went wrong. Please email me directly instead."
      );
    }
  }

  return (
    <div className="studio-page studio-inquire">
      <nav className="studio-nav" aria-label="Inquiry navigation">
        <div className="ecosystem-lockup"><BrandSignature space="studio" /><SpaceSwitcher space="studio" /></div>
        <Link to="/studio" className="studio-inquire__back">
          <Icon name="arrow-left" size={14} strokeWidth={1.5} /> Back to Studio
        </Link>
      </nav>

      <section className={`studio-section studio-inquire__hero${teamMode ? " studio-inquire__hero--team" : ""}`}>
        <p className="studio-eyebrow">
          <span>Tell me what isn’t working</span>
          <span className="studio-eyebrow__sub">Usually takes about 5 minutes</span>
        </p>
        <h1 className="studio-inquire__title">
          Tell me about
          <br />
          <em>{teamMode ? "your team." : "the work."}</em>
        </h1>
        <p className="studio-inquire__description">
          A few questions so our call starts with context instead of introductions. Once you submit
          this, you can book a free 20-minute fit call on my calendar.
        </p>
      </section>

      {status === "success" ? (
        <section className="studio-section studio-inquire__confirmation">
          <p className="studio-eyebrow">
            <span>Thank you</span>
          </p>
          <h2>Got it. Let’s find some time to talk.</h2>
          <p>
            Thanks for the context. Book a free 20-minute fit call below and I’ll come prepared to talk
            through what you shared.
          </p>
          <div className="studio-inquire__cal">
            <iframe src={CAL_LINK} title="Schedule an intro call" loading="lazy" />
          </div>
        </section>
      ) : (
        <section className="studio-section studio-inquire__form-section">
          <form data-analytics-form="studio_inquiry" className="studio-inquire__form" onSubmit={handleSubmit}>
            {teamMode && (
              <p className="studio-inquire__chosen">
                Inquiring about <strong>{FRACTIONAL.name}</strong> · {FRACTIONAL.plans.map((plan) => plan.price).join(" or ")}, 3-month minimum
              </p>
            )}

            <div className="studio-inquire__grid">
              <label className="studio-inquire__hp" aria-hidden="true">
                <span>Company website</span>
                <input name="_hp" type="text" tabIndex="-1" autoComplete="off" />
              </label>

              <label>
                <span>Name</span>
                <input name="name" type="text" autoComplete="name" required />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                <span>Company / business</span>
                <input name="company" type="text" autoComplete="organization" />
              </label>
              <label>
                <span>Website or product URL</span>
                <input name="website" type="url" placeholder="https://" />
              </label>
            </div>

            <label className="studio-inquire__textarea">
              <span>What isn’t working right now?</span>
              <textarea name="notWorking" rows="3" />
            </label>

            <fieldset className="studio-inquire__budget" aria-describedby="invest-help">
              <legend>What are you thinking of investing?</legend>
              <p id="invest-help" className="studio-inquire__help">
                Every project starts with a $500 diagnosis, credited toward the work. This just helps me
                come to the call prepared.
              </p>
              <div className="studio-inquire__budget-options">
                {INVEST_BANDS.map((band) => (
                  <label key={band} className="studio-inquire__budget-option">
                    <input type="radio" name="budget" value={band} required />
                    <span>{band}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="studio-inquire__textarea">
              <span>What would a successful outcome look like?</span>
              <textarea name="successLooksLike" rows="3" />
            </label>

            <div className="studio-inquire__grid studio-inquire__grid--single">
              <label>
                <span>Desired timeline</span>
                <select name="timeline" defaultValue="">
                  <option value="" disabled>
                    Choose one
                  </option>
                  {TIMELINES.map((timeline) => (
                    <option key={timeline} value={timeline}>
                      {timeline}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="studio-inquire__textarea">
              <span>Anything else I should know?</span>
              <textarea name="anythingElse" rows="3" />
            </label>

            <div className="studio-inquire__form-footer">
              <p
                className={
                  status === "error"
                    ? "studio-inquire__status studio-inquire__status--error"
                    : "studio-inquire__status"
                }
                aria-live="polite"
              >
                {errorMessage || "I read every note personally and reply within 1–2 business days."}
              </p>
              <button type="submit" className="studio-inquire__submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send inquiry"}{" "}
                <Icon name="deliver" size={17} strokeWidth={1.5} />
              </button>
            </div>
          </form>
        </section>
      )}

      <footer className="studio-inquire__escape">
        <p>
          Prefer email? Write to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>
      </footer>
    </div>
  );
}
