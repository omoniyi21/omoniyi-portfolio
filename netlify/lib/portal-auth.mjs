/**
 * Client portal access, shared by the portal-request-link function (Node) and
 * the portal-gate edge function (Deno). Web-standard code only.
 *
 * Who can sign in comes from one environment variable, PORTAL_CLIENTS:
 *
 *   PORTAL_CLIENTS="nawal@example.com=6ix, tae@example.com=taehamm"
 *
 * Each address opens exactly one project room, /portal/<project>/. The owner
 * (anyone in TOOLS_ALLOWED_EMAIL) can open every room. Access is looked up on
 * every request, so removing someone from PORTAL_CLIENTS locks them out at once,
 * even if they still have a session cookie.
 *
 * Tokens reuse tools-auth.mjs's signing with their own purposes
 * ("portal-link", "portal-session") and their own cookie, so a portal session
 * can never open /tools and a tools session can never open the portal.
 * PORTAL_AUTH_SECRET is used when set; otherwise TOOLS_AUTH_SECRET.
 */

export { signToken, verifyToken } from "./tools-auth.mjs";

export const PORTAL_COOKIE = "__Host-portal_session";
export const PORTAL_LINK_PURPOSE = "portal-link";
export const PORTAL_SESSION_PURPOSE = "portal-session";
export const PORTAL_LINK_TTL_SECONDS = 30 * 60; // links last 30 minutes: clients don't always open email right away
export const PORTAL_SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
export const OWNER = "*";

const PROJECT_PATTERN = /^[a-z0-9][a-z0-9-]{0,40}$/;

export function portalSecret(getEnv) {
  return getEnv("PORTAL_AUTH_SECRET") || getEnv("TOOLS_AUTH_SECRET") || "";
}

/** Map of lowercase email → project slug, with owner emails mapped to OWNER. */
export function parseClients(clientsValue = "", ownerValue = "") {
  const access = new Map();
  for (const entry of String(clientsValue).split(",")) {
    const [rawEmail, rawProject] = entry.split("=");
    const email = String(rawEmail || "").trim().toLowerCase();
    const project = String(rawProject || "").trim().toLowerCase();
    if (email && PROJECT_PATTERN.test(project)) access.set(email, project);
  }
  for (const rawEmail of String(ownerValue).split(",")) {
    const email = rawEmail.trim().toLowerCase();
    if (email) access.set(email, OWNER);
  }
  return access;
}

export function accessFromEnv(getEnv) {
  return parseClients(getEnv("PORTAL_CLIENTS"), getEnv("TOOLS_ALLOWED_EMAIL"));
}

/** The project a path is inside (/portal/6ix/... → "6ix"), or null for /portal itself and its shared pages. */
export function projectFromPath(path) {
  const match = /^\/portal\/([^/]+)/.exec(path);
  if (!match) return null;
  const slug = match[1].toLowerCase();
  if (["login", "logout", "auth", "assets"].includes(slug)) return null;
  return slug;
}

export function canOpen(project, requested) {
  return project === OWNER || project === requested;
}

/** Where someone lands after signing in. */
export function homeFor(project) {
  return project === OWNER ? "/portal/" : `/portal/${project}/`;
}

/** Only allow redirects to portal pages, never off the site or into sign-in itself. */
export function safePortalPath(value) {
  if (typeof value !== "string" || !value.startsWith("/portal/")) return null;
  if (value.startsWith("//") || value.includes("\\") || value.includes("..")) return null;
  if (/^\/portal\/(login|logout|auth)(\/|$)/.test(value)) return null;
  return value;
}
