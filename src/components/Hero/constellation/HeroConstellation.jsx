import "./constellation.css";

import Dust from "./Dust";
import Network from "./Network";
import Star from "./Star";

// Edit this list to reposition, add, or remove constellation nodes.
const stars = [

    { id: "upfar", x: 55, y: 32, color: "#b6c7ff", size: "small", delay: "-3.3s" },
    { id: "upfarright", x: 97, y: 10, color: "#f5c7da", size: "small", delay: "-3.3s" },
    { id: "north", x: 73, y: 16, label: "Strategy", color: "#f7d99a", size: "large", delay: "-1.2s" },
    { id: "east", x: 90, y: 34, label: "Design", color: "#b6c7ff", size: "medium", delay: "-3.8s" },
    { id: "center", x: 68, y: 46, label: "Build", color: "#f5c7da", size: "large", delay: "-2.1s" },
    { id: "eastcenter", x: 85, y: 56, color: "#c6f0e4", size: "small", delay: "-1.3s" },
    { id: "south", x: 81, y: 72, label: "Launch", color: "#c6f0e4", size: "medium", delay: "-4.4s" },
    { id: "west", x: 43, y: 66, label: "Explore", color: "#d7c5ff", size: "small", delay: "-0.6s" },
    { id: "far", x: 97, y: 80, color: "#f7d99a", size: "small", delay: "-3.1s" },
];

const connections = [
    ["north", "east"],
    ["north", "center"],
    ["east", "center"],
    ["center", "south"],
    ["center", "west"],
    ["south", "far"],
];

export default function HeroConstellation() {
    return (
        <div className="constellation" aria-hidden="true">
            <div className="constellation__aurora" />
            <Dust />
            <Network stars={stars} connections={connections} />
            <div className="constellation__stars">
                {stars.map((star) => (
                    <Star key={star.id} {...star} />
                ))}
            </div>
        </div>
    );
}