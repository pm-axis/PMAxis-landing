import Nav from "./Nav";
import Footer from "./Footer";
import HeroArt from "./HeroArt";
import HeroBadge from "./HeroBadge";
import Ticker from "./Ticker";
import PricingCalculator from "./PricingCalculator";
import ToolsShowcase from "./ToolsShowcase";
import DevPlatform from "./DevPlatform";
import Reveal from "./Reveal";
import AgentFlow from "./AgentFlow";
import UseCases from "./UseCases";

const API_URL = "https://api.pmaxis.trade";

const ENDPOINT_GROUPS = [
  {
    label: "Markets",
    endpoints: [
      { method: "GET", path: "/v1/markets",                desc: "List all prediction markets" },
      { method: "GET", path: "/v1/markets/{id}/price",     desc: "Live price for a market" },
      { method: "GET", path: "/v1/markets/{id}/orderbook", desc: "Full orderbook snapshot" },
      { method: "GET", path: "/v1/markets/{id}/candles",   desc: "OHLCV candlestick data" },
      { method: "GET", path: "/v1/markets/{id}/signals",   desc: "Signals and analytics" },
    ],
  },
  {
    label: "Trades & stats",
    endpoints: [
      { method: "GET", path: "/v1/trades/recent",          desc: "Latest trades across markets" },
      { method: "GET", path: "/v1/stats",                  desc: "Platform-wide statistics" },
    ],
  },
  {
    label: "Realtime",
    endpoints: [
      { method: "WS",  path: "/stream",                    desc: "Real-time WebSocket feed" },
    ],
  },
];

const s = {
  btnGreen:   { fontSize:13, fontWeight:700, background:"var(--green)", color:"var(--bg)", padding:"8px 16px", borderRadius:5, textDecoration:"none" },
  btnOutline: { fontSize:14, fontWeight:500, color:"var(--text)", border:"1px solid var(--border)", padding:"12px 24px", borderRadius:6, textDecoration:"none", background:"var(--surface)" },
  section:    { maxWidth:1180, margin:"0 auto", padding:"0 24px" },
  card:       { background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:24 },
  h2:         { fontFamily:"var(--font-serif), Georgia, serif", fontSize:38, letterSpacing:"-0.02em", color:"var(--text)", marginBottom:12 },
  sub:        { fontSize:15, color:"var(--muted)", lineHeight:1.7, maxWidth:480, marginBottom:56 },
  muted:      { color:"var(--muted)" },
  text:       { color:"var(--text)" },
};

