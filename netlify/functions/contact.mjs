import nodemailer from "nodemailer";

/**
 * Portfolio contact endpoint — Netlify Function.
 *
 * The site is deployed on Netlify (no PHP runtime), but the mailbox this
 * form delivers to lives on DreamHost. This sends over DreamHost's SMTP
 * server using nodemailer, authenticated with credentials read from Netlify
 * environment variables — never hardcoded here.
 *
 * Required Netlify environment variables (Site settings → Environment
 * variables): SMTP_USER (the full DreamHost mailbox address, e.g.
 * contact@omoniyialimi.com) and SMTP_PASS (that mailbox's password).
 * SMTP_HOST and SMTP_PORT are optional and default to DreamHost's own
 * smtp.dreamhost.com on port 587 (STARTTLS).
 */

const NOTIFICATION_EMAIL = "contact@omoniyialimi.com";
const ALLOWED_ORIGINS = [
  "https://omoniyialimi.com",
  "https://www.omoniyialimi.com",
  "http://localhost:5173",
];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    return json(400, { ok: false, error: "Please try sending your note again." });
  }

  const name = String(input.name || "").trim();
  const email = String(input.email || "").trim();
  const message = String(input.message || "").trim();
  const website = String(input.website || "").trim();

  // Honeypot — quietly accept bot submissions without sending them.
  if (website !== "") {
    return json(200, { ok: true });
  }

  if (name.length < 2 || name.length > 120) {
    return json(422, { ok: false, error: "Please include your name." });
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return json(422, { ok: false, error: "Please use a valid email address." });
  }
  if (message.length < 10 || message.length > 5000) {
    return json(422, { ok: false, error: "Please write a note between 10 and 5,000 characters." });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("contact function: SMTP_USER / SMTP_PASS are not set in Netlify's environment variables.");
    return json(502, {
      ok: false,
      error: `I couldn't send that just yet. Please email me directly at ${NOTIFICATION_EMAIL} instead.`,
    });
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Portfolio contact form" <${process.env.SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `New portfolio note from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
    });
    return json(200, { ok: true });
  } catch (error) {
    console.error("contact function: email failed to send:", error);
    return json(502, {
      ok: false,
      error: `I couldn't send that just yet. Please email me directly at ${NOTIFICATION_EMAIL} instead.`,
    });
  }
};
