const ROWS = [
  { url: "webhook.site/a92f...price-alerts", active: true },
  { url: "yourapp.com/hooks/pmaxis-trades", active: true },
  { url: "yourapp.com/hooks/resolutions", active: false },
];

function Illustration() {
  return (
    <svg viewBox="0 0 420 320" fill="none" width="100%" style={{ maxWidth: 420 }}>
      {/* card */}
      <rect x="1" y="1" width="418" height="318" rx="14" fill="var(--surface)" stroke="var(--border)" />
      {/* title bar */}
      <line x1="1" y1="48" x2="419" y2="48" stroke="var(--border)" />
      <circle cx="26" cy="24" r="5" fill="#FF5F57" />
      <circle cx="44" cy="24" r="5" fill="#FFBD2E" />
      <circle cx="62" cy="24" r="5" fill="#28C840" />
      <text x="200" y="28" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--muted)">dashboard.pmaxis.trade</text>

      {/* credits counter */}
      <text x="24" y="82" fontSize="10" fontFamily="monospace" fill="var(--muted)" letterSpacing="1">CREDITS USED THIS MONTH</text>
      <text x="24" y="112" fontSize="30" fontWeight="700" fill="var(--text)">3,140 <tspan fontSize="14" fill="var(--muted)">/ 5,000</tspan></text>
      <rect x="24" y="122" width="372" height="8" rx="4" fill="var(--border)" />
      <rect x="24" y="122" width="233" height="8" rx="4" fill="var(--green)" />

      {/* api key row */}
      <text x="24" y="160" fontSize="10" fontFamily="monospace" fill="var(--muted)" letterSpacing="1">API KEY</text>
      <rect x="24" y="168" width="230" height="30" rx="6" fill="var(--surface2)" stroke="var(--border)" />
      <text x="36" y="187" fontSize="12" fontFamily="monospace" fill="var(--text)">pmx_live_••••••••8f21</text>
      <rect x="264" y="168" width="60" height="30" rx="6" fill="var(--green-dim)" stroke="var(--green)" strokeOpacity="0.3" />
      <text x="294" y="187" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--green-text)">Rotate</text>

      {/* webhooks list */}
      <text x="24" y="228" fontSize="10" fontFamily="monospace" fill="var(--muted)" letterSpacing="1">WEBHOOKS</text>
      {ROWS.map((row, i) => (
        <g key={row.url} transform={`translate(24, ${236 + i * 24})`}>
          <circle cx="6" cy="0" r="4" fill={row.active ? "var(--green)" : "var(--border)"} />
          <text x="18" y="4" fontSize="11" fontFamily="monospace" fill="var(--muted)">{row.url}</text>
        </g>
      ))}
    </svg>
  );
}

export default function DevPlatform() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 48, flexWrap: "wrap" }} className="devplatform-row">
      <div style={{ flex: "1 1 380px", display: "flex", justifyContent: "center" }}>
        <Illustration />
      </div>
      <div style={{ flex: "1 1 380px", maxWidth: 480 }}>
        <div className="eyebrow">05 — Platform</div>
        <h2 className="section-h2 h2-mobile">One dashboard for keys, credits, and webhooks</h2>
        <p className="section-sub">
          No infra to run. Rotate API keys, watch credit usage in real time, and manage webhook endpoints from a single screen — the same account powers your REST calls, WebSocket stream, and MCP connection.
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            "Instant key issuance — no approval queue",
            "Live credit usage with 7-day history",
            "Webhook delivery logs with automatic retry + circuit breaker",
          ].map(f => (
            <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--muted)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 3 }}><polyline points="20 6 9 17 4 12" /></svg>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
