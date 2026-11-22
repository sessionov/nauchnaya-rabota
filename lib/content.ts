import fs from "node:fs"
import path from "node:path"
import { cache } from "react"
import matter from "gray-matter"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkRehype from "remark-rehype"
import rehypeKatex from "rehype-katex"
import { visit } from "unist-util-visit"
import type { Root, Element, ElementContent, Text } from "hast"
import { slugify } from "./translit"

const SECTIONS_DIR = path.join(process.cwd(), "content", "sections")

/** Описания разделов для карточек и оглавления. Пересказ содержания самих разделов. */
export const sectionMeta: Record<string, { short: string; summary: string }> = {
  vvedenie: {
    short: "Введение",
    summary:
      "Цель, задачи, гипотеза, актуальность, объект и предмет исследования; обзор научных исследований по теме и методология.",
  },
  "glava-1": {
    short: "Глава 1",
    summary:
      "Музыка в казахской степи XIX века; кюй, терме и жыр как средства воспитания и передачи духовных и философских ценностей.",
  },
  "glava-2": {
    short: "Глава 2",
    summary:
      "Музыкальная среда детства и юности Абая, влияние акынов и музыкантов, музыка как источник вдохновения и её символика в романе.",
  },
  "glava-3": {
    short: "Глава 3",
    summary:
      "Казахский оригинал и переводы Л. Соболева и А. Кима на примере отрывка «Айтыс и домбра»: лексика, синтаксис, стилистика.",
  },
  zaklyuchenie: {
    short: "Заключение",
    summary:
      "Основные выводы, значение музыки в становлении личности Абая и перспективы дальнейшего исследования темы.",
  },
}

export type Heading = { id: string; text: string; depth: 2 | 3 }
export type Chunk = { id: string | null; heading: string | null; text: string }

export type Section = {
  slug: string
  order: number
  title: string
  short: string
  summary: string
  headings: Heading[]
  chunks: Chunk[]
  words: number
  minutes: number
  hast: Root
  hasMath: boolean
}

function textOf(node: ElementContent | Root): string {
  if (node.type === "text") return node.value
  if ("children" in node) return (node.children as ElementContent[]).map(textOf).join("")
  return ""
}

const KAZAKH = /[әғқңөұүһі]/gi

/** Плагин: якоря у заголовков, обёртка таблиц, пометка казахского текста. */
function rehypeWorkStructure(headings: Heading[], chunks: Chunk[], flags: { math: boolean }) {
  return () => (tree: Root) => {
    const used = new Map<string, number>()
    visit(tree, "element", (node: Element, index, parent) => {
      if ((node.tagName === "h2" || node.tagName === "h3") && parent) {
        const text = textOf(node).trim()
        let id = slugify(text)
        const n = used.get(id) ?? 0
        used.set(id, n + 1)
        if (n) id = `${id}-${n + 1}`
        node.properties = { ...node.properties, id }
        headings.push({ id, text, depth: node.tagName === "h2" ? 2 : 3 })
        node.children.push({
          type: "element",
          tagName: "a",
          properties: { href: `#${id}`, className: ["heading-anchor", "no-print"], "aria-label": `Ссылка на раздел «${text}»` },
          children: [{ type: "text", value: "#" } as Text],
        })
      }
      if (node.tagName === "table" && parent && typeof index === "number") {
        const wrapper: Element = {
          type: "element",
          tagName: "div",
          properties: { className: ["table-scroll"], tabIndex: 0, role: "region", "aria-label": "Таблица, прокручивается по горизонтали" },
          children: [node],
        }
        ;(parent as Element).children[index] = wrapper
        return "skip"
      }
      if (node.tagName === "blockquote") {
        const t = textOf(node)
        const kk = (t.match(KAZAKH) || []).length
        if (kk > 8) node.properties = { ...node.properties, lang: "kk" }
      }
      if (node.properties?.className && String(node.properties.className).includes("katex")) flags.math = true
    })

    // Текстовые блоки для поиска: абзацы, привязанные к ближайшему заголовку.
    let current: Chunk = { id: null, heading: null, text: "" }
    chunks.push(current)
    for (const child of tree.children) {
      if (child.type !== "element") continue
      if (child.tagName === "h2" || child.tagName === "h3") {
        const h = headings.find((x) => x.id === child.properties?.id)
        current = { id: (child.properties?.id as string) ?? null, heading: h?.text ?? null, text: "" }
        chunks.push(current)
      } else {
        current.text += (current.text ? "\n" : "") + textOf(child).replace(/\s+/g, " ").trim()
      }
    }
  }
}

