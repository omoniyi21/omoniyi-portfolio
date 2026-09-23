import nodemailer from "nodemailer";

/**
 * Omoniyi Studio intake-form endpoint — Netlify Function.
 *
 * Mirrors the resilience pattern in contact.mjs: sends over DreamHost's
 * SMTP server via nodemailer, authenticated with credentials read from
 * Netlify environment variables (SMTP_USER, SMTP_PASS — never hardcoded).
 */

const NOTIFICATION_EMAIL = "contact@omoniyialimi.com";
const ALLOWED_ORIGINS = [
  "https://omoniyialimi.com",
  "https://www.omoniyialimi.com",
  "http://localhost:5173",
];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVICE_LABELS = {
  refine: "Refine — UX Audit & Optimization",
  build: "Build — Website / Product Design",
  transform: "Transform — Experience System & Creative Direction",
  fractional: "Fractional Design Lead",
  sprint: "Design System Sprint",
  "a11y-audit": "Accessibility & UX Audit",
  "not-sure": "Not sure yet",
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
    secure: false,
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
    return json(403, { ok: false, error: "This form can only be sent from the Studio site." });
  }

  let input;
  try {
    input = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { ok: false, error: "Please try sending your inquiry again." });
  }

  // Honeypot — quietly accept bot submissions without sending them.
  const honeypot = String(input._hp || "").trim();
  if (honeypot !== "") {
    return json(200, { ok: true });
  }

  const name = String(input.name || "").trim();
  const email = String(input.email || "").trim();
  const company = String(input.company || "").trim();
  const website = String(input.website || "").trim();
  const serviceKey = String(input.service || "not-sure").trim();
  const notWorking = String(input.notWorking || "").trim();
  const successLooksLike = String(input.successLooksLike || "").trim();
  const timeline = String(input.timeline || "").trim();
  const budget = String(input.budget || "").trim();
  const anythingElse = String(input.anythingElse || "").trim();

  if (name.length < 2 || name.length > 120) {
    return json(422, { ok: false, error: "Please include your name." });
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return json(422, { ok: false, error: "Please use a valid email address." });
  }
  if (budget.length < 1) {
    return json(422, { ok: false, error: "Please select an approximate budget." });
  }

  const longFields = { company, website, notWorking, successLooksLike, timeline, anythingElse };
  for (const [, value] of Object.entries(longFields)) {
    if (value.length > 5000) {
      return json(422, { ok: false, error: "One of the fields is too long — please shorten it and try again." });
    }
  }

  const serviceLabel = SERVICE_LABELS[serviceKey] || SERVICE_LABELS["not-sure"];

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company / business: ${company || "—"}`,
    `Website / product URL: ${website || "—"}`,
    `Interested in: ${serviceLabel}`,
    `Desired timeline: ${timeline || "—"}`,
    `Approximate budget: ${budget}`,
    "",
    "What isn't working right now?",
    notWorking || "—",
    "",
    "What would a successful outcome look like?",
    successLooksLike || "—",
    "",
    "Anything else?",
    anythingElse || "—",
  ];

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("studio-inquiry function: SMTP_USER / SMTP_PASS are not set in Netlify's environment variables.");
    return json(502, {
      ok: false,
      error: `I couldn't send that just yet. Please email me directly at ${NOTIFICATION_EMAIL} instead.`,
    });
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Studio inquiry form" <${process.env.SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `New Studio inquiry from ${name} (${serviceLabel})`,
      text: lines.join("\n") + "\n",
    });
    return json(200, { ok: true });
  } catch (error) {
    console.error("studio-inquiry function: email failed to send:", error);
    return json(502, {
      ok: false,
      error: `I couldn't send that just yet. Please email me directly at ${NOTIFICATION_EMAIL} instead.`,
    });
  }
};
