import nodemailer from "nodemailer";

/**
 * "What's on your mind?" submission endpoint — Netlify Function.
 *
 * Mirrors the resilience pattern in contact.mjs / studio-inquiry.mjs: sends
 * over DreamHost's SMTP server via nodemailer, authenticated with
 * credentials read from Netlify environment variables (SMTP_USER,
 * SMTP_PASS — never hardcoded here).
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
    return json(400, { ok: false, error: "Please try sending that again." });
  }

  // Honeypot — quietly accept bot submissions without sending them.
  const website = String(input.website || "").trim();
  if (website !== "") {
    return json(200, { ok: true });
  }

  const name = String(input.name || "").trim();
  const email = String(input.email || "").trim();
  const reading = String(input.reading || "").trim();
  const watching = String(input.watching || "").trim();
  const movie = String(input.movie || "").trim();
  const scent = String(input.scent || "").trim();
  const ritual = String(input.ritual || "").trim();
  const thought = String(input.thought || "").trim();
  const podcast = String(input.podcast || "").trim();
  const onRepeat = String(input.onRepeat || "").trim();

  if (name.length < 2 || name.length > 120) {
    return json(422, { ok: false, error: "Please include your name." });
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return json(422, { ok: false, error: "Please use a valid email address." });
  }

  const contentFields = { reading, watching, movie, scent, ritual, thought, podcast, onRepeat };
  const hasContent = Object.values(contentFields).some((value) => value.length > 0);
  if (!hasContent) {
    return json(422, { ok: false, error: "Please share at least one current favorite." });
  }
  for (const [, value] of Object.entries(contentFields)) {
    if (value.length > 500) {
      return json(422, { ok: false, error: "One of the fields is too long — please shorten it and try again." });
    }
  }

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    `Reading: ${reading || "—"}`,
    `Watching: ${watching || "—"}`,
    `Movie obsession: ${movie || "—"}`,
    `Scent: ${scent || "—"}`,
    `Ritual: ${ritual || "—"}`,
    `Thought: ${thought || "—"}`,
    `Podcast rec: ${podcast || "—"}`,
    `On repeat: ${onRepeat || "—"}`,
  ];

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("current-favorites function: SMTP_USER / SMTP_PASS are not set in Netlify's environment variables.");
    return json(502, {
      ok: false,
      error: `I couldn't send that just yet. Please email me directly at ${NOTIFICATION_EMAIL} instead.`,
    });
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Portfolio: what's on your mind" <${process.env.SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `New "what's on your mind" reply from ${name}`,
      text: lines.join("\n") + "\n",
    });
    return json(200, { ok: true });
  } catch (error) {
    console.error("current-favorites function: email failed to send:", error);
    return json(502, {
      ok: false,
      error: `I couldn't send that just yet. Please email me directly at ${NOTIFICATION_EMAIL} instead.`,
    });
  }
};
