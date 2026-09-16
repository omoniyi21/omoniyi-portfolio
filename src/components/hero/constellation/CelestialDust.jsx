import { useEffect, useRef } from 'react';
import starSrc from '../../../assets/branding/celestial/celestial-star.png';

const random = (n) => { const v = Math.sin(n * 127.1 + 31.7) * 43758.5453; return v - Math.floor(v); };

// Soft fade toward zero within EDGE_MARGIN px of the sheet's edge, so dust
// never pops or clips hard against the paper's boundary — it just settles
// into the grain instead of getting cut off.
const EDGE_MARGIN = 46;
const edgeFalloff = (x, y, w, h) => {
  const d = Math.min(x, w - x, y, h - y);
  if (d <= 0) return 0;
  if (d >= EDGE_MARGIN) return 1;
  return d / EDGE_MARGIN;
};

// Two loose, counter-rotating eddies spread across the paper card — one
// behind the headline, one lower behind the actions row — plus a soft wide
// wash so the whole sheet reads as one field of stardust rather than two
// separate clusters. Everything here is sized in fractions of the paper
// card itself (not the whole hero), and the card clips its own overflow, so
// the dust always sits on paper at any breakpoint — it never has anywhere
// else to spill onto.
// Two layouts share the same canvas: side-by-side columns on wide screens,
// stacked content on narrow ones. Each gets its own swirl placement so the
// dust frames the headline/card instead of sitting on top of dense text —
// picked at resize() time based on the sheet's current aspect ratio.
const SWIRLS_WIDE = [
  { cx: 0.14, cy: 0.20, dir: 1, count: 49, dustCount: 272, minR: 0.05, maxR: 0.4, speed: 0.16 },
  { cx: 0.88, cy: 0.22, dir: -1, count: 39, dustCount: 221, minR: 0.05, maxR: 0.36, speed: 0.22 },
  { cx: 0.52, cy: 0.9, dir: 1, count: 26, dustCount: 153, minR: 0.04, maxR: 0.3, speed: 0.14 },
];

// Stacked (mobile/tablet): just two small accents up near the persona
// toggle. Everything further down the sheet is real UI (the description,
// the buttons, the "Selected Work" label, the case-study card itself), so
// there's no clear patch of bare paper left for a third cluster without
// it sitting on top of text or getting swallowed by the card's own
// opaque fill — better to leave that area clear than fight either.
const SWIRLS_STACKED = [
  { cx: 0.82, cy: 0.05, dir: 1, count: 19, dustCount: 102, minR: 0.03, maxR: 0.2, speed: 0.16 },
  { cx: 0.18, cy: 0.05, dir: -1, count: 15, dustCount: 85, minR: 0.03, maxR: 0.18, speed: 0.18 },
];

// The exact four tones the real constellation art already ships with.
const TONES = [
  { name: 'violet', filter: null },
  { name: 'pink', filter: 'hue-rotate(40deg) saturate(1.05)' },
  { name: 'peach', filter: 'hue-rotate(115deg) saturate(1.05)' },
  { name: 'pearl', filter: 'saturate(0.15) brightness(1.12)' },
];
const TONE_WEIGHTS_BASE = [0.14, 0.08, 0.08, 0.7];
const TONE_WEIGHTS_FEATURE = [0.36, 0.3, 0.24, 0.1];
// Dust dots (not the star sprites) recolor with the hero's persona: violet
// while reading as "someone hiring", a warm ember while reading as "someone
// building" — a small preview of Studio's own oxblood accent before the
// visitor ever clicks through. The switch itself gets a brief outward
// "kick" (see kickStartRef below) so the change reads as a reaction, not
// just a palette swap.
const MODE_DUST_COLOR = { hiring: '132,101,190', building: '122,51,60' };

function pickTone(t, featured) {
  const weights = featured ? TONE_WEIGHTS_FEATURE : TONE_WEIGHTS_BASE;
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (t <= acc) return TONES[i].name;
  }
  return TONES[0].name;
}

