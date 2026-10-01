import PenLink from "./paper/PenLink";
import { tylerRecommendation as rec } from "../../data/recommendations";
import "./recommendation-quote.css";

export default function RecommendationQuote() {
  return (
    <figure className="rec-quote" aria-label="Recommendation">
      <p className="rec-quote__kicker">From a manager <b aria-hidden="true">✦</b></p>
      <blockquote className="rec-quote__text">“{rec.systems}”</blockquote>
      <figcaption className="rec-quote__cite">
        <strong>{rec.name}</strong>
        <span>{rec.title} · {rec.relationship}</span>
        <PenLink className="rec-quote__link" href={rec.source}>Read on LinkedIn</PenLink>
      </figcaption>
    </figure>
  );
}
