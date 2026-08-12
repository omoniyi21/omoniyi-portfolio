import "./constellation.css";
import Dust from "./Dust";
import Network from "./Network";
import Star from "./Star";

const stars = [
  { id: "explore", x: 17, y: 62, label: "Explore", color: "#ef6a9e", size: "large" },
  { id: "design", x: 28, y: 70, label: "Design", color: "#8170c8", size: "large" },
  { id: "research", x: 45, y: 34, label: "Research", color: "#8170c8", size: "large" },
  { id: "build", x: 62, y: 30, label: "Build", color: "#f2a447", size: "large" },
  { id: "systems", x: 76, y: 40, label: "Systems", color: "#668ee8", size: "large" },
  { id: "launch", x: 68, y: 72, label: "Launch", color: "#f2a447", size: "large" },
  { id: "n1", x: 21, y: 66, color: "#8170c8", size: "small" },
  { id: "n2", x: 24, y: 68, color: "#f2a447", size: "small" },
  { id: "n3", x: 34, y: 63, color: "#ef6a9e", size: "small" },
  { id: "n4", x: 38, y: 54, color: "#8170c8", size: "small" },
  { id: "n5", x: 41, y: 45, color: "#ef6a9e", size: "small" },
  { id: "n6", x: 51, y: 34, color: "#f2a447", size: "small" },
  { id: "n7", x: 56, y: 32, color: "#ef6a9e", size: "small" },
  { id: "n8", x: 68, y: 33, color: "#668ee8", size: "small" },
  { id: "n9", x: 72, y: 27, color: "#ef6a9e", size: "small" },
  { id: "n10", x: 80, y: 29, color: "#f2a447", size: "small" },
  { id: "n11", x: 79, y: 49, color: "#ef6a9e", size: "small" },
  { id: "n12", x: 73, y: 56, color: "#8170c8", size: "small" },
  { id: "n13", x: 70, y: 64, color: "#668ee8", size: "small" },
  { id: "n14", x: 65, y: 78, color: "#f2a447", size: "small" },
  { id: "n15", x: 60, y: 82, color: "#ef6a9e", size: "small" },
  { id: "n16", x: 55, y: 79, color: "#8170c8", size: "small" },
  { id: "n17", x: 53, y: 73, color: "#668ee8", size: "small" },
  { id: "n18", x: 83, y: 24, color: "#ef6a9e", size: "small" },
  { id: "n19", x: 87, y: 31, color: "#f2a447", size: "small" },
  { id: "n20", x: 84, y: 41, color: "#8170c8", size: "small" },
  { id: "n21", x: 82, y: 57, color: "#ef6a9e", size: "small" },
];

const connections = [
  ["explore", "n1"], ["n1", "n2"], ["n2", "design"], ["design", "n3"], ["n3", "n4"],
  ["n4", "n5"], ["n5", "research"], ["research", "n6"], ["n6", "n7"], ["n7", "build"],
  ["build", "n8"], ["n8", "systems"], ["systems", "n11"], ["n11", "n12"], ["n12", "n13"], ["n13", "launch"],
  ["launch", "n14"], ["n14", "n15"], ["n15", "n16"], ["n16", "n17"],
  ["systems", "n9"], ["n9", "n10"], ["n10", "n18"], ["n18", "n19"],
  ["systems", "n20"], ["n20", "n21"],
];

export default function HeroConstellation() {
  return <div className="constellation" aria-hidden="true"><Dust /><Network stars={stars} connections={connections} /><div className="constellation__stars">{stars.map((star, index) => <Star key={star.id} {...star} index={index} />)}</div></div>;
}