function buildSprites(img) {
  const size = 96;
  const sprites = {};
  for (const tone of TONES) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const cctx = c.getContext('2d');
    if (tone.filter) cctx.filter = tone.filter;
    cctx.drawImage(img, 0, 0, size, size);
    sprites[tone.name] = c;
  }
  return sprites;
}

function makeParticles(w, h, swirls) {
  const stars = [];
  const dust = [];
  let seed = 0;
  const scale = Math.min(w, h);
  swirls.forEach((swirl) => {
    for (let i = 0; i < swirl.count; i++) {
      seed += 1;
      const t = random(seed);
      const radiusFrac = Math.sqrt(t) * (swirl.maxR - swirl.minR) + swirl.minR;
      const baseRadius = radiusFrac * scale;
      const feature = i % 7 === 0;
      stars.push({
        cx: swirl.cx * w,
        cy: swirl.cy * h,
        angle: random(seed + 500) * Math.PI * 2,
        radius: baseRadius,
        jitter: (0.08 + random(seed + 900) * 0.12) * baseRadius,
        wobbleSeed: random(seed + 200) * 100,
        wobbleSpeed: 0.35 + random(seed + 300) * 0.55,
        angularSpeed: swirl.dir * (swirl.speed * (0.5 + random(seed + 700) * 0.7)),
        squish: 0.55 + random(seed + 1100) * 0.14,
        size: (feature ? 24 : 11) + random(seed + 100) * (feature ? 20 : 17),
        alpha: (feature ? 0.85 : 0.62) + random(seed + 400) * (feature ? 0.15 : 0.36) * (1 - radiusFrac * 0.3),
        tone: pickTone(random(seed + 1300), feature),
        spin: (random(seed + 1600) - 0.5) * 0.6,
        feature,
        pulseSeed: random(seed + 1800) * 100,
      });
    }
    for (let i = 0; i < swirl.dustCount; i++) {
      seed += 1;
      const t = random(seed);
      const radiusFrac = Math.sqrt(t) * (swirl.maxR - swirl.minR) + swirl.minR;
      const baseRadius = radiusFrac * scale;
      dust.push({
        cx: swirl.cx * w,
        cy: swirl.cy * h,
        angle: random(seed + 500) * Math.PI * 2,
        radius: baseRadius,
        jitter: (0.08 + random(seed + 900) * 0.12) * baseRadius,
        wobbleSeed: random(seed + 200) * 100,
        wobbleSpeed: 0.35 + random(seed + 300) * 0.55,
        angularSpeed: swirl.dir * (swirl.speed * (0.5 + random(seed + 700) * 0.7)),
        squish: 0.55 + random(seed + 1100) * 0.14,
        r: 0.6 + random(seed + 100) * 1.3,
        alpha: (0.2 + random(seed + 400) * 0.32) * (1 - radiusFrac * 0.3),
        pulseSeed: random(seed + 2000) * 100,
      });
    }
  });
  return { stars, dust };
}

