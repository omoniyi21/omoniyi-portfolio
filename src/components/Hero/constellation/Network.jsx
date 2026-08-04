const viewBoxWidth = 1000;
const viewBoxHeight = 700;

export default function Network({ stars, connections }) {
  const starById = Object.fromEntries(stars.map((star) => [star.id, star]));

  return (
    <svg
      className="constellation-network"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="none"
      focusable="false"
    >
      <defs>
        <linearGradient id="constellation-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9b86e8" stopOpacity="0.18" />
          <stop offset="0.48" stopColor="#d7a9bb" stopOpacity="0.5" />
          <stop offset="1" stopColor="#8da8e8" stopOpacity="0.18" />
        </linearGradient>
        <filter id="constellation-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {connections.map(([fromId, toId]) => {
        const from = starById[fromId];
        const to = starById[toId];
        if (!from || !to) return null;

        return (
          <line
            key={`${fromId}-${toId}`}
            className="constellation-network__line"
            x1={(from.x / 100) * viewBoxWidth}
            y1={(from.y / 100) * viewBoxHeight}
            x2={(to.x / 100) * viewBoxWidth}
            y2={(to.y / 100) * viewBoxHeight}
            filter="url(#constellation-glow)"
          />
        );
      })}
    </svg>
  );
}

