/**
 * Splits the one deploy across two domains.
 *
 * omoniyistudio.com
 *   /                 the Studio page (served from its prerendered HTML, so the
 *                     head, title and favicon are Studio's)
 *   /studio/*         the Studio's other pages
 *   /portal/*         the client portal (guarded by portal-gate)
 *   /api/*, files     pass through
 *   anything else     301 to the same path on omoniyialimi.com
 * www.omoniyistudio.com  301 to omoniyistudio.com
 *
 * omoniyialimi.com
 *   /portal/*         302 to the same path on omoniyistudio.com
 *
 * Other hosts (deploy previews, localhost) serve everything, so the portal
 * can be tested before the domain resolves.
 */

const STUDIO_HOST = "omoniyistudio.com";
const PERSONAL_HOSTS = ["omoniyialimi.com", "www.omoniyialimi.com"];
const PERSONAL_ORIGIN = "https://omoniyialimi.com";

const isPortal = (path) => path === "/portal" || path.startsWith("/portal/");
const isStudio = (path) => path === "/studio" || path.startsWith("/studio/");
const isFile = (path) => /\.[a-z0-9]{2,5}$/i.test(path);

function redirect(location, status) {
  return new Response(null, { status, headers: { Location: location, "Cache-Control": "no-store" } });
}

export default async (request, context) => {
  const url = new URL(request.url);
  const host = url.hostname;
  const path = url.pathname;

  if (host === `www.${STUDIO_HOST}`) {
    url.hostname = STUDIO_HOST;
    return redirect(url.toString(), 301);
  }

  if (host === STUDIO_HOST) {
    if (path === "/") return new URL("/studio/index.html", url);
    if (isStudio(path) || isPortal(path) || path.startsWith("/api/") || path.startsWith("/.netlify/") || isFile(path)) {
      return context.next();
    }
    return redirect(`${PERSONAL_ORIGIN}${path}${url.search}`, 301);
  }

  if (PERSONAL_HOSTS.includes(host) && isPortal(path)) {
    return redirect(`https://${STUDIO_HOST}${path}${url.search}`, 302);
  }

  return context.next();
};

export const config = { path: "/*" };
