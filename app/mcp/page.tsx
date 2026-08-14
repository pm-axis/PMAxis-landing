"use client";
import { useState } from "react";
import Nav from "../Nav";
import Footer from "../Footer";
import Reveal from "../Reveal";
import HeroArt from "../HeroArt";
import { highlightJSON } from "../highlight";

const API_URL = "https://api.pmaxis.trade";
const MCP_URL = "https://mcp.pmaxis.trade";

/* ── brand tokens ──────────────────────────────────────────── */
const B = {
  green:  "#00E676",
  purple: "#8B5CF6",
  black:  "#0A0A0A",
  white:  "#FFFFFF",
  grey:   "#A1A1AA",
  greenDim:   "rgba(0,230,118,0.10)",
  purpleDim:  "rgba(139,92,246,0.10)",
  greenBorder:"rgba(0,230,118,0.25)",
  purpleBorder:"rgba(139,92,246,0.25)",
  grad: "linear-gradient(135deg, #00E676 0%, #8B5CF6 100%)",
};


/* ── data ──────────────────────────────────────────────────── */
const CLAUDE_CONFIG = `{
  "mcpServers": {
    "pmaxis": {
      "command": "npx",
      "args": ["-y", "@pmaxis/mcp-server"],
      "env": {
        "PMAXIS_API_KEY": "YOUR_API_KEY",
        "PMAXIS_API_URL": "${API_URL}"
      }
    }
  }
}`;

const CURSOR_CONFIG = `{
  "mcpServers": {
    "pmaxis": {
      "url": "${MCP_URL}/sse?key=YOUR_API_KEY"
    }
  }
}`;

const WINDSURF_CONFIG = `{
  "mcpServers": {
    "pmaxis": {
      "url": "${MCP_URL}/sse?key=YOUR_API_KEY"
    }
  }
}`;

const PYTHON_CONFIG = `from mcp.client.sse import sse_client
from mcp import ClientSession

async with sse_client(
    "${MCP_URL}/sse?key=YOUR_API_KEY"
) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()
        result = await session.call_tool(
            "get_top_markets", {"limit": 5}
        )`;

const CONFIG_PATHS = {
  windows: "C:\\Users\\<name>\\AppData\\Roaming\\Claude\\claude_desktop_config.json",
  mac:     "~/Library/Application Support/Claude/claude_desktop_config.json",
};

const NPM_CONFIG = `# Install globally once
npm install -g @pmaxis/mcp-server

# Then add to your claude_desktop_config.json:
{
  "mcpServers": {
    "pmaxis": {
      "command": "pmaxis-mcp",
      "args": [],
      "env": {
        "PMAXIS_API_KEY": "YOUR_API_KEY",
        "PMAXIS_API_URL": "${API_URL}"
      }
    }
  }
}`;

const AGENTS = [
  { id: "claude",   label: "Claude Desktop", badge: "npx", color: B.green,  borderColor: B.greenBorder,  dimColor: B.greenDim },
  { id: "npm",      label: "npm (global)",    badge: "npm", color: B.green,  borderColor: B.greenBorder,  dimColor: B.greenDim },
  { id: "cursor",   label: "Cursor",          badge: "SSE", color: B.purple, borderColor: B.purpleBorder, dimColor: B.purpleDim },
  { id: "windsurf", label: "Windsurf",        badge: "SSE", color: B.purple, borderColor: B.purpleBorder, dimColor: B.purpleDim },
  { id: "python",   label: "Python SDK",      badge: "SSE", color: B.purple, borderColor: B.purpleBorder, dimColor: B.purpleDim },
];

const AGENT_CONFIGS: Record<string, string> = {
  claude:   CLAUDE_CONFIG,
  npm:      NPM_CONFIG,
  cursor:   CURSOR_CONFIG,
  windsurf: WINDSURF_CONFIG,
  python:   PYTHON_CONFIG,
};

