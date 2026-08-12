import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import referralDashboard from "../assets/images/house-committee/referral-dashboard.png";
import "./work.css";

const work = [
  {
    number: "01",
    client: "U.S. House",
    year: "2024–2025",
    title: "Modernizing legislative workflows for the web.",
    tags: "Product design · Research · Systems · Government",
    to: "/house",
    type: "house",
  },
  {
    number: "02",
    client: "USDA",
    title: "Enterprise systems",
    tags: "Government",
    to: "/usda",
    type: "usda",
  },
  {
    number: "03",
    client: "Athletico",
    title: "Patient registration",
    tags: "Healthcare",
    to: "/athletico",
    type: "athletico",
  },
  {
    number: "04",
    client: "Library of Congress",
    title: "Modernizing systems that support discovery.",
    tags: "Government · Design systems",
    to: "/library-of-congress",
    type: "loc",
  },
];

function ProjectVisual({ type }) {
  if (type === "house") {
    return <div className="work-visual work-visual--house"><img src={referralDashboard} alt="Committee Referrals dashboard" /></div>;
  }

  if (type === "usda") {
    return <div className="work-visual work-visual--usda" aria-hidden="true"><span>USDA NASS</span><div/><div/><div/><i/></div>;
  }

  if (type === "athletico") {
    return <div className="work-visual work-visual--athletico" aria-hidden="true"><span>Welcome</span><div/><div/><i>Continue</i></div>;
  }

  return <div className="work-visual work-visual--loc" aria-hidden="true"><span>ECS</span><div/><div/><div/><i/></div>;
}

export default function Work() {
  return <main className="work-page">
    <section className="work-page__header">
      <p>Selected work <span>✦</span></p>
      <h1>Systems made <em>navigable.</em></h1>
      <p>I design digital products that make complex work feel clear, useful, and human.</p>
    </section>

    <section className="work-bento" aria-label="Case studies">
      {work.map((project) => (
        <Link className={`work-card work-card--${project.type}`} key={project.client} to={project.to}>
          <div className="work-card__meta"><span>{project.number}</span><span>{project.year}</span></div>
          <h2>{project.client}</h2>
          <ProjectVisual type={project.type} />
          <p className="work-card__title">{project.title}</p>
          <footer><span>{project.tags}</span><ArrowUpRight aria-hidden="true" /></footer>
        </Link>
      ))}
    </section>
  </main>;
}
