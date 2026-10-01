import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PenLink from "../shared/paper/PenLink";
import "./work-slider.css";

import tape from "../../assets/images/observations/gingham-tape.webp";
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
import { Icon } from "../shared/icons/Icon";

// Selected Work as a small pile of prints on the desk sheet. Every print is
// the same component (border, tape, label, margin note); only the paper
// stock changes with the project, like a palette per environment. The
// variables change, the identity holds.
const WORK = {
  house: { client: "U.S. House", role: "UI/UX Designer", years: "2024–25", caption: "A 0 to 1 voting platform for the U.S. House", note: "paper votes to one digital record", to: "/house", small: house640, large: house1200, stock: "#c3cfdc", alt: "Committee Activity Portal home screen with referral, vote and roster summaries" },
  sultry: { client: "Sultry Tips", role: "Logo & lettering", years: "2024", caption: "Two years later, still her mark", note: "lacquer, not a nail icon", to: "/sultry-tips", small: sultry640, large: sultry1200, stock: "#f1ece0", alt: "Glossy red 3D lettering spelling Sultry Tips" },
  athletico: { client: "Athletico", role: "UI developer", years: "2021–23", caption: "Patient onboarding, tested with about 100 people", note: "the first step of care", to: "/athletico", small: athletico640, large: athletico1200, stock: "#c4d8ec", alt: "Athletico medical history step with treatment and test choices" },
  wedding: { client: "Wedding identity", role: "Creative direction", years: "2026", caption: "One emblem, eight keepsakes, one week", note: "two heritages, one emblem", to: "/wedding-identity", small: wedding640, large: wedding1200, stock: "#f1ece0", alt: "A pomegranate emblem shown in four colorways" },
  loc: { client: "U.S. Copyright Office", role: "Design system lead", years: "2025–26", caption: "Shared patterns for Copyright Office tools", note: "one way to search, everywhere", to: "/library-of-congress", small: locSearch640, large: locSearch1200, stock: "#c9d0e2", alt: "Copyright Office search with the search index menu open" },
  visual: { client: "Illustration", role: "OMDesigns archive", years: "", caption: "Original illustration and lettering", note: "where it started", to: "/visual", small: visual640, large: visual1200, stock: "#f1ece0", alt: "Illustrated room with a window, lamp and clothing rack" },
};

// The persona toggle in the hero reorders the pile: product work first for
// someone hiring, brand and illustration first for someone building.
const ORDER = {
  hiring: ["house", "sultry", "athletico", "wedding", "loc", "visual"],
  building: ["sultry", "wedding", "visual", "house", "athletico", "loc"],
};

// constellation pager: one star per print, on a gentle zigzag
const STAR_Y = [20, 9, 23, 11, 21, 13];
const STAR_PATH = "M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z";