function parseFile(file: string): Section {
  const raw = fs.readFileSync(path.join(SECTIONS_DIR, file), "utf8")
  const { data, content } = matter(raw)
  const headings: Heading[] = []
  const chunks: Chunk[] = []
  const flags = { math: false }
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex, { output: "htmlAndMathml", strict: false })
    .use(rehypeWorkStructure(headings, chunks, flags))
  const hast = processor.runSync(processor.parse(content)) as Root
  const plain = chunks.map((c) => c.text).join(" ")
  const words = plain.split(/\s+/).filter(Boolean).length
  const slug = String(data.slug)
  const meta = sectionMeta[slug]
  return {
    slug,
    order: Number(data.order),
    title: String(data.title),
    short: meta.short,
    summary: meta.summary,
    headings,
    chunks: chunks.filter((c) => c.text),
    words,
    minutes: Math.max(1, Math.round(words / 180)),
    hast,
    hasMath: flags.math,
  }
}

export const getSections = cache((): Section[] => {
  return fs
    .readdirSync(SECTIONS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map(parseFile)
    .sort((a, b) => a.order - b.order)
})

export function getSection(slug: string): Section | undefined {
  return getSections().find((s) => s.slug === slug)
}

/** Разделы, в тексте которых встречается фраза (для пометок в списке источников). */
export function sectionsMentioning(patterns: RegExp[]): { slug: string; short: string }[] {
  return getSections()
    .filter((s) => s.chunks.some((c) => patterns.some((p) => p.test(c.text) || (c.heading ? p.test(c.heading) : false))))
    .map((s) => ({ slug: s.slug, short: s.short }))
}

/** Отрывок «Айтыс и домбра» в трёх версиях и итоговая таблица главы 3 — прямо из текста раздела. */
export function getThreeVoices() {
  const raw = fs.readFileSync(path.join(SECTIONS_DIR, "04-glava-3.md"), "utf8")
  const quoteAfter = (heading: string) => {
    const start = raw.indexOf(`### ${heading}\n`)
    if (start === -1) throw new Error(`Нет заголовка ${heading}`)
    const rest = raw.slice(start).split("\n").slice(1)
    const lines: string[] = []
    let started = false
    for (const l of rest) {
      if (l.startsWith(">")) {
        started = true
        lines.push(l.replace(/^>\s?/, ""))
      } else if (started && l.trim() === "") {
        break
      }
    }
    return lines.join("\n").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  }
  const tables = raw.split("\n").filter((l) => l.startsWith("| "))
  const row = (name: string) => {
    const line = tables.find((l) => l.startsWith(`| **${name}** |`))
    if (!line) throw new Error(`Нет строки ${name}`)
    return line.split("|").slice(2, -1).map((c) => c.trim())
  }
  const abai = row("Абай")
  const formula = row("Музыкальная формула")
  return [
    { id: "original", label: "Казахский оригинал", short: "Оригинал", lang: "kk" as const, paragraphs: quoteAfter("Казахский оригинал"), abai: abai[0], formula: formula[0] },
    { id: "sobolev", label: "Перевод Л. Соболева", short: "Соболев", lang: "ru" as const, paragraphs: quoteAfter("Перевод Л. Соболева"), abai: abai[1], formula: formula[1] },
    { id: "kim", label: "Перевод А. Кима", short: "Ким", lang: "ru" as const, paragraphs: quoteAfter("Перевод А. Кима"), abai: abai[2], formula: formula[2] },
  ]
}

/** Ссылка на подраздел по началу его заголовка; при отсутствии — ошибка сборки. */
export function anchorHref(slug: string, headingStart: string): string {
  const s = getSection(slug)
  const h = s?.headings.find((x) => x.text.startsWith(headingStart))
  if (!s || !h) throw new Error(`Нет заголовка «${headingStart}» в разделе ${slug}`)
  return `/rabota/${slug}#${h.id}`
}

/** Проверка, что цитата дословно есть в тексте раздела (сборка падает, если нет). */
export function assertQuote(slug: string, quote: string): string {
  const s = getSection(slug)
  const text = s?.chunks.map((c) => c.text).join("\n") ?? ""
  if (!text.includes(quote)) throw new Error(`Цитата не найдена в ${slug}: ${quote.slice(0, 60)}…`)
  return quote
}
