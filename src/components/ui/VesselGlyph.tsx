/** Animated sacred-geometry hero glyph — 7 nodes for the 7 Universal Principles. */
export function VesselGlyph({ className = "" }: { className?: string }) {
  const nodes = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
    return { x: 200 + Math.cos(a) * 150, y: 200 + Math.sin(a) * 150 };
  });
  const r = (n: number) => Math.round(n * 100) / 100;

  return (
    <div className={`relative aspect-square ${className}`} aria-hidden>
      <div className="absolute inset-[18%] rounded-full bg-gold/10 blur-3xl" />
      <svg viewBox="0 0 400 400" className="absolute inset-0 size-full">
        <defs>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e9c766" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#d4af37" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9c7f22" />
            <stop offset="50%" stopColor="#e9c766" />
            <stop offset="100%" stopColor="#9c7f22" />
          </linearGradient>
        </defs>

        <g className="animate-spin-slower" style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}>
          <circle cx="200" cy="200" r="190" fill="none" stroke="#1e2633" strokeDasharray="2 6" />
          <circle cx="200" cy="200" r="172" fill="none" stroke="#2a3444" strokeWidth="0.6" />
        </g>

        <g className="animate-spin-slow" style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}>
          <polygon
            points={nodes.map((n) => `${r(n.x)},${r(n.y)}`).join(" ")}
            fill="none"
            stroke="url(#stroke)"
            strokeWidth="0.8"
            opacity="0.7"
          />
          {/* Heptagram {7/3} */}
          <polygon
            points={nodes.map((_, i) => nodes[(i * 3) % 7]).map((n) => `${r(n.x)},${r(n.y)}`).join(" ")}
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.5"
            opacity="0.35"
          />
          {nodes.map((n, i) => (
            <g key={i}>
              <circle cx={r(n.x)} cy={r(n.y)} r="9" fill="#090b0e" stroke="#d4af37" strokeWidth="0.8" />
              <circle cx={r(n.x)} cy={r(n.y)} r="2.5" fill="#e9c766" className="animate-pulse-gold" style={{ animationDelay: `${i * 0.4}s` }} />
            </g>
          ))}
        </g>

        <circle cx="200" cy="200" r="70" fill="url(#core)" />
        <circle cx="200" cy="200" r="46" fill="none" stroke="#d4af37" strokeWidth="0.6" opacity="0.6" />
        <text x="200" y="214" textAnchor="middle" fontSize="40" fill="#e9c766">⚡</text>
      </svg>
    </div>
  );
}