export default function WorkSlider({ persona = "hiring" }) {
  const order = ORDER[persona] || ORDER.hiring;
  const count = order.length;
  const [current, setCurrent] = useState(0);
  const swipe = useRef(null);
  const swiped = useRef(false);
  const [lastPersona, setLastPersona] = useState(persona);

  // a new persona starts the pile from its own first print
  if (persona !== lastPersona) {
    setLastPersona(persona);
    setCurrent(0);
  }

  // Every print always has a destination (on top, behind, or set aside to
  // the left), and CSS transitions move it there. Clicking quickly just
  // changes the destination mid-move, so nothing restarts or stutters.
  const go = useCallback((dir) => setCurrent((i) => (i + dir + count) % count), [count]);
  const jump = (index) => setCurrent(index);

  const onKeyDown = (event) => {
    if (event.target.closest(".print-pile__star")) return;
    if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
  };

  const onPointerDown = (event) => {
    swipe.current = { x: event.clientX, y: event.clientY };
    swiped.current = false;
  };
  const onPointerUp = (event) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(event.clientY - start.y)) {
      swiped.current = true;
      go(dx < 0 ? 1 : -1);
    }
  };
  // a swipe should not also count as a click on the print
  const onClickCapture = (event) => {
    if (swiped.current) {
      event.preventDefault();
      swiped.current = false;
    }
  };

  const active = WORK[order[current]];
  // 44px apart so every star gets a full 44px tap target
  const starX = order.map((_, i) => 22 + i * 44);

  return (
    <section
      className="print-pile"
      aria-roledescription="carousel"
      aria-labelledby="print-pile-title"
      onKeyDown={onKeyDown}
    >
      <div className="print-pile__head">
        <p id="print-pile-title" className="print-pile__eyebrow">
          <span>Selected Work</span>
          <span aria-hidden="true">✦</span>
        </p>
        <div className="print-pile__stars" style={{ "--w": `${starX[count - 1] + 22}px` }}>
          <svg className="print-pile__line" viewBox={`0 0 ${starX[count - 1] + 22} 32`} aria-hidden="true" focusable="false">
            <polyline points={starX.map((x, i) => `${x},${STAR_Y[i]}`).join(" ")} />
          </svg>
          <div role="group" aria-label="Choose a project">
            {order.map((key, i) => (
              <button
                key={key}
                type="button"
                className="print-pile__star"
                style={{ "--x": `${starX[i]}px`, "--y": `${STAR_Y[i]}px` }}
                aria-label={`Project ${i + 1} of ${count}: ${WORK[key].client}`}
                aria-current={i === current ? "true" : undefined}
                onClick={() => jump(i)}
              >
                <svg viewBox="-6 -6 12 12" aria-hidden="true" focusable="false"><path d={STAR_PATH} /></svg>
              </button>
            ))}
          </div>
        </div>
        <div className="print-pile__arrows">
          <button type="button" aria-label="Previous project" onClick={() => go(-1)}><Icon name="arrow-left" size={18} strokeWidth={1.5} /></button>
          <button type="button" aria-label="Next project" onClick={() => go(1)}><Icon name="arrow-right" size={18} strokeWidth={1.5} /></button>
        </div>
      </div>

      <div className="print-pile__stack" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onClickCapture={onClickCapture}>
        {order.map((key, i) => {
          const work = WORK[key];
          const rel = (i - current + count) % count;
          // 0 on top, 1 and 2 behind it, the one before set aside to the
          // left, the rest tucked under the pile out of sight
          const place = rel <= 2 ? `depth-${rel}` : rel === count - 1 ? "aside" : "under";
          const onTop = rel === 0;
          return (
            <article
              key={key}
              className={`print print--${place}`}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${work.caption}`}
              aria-hidden={onTop ? undefined : true}
              style={{ "--stock": work.stock }}
            >
              <Link className="print__link" to={work.to} tabIndex={onTop ? undefined : -1} draggable="false">
                <span className="print__paper">
                  <img
                    src={work.small}
                    srcSet={`${work.small} 640w, ${work.large} 1200w`}
                    sizes="(max-width: 980px) 90vw, 42vw"
                    width="1200"
                    height="900"
                    alt={work.alt}
                    loading={rel <= 1 ? "eager" : "lazy"}
                    fetchPriority={onTop ? "high" : undefined}
                    decoding="async"
                    draggable="false"
                  />
                  <span className="print__peel" aria-hidden="true"><span><Icon name="arrow-right" size={18} strokeWidth={1.5} /></span></span>
                </span>
                <img className="print__tape" src={tape} alt="" aria-hidden="true" draggable="false" />
              </Link>
            </article>
          );
        })}

        <div className="print-pile__note" key={`note-${order[current]}`} aria-hidden="true">
          <p>{active.note}</p>
          <svg viewBox="0 0 40 40"><path d="M4 6 C 14 8, 24 16, 30 30" /><path d="M22 28 L 30 31 L 32 22" /></svg>
        </div>
      </div>

      <div className="print-pile__label" aria-live="polite">
        <p className="print-pile__meta">
          <b>No. {String(current + 1).padStart(2, "0")}</b> · {active.client} · {active.role}{active.years ? ` · ${active.years}` : ""}
        </p>
        <Link className="print-pile__caption" to={active.to}>
          {active.caption} <span><Icon name="arrow-right" size={20} strokeWidth={1.5} /></span>
        </Link>
      </div>

      <PenLink className="print-pile__shelf" to="/work">the full shelf</PenLink>
    </section>
  );
}
