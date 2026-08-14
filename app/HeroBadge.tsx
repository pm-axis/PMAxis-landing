"use client";
import { useEffect, useRef, useState } from "react";

export default function HeroBadge() {
  const [total, setTotal] = useState<number | null>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/platform-stats")
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (!cancelled && d && !d.error) setTotal(d.total_markets); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (total === null || started.current) return;
    started.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setDisplay(total); return; }
    const duration = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(total * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [total]);

  return (
    <div className="hero-badge" style={{ background: "var(--green-dim)", color: "var(--green-text)", border: "1px solid var(--green-dim)" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block", flexShrink: 0 }}></span>
      {total !== null ? `${display.toLocaleString("en-US")}+ markets ingested, all time` : "Live — prediction market data"}
    </div>
  );
}
