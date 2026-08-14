import { NextResponse } from "next/server";

const API_URL = "https://api.pmaxis.trade";

export async function GET() {
  const apiKey = process.env.PMAXIS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "PMAXIS_API_KEY not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${API_URL}/v1/stats`, {
      headers: { "X-API-Key": apiKey },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `upstream ${res.status}` }, { status: 502 });
    }

    const d = await res.json();
    return NextResponse.json({
      total_markets: Number(d.total_markets ?? 0),
      active_markets: Number(d.active_markets ?? 0),
    });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }
}
