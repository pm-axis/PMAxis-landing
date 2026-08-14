"use client";
import { useEffect, useState } from "react";
import OrderbookDepth from "./OrderbookDepth";
import MarketsLiveStat from "./MarketsLiveStat";
import WalletPnl from "./WalletPnl";
import SignalGauge from "./SignalGauge";
import StreamPulse from "./StreamPulse";
import { highlightJSON } from "./highlight";

const AUTO_MS = 2800;
const PAUSE_TIMEOUT_MS = 6000;

type Tab = {
  id: string;
  label: string;
  method: "GET" | "WS";
  path: string;
  desc: string;
  json: string;
};

// JSON examples below are trimmed from real, documented API responses
// (docs/api/api-reference.md) — not invented sample data.
const TABS: Tab[] = [
  {
    id: "markets", label: "Markets", method: "GET", path: "/v1/markets/{id}",
    desc: "Full market profile with live pricing, straight from Postgres + Redis.",
    json: `{
  "market_id": "3017850",
  "question": "Bitcoin Up or Down - July 23, 12PM ET",
  "status": "ACTIVE",
  "category": "crypto",
  "outcomes": ["Up", "Down"],
  "yes_price": 0.985,
  "no_price": 0.015,
  "best_bid": 0.98,
  "best_ask": 0.99,
  "volume_24h": 1192892.4
}`,
  },
  {
    id: "orderbook", label: "Orderbook", method: "GET", path: "/v1/markets/{id}/liquidity",
    desc: "Best bid/ask and spread, served live from Redis. Today's feed carries one level per side.",
    json: `{
  "market_id": "3030127",
  "best_bid": 0.49,
  "best_ask": 0.5,
  "spread": 0.01,
  "mid_price": 0.495,
  "bids": [{ "price": "0.49", "size": "105404.62" }],
  "asks": [{ "price": "0.5", "size": "105404.62" }]
}`,
  },
  {
    id: "wallets", label: "Wallets", method: "GET", path: "/v1/wallets/{address}/summary",
    desc: "Trade volume, activity window, and market count for any wallet on Polymarket.",
    json: `{
  "wallet": "0xAdA100Db00Ca00073811820692005400218FcE1f",
  "total_trades": 4820,
  "total_volume": 1250000.5,
  "buy_volume": 640000.2,
  "sell_volume": 610000.3,
  "market_count": 312
}`,
  },
  {
    id: "signals", label: "Signals", method: "GET", path: "/v1/markets/{id}/signals",
    desc: "Pre-computed momentum signals with severity and threshold — no modeling required.",
    json: `{
  "signal_id": "4615c316b0d11ab2c9461d3ded5ef69386189630",
  "market_id": "3017850",
  "signal_type": "momentum",
  "severity": "medium",
  "value": 0.5618,
  "threshold": 0.05
}`,
  },
  {
    id: "stream", label: "Stream", method: "WS", path: "/stream",
    desc: "Subscribe to price, trade, and signal events over one authenticated WebSocket connection.",
    json: `ws://api.pmaxis.trade/stream?api_key=YOUR_KEY

> { "subscribe": ["price", "trades"], "market_id": "*" }
< { "type": "trade", "market_id": "3017850",
    "side": "Up", "price": 0.985, "size": 500 }`,
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

  // A phantom hover (content shifting under a stationary cursor on load/scroll)
  // can pause this with no matching mouseleave ever firing. Auto-resume after
  // a few seconds so it never gets permanently stuck on one tab.
  useEffect(() => {
    if (!paused) return;
    const id = setTimeout(() => setPaused(false), PAUSE_TIMEOUT_MS);
    return () => clearTimeout(id);
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
          {tab.id === "markets" && <MarketsLiveStat />}
          {tab.id === "orderbook" && <OrderbookDepth />}
          {tab.id === "wallets" && <WalletPnl />}
          {tab.id === "signals" && <SignalGauge />}
          {tab.id === "stream" && <StreamPulse active={active === "stream" && !paused} />}
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
