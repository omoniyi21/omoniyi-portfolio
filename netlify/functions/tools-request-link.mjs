import nodemailer from "nodemailer";
import { LINK_TTL_SECONDS, safeNextPath, signToken } from "../lib/tools-auth.mjs";

/**
 * Emails a sign-in link for the private /tools area.
 *
 * POST /api/tools/request-link  { email, next?, website? }
 *
 * Only the address in TOOLS_ALLOWED_EMAIL gets a link, but the response is
 * the same for any address, so the form can't be used to check who has access.
 * The link is signed with TOOLS_AUTH_SECRET and expires after 15 minutes;
 * nothing is stored. Mail goes out through the same DreamHost SMTP account as
 * the contact form (SMTP_USER / SMTP_PASS, optional SMTP_HOST / SMTP_PORT).
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ORIGINS = ["https://omoniyialimi.com", "https://www.omoniyialimi.com", "http://localhost:8888"];

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function allowedEmails() {
  return String(process.env.TOOLS_ALLOWED_EMAIL || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export default async (request) => {
  if (request.method !== "POST") return json(405, { ok: false, error: "Method not allowed." });

  const siteOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin") || "";
  if (origin && origin !== siteOrigin && !ALLOWED_ORIGINS.includes(origin)) {
    return json(403, { ok: false, error: "Sign-in links can only be requested from this site." });
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return json(400, { ok: false, error: "Please try again." });
  }

  const email = String(input.email || "").trim().toLowerCase();
  const next = safeNextPath(input.next);

  // Honeypot: bots fill every field. Pretend it worked and send nothing.
  if (String(input.website || "").trim() !== "") return json(200, { ok: true });

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return json(422, { ok: false, error: "Please enter a valid email address." });
  }

  const secret = process.env.TOOLS_AUTH_SECRET;
  if (!secret || allowedEmails().length === 0 || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("tools-request-link: TOOLS_AUTH_SECRET, TOOLS_ALLOWED_EMAIL or SMTP credentials are missing.");
    return json(503, { ok: false, error: "Sign-in isn't set up yet." });
  }

  // Same answer whether or not the address is allowed.
  if (!allowedEmails().includes(email)) return json(200, { ok: true });

  const token = await signToken(secret, "link", { sub: email, next }, LINK_TTL_SECONDS);
  const link = `${siteOrigin}/tools/auth/verify?t=${encodeURIComponent(token)}`;
  const minutes = LINK_TTL_SECONDS / 60;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.dreamhost.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // port 587 upgrades to TLS via STARTTLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: `"Omoniyi Tools" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your sign-in link for Tools",
      text: `Here's your sign-in link:\n\n${link}\n\nIt expires in ${minutes} minutes. If you didn't ask for it, you can ignore this email.\n`,
      html: `<p>Here's your sign-in link:</p><p><a href="${link}">Sign in to Tools</a></p><p>It expires in ${minutes} minutes. If you didn't ask for it, you can ignore this email.</p>`,
    });
  } catch (error) {
    console.error("tools-request-link: email failed to send:", error);
    return json(502, { ok: false, error: "The link couldn't be sent. Try again in a minute." });
  }

  return json(200, { ok: true });
};

export const config = {
  path: "/api/tools/request-link",
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