const AGENT_NOTES: Record<string, { path?: string; note: string }> = {
  claude: {
    path: "claude_desktop_config.json",
    note: "Requires Node.js 18+. npx downloads the package automatically on first use — no install step needed. Quit Claude Desktop fully from the system tray, then reopen.",
  },
  npm: {
    path: "claude_desktop_config.json",
    note: "Global install runs faster than npx since the package is already on disk. Run the npm install once, then use the config above. Works with Claude Desktop, Cursor, or any agent that supports stdio.",
  },
  cursor: {
    path: "~/.cursor/mcp.json",
    note: "Cursor supports SSE remote servers natively. Restart Cursor after saving.",
  },
  windsurf: {
    path: "~/.codeium/windsurf/mcp_config.json",
    note: "Windsurf supports SSE remote servers. Reload the window after saving.",
  },
  python: {
    note: "Install the MCP SDK: pip install mcp. The SSE client connects directly to the hosted server — no local process needed.",
  },
};

const TOOL_GROUPS = [
  {
    label: "Market Discovery",
    tools: [
      { name: "search_markets",         desc: "Full-text search across all markets" },
      { name: "list_markets",           desc: "Paginated list with filters" },
      { name: "get_top_markets",        desc: "Highest-volume markets" },
      { name: "get_trending_markets",   desc: "Markets with rising activity" },
      { name: "get_new_markets",        desc: "Recently created markets" },
      { name: "get_resolving_markets",  desc: "Markets closing within 7 days" },
      { name: "get_breaking_markets",   desc: "Sharpest price move in the last hour" },
      { name: "get_markets_by_timeframe", desc: "Active markets grouped by duration bucket (5m–long), optional asset filter" },
      { name: "compare_markets",        desc: "Side-by-side market comparison" },
    ],
  },
  {
    label: "Market Detail",
    tools: [
      { name: "get_market",                desc: "Full market profile" },
      { name: "get_market_summary",        desc: "Concise snapshot with key stats" },
      { name: "get_market_stats",          desc: "Volume, liquidity, trade counts" },
      { name: "get_market_liquidity",      desc: "Liquidity depth breakdown" },
      { name: "get_market_sentiment",      desc: "Crowd sentiment indicators" },
      { name: "get_market_signals",        desc: "Pre-computed momentum signals" },
      { name: "get_market_health",         desc: "Data freshness check for one market" },
      { name: "get_market_orderbook",      desc: "Current best bid/ask snapshot" },
      { name: "get_market_orderbook_history", desc: "Orderbook snapshots over time (rolling 2-day window)" },
      { name: "get_market_price",          desc: "Current YES/NO prices" },
      { name: "get_market_price_history",  desc: "Historical price series" },
      { name: "get_market_trades",         desc: "Recent trade history" },
      { name: "get_market_candles",        desc: "OHLCV candlestick data (1m/5m/1h)" },
      { name: "get_market_positions",      desc: "Open positions in a market" },
      { name: "get_related_markets",       desc: "Semantically similar markets" },
      { name: "get_markets_calibration",   desc: "Platform-wide: price before resolution vs actual outcome, Brier score" },
    ],
  },
  {
    label: "Wallet",
    tools: [
      { name: "search_wallets",            desc: "Browse/filter wallets by volume, trades, category, recency" },
      { name: "get_wallet_summary",        desc: "Portfolio value and P&L" },
      { name: "get_wallet_activity",       desc: "Full trade and activity history" },
      { name: "get_wallet_markets",        desc: "All markets a wallet has traded" },
      { name: "get_wallet_open_positions", desc: "Current open positions" },
      { name: "get_wallet_onchain",        desc: "Verified on-chain transactions" },
      { name: "get_wallet_pnl",            desc: "Real realized/unrealized P&L per market, not just volume" },
      { name: "get_wallet_calibration",    desc: "Brier score on resolved positions + unrealized edge on open ones" },
      { name: "get_leaderboard",           desc: "Top wallets by traded volume over a window" },
      { name: "get_positions",             desc: "Open positions for a wallet (Polymarket Data API)" },
      { name: "get_closed_positions",      desc: "Closed/settled positions for a wallet" },
      { name: "watch_wallet",              desc: "Register a wallet for richer activity tracking" },
      { name: "unwatch_wallet",            desc: "Stop tracking a wallet" },
      { name: "get_watched_wallets",       desc: "List all currently watched wallets" },
    ],
  },
  {
    label: "Wallet Clustering",
    tools: [
      { name: "get_wallet_clusters", desc: "Wallets sharing an on-chain USDC funding source — a Sybil/multi-account signal" },
      { name: "get_wallet_cluster",  desc: "One wallet's funding source and every wallet sharing it, plus wallets trading in lockstep with it" },
    ],
  },
  {
    label: "Organization",
    tools: [
      { name: "get_events",           desc: "Top-level event containers" },
      { name: "get_event_markets",    desc: "Markets inside an event" },
      { name: "get_categories",       desc: "Market category list" },
      { name: "get_category_markets", desc: "Markets in a specific category" },
      { name: "get_tags",             desc: "All available topic tags" },
      { name: "get_series",           desc: "Recurring market series" },
    ],
  },
  {
    label: "Platform",
    tools: [
      { name: "get_platform_stats",  desc: "Global volume, trade counts, market totals" },
      { name: "get_recent_trades",   desc: "Latest trades across all markets" },
      { name: "get_batch_prices",    desc: "Current prices for multiple markets at once" },
      { name: "get_current_time",    desc: "Authoritative server time — don't infer 'now' from market data" },
      { name: "get_pipeline_status", desc: "Data-freshness check across discovery/ingestion/trades" },
      { name: "get_top_signals",     desc: "Strongest live trading signals across every market" },
    ],
  },
];

