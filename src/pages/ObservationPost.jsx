import { useRef } from "react";
import { useParams } from "react-router-dom";
import PenLink from "../components/shared/paper/PenLink";
import { isMotionReduced } from "../lib/motionPreference";
import { Icon } from "../components/shared/icons/Icon";
import { topicIcon } from "../components/shared/icons/topics";

import { getPublishedObservations } from "../data/observations";
import BeehiivEmbed from "../components/observations/BeehiivEmbed";
import Frog from "../assets/images/observations/frog.png";
import NotFound from "./NotFound";

function InlineLinks({ text }) {
  return text.split(/(\[[^\]]+\]\(https?:\/\/[^)]+\))/g).map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    return match ? <a key={index} href={match[2]}>{match[1]}</a> : part;
  });
}

export default function ObservationPost() {
 const { slug } = useParams();
 const post = getPublishedObservations().find(post => post.slug === slug);
 const titleRef = useRef(null);

 // Back to the top of the essay: scroll up (gently, unless motion is
 // reduced) and move keyboard focus to the title so the next Tab starts
 // from the top too.
 const backToTop = () => {
   window.scrollTo({ top: 0, behavior: isMotionReduced() ? "auto" : "smooth" });
   titleRef.current?.focus({ preventScroll: true });
 };
 if (!post) return <NotFound />;
 const { paragraphs = [], notes = {} } = post;
  return (
    <main className="observation-post">
      <header className="observation-post__masthead">
        <PenLink back className="observation-post__back" to="/observations">Observations</PenLink>
        <span>Field notes · vol. 03</span>
      </header>

      <article>
        <header className={`observation-post__header${post.cardImage ? " observation-post__header--cover" : ""}`}>
          <p className="topic-mark">OBS. {post.number} · {topicIcon(post.category) && <Icon name={topicIcon(post.category)} size={18} />}{post.category}</p>
          <div className="observation-post__title-group">
            <h1 ref={titleRef} tabIndex={-1}>{post.title}</h1>
            {post.cardImage && <figure className="observation-card__image observation-post__cover"><img src={post.cardImage} alt={post.cardImageAlt || ""} fetchPriority="high" /></figure>}
          </div>
          <p className="observation-post__dek">{post.excerpt}</p>
          <p className="observation-post__byline">Words by Omoniyi Alimi · {post.dateLabel}</p>
        </header>

        <div className="observation-post__rule" aria-hidden="true"><span>✦</span></div>
        <div className={`observation-post__reading${post.blocks ? ' observation-post__reading--sections' : ''}`}>
          {post.blocks?.map((block, index) => block.type === "heading"
            ? <h2 key={index}>{block.text}</h2>
            : block.type === "image"
            ? <figure className="observation-post__media" key={index}><img src={block.src} alt={block.alt} width={block.width} height={block.height} loading="lazy" /></figure>
            : <div className="observation-post__paragraph" key={index}><p><InlineLinks text={block.text} /></p></div>)}
          {paragraphs.map((paragraph, index) => (
            <div className="observation-post__paragraph" key={paragraph}>
              <p>{paragraph}</p>
              {notes[index] && <aside>{notes[index]}</aside>}
            </div>
          ))}
        </div>
        <footer className="observation-post__footer">
          <span>End of observation {post.number}</span>
          <div className="observation-post__footer-links">
            <PenLink to="/observations">More field notes</PenLink>
            <PenLink icon="arrow-up" onClick={backToTop}>Back to top</PenLink>
          </div>
        </footer>
      </article>

      <aside className="observation-post__signup" aria-label="Get the next Observation">
        <div className="observation-post__signup-fields">
          <div className="observation-post__signup-text">
            <p className="observation-post__signup-label">A note for you</p>
            <h3 className="observation-post__signup-heading">Let me send you<br />the next one?</h3>
          </div>
          <BeehiivEmbed className="observation-post__signup-embed" />
        </div>
        <img className="observation-post__signup-frog" src={Frog} alt="" aria-hidden="true" />
      </aside>
    </main>
  );
}
