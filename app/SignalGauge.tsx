// Real example from /v1/markets/{id}/signals (docs/api/api-reference.md).
const SIGNAL_TYPE = "momentum";
const SEVERITY: "low" | "medium" | "high" = "medium";
const VALUE = 0.5618;
const THRESHOLD = 0.05;
const MARKET_ID = "3017850";

const ARC_LEN = Math.PI * 50; // semicircle radius 50

const SEVERITY_COLOR: Record<string, string> = {
  low: "var(--muted)",
  medium: "#d97706",
  high: "#d03b3b",
};

export default function SignalGauge() {
  const clamped = Math.min(1, VALUE);
  const offset = ARC_LEN * (1 - clamped);
  const color = SEVERITY_COLOR[SEVERITY];

  return (
    <div className="signal-gauge">
      <div className="signal-gauge-arc-wrap">
        <svg viewBox="0 0 120 66" width="140" height="78">
          <path d="M10,60 A50,50 0 0 1 110,60" fill="none" stroke="var(--border)" strokeWidth="8" strokeLinecap="round" />
          <path
            d="M10,60 A50,50 0 0 1 110,60"
            fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={ARC_LEN} strokeDashoffset={offset}
          />
        </svg>
        <div className="signal-gauge-value">
          <span className="signal-gauge-num">{VALUE.toFixed(4)}</span>
          <span className="signal-gauge-sub">signal value</span>
        </div>
      </div>
      <div className="signal-gauge-side">
        <div className="signal-gauge-row">
          <span className="signal-gauge-label">Type</span>
          <span className="signal-gauge-momentum rising" style={{ color }}>{SIGNAL_TYPE}</span>
        </div>
        <div className="signal-gauge-row">
          <span className="signal-gauge-label">Threshold</span>
          <span className="signal-gauge-score">{THRESHOLD.toFixed(2)} <span style={{ opacity: 0.6, fontWeight: 400 }}>(exceeded)</span></span>
        </div>
        <div className="signal-gauge-row">
          <span className="signal-gauge-label">Severity</span>
          <span className="signal-gauge-confidence" style={{ background: `${color}20`, color }}>{SEVERITY}</span>
        </div>
        <div className="signal-gauge-row">
          <span className="signal-gauge-label">Market</span>
          <span className="signal-gauge-score" style={{ fontSize: 12 }}>{MARKET_ID}</span>
        </div>
      </div>
    </div>
  );
}
