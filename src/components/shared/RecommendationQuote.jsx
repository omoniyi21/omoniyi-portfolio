import { ArrowUpRight } from "lucide-react";
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
        <a href={rec.source} target="_blank" rel="noopener noreferrer">
          Read on LinkedIn <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}
