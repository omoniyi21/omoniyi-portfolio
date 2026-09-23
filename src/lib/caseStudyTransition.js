import { flushSync } from "react-dom";
import { isMotionReduced } from "./motionPreference";

// Morphs the clicked work card into the case-study header using the
// browser's View Transitions API. Falls back to a normal link click when the
// API is missing, motion is reduced, or the click is modified (new tab etc.).
export function morphToCaseStudy(event, navigate, to) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (typeof document === "undefined" || !document.startViewTransition || isMotionReduced()) return;
  event.preventDefault();
  const card = event.currentTarget;
  card.style.viewTransitionName = "case-card";
  document.documentElement.classList.add("vt-case");
  const transition = document.startViewTransition(() => {
    card.style.viewTransitionName = "";
    flushSync(() => navigate(to));
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });
  transition.finished.finally(() => document.documentElement.classList.remove("vt-case"));
}