export default function CelestialDust({ paused, mode = 'hiring' }) {
  const ref = useRef(null);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const modeRef = useRef(mode);
  const kickStartRef = useRef(-Infinity);
  const mountedModeRef = useRef(false);
  useEffect(() => {
    modeRef.current = mode;
    if (mountedModeRef.current) {
      kickStartRef.current = performance.now();
    } else {
      mountedModeRef.current = true;
    }
  }, [mode]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const host = canvas.parentElement;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, stars = [], dust = [], sprites = null, frame = 0, last = 0, elapsed = 0, visible = true, strength = 0, ready = false;
    const pointer = { x: 0, y: 0, active: false };

    const image = new Image();
    image.onload = () => {
      sprites = buildSprites(image);
      ready = true;
      draw(elapsed);
      start();
    };
    image.src = starSrc;

    const settle = (p, t, kick = 0) => {
      const angle = p.angle + t * p.angularSpeed;
      const radius = (p.radius + Math.sin(t * p.wobbleSpeed + p.wobbleSeed) * p.jitter) * (1 + kick * 0.4);
      let x = p.cx + Math.cos(angle) * radius;
      let y = p.cy + Math.sin(angle) * radius * p.squish;
      if (strength > 0.001) {
        const dx = x - pointer.x, dy = y - pointer.y, d = Math.hypot(dx, dy);
        const reach = 150;
        if (d < reach) {
          const push = 58 * strength * (1 - d / reach) ** 2;
          const a = d > 0.1 ? Math.atan2(dy, dx) : 0;
          x += Math.cos(a) * push;
          y += Math.sin(a) * push;
        }
      }
      return [x, y, angle];
    };

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, width, height);
      const t = time * 0.001;
      ctx.lineCap = 'round';

      // Kick decays linearly over 700ms from the moment `mode` last changed.
      const kickAge = performance.now() - kickStartRef.current;
      const kick = kickAge < 700 ? Math.max(0, 1 - kickAge / 700) : 0;
      const dustColor = MODE_DUST_COLOR[modeRef.current] || MODE_DUST_COLOR.hiring;

      ctx.globalAlpha = 1;
      for (const p of dust) {
        const [x, y] = settle(p, t, kick);
        const edge = edgeFalloff(x, y, width, height);
        if (edge <= 0) continue;
        const twinkle = 0.75 + 0.25 * Math.sin(t * 0.9 + p.pulseSeed);
        const flash = 1 + kick * 0.6;
        ctx.fillStyle = `rgba(${dustColor},${Math.min(1, p.alpha * twinkle * edge * flash)})`;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (ready) {
        for (const p of stars) {
          const [x, y, angle] = settle(p, t, kick * 0.5);
          const edge = edgeFalloff(x, y, width, height);
          if (edge <= 0) continue;
          const sprite = sprites[p.tone];
          let size = p.size;
          let alpha = p.alpha;
          if (p.feature) {
            const pulse = 1 + 0.16 * Math.sin(t * 1.05 + p.pulseSeed);
            size = p.size * pulse;
            alpha = p.alpha * (0.82 + 0.18 * Math.sin(t * 0.85 + p.pulseSeed * 1.3));
          }
          ctx.globalAlpha = alpha * edge;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle * p.spin);
          ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      }
    };

    const tick = (now) => {
      frame = 0;
      if (!visible || document.hidden) return;
      if (now - last >= 32) {
        const delta = last ? Math.min(now - last, 80) : 0;
        last = now;
        if (!pausedRef.current && !motion.matches) {
          elapsed += delta;
          const target = pointer.active ? 1 : 0;
          strength += (target - strength) * 0.14;
          draw(elapsed);
        }
      }
      frame = requestAnimationFrame(tick);
    };
    const start = () => { if (!frame && visible && !document.hidden) { last = 0; frame = requestAnimationFrame(tick); } };
    const reset = () => { cancelAnimationFrame(frame); frame = 0; last = 0; };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const swirls = width > height * 1.15 ? SWIRLS_WIDE : SWIRLS_STACKED;
      const made = makeParticles(width, height, swirls);
      stars = made.stars;
      dust = made.dust;
      draw(elapsed);
      start();
    };

    const move = (e) => {
      if (e.pointerType !== 'mouse' || pausedRef.current || motion.matches) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height;
      start();
    };
    const leave = () => { pointer.active = false; start(); };
    const visibility = () => { if (document.hidden) reset(); else start(); };
    const preference = () => { strength = 0; pointer.active = false; draw(elapsed); start(); };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const mountFrame = requestAnimationFrame(resize);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) reset(); else start(); });
    intersection.observe(host);

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', preference);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(mountFrame);
      observer.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', preference);
    };
  }, []);

  return <canvas ref={ref} className="hero-dust" data-paused={paused} aria-hidden="true" />;
}
