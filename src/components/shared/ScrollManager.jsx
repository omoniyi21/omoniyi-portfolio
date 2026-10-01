import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    // Pages load on demand, so the target can appear a moment after the
    // route changes. Keep looking for it briefly instead of giving up.
    const id = decodeURIComponent(hash.slice(1));
    const started = performance.now();
    let frame;
    const seek = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ block: "start", behavior: "auto" });
      } else if (performance.now() - started < 2000) {
        frame = window.requestAnimationFrame(seek);
      }
    };
    frame = window.requestAnimationFrame(seek);

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
