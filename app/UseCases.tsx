import UseCasesArt from "./UseCasesArt";

const CASES = [
  {
    title: "Trading bots",
    desc: "Poll prices and orderbooks or subscribe to the WebSocket stream to react to fills in real time.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>,
  },
  {
    title: "AI agents & copilots",
    desc: "Connect over MCP and let the agent query markets, wallets, and signals with zero glue code.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M9 8V5a3 3 0 0 1 6 0v3"/><circle cx="9" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1" fill="currentColor" stroke="none"/></svg>,
  },
  {
    title: "Research & backtesting",
    desc: "Pull historical candles, resolved-market calibration, and wallet P&L to test a strategy before risking capital.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>,
  },
  {
    title: "Analytics dashboards",
    desc: "Build internal tools or public trackers on top of platform stats, leaderboards, and wallet clustering.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/></svg>,
  },
];

export default function UseCases() {
  return (
    <div className="usecases-stack">
      <div className="usecases-list">
        {CASES.map((c, i) => (
          <div key={c.title} className="usecases-item" style={{ animationDelay: `${i * 90}ms` }}>
            <div className="usecases-icon-badge">{c.icon}</div>
            <div>
              <div className="usecases-title">{c.title}</div>
              <div className="usecases-desc">{c.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <UseCasesArt />
    </div>
  );
}
