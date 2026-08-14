export default function HeroArt() {
  return (
    <svg
      className="hero-art"
      viewBox="0 0 1000 560"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <g className="hero-art-spin" style={{ transformOrigin: "500px 220px" }}>
        <circle cx="500" cy="220" r="120" stroke="var(--green)" strokeOpacity="0.16" strokeWidth="1" />
        <circle cx="500" cy="220" r="200" stroke="var(--green)" strokeOpacity="0.1" strokeWidth="1" />
        <circle cx="500" cy="220" r="280" stroke="#8B5CF6" strokeOpacity="0.08" strokeWidth="1" />
        <circle cx="620" cy="220" r="3" fill="var(--green)" fillOpacity="0.6" />
        <circle cx="500" cy="100" r="3" fill="#8B5CF6" fillOpacity="0.5" />
        <circle cx="380" cy="220" r="2.5" fill="var(--green)" fillOpacity="0.4" />
        <circle cx="500" cy="500" r="2.5" fill="#8B5CF6" fillOpacity="0.35" />
        <circle cx="220" cy="220" r="2" fill="var(--green)" fillOpacity="0.3" />
        <circle cx="780" cy="220" r="2" fill="#8B5CF6" fillOpacity="0.3" />
      </g>
      <path d="M60 420 L220 380 L340 430 L500 360 L660 410 L800 350 L940 400" stroke="var(--green)" strokeOpacity="0.08" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
