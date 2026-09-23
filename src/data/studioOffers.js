// Ongoing and systems-level work for product teams (fractional lane).
export const TEAM_OFFERS = [
  {
    id: "fractional",
    name: "Fractional Design Lead",
    price: "From $5,000/mo",
    terms: "2 days a week · 3-month minimum",
    budgets: ["$5,000–$7,500/mo", "$7,500–$10,000/mo", "$10,000+/mo", "Not sure yet"],
    description: "A senior product designer embedded in your team, without a full-time hire.",
    items: ["Discovery & roadmap input", "Flows, UI & implementation-ready specs", "Design system stewardship", "Research & accessibility built in"],
  },
  {
    id: "sprint",
    name: "Design System Sprint",
    price: "From $12,000",
    terms: "4–6 weeks",
    budgets: ["$12,000–$20,000", "$20,000–$35,000", "$35,000+", "Not sure yet"],
    description: "Tokens, components and documentation your engineers can build from.",
    items: ["UI inventory & audit", "Tokens & component library", "States, keyboard & focus behavior", "Docs & handoff to React"],
  },
  {
    id: "a11y-audit",
    name: "Accessibility & UX Audit",
    price: "From $4,000",
    terms: "~ 2 weeks",
    budgets: ["$4,000–$6,000", "$6,000–$10,000", "$10,000+", "Not sure yet"],
    description: "A WCAG 2.1 AA and Section 508 review for teams with compliance on the line.",
    items: ["Manual & assistive-tech testing", "Prioritized findings", "Fixes spec’d for engineering", "Readout with your team"],
  },
];

export const TEAM_OFFER_IDS = TEAM_OFFERS.map((offer) => offer.id);
