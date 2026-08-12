const palette = ["#8170c8", "#ef6a9e", "#f2a447", "#9db7ee"];
const random = (seed) => { const value = Math.sin(seed * 43758.5453) * 10000; return value - Math.floor(value); };
const tiers = [
  ["xl", "1.1rem", 5],
  ["lg", ".72rem", 10],
  ["md", ".34rem", 15],
  ["sm", ".24rem", 20],
  ["xs", ".2rem", 200],
];

// An intentionally irregular, airy sky: the small stars are numerous but
// scattered, while the larger siblings remain rare and incidental. A warped
// low-discrepancy distribution prevents visible rows, columns, or a halo.
const tierPool = tiers.flatMap(([tier, size, count]) => Array.from({ length: count }, () => ({ tier, size })));

const dust = Array.from({ length: tierPool.length }, (_, id) => {
  const { tier, size } = tierPool[(id * 37) % tierPool.length];
  const golden = 0.61803398875;
  const xSeed = (id * golden + random(id + 17) * 0.42) % 1;
  const ySeed = (id * 0.41421356237 + random(id + 99) * 0.42) % 1;
  const x = 2 + (xSeed + Math.sin(ySeed * Math.PI * 2) * 0.045) * 96;
  const y = 3 + (ySeed + Math.sin(xSeed * Math.PI * 3) * 0.04) * 94;

  return {
    id,
    tier,
    x,
    y,
    size,
    color: palette[Math.floor(random(id + 341) * palette.length)],
  };
});

export default function Dust() {
  return (
    <div className="constellation-dust">
      {dust.map((item) => (
        <span
          key={item.id}
          className={`dust dust--${item.tier}${item.id % 5 === 0 ? " dust--drift" : ""}`}
          aria-hidden="true"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            "--dust-size": `${item.size}px`,
            "--dust-color": item.color,
            "--dust-delay": `${(item.id % 13) * -0.7}s`,
            "--dust-drift-x": `${(item.id % 3) - 1}px`,
            "--dust-drift-y": `${(item.id % 4) - 2}px`,
          }}
        >
          {item.tier === "xs" ? "•" : item.tier === "xl" || item.tier === "lg" ? "✶" : "✦"}
        </span>
      ))}
    </div>
  );
}
