"use client";
import { useEffect, useState } from "react";

const CALLS = [
  "get_top_markets",
  "get_wallet_pnl",
  "get_market_orderbook",
  "get_top_signals",
];

const NODES = [
  { id: "agent", label: "Your agent" },
  { id: "mcp", label: "PMAxis MCP" },
  { id: "data", label: "Live data" },
];

export default function AgentFlow() {
  const [call, setCall] = useState(0);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCall(c => (c + 1) % CALLS.length);
      setPulse(p => p + 1);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="agentflow">
      <div className="agentflow-nodes">
        {NODES.map((n, i) => (
          <div className="agentflow-node-wrap" key={n.id}>
            <div className={`agentflow-node ${n.id === "mcp" ? "agentflow-node-mcp" : ""}`}>
              <span className="agentflow-node-dot" />
              <span className="agentflow-node-label">{n.label}</span>
            </div>
            {i < NODES.length - 1 && (
              <div className="agentflow-line">
                <span className="agentflow-packet" key={`${i}-${pulse}`} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="agentflow-call" key={call}>
        <span className="agentflow-call-dot" />
        <code>{CALLS[call]}()</code>
      </div>
    </div>
  );
}
