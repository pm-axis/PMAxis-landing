import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pmaxis.trade";
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/mcp`, changeFrequency: "weekly", priority: 0.9 },
  ];
}
