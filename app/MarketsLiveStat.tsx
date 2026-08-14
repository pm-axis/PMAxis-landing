"use client";
import { useEffect, useState } from "react";
import StatCounter from "./StatCounter";

export default function MarketsLiveStat() {
  const [stats, setStats] = useState<{ total_markets: number; active_markets: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/platform-stats")
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (!cancelled && d && !d.error) setStats(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!stats) return null;

  return (
    <div className="markets-live-stat">
      <div className="markets-live-badge">
        <span className="markets-live-dot" />
        Live
      </div>
      <div className="markets-live-grid">
        <div>
          <StatCounter target={stats.total_markets} suffix="+" label="Markets ingested" />
        </div>
        <div>
          <StatCounter target={stats.active_markets} suffix="+" label="Active right now" />
        </div>
      </div>
    </div>
  );
}
