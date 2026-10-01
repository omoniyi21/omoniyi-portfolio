import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useMotionReduced from "../../lib/useMotionReduced";
import "./work-slider.css";

import house640 from "../../assets/images/work-slider/house-640.webp";
import house1200 from "../../assets/images/work-slider/house-1200.webp";
import sultry640 from "../../assets/images/work-slider/sultry-640.webp";
import sultry1200 from "../../assets/images/work-slider/sultry-1200.webp";
import athletico640 from "../../assets/images/work-slider/athletico-640.webp";
import athletico1200 from "../../assets/images/work-slider/athletico-1200.webp";
import wedding640 from "../../assets/images/work-slider/wedding-640.webp";
import wedding1200 from "../../assets/images/work-slider/wedding-1200.webp";
import locSearch640 from "../../assets/images/work-slider/loc-search-640.webp";
import locSearch1200 from "../../assets/images/work-slider/loc-search-1200.webp";
import visual640 from "../../assets/images/work-slider/visual-640.webp";
import visual1200 from "../../assets/images/work-slider/visual-1200.webp";

// Real work, printed and pinned to the desk sheet. House and Sultry Tips
// open the row on purpose: a government system next to a lacquer logo is
// the range-and-restraint point in one glance.
const SLIDES = [
  { client: "U.S. House", caption: "A 0→1 voting platform for the U.S. House", to: "/house", small: house640, large: house1200, alt: "Committee Activity Portal home screen with referral, vote and roster summaries" },
  { client: "Sultry Tips", caption: "Two years later, still her mark", to: "/sultry-tips", small: sultry640, large: sultry1200, alt: "Glossy red 3D lettering spelling Sultry Tips" },
  { client: "Athletico", caption: "Patient onboarding, tested with ~100 people", to: "/athletico", small: athletico640, large: athletico1200, alt: "Athletico medical history step with treatment and test choices" },
  { client: "Wedding identity", caption: "One emblem, eight keepsakes, one week", to: "/wedding-identity", small: wedding640, large: wedding1200, alt: "A pomegranate emblem shown in four colorways" },
  { client: "U.S. Copyright Office", caption: "Shared patterns for Copyright Office tools", to: "/library-of-congress", small: locSearch640, large: locSearch1200, alt: "Copyright Office search with the search index menu open" },
  { client: "Illustration", caption: "Original illustration and lettering", to: "/visual", small: visual640, large: visual1200, alt: "Illustrated room with a window, lamp and clothing rack" },
];

const TOTAL = SLIDES.length + 1; // + the "see all work" card

export default function WorkSlider() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const reduceMotion = useMotionReduced();

  // The track is a native scroll-snap row, so swiping, trackpads and
  // keyboard scrolling all just work. The count follows whichever card is
  // closest to the left edge.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cards = [...track.children];
        const left = track.getBoundingClientRect().left;
        let best = 0;
        let bestDistance = Infinity;
        cards.forEach((card, i) => {
          const distance = Math.abs(card.getBoundingClientRect().left - left);
          if (distance < bestDistance) { bestDistance = distance; best = i; }
        });
        setActive(best);
      });
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const goTo = useCallback((index) => {
    const track = trackRef.current;
    const card = track?.children[Math.max(0, Math.min(index, TOTAL - 1))];
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - track.firstElementChild.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion]);

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); }
  };

  return (
    <section className="work-slider" aria-labelledby="work-slider-title">
      <div className="work-slider__intro">
        <p id="work-slider-title" className="work-slider__eyebrow">
          <span>Selected Work</span>
          <span aria-hidden="true">✦</span>
        </p>
        <span className="work-slider__count" aria-live="polite">
          {active + 1} / {TOTAL}
        </span>
        <div className="work-slider__controls">
          <button type="button" aria-label="Previous project" aria-controls="work-slider-track" disabled={active === 0} onClick={() => goTo(active - 1)}>←</button>
          <button type="button" aria-label="Next project" aria-controls="work-slider-track" disabled={active >= TOTAL - 1} onClick={() => goTo(active + 1)}>→</button>
        </div>
      </div>

      <ul className="work-slider__track" id="work-slider-track" ref={trackRef} onKeyDown={onKeyDown} aria-label="Selected projects. Use the arrow keys or swipe to browse.">
        {SLIDES.map((slide, i) => (
          <li className="work-slide" key={slide.to}>
            <Link className="work-slide__link" to={slide.to}>
              <span className="work-slide__photo">
                <img
                  src={slide.small}
                  srcSet={`${slide.small} 640w, ${slide.large} 1200w`}
                  sizes="(max-width: 980px) 82vw, 34vw"
                  width="1200"
                  height="900"
                  alt={slide.alt}
                  loading={i < 2 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : undefined}
                  decoding="async"
                />
              </span>
              <span className="work-slide__client">{slide.client}</span>
              <span className="work-slide__caption">{slide.caption} <span aria-hidden="true">↗</span></span>
            </Link>
          </li>
        ))}
        <li className="work-slide work-slide--end">
          <Link className="work-slide__link work-slide__all" to="/work">
            <span className="work-slide__all-note">there’s more where these came from</span>
            <span className="work-slide__all-label">See all work <span aria-hidden="true">→</span></span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
