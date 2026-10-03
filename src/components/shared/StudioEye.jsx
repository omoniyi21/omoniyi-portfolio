import "./studio-eye.css";

// The Omoniyi Studio eye mark, drawn from the "Studio Eye Mark" canvas:
// a rounded-square frame holding an eye under a lifted brow. The chosen
// state is lid B, "Knowing" (lid line at y=110 in a 200-unit box), at
// medium weight. Faint sketch lines stay in at 48px and up to show the
// drawing it came from; below that they would only blur the mark.
//
// `awake={false}` drops the lid to the drowsy position (y=128) and lowers
// the brow. Flipping it to true lifts both with a CSS transition, which is
// how the Studio curtain "opens" the eye on arrival. The sketch lid line
// stays put at the Knowing position, so the moving lid settles onto it.
const WEIGHTS = {
  light: { frame: 6, eye: 5, lid: 7, brow: 5 },
  medium: { frame: 12, eye: 9, lid: 11, brow: 8 },
  heavy: { frame: 18, eye: 13, lid: 16, brow: 12 },
};

const LID = 110; // B / Knowing
const BROW = 12; // default brow lift
const CORNER = 30;

export default function StudioEye({ size = 48, weight = "medium", sketch, awake = true, title, className = "" }) {
  const sw = WEIGHTS[weight] || WEIGHTS.medium;
  const showSketch = sketch ?? size >= 48;
  const by = 64 - BROW;
  const bp = 46 - BROW;
  const inset = sw.frame / 2 + 3;
  const labelled = Boolean(title);

  return (
    <svg
      className={`studio-eye${awake ? " is-awake" : ""}${className ? ` ${className}` : ""}`}
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : "true"}
      focusable="false"
    >
      <rect x={sw.frame / 2} y={sw.frame / 2} width={200 - sw.frame} height={200 - sw.frame} rx={CORNER} strokeWidth={sw.frame} />
      {showSketch && (
        <g className="studio-eye__sketch">
          <rect x={inset} y={inset} width={200 - inset * 2} height={200 - inset * 2} rx={CORNER} strokeWidth={Math.max(2.2, sw.frame * 0.32)} transform="rotate(-1.6 100 100)" />
          <circle cx="101.5" cy="110.5" r="40" strokeWidth={Math.max(1.8, sw.eye * 0.3)} />
          <path d={`M70 ${by + 3} Q102 ${bp + 2} 136 ${by - 1}`} strokeWidth={Math.max(1.8, sw.eye * 0.3)} />
          <path d={`M50 ${LID + 3} Q98 ${LID + 9} 141 ${LID + 4}`} strokeWidth={Math.max(1.8, sw.eye * 0.3)} />
        </g>
      )}
      <path className="studio-eye__brow" d={`M66 ${by} Q100 ${bp} 134 ${by}`} strokeWidth={sw.brow} />
      <circle cx="100" cy="112" r="38" strokeWidth={sw.eye} />
      <g className="studio-eye__lid">
        <path d={`M85 ${LID} A15 15 0 0 0 115 ${LID} Z`} fill="currentColor" stroke="none" />
        <path d={`M54 ${LID} Q100 ${LID + 4} 146 ${LID}`} strokeWidth={sw.lid} />
      </g>
    </svg>
  );
}
