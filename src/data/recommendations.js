// Recommendations quoted on the site. Quotes are verbatim from LinkedIn;
// keep them word-for-word and linked to the source.
export const LINKEDIN_RECOMMENDATIONS_URL =
  "https://www.linkedin.com/in/omoniyi-alimi-08428782/details/recommendations/";

export const tylerRecommendation = {
  name: "Tyler Winzenried",
  kicker: "From a manager",
  title: "Engineering Lead, Government Contracting",
  relationship: "Managed Omoniyi directly",
  systems:
    "She’s shown ability to think and design at a high level of abstraction while leading a design system UX team, while also delivering UX for niche, business-logic heavy systems and feature teams.",
  closing: "Omoniyi is a true gem, I recommend her highly.",
  source: LINKEDIN_RECOMMENDATIONS_URL,
};

export const stephenRecommendation = {
  name: "Stephen Schneider",
  kicker: "From a design lead",
  title: "Design Lead, U.S. Copyright Office",
  relationship: "Senior colleague",
  systems:
    "When we audited the search component, she ran the facilitation: she organized the sessions, kept a complex set of stakeholder opinions focused, and turned the findings into a clear redesign.",
  closing: "Any team building complex, high-stakes products would be lucky to have her.",
  source: LINKEDIN_RECOMMENDATIONS_URL,
};

// Order shown in the carousels on Home and Studio.
export const recommendations = [tylerRecommendation, stephenRecommendation];
