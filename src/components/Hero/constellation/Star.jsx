export default function Star({ x, y, label, color, size = "medium", delay = "0s" }) {
    return (
      <div
        className={`constellation-star constellation-star--${size}`}
        style={{ left: `${x}%`, top: `${y}%`, "--star-color": color, "--delay": delay }}
      >
        <span className="constellation-star__halo" />
        <span className="constellation-star__dot">
          <svg className="constellation-star__mark" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M20 1.8C21 13.1 24.1 16.8 38.1 20c-13.4 2.7-16.9 6.1-18.1 18.2C17.3 26.4 13.5 22.9 1.8 20 13.8 17.2 17 13.5 20 1.8Z" />
            <circle cx="20" cy="20" r="2.2" />
          </svg>
        </span>
        {label && <span className="constellation-star__label">{label}</span>}
      </div>
    );
  }
  