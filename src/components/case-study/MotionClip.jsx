import { useEffect, useRef, useState } from "react";
import useMotionReduced from "../../lib/useMotionReduced";

// A short, silent loop of a real interaction. Plays only while on screen,
// never autoplays under reduced motion, and always has a visible pause
// control (WCAG 2.2.2). Pass webm and/or mp4 plus a poster image.
export default function MotionClip({ webm, mp4, poster, caption, label }) {
  const ref = useRef(null);
  const reduced = useMotionReduced();
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced || userPaused) { video?.pause(); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.4 });
    io.observe(video);
    return () => io.disconnect();
  }, [reduced, userPaused]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) { setUserPaused(false); video.play().catch(() => {}); }
    else { setUserPaused(true); video.pause(); }
  };

  return (
    <figure className="study-clip">
      <div className="study-clip__frame">
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          aria-label={label || caption}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {webm && <source src={webm} type="video/webm" />}
          {mp4 && <source src={mp4} type="video/mp4" />}
        </video>
        <button type="button" className="study-clip__toggle" onClick={toggle} aria-pressed={!playing}>
          {playing ? "Pause" : "Play"}
        </button>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
