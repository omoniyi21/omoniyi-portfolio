import { ArrowRight } from "lucide-react";
import BackToPreviousPage from "../components/shared/BackToPreviousPage";
import "./project-case-study.css";

export default function ProjectCaseStudy({ study }) {
  return <main className="project-case">
    <section className="project-case__hero">
      <div className="project-case__bar"><BackToPreviousPage /><span>{study.breadcrumb}</span></div>
      <div className="project-case__hero-grid">
        <div className="project-case__intro"><p className="project-case__kicker">{study.eyebrow} <b>✦</b></p><h1>{study.title}</h1><p>{study.summary}</p><a href="#story">Read the case study <ArrowRight size={15}/></a></div>
        <div className="project-case__artifact" aria-label={`${study.client} product design artifacts`}><p>Project anatomy <span>— system, research, delivery</span></p><div className="project-case__artifact-bar"><b>{study.client}</b><span>Research · Design · Build</span></div><div className="project-case__artifact-cards"><article><small>01 / UNDERSTAND</small><b>{study.methods.slice(0, 2).join(" + ")}</b><i/></article><article><small>02 / DESIGN</small><b>{study.methods.slice(2, 4).join(" + ")}</b><i/></article><article><small>03 / VALIDATE</small><b>Accessible, responsive experience</b><i/></article></div></div>
        <div className="project-case__facts"><article><p>CLIENT</p><h2>{study.client}</h2></article><article><p>ROLE</p><h2>{study.role}</h2></article><article><p>USERS</p><h2>{study.users}</h2></article><article><p>DELIVERY</p><h2>{study.delivery}</h2></article></div>
      </div>
    </section>
    <section id="story" className="project-case__story"><p className="project-case__kicker">02 · THE STORY <b>✦</b></p><div><h2>{study.storyTitle}</h2><p>{study.story}</p></div><div className="project-case__evidence">{study.evidence.map(([number, title, body]) => <article key={title}><div className="project-case__evidence-visual"><span>{number}</span><i/><i/><i/></div><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    <section className="project-case__system"><div><p className="project-case__kicker">03 · THE SYSTEM <b>✦</b></p><h2>{study.systemTitle}</h2><p>{study.system}</p></div><div className="project-case__system-board"><div><span>FOUNDATIONS</span><span>COMPONENTS + PATTERNS</span></div><section>{study.methods.map((method) => <article key={method}>{method}</article>)}</section><footer><b>Designed for clarity, consistency, and implementation.</b><i/><i/><i/></footer></div></section>
    <section className="project-case__chapter"><p className="project-case__kicker">04 · WHAT I LEARNED <b>✦</b></p><h2>Design gets stronger when the real work stays visible.</h2><div className="project-case__learn-grid">{study.learnings.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    <section className="project-case__chapter"><p className="project-case__kicker">05 · DECISIONS THAT SHAPED THE PRODUCT <b>✦</b></p><h2>Small decisions create a more coherent experience.</h2><div className="project-case__decision-grid">{study.decisions.map(([number, title, body]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    <section className="project-case__chapter project-case__outcome"><p className="project-case__kicker">06 · OUTCOME + REFLECTION <b>✦</b></p><div><section><h2>Built around the people doing the work.</h2><p>{study.outcome}</p></section><blockquote>{study.reflection}</blockquote></div></section>
  </main>;
}
