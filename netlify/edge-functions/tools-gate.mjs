import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  safeNextPath,
  signToken,
  verifyToken,
} from "../lib/tools-auth.mjs";

/**
 * Guards everything under /tools.
 *
 * - /tools/login           the sign-in page (always reachable)
 * - /tools/auth/verify     where the emailed link lands; swaps it for a session cookie
 * - /tools/logout          clears the session cookie
 * - anything else          served only with a valid session, otherwise sent to /tools/login
 *
 * Needs TOOLS_AUTH_SECRET in Netlify's environment variables. Without it the
 * gate stays shut (fails closed) instead of letting everyone in.
 */

const NOINDEX = "noindex, nofollow";

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
  return `${SESSION_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
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
  const secret = Netlify.env.get("TOOLS_AUTH_SECRET");

  if (path === "/tools/login" || path.startsWith("/tools/login/")) {
    return passThrough(context);
  }

  if (path === "/tools/logout" || path === "/tools/logout/") {
    return redirect("/tools/login/?signed_out=1", { "Set-Cookie": sessionCookie("", 0) });
  }

  if (path === "/tools/auth/verify" || path === "/tools/auth/verify/") {
    const claims = await verifyToken(secret, "link", url.searchParams.get("t"));
    if (!claims) return redirect("/tools/login/?link=expired");
    const session = await signToken(secret, "session", { sub: claims.sub }, SESSION_TTL_SECONDS);
    return redirect(safeNextPath(claims.next), { "Set-Cookie": sessionCookie(session, SESSION_TTL_SECONDS) });
  }

  const session = await verifyToken(secret, "session", readCookie(request, SESSION_COOKIE));
  if (!session) {
    const next = encodeURIComponent(path + url.search);
    return redirect(`/tools/login/?next=${next}`);
  }

  return passThrough(context);
};

export const config = {
  path: ["/tools", "/tools/*"],
};
