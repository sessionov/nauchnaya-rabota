export type SearchDoc = {
  id: string
  kind: "section" | "source" | "slide" | "page"
  title: string
  heading: string | null
  text: string
  url: string
}

const ENDINGS = [
  "иями", "ями", "ами", "ого", "его", "ому", "ему", "ыми", "ими", "ией", "ией",
  "ах", "ях", "ов", "ев", "ей", "ой", "ый", "ий", "ая", "яя", "ое", "ее", "ые", "ие",
  "ам", "ям", "ом", "ем", "ую", "юю", "ия", "ию", "ии",
  "а", "я", "о", "е", "ы", "и", "у", "ю", "ь",
]

/** Нижний регистр, ё → е и грубое отсечение русских окончаний (одинаково для индекса и запроса). */
export function normalize(term: string): string {
  let t = term.toLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}-]/gu, "")
  if (/^[а-я]+$/.test(t) && t.length > 4) {
    for (const end of ENDINGS) {
      if (t.endsWith(end) && t.length - end.length >= 3) {
        t = t.slice(0, -end.length)
        break
      }
    }
  }
  return t
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)
}

/** Фрагмент текста вокруг первого совпадения с подсветкой <mark>. Текст экранируется. */
export function buildSnippet(text: string, query: string, radius = 90): string {
  const stems = query
    .split(/\s+/)
    .map(normalize)
    .filter((s) => s.length >= 2)
  const lower = text.toLowerCase().replace(/ё/g, "е")
  let pos = -1
  let len = 0
  for (const s of stems) {
    const i = lower.indexOf(s)
    if (i !== -1 && (pos === -1 || i < pos)) {
      pos = i
      len = s.length
    }
  }
  if (pos === -1) {
    const head = text.slice(0, radius * 2)
    return escapeHtml(head) + (text.length > head.length ? "…" : "")
  }
  // расширяем совпадение до конца слова
  while (pos + len < text.length && /\p{L}/u.test(text[pos + len])) len++
  const start = Math.max(0, pos - radius)
  const end = Math.min(text.length, pos + len + radius)
  return (
    (start > 0 ? "…" : "") +
    escapeHtml(text.slice(start, pos)) +
    "<mark>" +
    escapeHtml(text.slice(pos, pos + len)) +
    "</mark>" +
    escapeHtml(text.slice(pos + len, end)) +
    (end < text.length ? "…" : "")
  )
}
