export const MEASUREMENT_ID = "G-703DFRL69Z";
const LIVE_HOSTS = new Set(["omoniyialimi.com", "www.omoniyialimi.com"]);

const OPT_OUT_KEY = "omoniyi-analytics-opt-out";

// Visit any page with ?internal=1 once per device/browser to stop GA from
// loading there (works on any network, unlike IP filters). ?internal=0 undoes it.
function readInternalFlag() {
  try {
    const url = new URL(window.location.href);
    const flag = url.searchParams.get("internal");
    if (flag === "1" || flag === "0") {
      if (flag === "1") window.localStorage.setItem(OPT_OUT_KEY, "1");
      else window.localStorage.removeItem(OPT_OUT_KEY);
      url.searchParams.delete("internal");
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
      showInternalNotice(flag === "1");
    }
    return window.localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

function showInternalNotice(optedOut) {
  const note = document.createElement("div");
  note.textContent = optedOut
    ? "Analytics off for this browser."
    : "Analytics back on for this browser.";
  note.setAttribute("role", "status");
  note.style.cssText =
    "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;" +
    "padding:10px 16px;border-radius:999px;background:#1f1a24;color:#fff;" +
    "font:500 14px/1.2 system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.2)";
  const mount = () => {
    document.body.appendChild(note);
    setTimeout(() => note.remove(), 4000);
  };
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount, { once: true });
}

let internalDevice;

export function analyticsEnabled() {
  if (typeof window === "undefined" || !LIVE_HOSTS.has(window.location.hostname)) return false;
  if (internalDevice === undefined) internalDevice = readInternalFlag();
  return !internalDevice;
}

export function trackEvent(name, parameters = {}) {
  if (!analyticsEnabled() || typeof window.gtag !== "function") return;
  window.gtag("event", name, parameters);
}

export function initializeAnalytics() {
  if (!analyticsEnabled() || document.getElementById("omoniyi-google-tag")) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  // Enhanced Measurement owns initial and browser-history page views.
  // Do not also emit page_view from React Router.
  window.gtag("config", MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement("script");
  script.id = "omoniyi-google-tag";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    const parameters = { page_path: window.location.pathname };
    if (/\.pdf$/i.test(url.pathname) && /resume/i.test(decodeURIComponent(url.pathname))) {
      trackEvent("resume_click", parameters);
    } else if (url.hostname.endsWith("figma.com") && url.pathname === "/community/file/1679586204488729025") {
      trackEvent("launchkit_free_click", parameters);
    } else if (url.origin === window.location.origin && url.pathname === "/studio/inquire") {
      trackEvent("studio_inquiry_click", parameters);
    } else if (url.protocol === "mailto:") {
      trackEvent("email_click", parameters);
    } else if (url.hostname === "cal.com") {
      trackEvent("booking_click", parameters);
    }
  });
  const startedForms = new WeakSet();
  document.addEventListener("focusin", (event) => {
    const form = event.target.closest?.("form[data-analytics-form]");
    if (!form || startedForms.has(form)) return;
    startedForms.add(form);
    trackEvent("lead_form_start", { form_name: form.dataset.analyticsForm });
  });
}
