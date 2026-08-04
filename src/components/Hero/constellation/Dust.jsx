const colors = [
   
    "#FFF099",
    "#8166FF", // lavender
    "#FF79C8", // pink
    "#FFB56A", // peach
    "#A8E9FF", // blue
    "#FFFFFF"  // white
];

const color = colors[Math.floor(Math.random()*colors.length)];

const size =
    color === "#FFF099"
        ? Math.random()*2+1
        : Math.random()*1.2+0.8;

const dust = Array.from({ length: 400 }, (_, i) => ({

    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2.3 + 1.2,
    opacity: Math.random() * 0.35 + 0.05,
    duration: Math.random() * 14 + 12,
    delay: Math.random() * 8,
    color: colors[Math.floor(Math.random() * colors.length)]

}));

export default function Dust() {

    return (
        <>
            {dust.map((particle) => (

                <span
                    key={particle.id}
                    className="dust"
                    style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        opacity: particle.opacity,
                        background: particle.color,
                        animationDuration: `${particle.duration}s`,
                        animationDelay: `${particle.delay}s`,
                        animationIterationCount: "infinite",
                        animationTimingFunction: "ease-in-out",
                        animationDirection: "alternate",
                        boxShadow: 
                        `0 0 2px ${particle.color},
                        0 0 5px ${particle.color}55`,
                    }}
                />

            ))}
        </>
    );
}