export default function Home() {
  return (
    <>
      <style>{`
        .hero-h1 { font-size: 54px; line-height: 1.08; letter-spacing: -0.03em; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 999px; margin-bottom: 32px; letter-spacing: 0.08em; text-transform: uppercase; }
        .hero-sub { font-size: 17px; color: var(--muted); line-height: 1.7; max-width: 520px; margin: 0 auto 40px; }
        .hero-btns { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 32px; padding: 32px 24px; text-align: center; max-width: 1180px; margin: 0 auto; }
        .stat-val { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 16px; }
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 16px; }
        .endpoint-row { display: flex; align-items: center; gap: 16px; padding: 14px 24px; }
        .endpoint-desc { font-size: 13px; color: var(--muted); }
        .code-snippet { background: #111111; border: 1px solid #1E1E1E; border-radius: 14px; padding: 24px; text-align: left; max-width: 620px; margin: 64px auto 0; overflow-x: auto; }
        .code-pre { font-family: var(--font-geist-mono), monospace; font-size: 13px; line-height: 1.9; margin: 0; }
        .sec-px { padding-left: 24px; padding-right: 24px; }
        .mcp-teaser-row { flex-direction: row; }

        @media (max-width: 640px) {
          .hero-h1 { font-size: 30px; line-height: 1.18; }
          .hero-badge { font-size: 10px; padding: 5px 10px; margin-bottom: 20px; }
          .hero-sub { font-size: 15px; margin-bottom: 28px; }
          .hero-btns { flex-direction: column; align-items: stretch; padding: 0; }
          .hero-btns a { text-align: center; }
          .stats-grid { grid-template-columns: repeat(2,1fr); gap: 12px; padding: 20px 16px; }
          .stat-val { font-size: 22px; }
          .features-grid { grid-template-columns: 1fr; gap: 12px; }
          .pricing-grid { grid-template-columns: 1fr; gap: 12px; }
          .endpoint-desc { display: none; }
          .endpoint-row { padding: 11px 14px; gap: 10px; }
          .code-snippet { border-radius: 10px; padding: 14px; margin-top: 32px; }
          .code-pre { font-size: 11px; line-height: 1.65; }
          .mcp-teaser-row { flex-direction: column; }
          .ticker-wrap { max-width: 100%; }
          .calc-card { padding: 20px 16px; }
          .tools-label-active { font-size: 13px; }
          .section-pad { padding-top: 48px !important; padding-bottom: 48px !important; }
          .h2-mobile { font-size: 26px !important; margin-bottom: 8px !important; }
          .cta-h2 { font-size: 26px !important; }
          .sec-px { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>

      <Nav />

      <main style={{flex:1, paddingTop:84}}>

        {/* HERO */}
        <section style={{maxWidth:1180, margin:"0 auto", paddingTop:64, paddingBottom:80, textAlign:"center", position:"relative", zIndex:0}} className="section-pad sec-px">
          <HeroArt />
          <HeroBadge />
          <h1 className="hero-h1 font-serif" style={{color:"var(--text)", maxWidth:700, margin:"0 auto 20px"}}>
            Prediction market data,<br/>ready for your application.
          </h1>
          <p className="hero-sub">
            Real-time prices, orderbooks, trades, signals, and on-chain data across all major prediction markets — one REST API and WebSocket stream.
          </p>
          <div className="hero-btns">
            <a href={`${API_URL}/signup`} style={{...s.btnGreen, fontSize:14, padding:"13px 28px", borderRadius:6}}>
              Get free API key
            </a>
            <a href={`${API_URL}/docs`} style={s.btnOutline}>View docs</a>
          </div>

          {/* CODE SNIPPET */}
          <div className="code-snippet">
            <div style={{display:"flex", gap:8, marginBottom:20}}>
              <span style={{width:12, height:12, borderRadius:"50%", background:"#FF5F57"}}></span>
              <span style={{width:12, height:12, borderRadius:"50%", background:"#FFBD2E"}}></span>
              <span style={{width:12, height:12, borderRadius:"50%", background:"#28C840"}}></span>
              <span style={{marginLeft:12, fontSize:11, color:"#555", fontFamily:"monospace"}}>terminal</span>
            </div>
            <pre className="code-pre">
              <span style={{color:"#555"}}># Get live price for any market</span>{"\n"}
              <span style={{color:"#00E676"}}>curl</span>
              <span style={{color:"#fff"}}> -H </span>
              <span style={{color:"#F59E0B"}}>&quot;X-API-Key: YOUR_KEY&quot;</span>{" \\\n     "}
              <span style={{color:"#6B8CFF"}}>https://api.pmaxis.trade/v1/markets/&#123;id&#125;/price</span>{"\n\n"}
              <span style={{color:"#555"}}># Subscribe to live stream</span>{"\n"}
              <span style={{color:"#00E676"}}>wscat</span>
              <span style={{color:"#fff"}}> -H </span>
              <span style={{color:"#F59E0B"}}>&quot;X-API-Key: YOUR_KEY&quot;</span>{" \\\n     "}
              <span style={{color:"#6B8CFF"}}>wss://api.pmaxis.trade/stream</span>
              <span className="term-cursor" />
            </pre>
          </div>

          <div style={{marginTop:40}}>
            <Ticker />
          </div>
        </section>

        {/* TOOLS SHOWCASE */}
        <Reveal>
          <section style={{...s.section, paddingTop:112, paddingBottom:96}} className="section-pad sec-px">
            <div className="eyebrow">01 — Tools</div>
            <h2 className="section-h2 h2-mobile">Powerful tools, easy to use</h2>
            <p className="section-sub">Every data type PMAxis exposes, with a real endpoint and a real response shape. Pick one to see it.</p>
            <ToolsShowcase />
          </section>
        </Reveal>

        {/* MCP TEASER */}
        <Reveal>
          <section style={{...s.section, paddingTop:96, paddingBottom:96, display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:40, flexWrap:"wrap"}} className="mcp-teaser-row section-pad sec-px">
            <div style={{maxWidth:480}}>
              <div className="eyebrow">02 — Agents</div>
              <h2 className="section-h2 h2-mobile">Built for AI agents, not just apps</h2>
              <p style={{...s.sub, marginBottom:32}}>
                Connect Claude, Cursor, Windsurf, or any MCP-compatible agent directly to PMAxis. 60+ tools for market discovery, wallet analysis, and live signals — no scraping, no glue code.
              </p>
              <a href="/mcp" style={{...s.btnOutline, display:"inline-flex", alignItems:"center", gap:8}}>
                Explore MCP tools
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
            <div style={{flex:"1 1 320px", maxWidth:400}}>
              <AgentFlow />
            </div>
          </section>
        </Reveal>

        {/* USE CASES */}
        <Reveal>
          <section style={{...s.section, paddingTop:96, paddingBottom:96}} className="section-pad sec-px">
            <div className="eyebrow">03 — Built for</div>
            <h2 className="section-h2 h2-mobile">One API, every kind of builder</h2>
            <p className="section-sub">From automated bots to research notebooks — the same endpoints, different jobs.</p>
            <UseCases />
          </section>
        </Reveal>

        {/* ENDPOINTS */}
        <Reveal>
          <section style={{...s.section, paddingTop:96, paddingBottom:96}} className="section-pad sec-px">
            <div className="eyebrow">04 — Reference</div>
            <h2 className="section-h2 h2-mobile">Clean, predictable API</h2>
            <p className="section-sub">Standard REST conventions. JSON responses. One header for auth.</p>
            <div className="endpoint-groups">
              {ENDPOINT_GROUPS.map(group => (
                <div key={group.label} className="endpoint-group">
                  <div className="endpoint-group-label">{group.label}</div>
                  {group.endpoints.map(e=>(
                    <a key={e.path} href={`${API_URL}/docs`} className="endpoint-row">
                      <span style={{fontFamily:"monospace", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:4, width:44, textAlign:"center", flexShrink:0,
                        background: e.method==="WS" ? "var(--tag-ws)" : "var(--tag-get)",
                        color: e.method==="WS" ? "var(--tag-ws-text)" : "var(--tag-get-text)"
                      }}>{e.method}</span>
                      <code style={{fontFamily:"monospace", fontSize:13, color:"var(--text)", flex:1, wordBreak:"break-all"}}>{e.path}</code>
                      <span className="endpoint-desc">{e.desc}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="endpoint-arrow"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                  ))}
                </div>
              ))}
            </div>
            <div style={{marginTop:24, textAlign:"center"}}>
              <a href={`${API_URL}/docs`} style={{fontSize:13, color:"var(--muted)", textDecoration:"underline", textUnderlineOffset:4}}>View full API reference</a>
            </div>
          </section>
        </Reveal>

        {/* DEV PLATFORM */}
        <Reveal>
          <section style={{...s.section, paddingTop:96, paddingBottom:96}} className="section-pad sec-px">
            <DevPlatform />
          </section>
        </Reveal>

        {/* PRICING */}
        <Reveal>
          <section style={{...s.section, paddingTop:96, paddingBottom:96}} className="section-pad sec-px">
            <div className="eyebrow">06 — Pricing</div>
            <h2 className="section-h2 h2-mobile">Simple pricing</h2>
            <p className="section-sub">Start free. Scale when you need to.</p>
            <PricingCalculator />
          </section>
        </Reveal>

        {/* CTA */}
        <section style={{background:"var(--text)", borderTop:"1px solid var(--border)"}}>
          <div style={{...s.section, paddingTop:96, paddingBottom:96, textAlign:"center"}} className="section-pad sec-px">
            <h2 className="font-serif cta-h2" style={{fontSize:44, letterSpacing:"-0.03em", color:"var(--bg)", marginBottom:16}}>
              Start building in minutes.
            </h2>
            <p style={{fontSize:15, color:"rgba(128,128,128,0.8)", marginBottom:40, maxWidth:420, margin:"0 auto 40px", lineHeight:1.7}}>
              Sign up, get your API key instantly, and make your first request before your coffee gets cold.
            </p>
            <a href={`${API_URL}/signup`} style={{display:"inline-block", background:"var(--green)", color:"var(--bg)", fontSize:14, fontWeight:700, padding:"14px 32px", borderRadius:6, textDecoration:"none"}}>
              Get free API key
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
