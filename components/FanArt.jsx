// Realistic ceiling-fan illustration (viewed from below) used as a clean
// fallback when a product photo isn't available. Tinted per-product by `hue`.

export default function FanArt({ hue = 220, spin = true, size = "100%" }) {
  const blade = `hsl(${hue} 45% 55%)`;
  const bladeLight = `hsl(${hue} 55% 72%)`;
  const gold = "#d9a441";
  const gid = `cf-${hue}`;

  // 5 evenly spaced elegant blades
  const blades = [0, 72, 144, 216, 288].map((r) => (
    <g key={r} transform={`rotate(${r} 100 100)`}>
      <path
        d="M100 92
           C 118 90, 150 82, 176 86
           C 182 87, 183 95, 178 99
           C 152 108, 120 108, 100 104 Z"
        fill={`url(#${gid})`}
        stroke="rgba(0,0,0,0.06)"
        strokeWidth="1"
      />
      {/* blade holder */}
      <rect x="100" y="94" width="26" height="8" rx="3" fill={gold} transform="rotate(-4 100 98)" />
    </g>
  ));

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ display: "block" }} role="img" aria-label="Ceiling fan">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={bladeLight} />
          <stop offset="100%" stopColor={blade} />
        </linearGradient>
        <radialGradient id={`${gid}-hub`}>
          <stop offset="0%" stopColor="#fff" />
          <stop offset="70%" stopColor={gold} />
          <stop offset="100%" stopColor="#b8862f" />
        </radialGradient>
      </defs>

      <g
        style={
          spin
            ? { transformOrigin: "100px 100px", animation: "cfspin 4s linear infinite" }
            : undefined
        }
      >
        {blades}
      </g>

      {/* motor housing */}
      <circle cx="100" cy="100" r="24" fill="#f3f5fb" stroke="rgba(0,0,0,0.06)" />
      <circle cx="100" cy="100" r="15" fill={`url(#${gid}-hub)`} />
      <circle cx="100" cy="100" r="5" fill="#9a6f22" />

      <style>{`@keyframes cfspin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
