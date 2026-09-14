import { useState } from "react";
import "./current-favorites-slider.css";

import ReadingPaper from "../../assets/images/personal-effects-refined/reading-paper-v2-trim.png";
import WatchingPaper from "../../assets/images/personal-effects-refined/watching-paper-v2-trim.png";
import MovieTicket from "../../assets/images/personal-effects-refined/movie-ticket-v2-trim.png";
import ScentPaper from "../../assets/images/personal-effects-refined/scent-paper-v3-trim.png";
import RitualPaper from "../../assets/images/personal-effects-refined/ritual-paper-v3-trim.png";
import ThoughtPaper from "../../assets/images/personal-effects-refined/thought-paper-v3-trim.png";
import Podcast from "../../assets/images/personal-effects-refined/podcast-paper-v3-trim.png";
import Playlist from "../../assets/images/personal-effects-refined/playlist-paper-v3-trim.png";

// The same photographed desk artifacts used in Personal Effects on the
// homepage, one at a time — each item's rotation/contentRotation/inset
// values are carried over from personal-effects.css so the overlay text
// still lands on the same blank area of each photo, just scaled up for a
// single, larger, standalone slide instead of a small collage slot.
const artifacts = [
  { key: "reading", src: ReadingPaper, rotation: -3, contentRotation: 3, inset: "29% 14% 14% 18%", eyebrow: "Currently reading", title: "The Artist’s Way", detail: "Julia Cameron" },
  { key: "watching", src: WatchingPaper, rotation: 0, contentRotation: 0, inset: "18% 9% 10% 9%", eyebrow: "Currently watching", title: "FROM + Furious", detail: "On MGM+ and Hulu" },
  { key: "movie", src: MovieTicket, rotation: 4, contentRotation: 0, inset: "20% 16% 17% 14%", eyebrow: "Current movie obsession", title: "I Love Boosters", detail: "The movie that lives in my head rent free." },
  { key: "scent", src: ScentPaper, rotation: -1, contentRotation: 1, inset: "17% 29% 16% 16%", eyebrow: "Current scent", title: "Ode to Dullness", detail: "Juliette Has a Gun · woody, musky, warm" },
  { key: "ritual", src: RitualPaper, rotation: 0, contentRotation: 0, inset: "17% 15% 12% 15%", eyebrow: "Current ritual", title: "Coffee with honey, a little salt", detail: "Then walking the dogs.", light: true },
  { key: "thought", src: ThoughtPaper, rotation: -2, contentRotation: 2, inset: "25% 15% 18% 15%", eyebrow: "Current thought", title: "Design should feel inevitable.", detail: "" },
  { key: "podcast", src: Podcast, rotation: 2, contentRotation: -2, inset: "20% 12% 15% 12%", eyebrow: "Podcast rec", title: "Good Noticings", detail: "with Ashley & Claire" },
  { key: "playlist", src: Playlist, rotation: 4, contentRotation: -4, inset: "16% 14% 12% 14%", eyebrow: "On repeat", title: "Julia Wolf · Sade · Asake", detail: "In My Room · By Your Side · MBHC", light: true },
];

export default function CurrentFavoritesSlider() {
  const [index, setIndex] = useState(0);

  const go = (dir) => {
    setIndex((current) => {
      const next = current + dir;
      return next < 0 || next > artifacts.length - 1 ? current : next;
    });
  };

  const item = artifacts[index];

  return (
    <section className="favorites-slider" aria-labelledby="favorites-slider-title">
      <div className="favorites-slider__intro">
        <p id="favorites-slider-title" className="favorites-slider__eyebrow">
          <span>What’s On My Mind</span>
          <span className="favorites-slider__glyph" aria-hidden="true">✦</span>
        </p>
        <span className="favorites-slider__count">
          {String(index + 1).padStart(2, "0")} / {String(artifacts.length).padStart(2, "0")}
        </span>
        <div className="favorites-slider__controls" aria-label="Browse current favorites">
          <button type="button" aria-label="Previous favorite" aria-controls="favorites-stage" disabled={index <= 0} onClick={() => go(-1)}>←</button>
          <button type="button" aria-label="Next favorite" aria-controls="favorites-stage" disabled={index >= artifacts.length - 1} onClick={() => go(1)}>→</button>
        </div>
      </div>

      <div className="favorites-slider__stage" id="favorites-stage" role="group" aria-label="Current favorite artifacts">
        <figure
          key={item.key}
          className={`favorites-slider__artifact${item.light ? " is-light" : ""}`}
          style={{ "--rotation": `${item.rotation}deg`, "--content-rotation": `${item.contentRotation}deg`, "--content-inset": item.inset }}
        >
          <img src={item.src} alt="" />
          <figcaption>
            <p className="favorites-slider__eyebrow-tag">{item.eyebrow}</p>
            <h3>{item.title}</h3>
            {item.detail && <p className="favorites-slider__detail">{item.detail}</p>}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
