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
}

/**
 * Проверка ссылок (ноябрь 2026): по каждой записи искали точное совпадение автора,
 * названия, издательства и года. Ни для одной записи подтверждённой страницы издания
 * не найдено, поэтому url = null и на сайте стоит пометка «ссылка не найдена».
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

export function getSources(): Source[] {
  return (sourcesMd as string[]).map((md, i) => {
    const n = i + 1
    return {
      n,
      md,
      plain: md.replace(/\*/g, ""),
      url: verifiedUrls[n] ?? null,
      mentions: mentionsFor(n),
    }
  })
}
