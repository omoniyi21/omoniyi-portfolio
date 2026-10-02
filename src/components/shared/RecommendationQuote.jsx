import { useState } from "react";
import PenLink from "./paper/PenLink";
import { Icon } from "./icons/Icon";
import { recommendations } from "../../data/recommendations";
import "./recommendation-quote.css";

// One recommendation on screen at a time; the arrows wrap around.
export default function RecommendationQuote() {
  const [index, setIndex] = useState(0);
  const total = recommendations.length;
  const rec = recommendations[index];
  const go = (step) => setIndex((i) => (i + step + total) % total);

  return (
    <figure className="rec-quote" aria-roledescription="carousel" aria-label="Recommendations">
      <div className="rec-quote__top">
        <p className="rec-quote__kicker">{rec.kicker} <b aria-hidden="true">✦</b></p>
        {total > 1 && (
          <div className="rec-quote__arrows">
            <button type="button" aria-label="Previous recommendation" onClick={() => go(-1)}>
              <Icon name="arrow-left" size={18} strokeWidth={1.5} />
            </button>
            <span className="rec-quote__count" aria-hidden="true">{index + 1} / {total}</span>
            <button type="button" aria-label="Next recommendation" onClick={() => go(1)}>
              <Icon name="arrow-right" size={18} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
      <div key={rec.name} className="rec-quote__slide" aria-live="polite">
        <blockquote className="rec-quote__text">“{rec.systems}”</blockquote>
        <figcaption className="rec-quote__cite">
          <strong>{rec.name}</strong>
          <span>{rec.title} · {rec.relationship}</span>
          <PenLink className="rec-quote__link" href={rec.source}>Read on LinkedIn</PenLink>
        </figcaption>
      </div>
    </figure>
  );
}
