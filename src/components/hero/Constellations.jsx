import { CONSTELLATIONS } from "../../data/constellations";
import "./constellations.css";

// Scorpius (sun + rising) and Aquarius's Water Jar (moon), hand-drawn in ink
// in the sheet's margins, never behind the writing. Linework is fixed path
// data generated from real star positions (scripts/constellations.mjs).
// It draws itself in once on load and then stays still; with reduced motion
// it is simply there, fully drawn.
function Figure({ figure, className, label, note, noteSide = "left" }) {
  const { w, h, segments, marks } = CONSTELLATIONS[figure];
  return (
    <figure className={`constellation ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${w} ${h}`} focusable="false">
        <g className="constellation__lines">
          {segments.map((d, i) => (
            <path key={d} d={d} pathLength="1" style={{ "--i": i }} />
          ))}
        </g>
        <g className="constellation__stars">
          {marks.map((m, i) => (
            <circle
              key={m.k}
              cx={m.x}
              cy={m.y}
              r={m.r}
              className={m.name === "Antares" ? "is-antares" : undefined}
              style={{ "--i": i }}
            />
          ))}
        </g>
        {marks.filter((m) => m.name).map((m) => (
          <text key={`label-${m.k}`} className="constellation__star-name" x={m.x + 8} y={m.y + 4}>{m.name}</text>
        ))}
      </svg>
      <figcaption className={`constellation__note constellation__note--${noteSide}`}>
        <span>{note}</span>
        <small>{label}</small>
      </figcaption>
    </figure>
  );
}

export default function Constellations() {
  return (
    <>
      <Figure figure="scorpius" className="constellation--scorpius" label="Scorpius" note="sun + rising" />
      <Figure figure="aquarius" className="constellation--aquarius" label="Aquarius" note="moon" />
    </>
  );
}