const TOOL_COUNT = TOOL_GROUPS.reduce((n, g) => n + g.tools.length, 0);

const PROMPTS = [
  "What are the top 5 prediction markets by volume right now?",
  "Find all markets about the 2026 US elections and compare their prices.",
  "Show me the orderbook for the most liquid market today.",
  "Which markets are resolving this week with the highest trading activity?",
  "Analyze the price history of the most popular AI market over 7 days.",
  "Look up wallet 0x123… and summarize its open positions and P&L.",
  "Show me trending markets in the crypto category.",
  "What is the current sentiment and signal for the top AI market?",
];

/* ── page ──────────────────────────────────────────────────── */
export default function McpPage() {
  const [agent, setAgent] = useState("claude");
  const activeAgent = AGENTS.find(a => a.id === agent)!;
  const note = AGENT_NOTES[agent];

  return (
    <>
      <style>{`
        .mcp-page { font-family: var(--font-geist-sans), 'Helvetica Neue', sans-serif; }

        /* hero */
        .mcp-hero { background: ${B.black}; padding: 88px 24px 80px; text-align: center; position: relative; overflow: hidden; }
        .mcp-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,230,118,0.12) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 40% at 80% 80%, rgba(139,92,246,0.10) 0%, transparent 60%);
          pointer-events: none;
        }
        .mcp-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 6px 16px; border-radius: 999px; margin-bottom: 32px;
          background: rgba(0,230,118,0.08); border: 1px solid rgba(0,230,118,0.2); color: ${B.green};
          position: relative;
        }
        .mcp-hero-h1 {
          font-family: var(--font-serif), Georgia, serif; font-weight: 400;
          font-size: 56px; line-height: 1.08; letter-spacing: -0.02em;
          color: ${B.white}; max-width: 660px; margin: 0 auto 20px; position: relative;
        }
        .mcp-grad-text {
          background: ${B.grad};
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .mcp-hero-sub {
          font-size: 16px; color: ${B.grey}; line-height: 1.7;
          max-width: 480px; margin: 0 auto 40px; position: relative;
        }
        .mcp-hero-cta {
          display: inline-flex; align-items: center; gap: 10px;
          background: ${B.grad}; color: ${B.black};
          font-size: 14px; font-weight: 700; padding: 13px 30px;
          border-radius: 6px; text-decoration: none; position: relative;
          font-family: var(--font-geist-sans), sans-serif;
          transition: opacity 0.15s;
        }
        .mcp-hero-cta:hover { opacity: 0.88; }

        /* section */
        .mcp-section { max-width: 1180px; margin: 0 auto; padding: 72px 24px; }

        /* agent tabs */
        .agent-tabs { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 32px; }
        .agent-tab {
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 13px; font-weight: 600;
          padding: 8px 18px; border-radius: 6px; cursor: pointer;
          border: 1px solid var(--border);
          background: var(--surface); color: var(--muted);
          transition: all 0.15s; display: flex; align-items: center; gap: 8px;
        }
        .agent-tab-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 2px 7px; border-radius: 4px; }

        /* config block */
        .config-wrap { border-radius: 12px; overflow: hidden; border: 1px solid #1e1e1e; }
        .config-bar { background: #161616; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e1e1e; }
        .config-dots { display: flex; gap: 6px; }
        .config-dot { width: 10px; height: 10px; border-radius: 50%; }
        .config-label { font-size: 11px; color: #555; font-family: monospace; }
        .config-pre { background: #0d0d0d; padding: 20px 24px; font-family: var(--font-geist-mono), monospace; font-size: 13px; line-height: 1.9; color: #e4e4e4; overflow-x: auto; margin: 0; white-space: pre; }
        .config-copy { font-family: var(--font-geist-sans), sans-serif; font-size: 11px; font-weight: 600; background: transparent; border: 1px solid #333; color: #888; border-radius: 4px; padding: 4px 10px; cursor: pointer; transition: all 0.15s; }
        .config-copy:hover { border-color: ${B.green}; color: ${B.green}; }

        /* path box */
        .path-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin: 14px 0 5px; }
        .path-box { font-family: monospace; font-size: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 9px 14px; color: var(--muted); overflow-x: auto; white-space: nowrap; }

        /* note box */
        .note-box { font-size: 13px; color: var(--muted); background: var(--surface); border: 1px solid var(--border); border-left: 3px solid ${B.green}; border-radius: 6px; padding: 12px 16px; line-height: 1.65; margin-top: 16px; }

        /* step */
        .step-row { display: flex; gap: 16px; margin-bottom: 32px; }
        .step-num { width: 28px; height: 28px; border-radius: 50%; background: ${B.greenDim}; color: ${B.green}; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; border: 1px solid ${B.greenBorder}; }
        .step-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
        .step-desc { font-size: 13px; color: var(--muted); line-height: 1.65; }

        /* prompts */
        .prompt-item { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 18px 22px; margin-bottom: 10px; display: flex; gap: 14px; align-items: flex-start; transition: border-color 0.15s; }
        .prompt-item:hover { border-color: ${B.greenBorder}; }
        .prompt-arrow { color: ${B.green}; font-size: 16px; flex-shrink: 0; margin-top: 1px; }
        .prompt-text { font-size: 14px; color: var(--text); line-height: 1.55; font-weight: 500; }

        /* tools */
        .tool-group-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); padding-bottom: 12px; border-bottom: 1px solid var(--border); margin-bottom: 4px; }
        .tool-list { column-count: 2; column-gap: 40px; }
        .tool-row {
          display: flex; align-items: baseline; gap: 14px; padding: 11px 0;
          border-bottom: 1px solid var(--border); break-inside: avoid;
          border-radius: 8px; transition: background 0.15s;
        }
        .tool-row:hover { background: var(--surface); margin: 0 -14px; padding: 11px 14px; }
        .tool-name { font-family: var(--font-geist-mono), monospace; font-size: 12.5px; font-weight: 600; color: var(--green-text); flex-shrink: 0; white-space: nowrap; }
        .tool-desc { flex: 1; min-width: 0; font-size: 12.5px; color: var(--muted); line-height: 1.5; }

        /* cta dark */
        .mcp-cta-dark { background: ${B.black}; border-top: 1px solid #1a1a1a; }
        .mcp-cta-inner { max-width: 1180px; margin: 0 auto; padding: 80px 24px; text-align: center; }
        .mcp-cta-h2 { font-size: 40px; font-weight: 700; letter-spacing: -0.025em; color: ${B.white}; margin-bottom: 16px; }
        .mcp-cta-sub { font-size: 15px; color: ${B.grey}; margin-bottom: 40px; max-width: 380px; margin-left: auto; margin-right: auto; line-height: 1.7; }

        /* footer */

        @media (max-width: 640px) {
          .mcp-hero-h1 { font-size: 30px; }
          .mcp-hero { padding: 60px 16px 56px; }
          .mcp-section { padding: 48px 16px; }
          .mcp-cta-h2 { font-size: 28px; }
          .tool-list { column-count: 1; }
          .agent-tabs { gap: 8px; }
          .agent-tab { font-size: 12px; padding: 7px 12px; }
        }
      `}</style>

      <div className="mcp-page">

        <Nav active="mcp" />

        {/* ── HERO ── */}
        <div className="mcp-hero" style={{ paddingTop: 84, zIndex: 0 }}>
          <HeroArt />
          <div className="mcp-hero-badge">
            <span style={{ width:6, height:6, borderRadius:"50%", background:B.green, display:"inline-block" }}></span>
            Model Context Protocol · {TOOL_COUNT} live tools
          </div>
          <h1 className="mcp-hero-h1">
            Ask your AI agent about<br />
            <span className="mcp-grad-text">any prediction market.</span>
          </h1>
          <p className="mcp-hero-sub">
            Connect Claude, Cursor, Windsurf, or any MCP-compatible agent to live PMAxis data — prices, orderbooks, signals, and wallet history across every prediction market we index.
          </p>
          <a href={`${API_URL}/signup`} className="mcp-hero-cta">
            Get free API key
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        {/* ── SETUP GUIDE ── */}
        <Reveal>
        <section style={{ maxWidth:1180, margin:"0 auto", padding:"96px 24px 72px" }}>
          <div className="eyebrow">01 — Setup</div>
          <h2 className="section-h2">Connect your agent</h2>
          <p className="section-sub">
            Pick your agent below. Each has a different config format — the right one is shown automatically.
          </p>

          {/* Agent selector */}
          <div className="agent-tabs">
            {AGENTS.map(a => (
              <button
                key={a.id}
                className="agent-tab"
                onClick={() => setAgent(a.id)}
                style={{
                  borderColor: agent === a.id ? a.borderColor : "var(--border)",
                  background:  agent === a.id ? a.dimColor   : "var(--surface)",
                  color:       agent === a.id ? a.color      : "var(--muted)",
                }}
              >
                {a.label}
                <span className="agent-tab-badge" style={{ background: agent === a.id ? a.dimColor : "var(--surface2,#f0f0ee)", color: a.color, border:`1px solid ${a.borderColor}` }}>
                  {a.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Steps */}
          <div>
            {/* Step 1 — get key */}
            <div className="step-row">
              <div className="step-num">1</div>
              <div>
                <div className="step-title">Get a free API key</div>
                <div className="step-desc">
                  Sign up at <a href={`${API_URL}/signup`} style={{ color:"var(--text)", textDecoration:"underline", textUnderlineOffset:3 }}>api.pmaxis.trade/signup</a> — no credit card, key issued instantly.
                </div>
              </div>
            </div>

            {/* Step 2 — node (claude + npm) */}
            {(agent === "claude" || agent === "npm") && (
              <div className="step-row">
                <div className="step-num">2</div>
                <div>
                  <div className="step-title">Install Node.js 18+</div>
                  <div className="step-desc">
                    Download from <a href="https://nodejs.org" style={{ color:"var(--text)", textDecoration:"underline", textUnderlineOffset:3 }}>nodejs.org</a>. Confirm with <code style={{ fontFamily:"monospace", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:4, padding:"2px 6px", fontSize:12 }}>node -v</code> in your terminal.
                  </div>
                </div>
              </div>
            )}

            {/* Step 2/3 — config */}
            <div className="step-row">
              <div className="step-num">{agent === "claude" ? 3 : 2}</div>
              <div style={{ flex:1 }}>
                <div className="step-title">
                  {note.path ? `Add to ${note.path}` : "Connect via SDK"}
                </div>
                <div className="step-desc" style={{ marginBottom:14 }}>
                  {(agent === "claude" || agent === "npm")
                    ? <>Open the file below, paste the config, replace <code style={{ fontFamily:"monospace", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:4, padding:"2px 6px", fontSize:12 }}>YOUR_API_KEY</code> with your key.</>
                    : agent === "python"
                    ? "Install the MCP SDK and paste this snippet into your agent code."
                    : <>Open the config file for {activeAgent.label}, paste this block, replace <code style={{ fontFamily:"monospace", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:4, padding:"2px 6px", fontSize:12 }}>YOUR_API_KEY</code>.</>
                  }
                </div>

                {/* File paths for Claude Desktop + npm */}
                {(agent === "claude" || agent === "npm") && (
                  <>
                    <div className="path-label">Windows</div>
                    <div className="path-box">{CONFIG_PATHS.windows}</div>
                    <div className="path-label">macOS</div>
                    <div className="path-box">{CONFIG_PATHS.mac}</div>
                    <div style={{ marginTop:16 }} />
                  </>
                )}

                {/* Config block */}
                <div className="config-wrap">
                  <div className="config-bar">
                    <div className="config-dots">
                      <div className="config-dot" style={{ background:"#FF5F57" }}></div>
                      <div className="config-dot" style={{ background:"#FFBD2E" }}></div>
                      <div className="config-dot" style={{ background:"#28C840" }}></div>
                    </div>
                    <span className="config-label">{note.path || "agent.py"}</span>
                    <button className="config-copy" onClick={(e) => {
                      const btn = e.currentTarget;
                      navigator.clipboard?.writeText(AGENT_CONFIGS[agent]);
                      btn.textContent = "Copied!";
                      setTimeout(() => { btn.textContent = "Copy"; }, 2000);
                    }}>Copy</button>
                  </div>
                  <pre
                    className="config-pre"
                    dangerouslySetInnerHTML={{ __html: highlightJSON(AGENT_CONFIGS[agent]) + '<span class="term-cursor"></span>' }}
                  />
                </div>

                <div className="note-box">{note.note}</div>
              </div>
            </div>

            {/* Step 3/4 — restart (not python) */}
            {agent !== "python" && (
              <div className="step-row">
                <div className="step-num">{(agent === "claude" || agent === "npm") ? 4 : 3}</div>
                <div>
                  <div className="step-title">
                    {(agent === "claude" || agent === "npm") ? "Quit and reopen Claude Desktop" : `Restart ${activeAgent.label}`}
                  </div>
                  <div className="step-desc">
                    {(agent === "claude" || agent === "npm")
                      ? "Quit fully from the system tray (not just close the window). After relaunch, a hammer icon appears in the chat input — click it to confirm PMAxis tools are loaded."
                      : `Reload or restart ${activeAgent.label} after saving the config. PMAxis tools appear automatically in the agent's tool list.`
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        </Reveal>

        {/* ── PROMPTS ── */}
        <Reveal>
        <div className="mcp-section">
          <div className="eyebrow">02 — Prompts</div>
          <h2 className="section-h2">What to ask</h2>
          <p className="section-sub">
            Once connected, ask naturally. Your agent picks the right tools automatically.
          </p>
          <div>
            {PROMPTS.map((p, i) => (
              <div key={i} className="prompt-item">
                <span className="prompt-arrow">›</span>
                <span className="prompt-text">{p}</span>
              </div>
            ))}
          </div>
        </div>
        </Reveal>

        {/* ── TOOLS ── */}
        <Reveal>
        <div className="mcp-section">
          <div className="eyebrow">03 — Tools</div>
          <h2 className="section-h2">{TOOL_COUNT} tools, live data</h2>
          <p className="section-sub">Every tool calls the PMAxis REST API in real time. No stale data.</p>
          <p className="section-sub" style={{ marginTop: -20 }}>
            <strong>Cursor, Windsurf, and the Python SDK connect via the hosted SSE server and get all {TOOL_COUNT} tools.</strong> The <code style={{ fontFamily:"monospace", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:4, padding:"2px 6px", fontSize:12 }}>@pmaxis/mcp-server</code> npm package (used by the Claude Desktop / npm setup above) is on an older release and currently exposes 34 of these — the newer wallet-calibration, wallet-clustering, and orderbook-history tools aren&apos;t in it yet. Prefer Cursor/Windsurf/Python if you need full coverage today.
          </p>
          {TOOL_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: 40 }}>
              <div className="tool-group-label">{group.label}</div>
              <div className="tool-list">
                {group.tools.map(tool => (
                  <div key={tool.name} className="tool-row">
                    <code className="tool-name">{tool.name}</code>
                    <span className="tool-desc">{tool.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        </Reveal>

        {/* ── CTA ── */}
        <div className="mcp-cta-dark">
          <div className="mcp-cta-inner">
            <h2 className="mcp-cta-h2">
              Ready to <span className="mcp-grad-text">start?</span>
            </h2>
            <p className="mcp-cta-sub">Free API key. No credit card. All {TOOL_COUNT} tools on the free tier.</p>
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
              <a href={`${API_URL}/signup`} className="mcp-hero-cta">Get free API key</a>
              <a href={`${API_URL}/docs`} style={{ display:"inline-flex", alignItems:"center", fontSize:14, fontWeight:600, color:B.grey, padding:"13px 28px", borderRadius:6, textDecoration:"none", border:`1px solid #2a2a2a`, fontFamily:"var(--font-geist-sans), sans-serif", transition:"border-color 0.15s" }}>
                API reference
              </a>
            </div>
          </div>
        </div>

        <Footer />

      </div>
    </>
  );
}
