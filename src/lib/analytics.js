export const MEASUREMENT_ID = "G-703DFRL69Z";
const LIVE_HOSTS = new Set(["omoniyialimi.com", "www.omoniyialimi.com"]);

export function analyticsEnabled() {
  return typeof window !== "undefined" && LIVE_HOSTS.has(window.location.hostname);
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
