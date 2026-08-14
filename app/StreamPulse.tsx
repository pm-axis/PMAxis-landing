"use client";
import { useEffect, useState } from "react";

const EVENT_TYPES = [
  { type: "trade", detail: "3017850 · Up @ 0.985" },
  { type: "price", detail: "3030127 · 0.49 / 0.50" },
  { type: "signal", detail: "momentum · severity: medium" },
];

export default function StreamPulse({ active }: { active: boolean }) {
  const [count, setCount] = useState(0);
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setCount(c => c + 1);
      setCursor(c => (c + 1) % EVENT_TYPES.length);
    }, 1100);
    return () => clearInterval(id);
  }, [active]);

  const current = EVENT_TYPES[cursor];

  return (
    <div className="stream-pulse">
      <div className="stream-pulse-head">
        <span className={`stream-pulse-dot ${active ? "on" : ""}`} />
        <span className="stream-pulse-status">{active ? "Connected" : "Idle"}</span>
        <span className="stream-pulse-count">{count.toLocaleString("en-US")} events this session</span>
      </div>
      <div className="stream-pulse-event" key={cursor}>
        <span className={`stream-pulse-tag ${current.type}`}>{current.type}</span>
        <span className="stream-pulse-detail">{current.detail}</span>
      </div>
      <p className="stream-pulse-note">Illustrative cadence — connect your own key to see the real feed.</p>
    </div>
  );
}
