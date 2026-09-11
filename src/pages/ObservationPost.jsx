import { Link, useParams } from "react-router-dom";

import { getPublishedObservations } from "../data/observations";
import NotFound from "./NotFound";

export default function ObservationPost() {
 const { slug } = useParams();
 const post = getPublishedObservations().find(post => post.slug === slug);
 if (!post) return <NotFound />;
 const { paragraphs, notes = {} } = post;
  return (
    <main className="observation-post">
      <header className="observation-post__masthead">
        <Link to="/observations">← Observations</Link>
        <span>Field notes · vol. 03</span>
      </header>

      <article>
        <header className="observation-post__header">
          <p>OBS. {post.number} · {post.category}</p>
          <h1>{post.title}</h1>
          <p className="observation-post__dek">{post.excerpt}</p>
          <p className="observation-post__byline">Words by Omoniyi Alimi · {post.dateLabel}</p>
        </header>

        <div className="observation-post__rule" aria-hidden="true"><span>✦</span></div>
        <div className="observation-post__reading">
          {paragraphs.map((paragraph, index) => (
            <div className="observation-post__paragraph" key={paragraph}>
              <p>{paragraph}</p>
              {notes[index] && <aside>{notes[index]}</aside>}
            </div>
          ))}
        </div>
        <footer className="observation-post__footer">
          <span>End of observation {post.number}</span>
          <Link to="/observations">More field notes ↗</Link>
        </footer>
      </article>
    </main>
  );
}
