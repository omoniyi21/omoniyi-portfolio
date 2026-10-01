import { useState } from "react";
import { Play } from "lucide-react";
import PenLink from "../shared/paper/PenLink";

// Converts a Figma prototype share link into its embed URL.
function toEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("figma.com") && u.pathname.startsWith("/proto/")) {
      const e = new URL(`https://embed.figma.com${u.pathname}`);
      u.searchParams.forEach((v, k) => e.searchParams.set(k, v));
      e.searchParams.set("embed-host", "omoniyialimi");
      e.searchParams.set("hide-ui", "1");
      return e.toString();
    }
  } catch { /* fall through */ }
  return url;
}

// Click-to-load: nothing from Figma loads (no tracking, no weight) until the
// visitor asks for it. The poster keeps the layout stable at 16:10.
export default function PrototypeEmbed({ url, poster, title, caption }) {
  const [open, setOpen] = useState(false);
  return (
    <figure className="study-prototype">
      <div className="study-prototype__frame">
        {open ? (
          <iframe src={toEmbed(url)} title={title} allowFullScreen loading="lazy" />
        ) : (
          <button type="button" className="study-prototype__facade" onClick={() => setOpen(true)}>
            {poster && <img src={poster} alt="" loading="lazy" decoding="async" />}
            <span className="study-prototype__cta"><Play size={16} aria-hidden="true" /> Try the working prototype</span>
            <span className="visually-hidden">Loads an interactive Figma prototype: {title}</span>
          </button>
        )}
      </div>
      <figcaption>
        {caption}{" "}
        <PenLink className="study-prototype__open" href={url}>Open in Figma</PenLink>
      </figcaption>
    </figure>
  );
}
