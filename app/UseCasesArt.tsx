const NODES = [
  { x: 90, y: 40, color: "var(--green)" },
  { x: 230, y: 30, color: "#8B5CF6" },
  { x: 260, y: 170, color: "var(--green)" },
  { x: 70, y: 180, color: "#8B5CF6" },
];

export default function UseCasesArt() {
  return (
    <svg viewBox="0 0 320 220" fill="none" width="100%" style={{ maxWidth: 320 }} aria-hidden="true">
      <circle cx="160" cy="110" r="90" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 6" />
      {NODES.map((n, i) => (
        <line key={i} x1="160" y1="110" x2={n.x} y2={n.y} stroke={n.color} strokeOpacity="0.35" strokeWidth="1.5" />
      ))}
      <circle cx="160" cy="110" r="22" fill="var(--surface)" stroke="var(--text)" strokeOpacity="0.15" />
      <circle cx="160" cy="110" r="7" fill="var(--green)" />
      {NODES.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="12" fill="var(--surface)" stroke={n.color} strokeOpacity="0.4" />
          <circle cx={n.x} cy={n.y} r="4" fill={n.color} />
        </g>
      ))}
    </svg>
  );
}
