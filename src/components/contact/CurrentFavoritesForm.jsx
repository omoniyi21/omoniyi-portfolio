import { Send } from "lucide-react";
import { useState } from "react";

import "./contact.css";

const FIELDS = [
  { name: "reading", label: "Reading", placeholder: "What are you reading right now?" },
  { name: "watching", label: "Watching", placeholder: "What are you watching right now?" },
  { name: "movie", label: "Movie obsession", placeholder: "Any movie living in your head rent free?" },
  { name: "scent", label: "Scent", placeholder: "What scent have you been wearing?" },
  { name: "ritual", label: "Ritual", placeholder: "A small ritual you're keeping lately?" },
  { name: "thought", label: "Thought", placeholder: "A thought that's been sitting with you?" },
  { name: "podcast", label: "Podcast rec", placeholder: "A podcast worth recommending?" },
  { name: "onRepeat", label: "On repeat", placeholder: "What's on repeat for you?" },
];

export default function CurrentFavoritesForm() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/.netlify/functions/current-favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          reading: formData.get("reading"),
          watching: formData.get("watching"),
          movie: formData.get("movie"),
          scent: formData.get("scent"),
          ritual: formData.get("ritual"),
          thought: formData.get("thought"),
          podcast: formData.get("podcast"),
          onRepeat: formData.get("onRepeat"),
          website: formData.get("website"),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "I couldn't send that just yet.");
      }

      form.reset();
      setStatus("success");
      setMessage("Thanks for sharing — I read every one of these.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again in a moment.");
    }
  }

  return (
    <form className="contact-form current-favorites-form" onSubmit={handleSubmit}>
      <div className="contact-form__masthead">
        <span>What’s on your mind?</span>
        <span aria-hidden="true">✦</span>
      </div>
      <p className="contact-form__masthead-note">Your turn — tell me what you’re currently into. Answer one field or all of them.</p>

      <div className="contact-form__fields">
        <label className="contact-form__honeypot" aria-hidden="true">
          <span>Website</span>
          <input name="website" type="text" tabIndex="-1" autoComplete="off" />
        </label>
        <label>
          <span>Your name</span>
          <input name="name" autoComplete="name" placeholder="Who's answering?" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        {FIELDS.map((field) => (
          <label key={field.name}>
            <span>{field.label}</span>
            <input name={field.name} placeholder={field.placeholder} />
          </label>
        ))}
      </div>

      <div className="contact-form__footer">
        <p className={status === "error" ? "contact-form__status contact-form__status--error" : "contact-form__status"} aria-live="polite">
          {message || "Share as much or as little as you'd like."}
        </p>
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send it over"} <Send aria-hidden="true" size={17} strokeWidth={1.8} />
        </button>
      </div>
    </form>
  );
}
