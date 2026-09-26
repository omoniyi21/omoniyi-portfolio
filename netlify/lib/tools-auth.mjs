/**
 * Signed tokens for the private /tools area.
 *
 * Shared by the request-link function (Node) and the tools-gate edge
 * function (Deno), so it only uses Web Crypto, TextEncoder and btoa/atob,
 * which both runtimes provide.
 *
 * A token is `<payload>.<signature>`: the payload is base64url JSON, the
 * signature is HMAC-SHA256 over `<purpose>.<payload>` with TOOLS_AUTH_SECRET.
 * The purpose ("link" or "session") stops a sign-in link from being used as a
 * session cookie and the other way round. Nothing is stored anywhere; a token
 * is valid if the signature checks out and it hasn't expired. Changing
 * TOOLS_AUTH_SECRET signs out every device at once.
 */

export const SESSION_COOKIE = "__Host-tools_session";
export const LINK_TTL_SECONDS = 15 * 60; // sign-in links last 15 minutes
export const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // stay signed in for 30 days

const encoder = new TextEncoder();

function toBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(text) {
  const padded = text.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((text.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmacKey(secret) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export async function signToken(secret, purpose, claims, ttlSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const payload = toBase64Url(encoder.encode(JSON.stringify({ ...claims, iat: now, exp: now + ttlSeconds })));
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${purpose}.${payload}`));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

/** Returns the claims if the token is genuine, unexpired and for this purpose; otherwise null. */
export async function verifyToken(secret, purpose, token) {
  if (!secret || typeof token !== "string") return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra !== undefined) return null;
  try {
    const key = await hmacKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signature),
      encoder.encode(`${purpose}.${payload}`),
    );
    if (!valid) return null;
    const claims = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    if (typeof claims.exp !== "number" || claims.exp < Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}

/** Only allow redirects back into /tools, never to another site. */
export function safeNextPath(value) {
  if (typeof value !== "string") return "/tools/";
  if (value !== "/tools" && !value.startsWith("/tools/")) return "/tools/";
  if (value.startsWith("//") || value.includes("\\")) return "/tools/";
  if (value.startsWith("/tools/login") || value.startsWith("/tools/auth")) return "/tools/";
  return value;
}
