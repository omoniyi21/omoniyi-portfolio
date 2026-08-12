import { Send } from "lucide-react";
import { useState } from "react";

import "./contact.css";

export default function RecommendationForm() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "I couldn't send that note just yet.");
      }

      form.reset();
      setStatus("success");
      setMessage("Your note is on its way — thank you for reaching out.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please email me directly instead.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__masthead">
        <span>Drop a note</span>
        <span aria-hidden="true">✦</span>
      </div>
      <p className="contact-form__masthead-note">I love thoughtful emails, half-finished ideas, favorite movies, and conversations about design.</p>

      <div className="contact-form__fields">
        <label className="contact-form__honeypot" aria-hidden="true">
          <span>Website</span>
          <input name="website" type="text" tabIndex="-1" autoComplete="off" />
        </label>
        <label>
          <span>Your name</span>
          <input name="name" autoComplete="name" placeholder="How should I say hello?" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        <label className="contact-form__message">
          <span>What’s on your mind?</span>
          <textarea name="message" rows="6" placeholder="A project, an idea, or just something you’re excited about…" required />
        </label>
      </div>

      <div className="contact-form__footer">
        <p className={status === "error" ? "contact-form__status contact-form__status--error" : "contact-form__status"} aria-live="polite">
          {message || "I usually reply within 2–3 business days."}
        </p>
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send a note"} <Send aria-hidden="true" size={17} strokeWidth={1.8} />
        </button>
      </div>
    </form>
  );
}
