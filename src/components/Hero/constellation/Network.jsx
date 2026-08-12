const width = 1000;
const height = 700;

export default function Network({ stars, connections }) {
  const byId = Object.fromEntries(stars.map((star) => [star.id, star]));
  return <svg className="constellation-network" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" focusable="false"><defs>{connections.map(([a, b]) => { const from = byId[a]; const to = byId[b]; return <linearGradient key={`${a}-${b}`} id={`thread-${a}-${b}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={from.color} stopOpacity=".82" /><stop offset="1" stopColor={to.color} stopOpacity=".68" /></linearGradient>; })}</defs>{connections.map(([a, b], index) => { const from = byId[a]; const to = byId[b]; if (!from || !to) return null; return <line key={`${a}-${b}`} className="constellation-network__line" x1={(from.x / 100) * width} y1={(from.y / 100) * height} x2={(to.x / 100) * width} y2={(to.y / 100) * height} style={{ stroke: `url(#thread-${a}-${b})`, "--thread-delay": `${index * -0.42}s`, "--thread-duration": `${7.5 + (index % 5) * 0.7}s` }} />; })}</svg>;
}
