import type { Metadata } from "next"
import { Download } from "lucide-react"
import { files } from "@/lib/site"

export const metadata: Metadata = {
  title: "Скачать",
  description: "Файлы научного проекта о роли музыки в становлении личности Абая: работа в PDF и Word, презентация защиты.",
  alternates: { canonical: "/skachat" },
}

const items = [
  {
    title: "Работа, PDF",
    href: files.pdf.href,
    meta: `PDF, ${files.pdf.pages} страниц, ${files.pdf.size}`,
    note: "Сделан из исходного файла Word без изменений текста. Удобен для чтения и печати.",
    primary: true,
  },
  {
    title: "Работа, Word",
    href: files.docx.href,
    meta: `DOCX, ${files.docx.size}`,
    note: "Исходный файл работы, байт в байт. Подходит, если нужно цитировать или редактировать.",
  },
  {
    title: "Презентация, PDF",
    href: files.presLite.href,
    meta: `PDF, 18 слайдов, ${files.presLite.size}`,
    note: "Все 18 слайдов в виде изображений. Текст со слайдов в этом файле не выделяется.",
  },
]

export default function DownloadPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="text-display font-semibold tracking-[-0.025em]">Скачать</h1>
      <p className="mt-5 max-w-[56ch] text-lead text-muted-foreground">Работа и презентация защиты для чтения без интернета.</p>

      <ul className="mt-12 flex max-w-[64rem] flex-col gap-1">
        {items.map((it) => (
          <li key={it.href} className="grid gap-4 bg-muted/60 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6">
            <div>
              <h2 className="text-lead font-semibold">{it.title}</h2>
              <p className="mt-1 text-[0.9375rem] text-muted-foreground">{it.meta}</p>
              <p className="mt-2 max-w-[60ch] leading-relaxed">{it.note}</p>
            </div>
            <a
              href={it.href}
              download
              className={
                it.primary
                  ? "inline-flex min-h-12 w-fit items-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition-[background-color,transform] duration-150 hover:bg-primary/90 active:scale-[0.98]"
                  : "inline-flex min-h-12 w-fit items-center gap-2 bg-background px-5 font-semibold transition-[background-color,transform] duration-150 hover:bg-accent active:scale-[0.98]"
              }
            >
              <Download aria-hidden className="size-4" />
              Скачать
              <span className="sr-only">{it.title}</span>
            </a>
          </li>
        ))}
      </ul>

      <section aria-labelledby="appendix-title" className="mt-16 max-w-[64rem]">
        <h2 id="appendix-title" className="text-head font-semibold">
          Приложения
        </h2>
        <p className="mt-4 max-w-[64ch] leading-relaxed">
          Во введении сказано, что в приложении представлены литературные эпизоды с музыкальными образами и их
          интерпретация, а в главе 3 упоминается регистр 33 музыкальных эпизодов. Отдельного файла приложения в
          материалах нет. Часть таблиц с разбором эпизодов есть на слайдах 7 и 15 презентации.
        </p>
      </section>
    </div>
  )
}
