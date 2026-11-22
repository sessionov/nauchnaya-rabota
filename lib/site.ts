/** Сведения с титульного листа работы. Ничего сверх титульного листа здесь нет. */
export const work = {
  title: "Роль музыки в становлении личности Абая",
  subtitle: "(по роману Мухтара Ауэзова «Путь Абая»)",
  subtitlePlain: "по роману Мухтара Ауэзова «Путь Абая»",
  kind: "Научный проект",
  direction: "литературоведение",
  section: "литература",
  author: "Валеев Камиль",
  authorShort: "К. Валеев",
  authorGenitive: "Камиля Валеева",
  grade: "11 класс",
  supervisor: "Левит Татьяна Борисовна",
  supervisorShort: "Т. Б. Левит",
  /** Как в оригинале титульного листа, включая кавычки. */
  institutionFull:
    "КГУ «Общеобразовательная школа имени Абая» отдела образования Федоровского района» Управления образования акимата Костанайской области",
  institutionShort: "Школа имени Абая",
  institutionRegion: "Федоровский район, Костанайская область",
  city: "Костанай",
  year: 2026,
  language: "ru",
} as const

export const siteName = "Роль музыки в становлении личности Абая"
export const siteDescription =
  "Научный проект Камиля Валеева (11 класс, школа имени Абая, 2026): роль музыки в становлении личности Абая по роману Мухтара Ауэзова «Путь Абая». Полный текст работы, презентация, источники и материалы для продолжателей."

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`
  return "http://localhost:3000"
}

export const files = {
  pdf: { href: "/files/valeev-rol-muzyki-abai-2026.pdf", size: "225 КБ", pages: 30 },
  docx: { href: "/files/valeev-rol-muzyki-abai-2026.docx", size: "57 КБ" },
  presLite: { href: "/files/valeev-prezentatsiya-2026-lite.pdf", size: "4,0 МБ" },
} as const

/** Ссылка из QR-кода на слайде 17 презентации (медиапроект «Abay Talking»). */
export const mediaProjectUrl = "https://www.youtube.com/watch?v=dOztYG-UUaU"

export const nav = [
  { href: "/rabota", label: "Работа" },
  { href: "/prezentatsiya", label: "Презентация" },
  { href: "/istochniki", label: "Источники" },
  { href: "/prodolzhatelyam", label: "Продолжателям" },
  { href: "/skachat", label: "Скачать" },
] as const

/**
 * Строка для цитирования по ГОСТ Р 7.0.100–2018 (описание электронного ресурса).
 * Адрес и дата обращения подставляются на стороне читателя.
 */
export function gostCitation(url: string, accessed: string): string {
  return `Валеев, К. Роль музыки в становлении личности Абая (по роману Мухтара Ауэзова «Путь Абая») : научный проект / К. Валеев ; научный руководитель Т. Б. Левит ; Общеобразовательная школа имени Абая. – Костанай, 2026. – URL: ${url} (дата обращения: ${accessed}). – Текст : электронный.`
}
