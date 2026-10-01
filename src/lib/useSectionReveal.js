import { useEffect } from "react";
import { isMotionReduced, onMotionPreferenceChange } from "./motionPreference";

const SECTIONS = ".process-section, .rec-quote, .personal-effects, .observations-notebook, .write-me";

// Content stays visible without this enhancement. One observer, no scroll
// handlers or React updates; each section is released after its first reveal.
export default function useSectionReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const systemMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => systemMotion.matches || isMotionReduced();
    const animations = new Map();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (reduced() || entry.target.contains(document.activeElement)) continue;
        if (typeof entry.target.animate !== "function") continue;
        const animation = entry.target.animate(
          [{ opacity: 0, translate: "0 12px" }, { opacity: 1, translate: "0 0" }],
          { duration: 320, easing: "cubic-bezier(.2,.65,.3,1)" },
        );
        animations.set(entry.target, animation);
        animation.onfinish = () => animations.delete(entry.target);
      }
    }, { rootMargin: "0px 0px 48px 0px", threshold: 0 });

    // Read geometry before observing. Never animate the initial viewport or
    // content above it, including when returning to a saved scroll position.
    const sections = [...root.querySelectorAll(SECTIONS)];
    const belowFold = sections.filter(section => section.getBoundingClientRect().top >= window.innerHeight + 48);
    if (!reduced()) belowFold.forEach(section => observer.observe(section));

    const stopMotion = () => {
      if (!reduced()) return;
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    const revealFocused = (event) => {
      const section = event.target.closest(SECTIONS);
      if (!section) return;
      observer.unobserve(section);
      animations.get(section)?.cancel();
      animations.delete(section);
    };
    const unsubscribe = onMotionPreferenceChange(stopMotion);
    systemMotion.addEventListener("change", stopMotion);
    root.addEventListener("focusin", revealFocused);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      unsubscribe();
      systemMotion.removeEventListener("change", stopMotion);
      root.removeEventListener("focusin", revealFocused);
    };
  }, [rootRef]);
}
