import { useEffect, useRef } from "react";

// Keep the newsletter's third-party work off the initial page-load path.
export default function BeehiivEmbed({ className }) {
  const form = useRef(null);
  useEffect(() => {
    const host = form.current;
    let mounted = false;
    const labelFrames = () => host.querySelectorAll('iframe').forEach(frame => {
      if (!frame.title) frame.title = 'Subscribe to Observations';
    });
    const frames = new MutationObserver(labelFrames);
    const mount = () => {
      if (mounted) return;
      mounted = true;
      frames.observe(host, { childList: true, subtree: true });
      const loader = document.createElement("script");
      loader.async = true;
      loader.src = "https://subscribe-forms.beehiiv.com/v3/loader.js";
      loader.setAttribute("data-beehiiv-form", "e321f677-f5bd-4383-b5a5-f77a7285df6b");
      host.appendChild(loader);
      if (!document.querySelector('script[src="https://subscribe-forms.beehiiv.com/attribution.js"]')) {
        const attribution = document.createElement("script");
        attribution.async = true;
        attribution.src = "https://subscribe-forms.beehiiv.com/attribution.js";
        document.body.appendChild(attribution);
      }
    };
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        mount();
        observer.disconnect();
      }
    }, { rootMargin: '400px' });
    if (observer) observer.observe(host);
    else mount();
    return () => {
      observer?.disconnect();
      frames.disconnect();
      host.replaceChildren();
    };
  }, []);
  return <div className={className} ref={form} />;
}
