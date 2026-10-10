import {
  PORTAL_COOKIE,
  PORTAL_LINK_PURPOSE,
  PORTAL_SESSION_PURPOSE,
  PORTAL_SESSION_TTL_SECONDS,
  accessFromEnv,
  canOpen,
  homeFor,
  portalSecret,
  projectFromPath,
  safePortalPath,
  signToken,
  verifyToken,
} from "../lib/portal-auth.mjs";

/**
 * Guards the client portal.
 *
 * - /portal/login, /portal/assets/*   always reachable
 * - /portal/auth/verify               where the emailed link lands; swaps it for a session cookie
 * - /portal/logout                    clears the session
 * - /portal/                          the owner's overview; a client is sent to their own room
 * - /portal/<project>/*               only for that project's client, or the owner
 *
 * Fails closed: with no secret set, nobody gets past the sign-in page.
 */

const NOINDEX = "noindex, nofollow";
const getEnv = (key) => Netlify.env.get(key);

function redirect(location, extraHeaders = {}) {
  return new Response(null, {
    status: 302,
    headers: { Location: location, "Cache-Control": "no-store", "X-Robots-Tag": NOINDEX, ...extraHeaders },
  });
}

function readCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

function sessionCookie(value, maxAge) {
  return `${PORTAL_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

async function passThrough(context) {
  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", NOINDEX);
  headers.set("Cache-Control", "private, no-store");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;
  const secret = portalSecret(getEnv);

  if (/^\/portal\/(login|assets)(\/|$)/.test(path)) return passThrough(context);

  if (path === "/portal/logout" || path === "/portal/logout/") {
    return redirect("/portal/login/?signed_out=1", { "Set-Cookie": sessionCookie("", 0) });
  }

  if (path === "/portal/auth/verify" || path === "/portal/auth/verify/") {
    const claims = await verifyToken(secret, PORTAL_LINK_PURPOSE, url.searchParams.get("t"));
    const project = claims && accessFromEnv(getEnv).get(claims.sub);
    if (!project) return redirect("/portal/login/?link=expired");
    const session = await signToken(secret, PORTAL_SESSION_PURPOSE, { sub: claims.sub }, PORTAL_SESSION_TTL_SECONDS);
    const next = safePortalPath(claims.next);
    const target = next && canOpen(project, projectFromPath(next)) ? next : homeFor(project);
    return redirect(target, { "Set-Cookie": sessionCookie(session, PORTAL_SESSION_TTL_SECONDS) });
  }

  const session = await verifyToken(secret, PORTAL_SESSION_PURPOSE, readCookie(request, PORTAL_COOKIE));
  const project = session && accessFromEnv(getEnv).get(session.sub);
  if (!project) {
    const next = safePortalPath(path + url.search);
    return redirect(next ? `/portal/login/?next=${encodeURIComponent(next)}` : "/portal/login/");
  }

  const requested = projectFromPath(path);
  if (requested === null) {
    // /portal itself: the owner's overview; clients go straight to their room.
    return project === "*" ? passThrough(context) : redirect(homeFor(project));
  }
  if (!canOpen(project, requested)) return redirect(homeFor(project));

  return passThrough(context);
};

export const config = {
  path: ["/portal", "/portal/*"],
};
