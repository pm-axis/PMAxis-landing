import { NextResponse } from "next/server";

const API_URL = "https://api.pmaxis.trade";

// TODO: set PMAXIS_API_KEY in the deploy environment (Vercel project settings, etc).
// Use a dedicated low-privilege free-tier key for this — it's a public-facing proxy.
export async function GET() {
  const apiKey = process.env.PMAXIS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "PMAXIS_API_KEY not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${API_URL}/v1/markets/top?by=volume&limit=8&period=24h`, {
      headers: { "X-API-Key": apiKey },
      next: { revalidate: 20 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `upstream ${res.status}` }, { status: 502 });
    }

    const markets = await res.json();
    const rows = (Array.isArray(markets) ? markets : []).map((m: Record<string, unknown>) => ({
      id: String(m.market_id ?? m.slug ?? m.question),
      name: String(m.question ?? "Untitled market"),
      price: typeof m.price === "number" ? m.price : Number(m.price ?? 0),
      volume: typeof m.volume_period === "number" ? m.volume_period : Number(m.volume_24h ?? m.volume ?? 0),
    }));

    return NextResponse.json({ rows });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }
}
