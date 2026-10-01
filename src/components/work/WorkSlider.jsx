import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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

const COUNT = SLIDES.length;
// Three copies in a row: the middle one is real, the outer two are
// stand-ins so the row can keep going in either direction. Whenever the
// scroll comes to rest inside a stand-in, it hops (invisibly) to the same
// card in the middle copy, so the loop never runs out.
const LOOP = [0, 1, 2].flatMap((copy) => SLIDES.map((slide, i) => ({ ...slide, copy, i })));

const leftOf = (track, index) => {
  const card = track?.children[index];
  return card ? card.offsetLeft - track.firstElementChild.offsetLeft : 0;
};

export default function WorkSlider() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const reduceMotion = useMotionReduced();


  // Start on the first real card (the middle copy).
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollLeft = leftOf(track, COUNT);
  }, []);

  // Let the row run past the paper's edge to the edge of the window,
  // instead of stopping at the column.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      track.style.setProperty("--bleed", "0px");
      const right = track.getBoundingClientRect().right;
      const viewport = document.documentElement.clientWidth;
      track.style.setProperty("--bleed", `${Math.max(0, viewport - right)}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame;
    let settle;
    const nearest = () => {
      const left = track.getBoundingClientRect().left;
      let best = 0;
      let bestDistance = Infinity;
      [...track.children].forEach((card, i) => {
        const distance = Math.abs(card.getBoundingClientRect().left - left - parseFloat(getComputedStyle(track).scrollPaddingLeft || 0));
        if (distance < bestDistance) { bestDistance = distance; best = i; }
      });
      return best;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(nearest() % COUNT));
      clearTimeout(settle);
      settle = setTimeout(() => {
        const index = nearest();
        if (index < COUNT || index >= COUNT * 2) {
          const twin = COUNT + (index % COUNT);
          track.style.scrollSnapType = "none";
          track.scrollLeft += leftOf(track, twin) - leftOf(track, index);
          requestAnimationFrame(() => { track.style.scrollSnapType = ""; });
        }
      }, 140);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  const step = useCallback((dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[COUNT + active];
    const next = track.children[COUNT + active + dir];
    if (!card || !next) return;
    track.scrollBy({ left: next.offsetLeft - card.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
  }, [active, reduceMotion]);

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
  };

  return (
    <section className="work-slider" aria-labelledby="work-slider-title">
      <div className="work-slider__intro">
        <p id="work-slider-title" className="work-slider__eyebrow">
          <span>Selected Work</span>
          <span aria-hidden="true">✦</span>
        </p>
        <span className="work-slider__count" aria-live="polite">
          {active + 1} / {COUNT}
        </span>
        <Link className="work-slider__all" to="/work">See all work <span aria-hidden="true">→</span></Link>
        <div className="work-slider__controls">
          <button type="button" aria-label="Previous project" aria-controls="work-slider-track" onClick={() => step(-1)}>←</button>
          <button type="button" aria-label="Next project" aria-controls="work-slider-track" onClick={() => step(1)}>→</button>
        </div>
      </div>

      <ul className="work-slider__track" id="work-slider-track" ref={trackRef} onKeyDown={onKeyDown} aria-label="Selected projects. Use the arrow keys or swipe to browse.">
        {LOOP.map((slide) => {
          const real = slide.copy === 1;
          return (
            <li className={`work-slide work-slide--${slide.i % 2 ? "even" : "odd"}`} key={`${slide.copy}-${slide.to}`} aria-hidden={real ? undefined : true}>
              <Link className="work-slide__link" to={slide.to} tabIndex={real ? undefined : -1}>
                <span className="work-slide__photo">
                  <img
                    src={slide.small}
                    srcSet={`${slide.small} 640w, ${slide.large} 1200w`}
                    sizes="(max-width: 980px) 82vw, 34vw"
                    width="1200"
                    height="900"
                    alt={real ? slide.alt : ""}
                    loading={real && slide.i < 2 ? "eager" : "lazy"}
                    fetchPriority={real && slide.i === 0 ? "high" : undefined}
                    decoding="async"
                  />
                </span>
                <span className="work-slide__client">{slide.client}</span>
                <span className="work-slide__caption">{slide.caption} <span aria-hidden="true">↗</span></span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
