// The site answers on two domains from one deploy:
//   omoniyialimi.com   the portfolio, observations, UI kits and personal /tools
//   omoniyistudio.com  Omoniyi Studio (its page sits at the root), the client portal and toolbox
// The edge function netlify/edge-functions/studio-domain.mjs does the
// server-side half of this split; these helpers do the in-app half, so
// links followed inside the app land on the right domain too.

export const STUDIO_HOSTS = ["omoniyistudio.com", "www.omoniyistudio.com"];
export const PERSONAL_ORIGIN = "https://omoniyialimi.com";

export function isStudioHost(hostname = typeof window === "undefined" ? "" : window.location.hostname) {
  return STUDIO_HOSTS.includes(hostname);
}

// Paths that belong to the Studio domain. Everything else on it goes to the portfolio.
export function isStudioPath(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return clean === "/" || clean === "/studio" || clean.startsWith("/studio/") || clean === "/portal" || clean.startsWith("/portal/") || clean === "/toolbox" || clean.startsWith("/toolbox/");
}

// On the Studio domain the root shows the Studio page, so it uses Studio's metadata.
export function metadataPathFor(pathname, studioHost = isStudioHost()) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return studioHost && clean === "/" ? "/studio" : pathname;
}
