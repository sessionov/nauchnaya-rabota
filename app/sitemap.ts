import type { MetadataRoute } from "next"
import { getSections } from "@/lib/content"
import { siteUrl } from "@/lib/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  const pages = ["", "/rabota", "/prezentatsiya", "/istochniki", "/prodolzhatelyam", "/skachat", "/poisk"]
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "yearly" as const, priority: p === "" ? 1 : 0.7 })),
    ...getSections().map((s) => ({ url: `${base}/rabota/${s.slug}`, changeFrequency: "yearly" as const, priority: 0.9 })),
  ]
}
