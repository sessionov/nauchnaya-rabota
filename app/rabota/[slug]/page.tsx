import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getSection, getSections } from "@/lib/content"
import { work } from "@/lib/site"
import { Prose } from "@/components/prose"
import { WorkToc } from "@/components/work-toc"
import { OnThisPage } from "@/components/on-this-page"
import { ReadingProgress } from "@/components/reading-progress"
import { MobileToc } from "@/components/mobile-toc"
import { PrintButton } from "@/components/print-button"

export const dynamicParams = false

export function generateStaticParams() {
  return getSections().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps<"/rabota/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const s = getSection(slug)
  if (!s) return {}
  return {
    title: s.title,
    description: s.summary,
    alternates: { canonical: `/rabota/${s.slug}` },
    openGraph: { title: s.title, description: s.summary, type: "article" },
  }
}

export default async function SectionPage({ params }: PageProps<"/rabota/[slug]">) {
  const { slug } = await params
  const sections = getSections()
  const index = sections.findIndex((s) => s.slug === slug)
  if (index === -1) notFound()
  const s = sections[index]
  const prev = sections[index - 1]
  const next = sections[index + 1]
  const toc = sections.map(({ slug, title, headings }) => ({ slug, title, headings }))

  return (
    <>
      <ReadingProgress targetId="section-text" />
      {s.hasMath ? <link rel="stylesheet" href="/katex/katex.min.css" precedence="default" /> : null}
      <div className="mx-auto grid max-w-[90rem] gap-x-12 px-4 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8 xl:grid-cols-[17rem_minmax(0,1fr)_14rem]">
        <nav
          data-toc
          aria-label="Оглавление работы"
          className="sticky top-[4.2rem] hidden h-[calc(100svh-4.2rem)] self-start overflow-y-auto overscroll-contain py-10 pr-2 lg:block"
        >
          <WorkToc sections={toc} current={s.slug} />
        </nav>

        <article id="section-text" className="min-w-0 py-8 lg:py-12" aria-labelledby="section-title">
          <div className="no-print flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Путь к странице" className="text-[0.9375rem] text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-x-2">
                <li>
                  <Link href="/" className="underline-offset-4 hover:text-foreground hover:underline">
                    Главная
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/rabota" className="underline-offset-4 hover:text-foreground hover:underline">
                    Работа
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-foreground">
                  {s.short}
                </li>
              </ol>
            </nav>
            <MobileToc>
              <WorkToc sections={toc} current={s.slug} />
            </MobileToc>
          </div>

          <header className="mt-8 max-w-[68ch]">
            <p className="print-only mb-4 text-small">
              {work.author}. {work.title} {work.subtitle}. {work.city}, {work.year}.
            </p>
            <h1 id="section-title" className="text-display font-semibold tracking-[-0.02em]">
              {s.title}
            </h1>
            <p className="mt-5 text-lead text-muted-foreground">{s.summary}</p>
            <div className="no-print mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.9375rem] text-muted-foreground">
              <span>Около {s.minutes} мин чтения</span>
              <PrintButton />
            </div>
          </header>

          <Prose tree={s.hast} className="mt-10" />

          <nav aria-label="Соседние разделы" className="no-print mt-20 grid max-w-[68ch] gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/rabota/${prev.slug}`}
                rel="prev"
                className="group flex flex-col gap-1 bg-muted p-5 transition-colors hover:bg-accent"
              >
                <span className="inline-flex items-center gap-2 text-[0.9375rem] text-muted-foreground">
                  <ArrowLeft aria-hidden className="size-4 transition-transform group-hover:-translate-x-0.5" />
                  Назад
                </span>
                <span className="font-semibold">{prev.title}</span>
              </Link>
            ) : (
              <Link href="/rabota" className="group flex flex-col gap-1 bg-muted p-5 transition-colors hover:bg-accent">
                <span className="inline-flex items-center gap-2 text-[0.9375rem] text-muted-foreground">
                  <ArrowLeft aria-hidden className="size-4" />
                  Назад
                </span>
                <span className="font-semibold">Обзор работы и титульный лист</span>
              </Link>
            )}
            {next ? (
              <Link
                href={`/rabota/${next.slug}`}
                rel="next"
                className="group flex flex-col gap-1 bg-muted p-5 text-right transition-colors hover:bg-accent sm:col-start-2"
              >
                <span className="inline-flex items-center justify-end gap-2 text-[0.9375rem] text-muted-foreground">
                  Далее
                  <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="font-semibold">{next.title}</span>
              </Link>
            ) : (
              <Link href="/istochniki" rel="next" className="group flex flex-col gap-1 bg-muted p-5 text-right transition-colors hover:bg-accent sm:col-start-2">
                <span className="inline-flex items-center justify-end gap-2 text-[0.9375rem] text-muted-foreground">
                  Далее
                  <ArrowRight aria-hidden className="size-4" />
                </span>
                <span className="font-semibold">Список литературы</span>
              </Link>
            )}
          </nav>
        </article>

        <aside className="sticky top-[4.2rem] hidden h-[calc(100svh-4.2rem)] self-start overflow-y-auto overscroll-contain py-12 xl:block">
          <OnThisPage headings={s.headings} />
        </aside>
      </div>
    </>
  )
}
