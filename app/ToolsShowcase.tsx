"use client";
import { useEffect, useState } from "react";
import OrderbookDepth from "./OrderbookDepth";
import { highlightJSON } from "./highlight";

const AUTO_MS = 4200;

type Tab = {
  id: string;
  label: string;
  method: "GET" | "WS";
  path: string;
  desc: string;
  json: string;
};

const TABS: Tab[] = [
  {
    id: "markets", label: "Markets", method: "GET", path: "/v1/markets",
    desc: "Search and list every active prediction market with live pricing.",
    json: `{
  "id": "will-fed-cut-q1-2026",
  "question": "Fed cuts rates in Q1 2026?",
  "yes_price": 0.62,
  "no_price": 0.38,
  "volume_24h": 4120000,
  "category": "macro",
  "resolves": "2026-03-31"
}`,
  },
  {
    id: "orderbook", label: "Orderbook", method: "GET", path: "/v1/markets/{id}/orderbook",
    desc: "Full bid/ask depth snapshot, updated on every fill.",
    json: `{
  "market_id": "will-fed-cut-q1-2026",
  "bids": [
    { "price": 0.61, "size": 18400 },
    { "price": 0.60, "size": 22100 }
  ],
  "asks": [
    { "price": 0.63, "size": 15900 },
    { "price": 0.64, "size": 30200 }
  ]
}`,
  },
  {
    id: "wallets", label: "Wallets", method: "GET", path: "/v1/wallets/{address}/pnl",
    desc: "Realized and unrealized P&L, calibration, and open positions for any wallet.",
    json: `{
  "address": "0x7a3f...9c21",
  "realized_pnl": 48250.12,
  "unrealized_pnl": 6120.40,
  "brier_score": 0.14,
  "open_positions": 7,
  "win_rate": 0.71
}`,
  },
  {
    id: "signals", label: "Signals", method: "GET", path: "/v1/markets/{id}/signals",
    desc: "Pre-computed momentum, sentiment, and breakout signals — no modeling required.",
    json: `{
  "market_id": "ai-model-tops-benchmark",
  "momentum": "rising",
  "sentiment": 0.74,
  "breakout_score": 8.2,
  "confidence": "high"
}`,
  },
  {
    id: "stream", label: "Stream", method: "WS", path: "/stream",
    desc: "Subscribe to price, trade, and orderbook events over one WebSocket connection.",
    json: `> { "subscribe": ["price", "trades"], "market_id": "*" }

< { "type": "trade", "market_id": "btc-120k-march",
    "side": "YES", "price": 0.41, "size": 500 }
< { "type": "price", "market_id": "btc-120k-march",
    "yes": 0.415, "no": 0.585 }`,
  },
];

export default function ToolsShowcase() {
  const [active, setActive] = useState(TABS[0].id);
  const [paused, setPaused] = useState(false);
  const tab = TABS.find(t => t.id === active)!;
  const activeIndex = TABS.findIndex(t => t.id === active);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive(prev => {
        const i = TABS.findIndex(t => t.id === prev);
        return TABS[(i + 1) % TABS.length].id;
      });
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="tools-indicator-row">
        {TABS.map((t, i) => (
          <div key={t.id} className="tools-indicator" aria-hidden="true">
            <span
              className="tools-indicator-fill"
              style={{
                transform: i < activeIndex ? "scaleX(1)" : i > activeIndex ? "scaleX(0)" : undefined,
                animationName: i === activeIndex && !paused ? "tabProgress" : "none",
                animationDuration: `${AUTO_MS}ms`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="tools-label-row">
        <span className="tools-label-active">{tab.label}</span>
        <span className="tools-label-count">{String(activeIndex + 1).padStart(2, "0")} / {String(TABS.length).padStart(2, "0")}</span>
      </div>

      <div className="tools-panel" key={tab.id}>
        <div className="tools-panel-left tools-fade-in">
          <span className="tools-method" style={{
            background: tab.method === "WS" ? "var(--tag-ws)" : "var(--tag-get)",
            color: tab.method === "WS" ? "var(--tag-ws-text)" : "var(--tag-get-text)",
          }}>{tab.method}</span>
          <code className="tools-path">{tab.path}</code>
          <p className="tools-desc">{tab.desc}</p>
          {tab.id === "orderbook" && <OrderbookDepth />}
        </div>
        <div className="code-snippet tools-code tools-fade-in">
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }}></span>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }}></span>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }}></span>
            <span style={{ marginLeft: 12, fontSize: 11, color: "#555", fontFamily: "monospace" }}>response</span>
          </div>
          <pre
            className="code-pre"
            style={{ color: "#e4e4e4", whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: highlightJSON(tab.json) + '<span class="term-cursor"></span>' }}
          />
        </div>
      </div>
    </div>
  );
}
