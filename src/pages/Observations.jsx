import { Link } from "react-router-dom";
import Thinking from "../assets/branding/sd-variants/sd-thinking.png";

import { getPublishedObservations } from "../data/observations";

export default function Observations() {
  return <main className="observations-page">
    <header><p><b>04</b> Observations (Blog) <i>✦</i></p><span>Field notes · vol. 03</span></header>
    <section className="observations-page__hero">
      <p className="observations-page__eyebrow">A living record</p>
      <h1>Things I’m <em>noticing.</em></h1>
      <p>Notes on systems, stories, design, and everything that makes a life feel more considered.</p>
      <img src={Thinking} alt="SD thinking things over" />
    </section>
    <section className="observation-index" aria-label="Published observations">
      <p className="observation-index__kicker">Latest field note</p>
      {getPublishedObservations().map(post => <Link key={post.slug} className="observation-card" to={`/observations/${post.slug}`}>
        <div className="observation-card__topline"><span>OBS. {post.number}</span><span>{post.category}</span></div>
        <div className="observation-card__body"><h2>{post.title}</h2><p className="observation-card__excerpt">{post.excerpt}</p></div>
        <div className="observation-card__footer"><span>Read observation</span><span aria-hidden="true">↗</span></div>
      </Link>)}
    </section>
  </main>;
}
