export const MEASUREMENT_ID = "G-703DFRL69Z";
// Both domains from the one deploy report to the same property; GA's
// hostname dimension tells portfolio and Studio traffic apart.
const LIVE_HOSTS = new Set(["omoniyialimi.com", "www.omoniyialimi.com", "omoniyistudio.com", "www.omoniyistudio.com"]);

const OPT_OUT_KEY = "omoniyi-analytics-opt-out";
const COMPANY_KEY = "omoniyi-company-tag";

// Tagged links name a company in utm_source. Social posts and blog
// shares also use utm_source, but they name a channel, not a company,
// so they never become a company tag.
const CHANNEL_SOURCES = new Set([
  "instagram", "insta-post", "ig", "linkedin", "linkedin-post", "pinterest", "tiktok",
  "twitter", "x", "threads", "facebook", "my-blog", "beehiiv", "reddit", "family",
  // Older Pinterest and blog pins used these as their source.
  "omoniyi-studio", "pinterest-blog", "google-maps-vialinkedinpost",
]);
const CHANNEL_MEDIUMS = new Set(["social", "newsletter"]);

// The first company link a browser arrives on is remembered there, so a
// later visit without the link (typed URL, bookmark, forwarded PDF)
// still reports as that company. Sent as the GA user property company_tag.
export function readCompanyTag(href = window.location.href) {
  let stored;
  try {
    stored = window.localStorage.getItem(COMPANY_KEY);
  } catch {
    stored = null;
  }
  if (stored) return stored;
  try {
    const params = new URL(href).searchParams;
    const source = (params.get("utm_source") || "").trim().toLowerCase();
    const medium = (params.get("utm_medium") || "").trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(source)) return null;
    if (CHANNEL_SOURCES.has(source) || CHANNEL_MEDIUMS.has(medium)) return null;
    try {
      window.localStorage.setItem(COMPANY_KEY, source);
    } catch {
      // Storage can be blocked; the tag still applies to this visit.
    }
    return source;
  } catch {
    return null;
  }
}

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
  if (!analyticsEnabled() || window.__omoniyiAnalytics) return;
  window.__omoniyiAnalytics = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  const companyTag = readCompanyTag();
  if (companyTag) window.gtag("set", "user_properties", { company_tag: companyTag });
  // Enhanced Measurement owns initial and browser-history page views.
  // Do not also emit page_view from React Router.
  window.gtag("config", MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  // The queue above is live right away, so nothing is lost; the tag itself
  // downloads once the page has loaded and the browser is idle, so it never
  // competes with the hero for bandwidth. It reads the queue when it arrives.
  const inject = () => {
    if (document.getElementById("omoniyi-google-tag")) return;
    const script = document.createElement("script");
    script.id = "omoniyi-google-tag";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  };
  const whenIdle = () => ("requestIdleCallback" in window ? window.requestIdleCallback(inject, { timeout: 3000 }) : setTimeout(inject, 1500));
  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });

  document.addEventListener("click", (event) => {
    // Any element can name its own event: data-track="nav_click" plus
    // optional data-label and data-location. That pattern handles new
    // buttons and links without touching this file.
    const tagged = event.target.closest?.("[data-track]");
    const trackName = tagged?.dataset?.track;
    if (trackName) {
      const parameters = { page_path: window.location.pathname };
      if (tagged.dataset.label) parameters.label = tagged.dataset.label;
      if (tagged.dataset.location) parameters.location = tagged.dataset.location;
      trackEvent(trackName, parameters);
      return;
    }
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
    } else if (url.hostname.endsWith("figma.com") && url.pathname.startsWith("/design/ZdQgGWYa2JVXtn57IIMShQ")) {
      trackEvent("stardust_origin_click", parameters);
    } else if (url.hostname.endsWith("linkedin.com")) {
      trackEvent(/\/recommendations/.test(url.pathname) ? "recommendations_click" : "linkedin_click", parameters);
    } else if (/^https?:$/.test(url.protocol) && !LIVE_HOSTS.has(url.hostname) && url.origin !== window.location.origin) {
      trackEvent("outbound_click", { ...parameters, link_domain: url.hostname.replace(/^www\./, "") });
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

// Page type for reports: groups the many case-study and post paths.
const CASE_STUDY_PATHS = new Set(["/house", "/usda", "/athletico", "/copyright-accounting", "/portfolio-ecosystem", "/wedding-identity", "/sultry-tips", "/library-of-congress"]);
export function pageTypeFor(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/") return isStudioDomain() ? "studio" : "home";
  if (CASE_STUDY_PATHS.has(clean)) return "case_study";
  if (clean.startsWith("/resume")) return "resume";
  if (clean === "/observations") return "blog_index";
  if (clean.startsWith("/observations/")) return "blog_post";
  if (clean.startsWith("/studio")) return "studio";
  if (clean.startsWith("/uikit")) return "uikit";
  if (clean === "/skylight") return "deck";
  if (clean === "/work" || clean === "/visual" || clean === "/about") return clean.slice(1);
  return "other";
}

function isStudioDomain() {
  return typeof window !== "undefined" && /(^|\.)omoniyistudio\.com$/.test(window.location.hostname);
}

// real_read: a person, not a link scanner. Fires once per page once the
// page has been on screen for 15 seconds and they have scrolled (or the
// page is too short to scroll). Scanners open a page for a second or two
// and never scroll, so they never send it.
const REAL_READ_MS = 15000;
let readWatch = null;

export function watchPageRead(pathname) {
  if (typeof window === "undefined") return;
  if (readWatch) readWatch.stop();
  if (!analyticsEnabled()) return;
  let visibleMs = 0;
  let scrolled = false;
  let sent = false;
  const onScroll = () => { scrolled = true; };
  const tooShortToScroll = () => document.documentElement.scrollHeight <= window.innerHeight * 1.1;
  const timer = window.setInterval(() => {
    if (document.visibilityState === "visible") visibleMs += 1000;
    if (!sent && visibleMs >= REAL_READ_MS && (scrolled || tooShortToScroll())) {
      sent = true;
      trackEvent("real_read", { page_path: pathname, page_type: pageTypeFor(pathname) });
      stop();
    }
  }, 1000);
  window.addEventListener("scroll", onScroll, { passive: true });
  function stop() {
    window.clearInterval(timer);
    window.removeEventListener("scroll", onScroll);
  }
  readWatch = { stop };
}

// page_not_found: the 404 page reports the path that missed, so broken
// links in applications show up without checking each one by hand.
export function trackNotFound(pathname, search = "") {
  let referrer = "";
  try {
    if (document.referrer) {
      const ref = new URL(document.referrer);
      referrer = ref.hostname + ref.pathname;
    }
  } catch {
    referrer = "";
  }
  trackEvent("page_not_found", { bad_path: (pathname + search).slice(0, 100), referrer: referrer.slice(0, 100) });
}
