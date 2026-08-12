import "./personal-effects.css";

export default function Arrow({
    width = 100,
    rotation = 0,
    className = "",
  }) {
    return (
      <svg
        className={`artifact-arrow ${className}`}
        width={width}
        viewBox="0 0 120 24"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <path
          d="M2 12 C35 12 55 12 95 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />
  
        <path
          d="M92 5 L105 12 L92 19"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }