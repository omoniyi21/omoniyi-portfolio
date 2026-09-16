import { useEffect, useRef } from "react";

// Shared Beehiiv subscribe-form mount point. Used by the homepage
// Observations bar and by the compact prompt at the end of every
// observation post, so the embed logic lives in exactly one place.
export default function BeehiivEmbed({ className }) {
  const form = useRef(null);
  useEffect(() => {
    const host = form.current;
    const loader = document.createElement("script");
    loader.async = true;
    loader.src = "https://subscribe-forms.beehiiv.com/v3/loader.js";
    loader.setAttribute("data-beehiiv-form", "e321f677-f5bd-4383-b5a5-f77a7285df6b");
    host.appendChild(loader);
    if (!document.querySelector('script[src="https://subscribe-forms.beehiiv.com/attribution.js"]')) {
      const attribution = document.createElement("script");
      attribution.type = "text/javascript";
      attribution.async = true;
      attribution.src = "https://subscribe-forms.beehiiv.com/attribution.js";
      document.body.appendChild(attribution);
    }
    return () => host.replaceChildren();
  }, []);
  return <div className={className} ref={form} />;
}
