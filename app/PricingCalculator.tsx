"use client";
import { useMemo, useState } from "react";

const API_URL = "https://api.pmaxis.trade";

const TIERS = [
  {
    name: "Free", price: "$0", period: "/mo", credits: 5000,
    features: ["5,000 credits / month", "WebSocket — 5 connections", "1 API key · 5 webhooks", "7-day usage history"],
    href: `${API_URL}/signup`, cta: "Get started free",
  },
  {
    name: "Pro", price: "Coming soon", period: "", credits: 100000,
    features: ["100,000 credits / month", "WebSocket — 50 connections", "3 API keys · 2,500 webhooks"],
    href: "#", cta: "Join waitlist",
  },
  {
    name: "Enterprise", price: "Custom", period: "", credits: Infinity,
    features: ["Custom credits & connections", "Dedicated infrastructure", "SLA guarantee", "White-glove onboarding"],
    href: "#", cta: "Talk to us",
  },
] as const;

const PRESETS = [1000, 5000, 25000, 50000, 100000];
const MAX = 100000;
const format = (n: number) => n.toLocaleString("en-US");

function tierFor(credits: number, overMax: boolean) {
  if (overMax) return "Enterprise";
  if (credits <= 5000) return "Free";
  if (credits <= 100000) return "Pro";
  return "Enterprise";
}

export default function PricingCalculator() {
  const [credits, setCredits] = useState(5000);
  const [overMax, setOverMax] = useState(false);

  const recommended = useMemo(() => tierFor(credits, overMax), [credits, overMax]);

  return (
    <div>
      <div className="calc-card">
        <div className="calc-head">
          <div>
            <div className="calc-label">Estimate your usage</div>
            <div className="calc-sub">Credits per month across REST, WebSocket, and MCP calls.</div>
          </div>
          <div className="calc-readout">
            <span className="calc-readout-num">{overMax ? `${format(MAX)}+` : format(credits)}</span>
            <span className="calc-readout-unit">credits / mo</span>
          </div>
        </div>

        <div className="calc-presets">
          {PRESETS.map(p => (
            <button
              key={p}
              className="calc-preset-chip"
              onClick={() => { setCredits(p); setOverMax(false); }}
              style={{
                borderColor: !overMax && credits === p ? "var(--green)" : "var(--border)",
                color: !overMax && credits === p ? "var(--green-text)" : "var(--muted)",
                background: !overMax && credits === p ? "var(--green-dim)" : "var(--surface)",
              }}
            >
              {format(p)}
            </button>
          ))}
          <button
            className="calc-preset-chip"
            onClick={() => { setCredits(MAX); setOverMax(true); }}
            style={{
              borderColor: overMax ? "var(--green)" : "var(--border)",
              color: overMax ? "var(--green-text)" : "var(--muted)",
              background: overMax ? "var(--green-dim)" : "var(--surface)",
            }}
          >
            {format(MAX)}+
          </button>
        </div>

        <input
          type="range"
          min={500}
          max={MAX}
          step={500}
          value={overMax ? MAX : credits}
          onChange={e => { setCredits(Number(e.target.value)); setOverMax(false); }}
          className="calc-slider"
          aria-label="Estimated monthly credits"
        />
        <div className="calc-scale">
          <span>500</span>
          <span>{format(MAX / 2)}</span>
          <span>{format(MAX)}+</span>
        </div>

        <div className="calc-result">
          At <strong>{overMax ? `${format(MAX)}+` : format(credits)}</strong> credits/mo, you&apos;d need the{" "}
          <strong style={{ color: "var(--green)" }}>{recommended}</strong> tier.
        </div>
      </div>

      <div className="pricing-grid" style={{ marginTop: 16 }}>
        {TIERS.map(t => {
          const isRecommended = t.name === recommended;
          return (
            <div
              key={t.name}
              className="calc-tier-card"
              style={{
                borderColor: isRecommended ? "var(--green)" : "var(--border)",
                boxShadow: isRecommended ? "0 0 0 1px var(--green)" : "none",
              }}
            >
              {isRecommended && <div className="calc-tier-badge">Fits your usage</div>}
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--green)", marginBottom: 16 }}>{t.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)" }}>{t.price}</span>
                {t.period && <span style={{ fontSize: 13, color: "var(--muted)" }}>{t.period}</span>}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 8 }}>
                {t.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--muted)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={t.href} style={{
                display: "block", textAlign: "center", fontSize: 13, fontWeight: 700, padding: "11px", borderRadius: 6, textDecoration: "none",
                background: isRecommended ? "var(--text)" : "var(--surface2)",
                color: isRecommended ? "var(--bg)" : "var(--muted)",
                border: "1px solid var(--border)",
              }}>
                {t.cta}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
