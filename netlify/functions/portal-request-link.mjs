import nodemailer from "nodemailer";
import {
  PORTAL_LINK_PURPOSE,
  PORTAL_LINK_TTL_SECONDS,
  accessFromEnv,
  portalSecret,
  safePortalPath,
  signToken,
} from "../lib/portal-auth.mjs";

/**
 * Emails a sign-in link for the client portal.
 *
 * POST /api/portal/request-link  { email, next?, website? }
 *
 * Only addresses in PORTAL_CLIENTS (or the owner's TOOLS_ALLOWED_EMAIL) get a
 * link, but every address gets the same answer, so the form can't be used to
 * find out who is a client. Mail goes out through DreamHost SMTP: the
 * PORTAL_SMTP_USER / PORTAL_SMTP_PASS account when set (for a Studio sender
 * like hello@omoniyistudio.com later), otherwise the site's SMTP_USER / SMTP_PASS.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STUDIO_ORIGIN = "https://omoniyistudio.com";
const ALLOWED_ORIGINS = [STUDIO_ORIGIN, "https://www.omoniyistudio.com", "http://localhost:8888"];
const getEnv = (key) => process.env[key];

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function emailBodies(link, minutes) {
  const text = [
    "Here's your link to your project room at Omoniyi Studio:",
    "",
    link,
    "",
    `It expires in ${minutes} minutes. After that you'll stay signed in on this device for 30 days.`,
    "If you didn't ask for this, you can ignore it.",
    "",
    "Omoniyi",
  ].join("\n");
  const safeLink = escapeHtml(link);
  const html = `<!doctype html><html><body style="margin:0;padding:32px 16px;background:#fffad6;font-family:Georgia,serif;color:#18140f">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:480px;background:#f6ecc9;border:1px solid rgba(24,20,15,.18)" cellspacing="0" cellpadding="0">
<tr><td style="background:#3b1016;color:#fffad6;padding:14px 24px;font:700 11px/1.4 Arial,sans-serif;letter-spacing:.24em;text-transform:uppercase">Omoniyi Studio · Admit one</td></tr>
<tr><td style="padding:28px 24px 8px;font-size:24px;line-height:1.25">Your project room is ready.</td></tr>
<tr><td style="padding:8px 24px 24px;font:16px/1.6 Arial,sans-serif;color:#33291d">Use the button below to sign in. It expires in ${minutes} minutes. After that you'll stay signed in on this device for 30 days.</td></tr>
<tr><td style="padding:0 24px 28px"><a href="${safeLink}" style="display:inline-block;background:#3b1016;color:#fffad6;text-decoration:none;font:700 14px/1 Arial,sans-serif;letter-spacing:.08em;padding:16px 24px;border:2px dashed rgba(255,250,214,.5)">Open my project room</a></td></tr>
<tr><td style="padding:0 24px 28px;font:13px/1.6 Arial,sans-serif;color:rgba(24,20,15,.62)">If you didn't ask for this, you can ignore it.<br>Omoniyi</td></tr>
</table></td></tr></table></body></html>`;
  return { text, html };
}

export default async (request) => {
  if (request.method !== "POST") return json(405, { ok: false, error: "Method not allowed." });

  const siteOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin") || "";
  if (origin && origin !== siteOrigin && !ALLOWED_ORIGINS.includes(origin)) {
    return json(403, { ok: false, error: "Sign-in links can only be requested from the Studio site." });
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return json(400, { ok: false, error: "Please try again." });
  }

  const email = String(input.email || "").trim().toLowerCase();
  const next = safePortalPath(input.next);

  // Honeypot: bots fill every field. Pretend it worked and send nothing.
  if (String(input.website || "").trim() !== "") return json(200, { ok: true });

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return json(422, { ok: false, error: "Please enter a valid email address." });
  }

  const secret = portalSecret(getEnv);
  const smtpUser = getEnv("PORTAL_SMTP_USER") || getEnv("SMTP_USER");
  const smtpPass = getEnv("PORTAL_SMTP_USER") ? getEnv("PORTAL_SMTP_PASS") : getEnv("SMTP_PASS");
  if (!secret || !smtpUser || !smtpPass) {
    console.error("portal-request-link: a signing secret or SMTP credentials are missing.");
    return json(503, { ok: false, error: "Sign-in isn't set up yet. Email Omoniyi and she'll sort it out." });
  }

  // Same answer whether or not the address has a project.
  if (!accessFromEnv(getEnv).has(email)) return json(200, { ok: true });

  const token = await signToken(secret, PORTAL_LINK_PURPOSE, { sub: email, next }, PORTAL_LINK_TTL_SECONDS);
  // Links point at the domain the request came from, so they also work on deploy previews.
  const link = `${siteOrigin}/portal/auth/verify?t=${encodeURIComponent(token)}`;
  const { text, html } = emailBodies(link, PORTAL_LINK_TTL_SECONDS / 60);

  try {
    const transporter = nodemailer.createTransport({
      host: getEnv("SMTP_HOST") || "smtp.dreamhost.com",
      port: Number(getEnv("SMTP_PORT")) || 587,
      secure: false, // port 587 upgrades to TLS via STARTTLS
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({
      from: `"Omoniyi Studio" <${smtpUser}>`,
      to: email,
      subject: "Your link to your project room",
      text,
      html,
    });
  } catch (error) {
    console.error("portal-request-link: email failed to send:", error);
    return json(502, { ok: false, error: "The link couldn't be sent. Try again in a minute." });
  }

  return json(200, { ok: true });
};

export const config = {
  path: "/api/portal/request-link",
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
