"use client";
import { useEffect, useRef, useState } from "react";

type ApiRow = { id: string; name: string; price: number; volume: number };
type Row = { id: string; name: string; yes: number; vol: string; delta: number };

const POLL_MS = 20000;

function formatVol(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}

function Chip({ r }: { r: Row }) {
  const up = r.delta >= 0;
  return (
    <div className="ticker-chip">
      <span className="ticker-name">{r.name}</span>
      <span className="ticker-yes">{r.yes}¢</span>
      {r.delta !== 0 && (
        <span className={`ticker-delta ${up ? "up" : "down"}`}>
          {up ? "▲" : "▼"} {Math.abs(r.delta)}
        </span>
      )}
      <span className="ticker-vol">{r.vol}</span>
    </div>
  );
}

export default function Ticker() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const prevPrices = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/ticker");
        if (!res.ok) return;
        const { rows: apiRows }: { rows: ApiRow[] } = await res.json();
        if (cancelled || !apiRows?.length) return;

        const next: Row[] = apiRows.map(m => {
          const yes = Math.round(m.price * 100);
          const prevYes = prevPrices.current.get(m.id);
          const delta = prevYes !== undefined ? yes - prevYes : 0;
          prevPrices.current.set(m.id, yes);
          return { id: m.id, name: truncate(m.name, 42), yes, vol: formatVol(m.volume), delta };
        });
        setRows(next);
      } catch {
        // leave last known good rows in place
      }
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  if (!rows || rows.length === 0) return null;

  const doubled = [...rows, ...rows];

  return (
    <div className="ticker-wrap" role="img" aria-label="Live prediction market feed">
      <div className="ticker-fade ticker-fade-l" />
      <div className="ticker-fade ticker-fade-r" />
      <div className="ticker-track">
        {doubled.map((r, i) => (
          <Chip key={`${r.id}-${i}`} r={r} />
        ))}
      </div>
    </div>
  );
}
