import "./personal-effects.css";

export default function FloatingArtifact({
    src,
    alt,
    x = "0%",
    y = "0%",
    rotation = 0,
    width = "220px",
    z = 1,
    delay = 0,
    className = "",
    children
}) {
    return (
        <div
        className={`floating-artifact ${className}`}
        style={{
            left: x,
            top: y,
            width,
            zIndex: z,
            "--rotation": `${rotation}deg`,
            animationDelay: `${delay}s`
        }}
    >
            <img src={src} alt={alt} />

            {children}
        </div>
    );
}

