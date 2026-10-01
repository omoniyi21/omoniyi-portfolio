import { useEffect } from "react";
import { isMotionReduced, onMotionPreferenceChange } from "./motionPreference";

// Below the hero, each section's pieces arrive in reading order as it
// scrolls into view: heading first, then what follows, each rising a few
// pixels and fading in, 80ms apart. It happens once per section, and
// the hero and anything already on screen never animate.
//
// The CSS (see reveal.css) does the motion with transitions, so a section
// that is scrolled past quickly simply finishes; nothing restarts.
// Content is fully visible without JS, with reduced motion, and the
// moment keyboard focus lands inside a section.
const SECTIONS = {
  ".rec-quote": ":scope > *",
  ".process-section": ".process-section__opening, .process-section__grid > li",
  ".personal-effects": ":scope > *",
  ".observations-notebook": ":scope > *",
  ".write-me": ":scope > *",
};

export default function useSectionReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const systemMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => systemMotion.matches || isMotionReduced();
    if (reduced()) return;

    const prepared = [];
    // Read all geometry first, then write classes, so layout is read once.
    const candidates = Object.entries(SECTIONS).flatMap(([selector, items]) =>
      [...root.querySelectorAll(selector)].map((section) => ({ section, items })),
    );
    const below = candidates.filter(({ section }) => section.getBoundingClientRect().top > window.innerHeight);

    for (const { section, items } of below) {
      section.querySelectorAll(items).forEach((item, index) => {
        item.classList.add("reveal-item");
        item.style.setProperty("--reveal-i", Math.min(index, 5));
      });
      section.classList.add("reveal");
      prepared.push(section);
    }

    const show = (section) => section.classList.add("is-revealed");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        show(entry.target);
      }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0 });
    prepared.forEach((section) => observer.observe(section));

    const showAll = () => {
      observer.disconnect();
      prepared.forEach(show);
    };
    const onMotionChange = () => { if (reduced()) showAll(); };
    const onFocus = (event) => {
      const section = event.target.closest(".reveal");
      if (section) show(section);
    };

    const unsubscribe = onMotionPreferenceChange(onMotionChange);
    systemMotion.addEventListener("change", onMotionChange);
    root.addEventListener("focusin", onFocus);
    return () => {
      observer.disconnect();
      unsubscribe();
      systemMotion.removeEventListener("change", onMotionChange);
      root.removeEventListener("focusin", onFocus);
      prepared.forEach((section) => {
        section.classList.remove("reveal", "is-revealed");
        section.querySelectorAll(".reveal-item").forEach((item) => {
          item.classList.remove("reveal-item");
          item.style.removeProperty("--reveal-i");
        });
      });
    };
  }, [rootRef]);
}
