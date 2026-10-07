import { Link } from "react-router-dom";
import { Icon } from "../components/shared/icons/Icon";
import { topicIcon } from "../components/shared/icons/topics";
import Thinking from "../assets/branding/sd-variants/sd-thinking.webp";

import { getPublishedObservations } from "../data/observations";
import ObservationCover from "../components/observations/ObservationCover";

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
        <div className="observation-card__topline"><span>OBS. {post.number}</span><span className="topic-mark">{topicIcon(post.category) && <Icon name={topicIcon(post.category)} size={18} />}{post.category}</span></div>
        <div className="observation-card__body">
          <div className="observation-card__copy"><h2>{post.title}</h2><p className="observation-card__excerpt">{post.excerpt}</p></div>
          {post.cardImage && <figure className="observation-card__image"><ObservationCover post={post} /></figure>}
        </div>
        <div className="observation-card__footer"><span>Read observation</span><Icon name="arrow-right" size={16} strokeWidth={1.5} /></div>
      </Link>)}
    </section>
  </main>;
}
