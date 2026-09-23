import { useEffect, useRef, useState } from "react";
import "./pen-mark.css";

const PATHS = {
  underline: "M2 9 C 40 4, 90 12, 140 6 S 196 5, 198 8",
  circle: "M104 6 C 40 2, 6 14, 8 26 C 10 40, 70 46, 130 42 C 186 38, 198 24, 190 14 C 180 4, 130 2, 92 8",
};

// A hand-drawn mark that inks itself once, the first time it scrolls into
// view. Purely decorative (aria-hidden); the annotation it sits under stays
// real text. Reduced motion shows it already drawn.
export default function PenMark({ variant = "underline", color = "currentColor", className = "" }) {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setDrawn(true); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setDrawn(true); io.disconnect(); }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <svg
      ref={ref}
      className={`pen-mark pen-mark--${variant}${drawn ? " is-drawn" : ""} ${className}`.trim()}
      viewBox={variant === "circle" ? "0 0 200 48" : "0 0 200 14"}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[variant]} pathLength="1" style={{ stroke: color }} />
    </svg>
  );
}
