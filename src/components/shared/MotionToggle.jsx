import useMotionReduced from "../../lib/useMotionReduced";
import { setMotionReduced } from "../../lib/motionPreference";

export default function MotionToggle({ className = "" }) {
  const reduced = useMotionReduced();
  return (
    <button
      type="button"
      className={`motion-toggle ${className}`.trim()}
      aria-pressed={reduced}
      onClick={() => setMotionReduced(!reduced)}
    >
      {reduced ? "motion: reduced" : "reduce motion"}
    </button>
  );
}
