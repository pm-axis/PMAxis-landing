// Real example from /v1/markets/{id}/liquidity (docs/api/api-reference.md) — the live
// orderbook feed only ever carries one level per side, so this shows the real shape
// (best bid vs best ask on the price axis), not a fabricated multi-level depth curve.
const MARKET_ID = "3030127";
const BEST_BID = 0.49;
const BEST_ASK = 0.5;
const SPREAD = 0.01;
const MID = 0.495;
const SIZE = 105404.62;

const BID_COLOR = "var(--green)";
const ASK_COLOR = "#d03b3b";

export default function OrderbookDepth() {
  return (
    <div className="depth-chart">
      <div className="depth-legend">
        <span className="depth-legend-item"><span className="depth-swatch" style={{ background: BID_COLOR }} />Best bid</span>
        <span className="depth-legend-item"><span className="depth-swatch" style={{ background: ASK_COLOR }} />Best ask</span>
        <span className="depth-legend-item" style={{ marginLeft: "auto", color: "var(--muted)" }}>Market {MARKET_ID}</span>
      </div>

      <div className="depth-price-axis">
        <div className="depth-price-track">
          <div className="depth-price-mark bid" style={{ left: `${BEST_BID * 100}%` }} title={`Bid ${BEST_BID}`} />
          <div className="depth-price-mark ask" style={{ left: `${BEST_ASK * 100}%` }} title={`Ask ${BEST_ASK}`} />
          <div className="depth-price-spread" style={{ left: `${BEST_BID * 100}%`, width: `${(BEST_ASK - BEST_BID) * 100}%` }} />
        </div>
        <div className="depth-price-scale"><span>0.00</span><span>0.50</span><span>1.00</span></div>
      </div>

      <div className="depth-spread-rows">
        <div className="depth-spread-row">
          <span className="depth-spread-label" style={{ color: BID_COLOR }}>Bid</span>
          <span className="depth-spread-price">{BEST_BID.toFixed(2)}</span>
          <span className="depth-spread-size">size {SIZE.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="depth-spread-row">
          <span className="depth-spread-label" style={{ color: ASK_COLOR }}>Ask</span>
          <span className="depth-spread-price">{BEST_ASK.toFixed(2)}</span>
          <span className="depth-spread-size">size {SIZE.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
        </div>
      </div>

      <div className="depth-spread-readout">
        Spread <strong>{SPREAD.toFixed(2)}</strong> · mid-price <strong>{MID}</strong>
      </div>
    </div>
  );
}
