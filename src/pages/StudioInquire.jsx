import { trackEvent } from "../lib/analytics";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import "./studio.css";
import "./studio-inquire.css";

const CONTACT = "contact@omoniyialimi.com";
const CAL_LINK = "https://cal.com/omoniyi-studio/intake";

const SERVICES = [
  { id: "refine", label: "Refine", sub: "UX Audit & Optimization" },
  { id: "build", label: "Build", sub: "Website / Product Design" },
  { id: "transform", label: "Transform", sub: "Experience System & Creative Direction" },
  { id: "not-sure", label: "Not sure yet", sub: "Let’s figure it out together" },
];

const TIMELINES = ["As soon as possible", "Within 1 month", "1–3 months", "3+ months", "Not sure yet"];

const BUDGETS = ["$950–$2,500", "$2,500–$5,000", "$5,000–$10,000", "$10,000+", "Not sure yet"];

function normalizeService(value) {
  return SERVICES.some((option) => option.id === value) ? value : "not-sure";
}

export default function StudioInquire() {
  const [searchParams] = useSearchParams();
  const [service, setService] = useState(() => normalizeService(searchParams.get("service")));
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setErrorMessage("");

    if (!service) {
      setStatus("error");
      setErrorMessage("Please choose which service you’re interested in.");
      return;
    }

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
        <Link to="/studio" className="studio-nav__logo">
          Omoniyi Studio
        </Link>
        <Link to="/studio" className="studio-inquire__back">
          <ArrowLeft size={14} strokeWidth={1.8} aria-hidden="true" /> Back to Studio
        </Link>
      </nav>

      <section className="studio-section studio-inquire__hero">
        <p className="studio-eyebrow">
          <span>Start a project</span>
          <span className="studio-eyebrow__sub">Usually takes about 5 minutes</span>
        </p>
        <h1 className="studio-inquire__title">
          Tell me about
          <br />
          <em>the work.</em>
        </h1>
        <p className="studio-inquire__description">
          A few questions so our call starts with context instead of introductions. Once you submit
          this, you’ll be able to grab 20–30 minutes on my calendar.
        </p>
      </section>

      {status === "success" ? (
        <section className="studio-section studio-inquire__confirmation">
          <p className="studio-eyebrow">
            <span>Thank you</span>
          </p>
          <h2>Got it — let’s find some time to talk.</h2>
          <p>
            Thanks for the context. Grab 20–30 minutes below and I’ll come prepared to talk through
            what you shared.
          </p>
          <div className="studio-inquire__cal">
            <iframe src={CAL_LINK} title="Schedule an intro call" loading="lazy" />
          </div>
        </section>
      ) : (
        <section className="studio-section studio-inquire__form-section">
          <form data-analytics-form="studio_inquiry" className="studio-inquire__form" onSubmit={handleSubmit}>
            <fieldset className="studio-inquire__services">
              <legend>Interested in</legend>
              <div className="studio-inquire__service-options">
                {SERVICES.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    className={`studio-inquire__service-pill${service === option.id ? " is-active" : ""}`}
                    onClick={() => setService(option.id)}
                    aria-pressed={service === option.id}
                  >
                    <span>{option.label}</span>
                    <span className="studio-inquire__service-sub">{option.sub}</span>
                  </button>
                ))}
              </div>
            </fieldset>

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

            <fieldset className="studio-inquire__budget">
              <legend>Approximate budget</legend>
              <div className="studio-inquire__budget-options">
                {BUDGETS.map((budget) => (
                  <label key={budget} className="studio-inquire__budget-option">
                    <input type="radio" name="budget" value={budget} required />
                    <span>{budget}</span>
                  </label>
                ))}
              </div>
            </fieldset>

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
                <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
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
