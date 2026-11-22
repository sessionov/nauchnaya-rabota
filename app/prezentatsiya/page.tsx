import type { Metadata } from "next"
import { Download, ExternalLink } from "lucide-react"
import { slides } from "@/lib/slides"
import { files, mediaProjectUrl } from "@/lib/site"
import { SlideViewer } from "@/components/slide-viewer"
import { SlideTranscript } from "@/components/slide-transcript"

export const metadata: Metadata = {
  title: "Презентация",
  description: "Слайды защиты научного проекта о роли музыки в становлении личности Абая: просмотр, полный экран и текст каждого слайда.",
  alternates: { canonical: "/prezentatsiya" },
}

export default function PresentationPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <h1 className="text-display font-semibold tracking-[-0.025em]">Презентация защиты</h1>
          <p className="mt-5 max-w-[56ch] text-lead text-muted-foreground">
            18 слайдов. Листайте кнопками, стрелками клавиатуры или свайпом; клавиша F открывает полный экран.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
          <a
            href={files.presLite.href}
            download
            className="inline-flex min-h-12 items-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition-[background-color,transform] duration-150 hover:bg-primary/90 active:scale-[0.98]"
          >
            <Download aria-hidden className="size-4" />
            Скачать PDF
            <span className="font-normal opacity-85">{files.presLite.size}</span>
          </a>
        </div>
      </header>

      <div className="mt-10 max-w-[70rem]" id="prosmotr">
        <SlideViewer slides={slides} />
      </div>

      <section aria-labelledby="media-title" className="mt-20 grid gap-6 bg-muted p-6 sm:p-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="media-title" className="text-head font-semibold">
            Медиапроект «<span translate="no">Abay Talking</span>»
          </h2>
          <p className="mt-4 max-w-[60ch] leading-relaxed">
            На слайде 17 автор рассказывает о медиапроекте «AT», в котором говорить об Абае предполагается с позиции
            современного взгляда, и даёт QR-код на выпуск. Ниже ссылка, записанная в этом QR-коде.
          </p>
        </div>
        <div className="flex flex-col justify-end gap-2 lg:col-span-5">
          <a
            href={mediaProjectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-fit items-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition-[background-color,transform] duration-150 hover:bg-primary/90 active:scale-[0.98]"
          >
            Открыть выпуск на YouTube
            <ExternalLink aria-hidden className="size-4" />
            <span className="sr-only">(откроется в новой вкладке)</span>
          </a>
          <p className="text-[0.9375rem] text-muted-foreground">Ссылка расшифрована из QR-кода на слайде; содержимое ролика при подготовке сайта открыть не удалось.</p>
        </div>
      </section>

      <section aria-labelledby="all-text-title" className="mt-20">
        <h2 id="all-text-title" className="text-head font-semibold">
          Текст всех слайдов
        </h2>
        <p className="mt-3 max-w-[60ch] text-muted-foreground">
          Расшифровка для чтения с телефона, экранного диктора и поиска по сайту.
        </p>
        <ol className="mt-8 flex flex-col gap-1">
          {slides.map((s) => (
            <li key={s.n} id={`tekst-slajda-${s.n}`} className="scroll-mt-24 bg-muted/50 p-5 sm:p-6">
              <details>
                <summary className="flex min-h-8 cursor-pointer list-none items-baseline gap-3 font-semibold [&::-webkit-details-marker]:hidden">
                  <span className="w-8 shrink-0 text-muted-foreground tabular-nums">{s.n}</span>
                  <span className="underline decoration-border underline-offset-4">{s.title}</span>
                </summary>
                <SlideTranscript slide={s} className="mt-4 pl-11" />
              </details>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
