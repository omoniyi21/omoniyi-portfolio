import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
