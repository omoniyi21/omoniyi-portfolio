// One set of facts, two framings. Every claim here should be defensible in an
// interview: scale and scope, not unsourced outcome percentages.

export const contact = {
  location: "Dallas, TX · Open to remote",
  email: "contact@omoniyialimi.com",
  site: "omoniyialimi.com",
  linkedin: "https://www.linkedin.com/in/omoniyi-alimi-08428782",
};

const independent = {
  company: "Omoniyi Studio & LaunchKit UI",
  role: "Founder & Designer",
  dates: "Aug 2026 – Present",
};

export const resumes = {
  product: {
    path: "/resume",
    tab: "a product team",
    title: "Senior Product Designer",
    tagline: "I help people navigate complex systems.",
    summary:
      "Senior Product Designer with nine years designing and building products for government, healthcare, and enterprise teams. I lead from discovery through delivery: researching how people actually work, turning dense legacy processes into clear workflows, and building the design systems that let engineering teams ship them consistently. Comfortable in code (HTML, CSS, JavaScript, React) and fluent with AI prototyping tools.",
    highlightsTitle: "Career Highlights",
    highlights: [
      { text: "Led end-to-end design of a new voting platform used across all of Congress, partnering directly with U.S. House leadership from discovery to implementation-ready specs.", link: { label: "voting platform", to: "/house" } },
      { text: "Built and scaled design systems across three federal platforms (House, Library of Congress, USDA), including 30+ USWDS components with tokens, states, and documentation." },
      { text: "Designed permissions, user-management, and governance tools for the Enterprise Copyright System, serving 100,000+ users and application submissions.", link: { label: "Enterprise Copyright System", to: "/library-of-congress" } },
      { text: "Ran research from 80+ hours of stakeholder discovery to usability testing with 100+ participants, and turned findings into shipped product decisions." },
      { text: "Designed to WCAG 2.1 AA and Section 508 across federal and healthcare products, validated with manual and tool-based testing." },
    ],
    experienceTitle: "Professional Experience",
    experience: [
      { ...independent, projects: [{ name: "Independent practice", sub: "Product design & front-end build", bullets: [
        { text: "Designed, built, and shipped omoniyialimi.com end-to-end: React front end, prerendered routes for search and link previews, accessible navigation, and GA4 funnel instrumentation.", link: { label: "omoniyialimi.com", to: "/" } },
        { text: "Designed and launched LaunchKit UI, a startup UI kit with a free community edition and a Pro tier: component architecture, tokens, and documentation.", link: { label: "LaunchKit UI", to: "/uikit" } },
        { text: "Launched Omoniyi Studio, a product design practice for small businesses, including service tiers and a qualification-to-booking flow.", link: { label: "Omoniyi Studio", to: "/studio" } },
      ] }] },
      { company: "Aretum", role: "UI/UX Designer", dates: "Mar 2024 – Jul 2026", projects: [
        { name: "Library of Congress", sub: "Enterprise Copyright System Modernization · Mar 2025 – Jul 2026", to: "/library-of-congress", bullets: [
          { text: "Led product discovery and UX research for the modernization of the Enterprise Copyright System, partnering with technical leadership and subject-matter experts across registration and financial operations." },
          { text: "Designed administration tools for role-based permissions, user management, and platform governance across a system processing 100,000+ users and submissions." },
          { text: "Defined the experience for a new financial management workspace through discovery with accounting stakeholders.", link: { label: "financial management workspace", to: "/copyright-accounting" } },
          { text: "Expanded the platform design system with new components, design tokens, and documentation that set UI standards across the product." },
          { text: "Wrote user stories and implementation-ready specs, partnering with engineering and QA through delivery." },
        ] },
        { name: "U.S. House of Representatives", sub: "Enterprise Voting Modernization · Mar 2024 – Mar 2025", to: "/house", bullets: [
          { text: "Led end-to-end design of a new voting platform for all of Congress, translating complex legislative processes into a clear digital workflow." },
          { text: "Partnered with House leadership and subject-matter experts in recurring discovery sessions to define requirements, flows, and product direction." },
          { text: "Built a USWDS-based design system of 30+ components with documented states, keyboard and focus behavior, tokens, and specs that became the foundation for future development." },
          { text: "Used interactive prototypes to align stakeholders and resolve ambiguity before engineering implementation." },
        ] },
      ] },
      { company: "Coretec", role: "UI/UX Developer", dates: "Dec 2022 – Aug 2023", projects: [
        { name: "USDA National Agricultural Statistics Service", sub: "Enterprise System Modernization", to: "/usda", bullets: [
          { text: "Led modernization of enterprise applications supporting agricultural data collection for 10,000+ farmers nationwide." },
          { text: "Designed and built a shared design system in Figma, Blazor, HTML, CSS/SCSS, and USWDS, standardizing patterns across multiple applications." },
          { text: "Created reusable templates that accelerated development and improved consistency across the product ecosystem." },
        ] },
      ] },
      { company: "Apex Systems", role: "UI/UX Developer", dates: "Oct 2021 – Jan 2023", projects: [
        { name: "Athletico", sub: "Patient Onboarding & Scheduling Platform", to: "/athletico", bullets: [
          { text: "Redesigned patient onboarding and appointment scheduling for a multi-location healthcare provider across desktop, tablet, and mobile." },
          { text: "Facilitated usability testing with 100+ participants and turned findings into iterative improvements to registration and scheduling." },
          { text: "Partnered with PMs, engineers, and designers on flows, prototypes, and production-ready UI within the existing design system." },
        ] },
      ] },
      { company: "The Day Publishing", role: "Front-End Designer & Developer", dates: "Dec 2018 – Oct 2021", projects: [
        { name: "Digital Product & Web Experience", bullets: [
          { text: "Designed and built responsive web products for 35+ organizations across healthcare, nonprofit, education, and commercial sectors, from discovery through launch." },
        ] },
      ] },
      { company: "Birthright Africa", role: "Graphic Designer", dates: "Apr 2021 – Oct 2021", projects: [
        { name: "Community Engagement & Digital Experience", bullets: [
          { text: "Designed marketing assets, web experiences, and visual systems for diaspora engagement and cultural education programs." },
        ] },
      ] },
    ],
    skills: [
      ["Product", "Product strategy, UX research, information architecture, interaction design, prototyping, user stories & acceptance criteria"],
      ["Systems", "Design systems, component libraries, design tokens, USWDS, enterprise platforms, legacy modernization"],
      ["Accessibility", "WCAG 2.1 AA, Section 508, keyboard & focus design, accessible forms, WAVE, Accessibility Insights, NVDA, JAWS"],
      ["Build & tools", "Figma, FigJam, HTML, CSS, JavaScript, React, Blazor, Claude, OpenAI, GitHub, Netlify, Azure DevOps"],
    ],
    education: ["Florida State University", "Bachelor of Social Work, 2016"],
  },

  experience: {
    path: "/resume/experience",
    tab: "a creative studio",
    title: "Product & Experience Designer",
    tagline: "I turn complex systems into worlds people can find their way through.",
    summary:
      "Product and experience designer who designs and builds. For nine years I’ve made complicated things feel human, from a voting platform for the U.S. Congress to a portfolio built as a hand-made field notebook. I bring research with real people, a systems mind for keeping a visual world consistent, front-end skills to prototype in code, and accessibility practice rooted in designing for everyone who shows up. Now focused on interactive, experiential, and creative-technology work.",
    highlightsTitle: "Selected Work",
    highlights: [
      { text: "omoniyialimi.com: a portfolio designed and coded as a world, with a notebook visual language, a hero that changes its story for each visitor, and ambient motion.", link: { label: "omoniyialimi.com", to: "/" } },
      { text: "LaunchKit UI: a UI kit I designed and launched, from brand and visual language to components and launch page.", link: { label: "LaunchKit UI", to: "/uikit" } },
      { link: { label: "Wedding identity case study", to: "/wedding-identity" }, text: "Wedding identity case study: creative direction for a wedding celebration, anchored by an original illustrated emblem that joins cowrie shells (Black American heritage) and pomegranates (Armenian heritage), designed to carry across menus, a custom newspaper, and keepsakes." },
      { text: "U.S. House voting platform: translating the rules and rituals of legislative voting into an interface all of Congress relies on.", link: { label: "U.S. House voting platform", to: "/house" } },
    ],
    experienceTitle: "Experience",
    experience: [
      { ...independent, projects: [{ name: "Independent practice", sub: "Product, brand & interactive work", bullets: [
        { text: "Designed and built omoniyialimi.com as a hand-made world: a field-notebook visual language, a persona-aware hero that rewrites its story for someone hiring vs. someone building, and ambient motion with a visitor-controlled pause.", link: { label: "omoniyialimi.com", to: "/" } },
        { text: "Designed and launched LaunchKit UI, a startup UI kit with a free community edition and a Pro tier, from visual language and components to launch page.", link: { label: "LaunchKit UI", to: "/uikit" } },
        { link: { label: "wedding-identity case study", to: "/wedding-identity" }, text: "Created a wedding-identity case study for a boutique event-design studio, extending the visual world it had established: an original illustrated emblem in four colorways, eight décor and keepsake concepts, and tablescape direction." },
        { text: "Launched Omoniyi Studio, a design practice for small businesses, with productized service tiers and a designed intake-to-booking journey.", link: { label: "Omoniyi Studio", to: "/studio" } },
      ] }] },
      { company: "Aretum", role: "UI/UX Designer", dates: "Mar 2024 – Jul 2026", projects: [
        { name: "U.S. House of Representatives", sub: "Voting Platform · Mar 2024 – Mar 2025", to: "/house", bullets: [
          { text: "Led end-to-end design of a new voting platform for all of Congress, turning an intricate legislative process into a clear, confident interaction." },
          { text: "Ran recurring discovery with House leadership and used interactive prototypes to align stakeholders before anything was built." },
          { text: "Built a 30+ component design system with documented states and behaviors that carried one consistent visual language across the product." },
        ] },
        { name: "Library of Congress", sub: "Copyright System Modernization · Mar 2025 – Jul 2026", to: "/library-of-congress", bullets: [
          { text: "Led discovery and research through interviews, journey mapping, and prototypes to redesign workflows for a system serving 100,000+ users and submissions." },
          { text: "Expanded the design system with components, tokens, and documentation, and designed accessible experiences for a public-facing federal service." },
        ] },
      ] },
      { company: "Coretec", role: "UI/UX Developer", dates: "Dec 2022 – Aug 2023", projects: [
        { name: "USDA", sub: "Enterprise System Modernization", to: "/usda", bullets: [
          { text: "Designed and coded a shared design system in Figma, Blazor, HTML, and CSS/SCSS, building the front-end components myself to keep design and build in sync." },
          { text: "Modernized tools used to collect data from 10,000+ farmers nationwide into accessible, responsive experiences." },
        ] },
      ] },
      { company: "Apex Systems", role: "UI/UX Developer", dates: "Oct 2021 – Jan 2023", projects: [
        { name: "Athletico", sub: "Patient Onboarding & Scheduling", to: "/athletico", bullets: [
          { text: "Redesigned the patient journey from registration to scheduling across desktop, tablet, and mobile for a multi-location provider." },
          { text: "Tested with 100+ participants and iterated the experience directly from what people did and said." },
        ] },
      ] },
      { company: "The Day Publishing", role: "Front-End Designer & Developer", dates: "Dec 2018 – Oct 2021", projects: [
        { name: "Digital Experience Design", bullets: [
          { text: "Designed and built responsive web experiences for 35+ organizations, leading discovery, content strategy, visual design, and front-end build end to end." },
          { text: "Partnered with clients from first conversation through launch, translating each organization’s identity into a distinct digital presence." },
        ] },
      ] },
      { company: "Birthright Africa", role: "Graphic Designer", dates: "Apr 2021 – Oct 2021", projects: [
        { name: "Cultural Engagement & Brand", bullets: [
          { text: "Designed visual systems, campaign assets, and web experiences for programs centered on African diaspora engagement and cultural education." },
          { text: "Kept one consistent visual world across print, social, and digital touchpoints through brand guidelines." },
        ] },
      ] },
    ],
    skills: [
      ["Experience design", "Interaction design, prototyping, world-building & narrative UX, journey mapping, multi-surface experiences"],
      ["Visual", "Visual systems, UI craft, typography, brand & graphic design, design systems as visual language"],
      ["Build", "HTML, CSS, JavaScript, React, Blazor, WordPress, Netlify, AI-assisted prototyping (Claude, OpenAI)"],
      ["Research & inclusion", "Usability testing, interviews, inclusive and accessible design (WCAG 2.1 AA) for public audiences"],
    ],
    education: ["Florida State University", "Bachelor of Social Work, 2016: human behavior, communities, and social systems"],
  },
};
