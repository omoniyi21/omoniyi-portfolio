import nodemailer from "nodemailer";

/**
 * LaunchKit signup endpoint — Netlify Function.
 *
 * Both the homepage "early access" popup and the LaunchKit Pro waitlist on
 * /uikit collect just an email address. Previously they posted straight to
 * "/" for Netlify Forms to pick up, which depends on a hidden static form
 * in index.html and a notification rule configured separately in the
 * Netlify dashboard. This mirrors contact.mjs's more direct pattern
 * instead: it sends a notification over DreamHost's SMTP server via
 * nodemailer, authenticated with credentials read from Netlify environment
 * variables — never hardcoded here.
 *
 * Required Netlify environment variables (Site settings → Environment
 * variables): SMTP_USER and SMTP_PASS — the same DreamHost mailbox
 * credentials contact.mjs and studio-inquiry.mjs already use. SMTP_HOST and
 * SMTP_PORT are optional and default to DreamHost's own smtp.dreamhost.com
 * on port 587 (STARTTLS).
 */

const NOTIFICATION_EMAIL = "contact@omoniyialimi.com";
const ALLOWED_ORIGINS = [
  "https://omoniyialimi.com",
  "https://www.omoniyialimi.com",
  "http://localhost:5173",
];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIST_LABELS = {
  "home-popup": "LaunchKit UI early access (homepage popup)",
  "pro-waitlist": "LaunchKit Pro waitlist (/uikit)",
};

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  };
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.dreamhost.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // port 587 upgrades to TLS via STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method not allowed." });
  }

  const origin = event.headers.origin || event.headers.Origin || "";
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return json(403, { ok: false, error: "This form can only be sent from the portfolio site." });
  }

  let input;
  try {
    input = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { ok: false, error: "Please try again." });
  }

  const email = String(input.email || "").trim();
  const website = String(input.website || "").trim(); // honeypot
  const listKey = String(input.list || "home-popup").trim();
  const source = String(input.source || "").trim();

  // Honeypot — quietly accept bot submissions without sending them.
  if (website !== "") {
    return json(200, { ok: true });
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return json(422, { ok: false, error: "Please use a valid email address." });
  }

  const listLabel = LIST_LABELS[listKey] || LIST_LABELS["home-popup"];

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("launchkit-signup function: SMTP_USER / SMTP_PASS are not set in Netlify's environment variables.");
    return json(502, {
      ok: false,
      error: `I couldn't save that just yet. Please email me directly at ${NOTIFICATION_EMAIL} instead.`,
    });
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"LaunchKit signup" <${process.env.SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `New ${listLabel} signup`,
      text: `Email: ${email}\nList: ${listLabel}\nSource: ${source || "—"}\n`,
    });
    return json(200, { ok: true });
  } catch (error) {
    console.error("launchkit-signup function: email failed to send:", error);
    return json(502, {
      ok: false,
      error: `I couldn't save that just yet. Please email me directly at ${NOTIFICATION_EMAIL} instead.`,
    });
  }
};
