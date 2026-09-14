import { trackEvent } from "../../lib/analytics";
import { useEffect, useRef, useState } from "react";
import "./launchkit-popup.css";

const STORAGE_KEY = "lk-popup-last-seen";
const COOLDOWN_DAYS = 14;
const SCROLL_TRIGGER = 0.35;
const TIME_TRIGGER_MS = 25000;

function withinCooldown() {
  try {
    const last = localStorage.getItem(STORAGE_KEY);
    if (!last) return false;
    return (Date.now() - Number(last)) / 86400000 < COOLDOWN_DAYS;
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* private mode / storage blocked — fine to no-op */
  }
}

export default function LaunchKitPopup() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const dialogRef = useRef(null);
  const shownRef = useRef(false);

  // Automatic trigger only — scroll depth or a dwell timer, whichever comes
  // first, gated by a cooldown so it doesn't show on every visit.
  useEffect(() => {
    if (shownRef.current || withinCooldown()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeoutId;
    function trigger() {
      if (shownRef.current) return;
      shownRef.current = true;
      setOpen(true);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeoutId);
    }
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight || 1;
      if (window.scrollY / max > SCROLL_TRIGGER) trigger();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    timeoutId = setTimeout(trigger, TIME_TRIGGER_MS);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.body.style.overflow = "hidden";
      markSeen();
    }
    if (!open && el.open) {
      el.close();
      document.body.style.overflow = "";
    }
  }, [open]);

  function close() {
    setOpen(false);
    setStatus("idle");
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "launchkit-home-popup",
          email: String(data.get("email")).trim(),
          "bot-field": String(data.get("bot-field") || ""),
          consent: "Email me about LaunchKit UI.",
          source: "https://omoniyialimi.com/",
        }).toString(),
      });
      if (!response.ok) throw new Error("Your request couldn’t be saved. Please try again or email me directly.");
      setStatus("success");
      trackEvent("launchkit_signup", { form_name: "launchkit_home_popup" });
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="lk-popup"
      aria-labelledby="lk-popup-title"
      onCancel={close}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
      }}
    >
      <div className="lk-popup__ticket">
        <button type="button" className="lk-popup__close" aria-label="Close" onClick={close}>
          ×
        </button>

        <div className="lk-popup__stub" aria-hidden="true">
          <span className="lk-popup__stub-spark">✦</span>
          <span className="lk-popup__stub-text">Admit One</span>
          <span className="lk-popup__stub-serial">No. 000142</span>
        </div>

        <div className="lk-popup__body">
          {status === "success" ? (
            <div role="status">
              <p className="lk-popup__eyebrow">You’re in</p>
              <h2 id="lk-popup-title">You’re on the list.</h2>
              <p>I’ll email you when there’s something new to try. In the meantime, explore what’s already live.</p>
              <a className="lk-popup__link" href="/uikit">
                Browse LaunchKit UI ↗
              </a>
            </div>
          ) : (
            <form data-analytics-form="launchkit_home_popup" onSubmit={submit}>
              <p className="lk-popup__eyebrow">Early access · Admit one</p>
              <h2 id="lk-popup-title">
                Get early access
                <br />
                to LaunchKit UI.
              </h2>
              <p>Ready-to-use kits for people building on their own, plus the occasional note on what I’m making.</p>
              <label className="lk-popup__field">
                <span>Email address</span>
                <input type="email" name="email" placeholder="you@example.com" required maxLength={254} autoComplete="email" disabled={status === "sending"} />
              </label>
              <label className="lk-popup__honeypot" aria-hidden="true">
                Website
                <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
              {error && (
                <p className="lk-popup__error" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="lk-popup__submit" disabled={status === "sending"}>
                {status === "sending" ? "Reserving your seat…" : "Reserve my seat →"}
              </button>
              <p className="lk-popup__fine">One note when it matters. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
