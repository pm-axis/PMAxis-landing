"use client";
import { useState } from "react";

type Level = { price: number; size: number };

const BIDS: Level[] = [
  { price: 0.61, size: 18400 },
  { price: 0.60, size: 22100 },
  { price: 0.585, size: 15000 },
  { price: 0.57, size: 9000 },
];
const ASKS: Level[] = [
  { price: 0.63, size: 15900 },
  { price: 0.64, size: 30200 },
  { price: 0.655, size: 12000 },
  { price: 0.67, size: 8000 },
];

const BID_COLOR = "var(--green)";
const ASK_COLOR = "#d03b3b";

const W = 480, H = 200, MID_X = W / 2, BASE_Y = 170, TOP_Y = 20;
const STEP = 90;

function cumulative(levels: Level[]) {
  let sum = 0;
  return levels.map(l => { sum += l.size; return { ...l, cum: sum }; });
}

function buildStep(levels: { price: number; size: number; cum: number }[], maxCum: number, dir: 1 | -1) {
  const points: [number, number][] = [[MID_X, BASE_Y]];
  levels.forEach((l, i) => {
    const x = MID_X + dir * (i * STEP + STEP * 0.5);
    const y = BASE_Y - (l.cum / maxCum) * (BASE_Y - TOP_Y);
    const prevX = MID_X + dir * (i * STEP);
    points.push([prevX, points[points.length - 1][1]]);
    points.push([prevX, y]);
    points.push([x, y]);
  });
  const last = points[points.length - 1];
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const areaPath = `${linePath} L${last[0]},${BASE_Y} L${MID_X},${BASE_Y} Z`;
  return { linePath, areaPath, last, points };
}

export default function OrderbookDepth() {
  const [hover, setHover] = useState<{ side: "bid" | "ask"; i: number } | null>(null);

  const bids = cumulative(BIDS);
  const asks = cumulative(ASKS);
  const maxCum = Math.max(bids[bids.length - 1].cum, asks[asks.length - 1].cum);

  const bidStep = buildStep(bids, maxCum, -1);
  const askStep = buildStep(asks, maxCum, 1);

  const hoveredLevel = hover ? (hover.side === "bid" ? bids[hover.i] : asks[hover.i]) : null;

  return (
    <div className="depth-chart">
      <div className="depth-legend">
        <span className="depth-legend-item"><span className="depth-swatch" style={{ background: BID_COLOR }} />Bids</span>
        <span className="depth-legend-item"><span className="depth-swatch" style={{ background: ASK_COLOR }} />Asks</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Orderbook depth: cumulative bid and ask size by price">
        <line x1={0} y1={BASE_Y} x2={W} y2={BASE_Y} stroke="var(--border)" strokeWidth="1" />
        <line x1={MID_X} y1={TOP_Y} x2={MID_X} y2={BASE_Y} stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4" />

        <path d={bidStep.areaPath} fill={BID_COLOR} fillOpacity="0.1" />
        <path d={askStep.areaPath} fill={ASK_COLOR} fillOpacity="0.1" />
        <path d={bidStep.linePath} stroke={BID_COLOR} strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d={askStep.linePath} stroke={ASK_COLOR} strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

        {/* hit targets */}
        {bids.map((l, i) => (
          <rect key={`b${i}`} x={MID_X - (i + 1) * STEP} y={TOP_Y} width={STEP} height={BASE_Y - TOP_Y}
            fill="transparent" onMouseEnter={() => setHover({ side: "bid", i })} onMouseLeave={() => setHover(null)} />
        ))}
        {asks.map((l, i) => (
          <rect key={`a${i}`} x={MID_X + i * STEP} y={TOP_Y} width={STEP} height={BASE_Y - TOP_Y}
            fill="transparent" onMouseEnter={() => setHover({ side: "ask", i })} onMouseLeave={() => setHover(null)} />
        ))}

        <circle cx={bidStep.last[0]} cy={bidStep.last[1]} r="4" fill={BID_COLOR} stroke="var(--surface)" strokeWidth="2" />
        <circle cx={askStep.last[0]} cy={askStep.last[1]} r="4" fill={ASK_COLOR} stroke="var(--surface)" strokeWidth="2" />

        <text x={16} y={BASE_Y - 8} fontSize="10" fontFamily="var(--font-geist-mono), monospace" fill="var(--muted)">BIDS</text>
        <text x={W - 16} y={BASE_Y - 8} textAnchor="end" fontSize="10" fontFamily="var(--font-geist-mono), monospace" fill="var(--muted)">ASKS</text>

        {hover && hoveredLevel && (
          <line
            x1={hover.side === "bid" ? MID_X - hover.i * STEP - STEP / 2 : MID_X + hover.i * STEP + STEP / 2}
            y1={TOP_Y}
            x2={hover.side === "bid" ? MID_X - hover.i * STEP - STEP / 2 : MID_X + hover.i * STEP + STEP / 2}
            y2={BASE_Y}
            stroke="var(--muted)" strokeWidth="1" strokeOpacity="0.3"
          />
        )}
      </svg>
      <div className="depth-tooltip" style={{ opacity: hoveredLevel ? 1 : 0 }}>
        {hoveredLevel ? (
          <>
            <strong>{hover!.side === "bid" ? "Bid" : "Ask"}</strong> {hoveredLevel.price.toFixed(3)} · cumulative {hoveredLevel.cum.toLocaleString("en-US")}
          </>
        ) : "Hover a step for depth at that price"}
      </div>
    </div>
  );
}
