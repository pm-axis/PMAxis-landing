"use client";
import { useEffect, useState } from "react";

// Three product-glimpse cards using real PMAxis endpoints, real webhook channel
// names, and (for the third card) an actual live market pulled from /api/ticker —
// same route the hero ticker uses — instead of one hardcoded example.

const ENDPOINTS = [
  { method: "GET", path: "/v1/markets" },
  { method: "GET", path: "/v1/events" },
  { method: "GET", path: "/v1/wallets/{address}" },
  { method: "GET", path: "/v1/markets/{id}/signals" },
];

const WEBHOOK_EVENTS = [
  { channel: "trade", when: "2s ago" },
  { channel: "onchain_trade", when: "1m ago" },
  { channel: "signal", when: "3m ago" },
];

// Static sparkline path — a fixed data set, not randomly generated (randomness at
// render time is what caused the earlier hydration-mismatch bug).
const SPARK_POINTS = [4, 18, 10, 26, 16, 32, 22, 40, 30, 46, 38, 52, 44, 58];
const SPARK_W = 200, SPARK_H = 60;
const sparkPath = SPARK_POINTS.map((v, i) => {
  const x = (i / (SPARK_POINTS.length - 1)) * SPARK_W;
  const y = SPARK_H - (v / 58) * SPARK_H;
  return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
}).join(" ");

function ApiReferenceCard() {
  return (
    <div className="glimpse-card">
      <div className="glimpse-head">
        <span className="glimpse-dot green" />
        <span className="glimpse-title">API Reference</span>
      </div>
      <div className="glimpse-body">
        {ENDPOINTS.map(e => (
          <div className="glimpse-endpoint" key={e.path}>
            <span className="glimpse-method">{e.method}</span>
            <code className="glimpse-path">{e.path}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

function WebhooksCard() {
  return (
    <div className="glimpse-card">
      <div className="glimpse-head">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c0-2.5 1.5-4 1.5-4H4M6 10l1.5-1.5A4 4 0 0 1 12 7a4 4 0 0 1 4 4v1.5"/></svg>
        <span className="glimpse-title">{WEBHOOK_EVENTS.length} webhooks triggered</span>
      </div>
      <div className="glimpse-body glimpse-timeline">
        {WEBHOOK_EVENTS.map((w, i) => (
          <div className="glimpse-event" key={w.channel} style={{ animationDelay: `${i * 120}ms` }}>
            <code className="glimpse-event-channel">{w.channel}</code>
            <span className="glimpse-event-when">{w.when}</span>
            <span className="glimpse-event-code">200</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}

function MarketChartCard() {
  const [market, setMarket] = useState<{ name: string; price: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ticker")
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (cancelled || !d?.rows?.length) return;
        setMarket({ name: d.rows[0].name, price: d.rows[0].price });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="glimpse-card">
      <div className="glimpse-head">
        <span className="glimpse-title">{market ? truncate(market.name, 26) : "Top market"}</span>
        <span className="glimpse-live"><span className="glimpse-dot green" />Live</span>
      </div>
      <div className="glimpse-chart-wrap">
        <svg viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} width="100%" height="70" preserveAspectRatio="none">
          <path d={sparkPath} fill="none" stroke="var(--green)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={SPARK_W} cy={SPARK_H - (SPARK_POINTS[SPARK_POINTS.length - 1] / 58) * SPARK_H} r="3" fill="var(--green)" />
        </svg>
      </div>
    </div>
  );
}

export default function UseCasesArt() {
  return (
    <div className="glimpse-row" aria-hidden="true">
      <ApiReferenceCard />
      <WebhooksCard />
      <MarketChartCard />
    </div>
  );
}
