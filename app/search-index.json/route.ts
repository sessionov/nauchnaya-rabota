import { getSections } from "@/lib/content"
import { getSources } from "@/lib/sources"
import { slides } from "@/lib/slides"
import { getGlossary } from "@/lib/glossary"
import type { SearchDoc } from "@/lib/search-shared"

export const dynamic = "force-static"

/** Поисковый индекс собирается при сборке и отдаётся статическим JSON. */
export function GET() {
  const docs: SearchDoc[] = []
  for (const s of getSections()) {
    s.chunks.forEach((c, i) => {
      docs.push({
        id: `${s.slug}-${i}`,
        kind: "section",
        title: s.title,
        heading: c.heading,
        text: c.text,
        url: `/rabota/${s.slug}${c.id ? `#${c.id}` : ""}`,
      })
    })
  }
  for (const src of getSources()) {
    docs.push({
      id: `src-${src.n}`,
      kind: "source",
      title: "Список литературы",
      heading: `Источник ${src.n}`,
      text: src.plain,
      url: `/istochniki#src-${src.n}`,
    })
  }
  for (const sl of slides) {
    const table = sl.table ? [sl.table.head.join(" "), ...sl.table.rows.map((r) => r.join(" "))].join(" ") : ""
    docs.push({
      id: `slide-${sl.n}`,
      kind: "slide",
      title: "Презентация",
      heading: `Слайд ${sl.n}: ${sl.title}`,
      text: [...sl.lines, table].filter(Boolean).join(" "),
      url: `/prezentatsiya#slide-${sl.n}`,
    })
  }
  for (const g of getGlossary()) {
    docs.push({
      id: `gloss-${g.term}`,
      kind: "page",
      title: "Для продолжателей: глоссарий",
      heading: g.term.replace(/[«»]/g, ""),
      text: g.def,
      url: "/prodolzhatelyam#glossariy",
    })
  }
  return Response.json(docs, { headers: { "Cache-Control": "public, max-age=3600" } })
}
