import type { Metadata } from "next"
import Link from "next/link"
import { plural } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { getSections } from "@/lib/content"
import { getSources } from "@/lib/sources"
import { work } from "@/lib/site"

export const metadata: Metadata = {
  title: "Текст работы",
  description: "Титульный лист и оглавление научного проекта «Роль музыки в становлении личности Абая»: введение, три главы, заключение и список литературы.",
  alternates: { canonical: "/rabota" },
}

export default function WorkIndexPage() {
  const sections = getSections()
  const sources = getSources()
  const totalMinutes = sections.reduce((a, s) => a + s.minutes, 0)

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-12">
        <header className="lg:col-span-7">
          <h1 className="text-display font-semibold tracking-[-0.025em]">Текст работы</h1>
          <p className="mt-5 max-w-[56ch] text-lead text-muted-foreground">
            Полный текст без сокращений, разбитый по разделам, как в оригинале. Всего около {totalMinutes} минут чтения.
          </p>
          <Link
            href={`/rabota/${sections[0].slug}`}
            className="group mt-8 inline-flex min-h-12 items-center gap-2 bg-primary px-6 font-semibold text-primary-foreground transition-[background-color,transform] duration-150 hover:bg-primary/90 active:scale-[0.98]"
          >
            Начать с введения
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </header>

        <section aria-labelledby="title-page" className="bg-muted p-6 sm:p-8 lg:col-span-5">
          <h2 id="title-page" className="text-lead font-semibold">
            Титульный лист
          </h2>
          <dl className="mt-5 grid gap-x-6 gap-y-3 text-[0.9375rem] sm:grid-cols-[10rem_1fr]">
            <dt className="text-muted-foreground">Учреждение</dt>
            <dd>{work.institutionFull}</dd>
            <dt className="text-muted-foreground">Тема</dt>
            <dd>
              {work.title} {work.subtitle}
            </dd>
            <dt className="text-muted-foreground">Вид работы</dt>
            <dd>{work.kind}</dd>
            <dt className="text-muted-foreground">Направление</dt>
            <dd>{work.direction}</dd>
            <dt className="text-muted-foreground">Секция</dt>
            <dd>{work.section}</dd>
            <dt className="text-muted-foreground">Выполнил</dt>
            <dd>
              {work.author}, {work.grade}, школа имени Абая
            </dd>
            <dt className="text-muted-foreground">Научный руководитель</dt>
            <dd>{work.supervisor}</dd>
            <dt className="text-muted-foreground">Город и год</dt>
            <dd>
              {work.city}, {work.year} г.
            </dd>
          </dl>
        </section>
      </div>

      <section aria-labelledby="toc-title" className="mt-20 lg:mt-28">
        <h2 id="toc-title" className="text-head font-semibold">
          Оглавление
        </h2>
        <ol className="mt-8 flex flex-col gap-1">
          {sections.map((s) => (
            <li key={s.slug}>
              <div className="grid gap-4 bg-muted/60 p-5 sm:p-6 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <Link href={`/rabota/${s.slug}`} className="text-lead font-semibold underline-offset-4 hover:text-primary hover:underline">
                    {s.title}
                  </Link>
                  <p className="mt-2 text-[0.9375rem] leading-snug text-muted-foreground">
                    {s.summary} Около {s.minutes} мин.
                  </p>
                </div>
                {s.headings.filter((h) => h.depth === 2).length ? (
                  <ul className="flex flex-col gap-1 lg:col-span-7">
                    {s.headings
                      .filter((h) => h.depth === 2)
                      .map((h) => (
                        <li key={h.id}>
                          <Link
                            href={`/rabota/${s.slug}#${h.id}`}
                            className="inline-flex min-h-10 items-center text-[0.9375rem] underline decoration-border underline-offset-4 hover:decoration-primary"
                          >
                            {h.text}
                          </Link>
                        </li>
                      ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
          <li>
            <div className="grid gap-4 bg-muted/60 p-5 sm:p-6 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Link href="/istochniki" className="text-lead font-semibold underline-offset-4 hover:text-primary hover:underline">
                  Список литературы
                </Link>
                <p className="mt-2 text-[0.9375rem] text-muted-foreground">{sources.length} {plural(sources.length, "запись", "записи", "записей")}, с поиском и проверкой ссылок.</p>
              </div>
            </div>
          </li>
        </ol>
        <p className="mt-8 max-w-[70ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          В оглавлении исходного файла работы перечислены также «Абстракт» и «Приложение», но их текста в файле нет,
          поэтому на сайте этих разделов нет.
        </p>
      </section>
    </div>
  )
}
