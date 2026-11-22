import sourcesMd from "@/content/sources-md.json"
import { sectionsMentioning } from "./content"

export type Mention = { href: string; label: string }

export type Source = {
  n: number
  /** Запись в точности как в работе; *курсив* как в оригинале. */
  md: string
  plain: string
  /** Проверенная ссылка или DOI. null — ссылку найти не удалось. */
  url: string | null
  mentions: Mention[]
  /** Автор и название для поиска книги в Google Книгах. */
  searchQuery: string
}

/**
 * Проверка ссылок (ноябрь 2026): по каждой записи искали точное совпадение автора,
 * названия, издательства и года. Ни для одной записи подтверждённой страницы издания
 * не найдено, поэтому url = null: строка «Ссылка» не показывается, вместо неё
 * у каждой записи есть кнопка поиска книги в Google Книгах.
 */
const verifiedUrls: Record<number, string> = {}

/** Где источник фигурирует. В тексте работы нет внутритекстовых ссылок вида [1]. */
function mentionsFor(n: number): Mention[] {
  if (n === 1) {
    return sectionsMentioning([/«Путь Абая»/, /Ауэзов/]).map((s) => ({
      href: `/rabota/${s.slug}`,
      label: s.short,
    }))
  }
  if (n === 4 || n === 5 || n === 6) {
    return [{ href: "/prezentatsiya#slide-4", label: "Презентация, слайд 4" }]
  }
  return []
}

/** Автор + название без описания в скобках: «Ауэзов Путь Абая». */
function searchQueryFor(md: string): string {
  let t = md.replace(/\*/g, "").replace(/\s*\([^)]*\)\s*\.?\s*$/, "")
  t = t.split(" / ")[0].split(/\s[–—]\s/)[0]
  t = t.replace(/(^|[\s,])[А-ЯЁA-ZӘҒҚҢӨҰҮҺІ]\.(?=\s|$)/g, " ").replace(/,/g, " ")
  return t.replace(/\s+/g, " ").replace(/[.:]\s*$/, "").trim()
}

export function getSources(): Source[] {
  return (sourcesMd as string[]).map((md, i) => {
    const n = i + 1
    return {
      n,
      md,
      plain: md.replace(/\*/g, ""),
      url: verifiedUrls[n] ?? null,
      mentions: mentionsFor(n),
      searchQuery: searchQueryFor(md),
    }
  })
}
