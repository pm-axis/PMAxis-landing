// Real example from /v1/wallets/{address}/summary (docs/api/api-reference.md).
const WALLET = "0xAdA1...FcE1f";
const TOTAL_TRADES = 4820;
const TOTAL_VOLUME = 1250000.5;
const BUY_VOLUME = 640000.2;
const SELL_VOLUME = 610000.3;
const MARKET_COUNT = 312;

function fmtUsd(n: number) {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function WalletPnl() {
  const buyPct = (BUY_VOLUME / TOTAL_VOLUME) * 100;

  return (
    <div className="wallet-pnl">
      <div className="wallet-pnl-addr">{WALLET}</div>
      <div className="wallet-pnl-split-track">
        <div className="wallet-pnl-split-buy" style={{ width: `${buyPct}%` }} />
        <div className="wallet-pnl-split-sell" style={{ width: `${100 - buyPct}%` }} />
      </div>
      <div className="wallet-pnl-split-legend">
        <span><span className="wallet-pnl-dot buy" />Buy {fmtUsd(BUY_VOLUME)}</span>
        <span><span className="wallet-pnl-dot sell" />Sell {fmtUsd(SELL_VOLUME)}</span>
      </div>
      <div className="wallet-pnl-stats">
        <div>
          <div className="wallet-pnl-stat-val">{TOTAL_TRADES.toLocaleString("en-US")}</div>
          <div className="wallet-pnl-stat-label">Total trades</div>
        </div>
        <div>
          <div className="wallet-pnl-stat-val">{MARKET_COUNT}</div>
          <div className="wallet-pnl-stat-label">Markets traded</div>
        </div>
        <div>
          <div className="wallet-pnl-stat-val">{fmtUsd(TOTAL_VOLUME)}</div>
          <div className="wallet-pnl-stat-label">Total volume</div>
        </div>
      </div>
    </div>
  );
}
