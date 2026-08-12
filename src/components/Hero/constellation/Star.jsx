import { useRef, useState } from "react";

export default function Star({ x, y, label, color, size = "small", index = 0 }) {
  const [position, setPosition] = useState({ x, y });
  const dragRef = useRef(null);

  const handlePointerDown = (event) => {
    if (size !== "large") return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      x: position.x,
      y: position.y,
      bounds: event.currentTarget.parentElement?.getBoundingClientRect(),
    };
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag?.bounds) return;

    const nextX = drag.x + ((event.clientX - drag.startX) / drag.bounds.width) * 100;
    const nextY = drag.y + ((event.clientY - drag.startY) / drag.bounds.height) * 100;
    setPosition({ x: Math.min(96, Math.max(4, nextX)), y: Math.min(94, Math.max(6, nextY)) });
  };

  const handlePointerUp = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  return (
    <div
      className={`constellation-star constellation-star--${size}`}
      style={{ left: `${position.x}%`, top: `${position.y}%`, "--star-color": color, "--star-delay": `${index * -0.47}s` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <span className="constellation-star__mark" aria-hidden="true">{size === "large" ? "✶" : "✦"}</span>
      {label && <span className="constellation-star__label">{label}</span>}
    </div>
  );
}
