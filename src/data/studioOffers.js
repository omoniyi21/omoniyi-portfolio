// Omoniyi Studio offer flow. Source of truth: the "Omoniyi Studio: Offer
// Flow", "Admission: What I Check" and "The Feature: Scope" docs (Oct 2026).
// Every client engagement is a sequence, not a menu: a paid $500 diagnosis
// decides the scope, and the next stage is quoted fixed after it. Fractional
// product work skips the paid diagnosis and starts as a Residency.
//
// "Total" prices already include the $500 Admission credit.

export const ADMISSION = {
  id: "admission",
  name: "Admission",
  sub: "The diagnosis",
  price: "$500",
  description:
    "I look at your experience, your business and the signals you already have, then walk you through what’s getting in the way, what to fix first and what can wait. You leave with a written diagnosis and a fixed quote. If you book the work within 30 days, the full $500 goes toward it. If you don’t, the diagnosis is still yours.",
  timeline: "Within 5 business days",
};

export const STAGES = [
  {
    id: "feature",
    name: "The Feature",
    sub: "One fix",
    price: "From $1,500",
    description:
      "For one concentrated problem. I fix the part that matters and tell you what was left alone and why.",
    items: [
      "The one priority named in your diagnosis, designed",
      "A working session on direction before final design",
      "Files ready for your developer, or built where the platform allows",
      "A handoff note: what changed, why, and what was left alone",
      "A measurement note: what to watch and when",
    ],
    timeline: "About 2 weeks",
    tone: "light",
  },
  {
    id: "main-production",
    name: "Main Production",
    sub: "A connected fix",
    price: "$5,000 to $9,000",
    description:
      "For a bigger problem running across a whole journey. Deeper work, implementation support, and a baseline so we can see what changed.",
    items: [
      "Deeper diagnosis where it’s needed",
      "The connected changes across one journey",
      "Implementation support or handoff to your team",
      "A recorded baseline, then a results review",
    ],
    timeline: "4 to 8 weeks",
    tone: "tint",
  },
  {
    id: "residency",
    name: "Residency",
    sub: "Ongoing creative direction",
    price: "From $13,000 per term",
    description:
      "For businesses with several connected problems, worked through in sequence.",
    items: [
      "A roadmap and sequenced fixes",
      "Measurement and reporting",
      "Continued creative direction",
      "Renews only if we both say yes",
    ],
    timeline: "3-month term",
    tone: "dark",
  },
];

export const FRACTIONAL = {
  id: "fractional",
  name: "Fractional Residency",
  sub: "Embedded senior design",
  plans: [
    { label: "10 hours a week", price: "$3,900/mo" },
    { label: "20 hours a week", price: "$7,800/mo" },
  ],
  terms: "3-month minimum, billed monthly at $90/hr",
  description:
    "For product and SaaS teams that need senior design embedded with the team. It starts directly from a fit call, and the first two weeks act as the diagnosis.",
  items: [
    "Product design",
    "Experience strategy",
    "Design systems",
    "Stakeholder collaboration",
    "Creative direction",
  ],
};

// Price gauge on the inquiry form. Bands don't make anyone pick a stage;
// they tell Omoniyi before the fit call whether budget and problem match.
export const INVEST_BANDS = [
  "Under $1,500",
  "$1,500 to $5,000",
  "$5,000 to $10,000",
  "$10,000 and up",
  "Monthly support for a product team",
  "Not sure yet, help me figure it out",
];

// The nine things every Admission checks. 1 to 8 from the outside; 9 once
// the client shares analytics and sales.
export const CHECK_AREAS = [
  { n: "01", area: "First impression", question: "Can a new visitor tell in a few seconds what you do, who it’s for and why you?", why: "People decide whether to stay almost instantly." },
  { n: "02", area: "The path to yes", question: "How many steps from arriving to booking, buying or getting in touch, and where do people stall?", why: "Every extra step is a place to give up." },
  { n: "03", area: "Trust", question: "Does the site look as credible as your business really is: real people, reviews, contact details, a checkout that feels safe?", why: "People won’t hand over a card or a phone number to a site they doubt." },
  { n: "04", area: "Words", question: "Does the copy use your customers’ language, and can someone skimming still get the point?", why: "Most visitors read only a fraction of the page." },
  { n: "05", area: "Phones", question: "Does everything above work as well on a phone?", why: "For many small businesses, most visits are on a phone." },
  { n: "06", area: "Speed", question: "Does the page load and respond fast enough that people don’t give up?", why: "Slow pages lose people before they see anything." },
  { n: "07", area: "Access for everyone", question: "Can people using a keyboard, a screen reader or zoom use the site?", why: "Most people who hit a barrier leave without telling you." },
  { n: "08", area: "Being found", question: "Do the right searches lead to the right page, and does your listing make people click?", why: "A problem can start before anyone reaches your site." },
  { n: "09", area: "The numbers", question: "Is your tracking accurate, where do visitors drop off, and does your traffic become the right customers?", why: "It tells us which problem is costing you the most.", note: "Full diagnosis" },
];
