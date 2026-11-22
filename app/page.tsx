import Image from "next/image"
import Link from "next/link"
import { plural } from "@/lib/utils"
import { ArrowRight, Download, Presentation } from "lucide-react"
import { getSections, getThreeVoices } from "@/lib/content"
import { getSources } from "@/lib/sources"
import { files, work } from "@/lib/site"
import { slideSrc, slides } from "@/lib/slides"
import { HomeStage, type StageSlide } from "@/components/home-stage"
import { ThreeVoices } from "@/components/three-voices"

const stage: StageSlide[] = [
  { n: 1, caption: "Титульный слайд защиты." },
  { n: 3, caption: "Цель, задачи и методы исследования." },
  { n: 14, caption: "Пример анализа отрывка: оригинал, Соболев, Ким." },
  { n: 6, caption: "Музыка в романе «Путь Абая»." },
  { n: 16, caption: "Выводы защиты." },
].map((s) => {
  const slide = slides.find((x) => x.n === s.n)!
  return { ...s, src: slideSrc(s.n), alt: `Слайд ${s.n}: ${slide.title}. ${slide.lines.join(" ")}`.trim() }
})

export default function HomePage() {
  const sections = getSections()
  const voices = getThreeVoices()
  const sourcesCount = getSources().length

  return (
    <div className="grid lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)]">
      {/* Неподвижная половина: слайды защиты на тёмно-зелёном поле */}
      <div className="sticky top-16 hidden h-[calc(100svh-4rem)] bg-field text-field-foreground lg:block">
        <HomeStage slides={stage} />
      </div>

      <div className="min-w-0 max-w-[62rem] px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Первый экран */}
        <section data-stage="1" aria-labelledby="hero-title" className="rise pt-12 pb-12 sm:pt-16 lg:pt-[14vh] lg:pb-24">
          <h1 id="hero-title" className="text-[clamp(2.25rem,3.55vw,3.75rem)] leading-[1.04] font-semibold tracking-[-0.025em]">
            {work.title}
          </h1>
          <p className="mt-4 text-lead">{work.subtitlePlain}</p>
          <p className="mt-8 max-w-[52ch] text-[1.0625rem] leading-relaxed">
            Научный проект по литературоведению. Выполнил {work.author.split(" ").reverse().join(" ")}, {work.grade},
            школа имени Абая ({work.institutionRegion}). Научный руководитель: {work.supervisor}. {work.city}, {work.year}.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <Link
              href="/rabota/vvedenie"
              className="group col-span-2 inline-flex min-h-12 justify-center sm:justify-start items-center gap-2 bg-primary px-6 font-semibold text-primary-foreground transition-[background-color,transform] duration-150 hover:bg-primary/90 active:scale-[0.98]"
            >
              Читать работу
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/prezentatsiya"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-muted px-4 font-semibold sm:px-5 transition-[background-color,transform] duration-150 hover:bg-accent active:scale-[0.98]"
            >
              <Presentation aria-hidden className="size-4" />
              Презентация
            </Link>
            <a
              href={files.pdf.href}
              download
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-muted px-4 font-semibold sm:px-5 transition-[background-color,transform] duration-150 hover:bg-accent active:scale-[0.98]"
            >
              <Download aria-hidden className="size-4" />
              Скачать PDF
              <span className="hidden font-normal text-muted-foreground sm:inline">{files.pdf.size}</span>
            </a>
          </div>

          {/* На телефоне и планшете слайд стоит под первым экраном */}
          <Link href="/prezentatsiya" className="mt-12 block bg-field p-3 lg:hidden" aria-label="Открыть презентацию">
            <Image
              src={slideSrc(1)}
              alt={`Слайд 1: ${work.title}, ${work.subtitlePlain}`}
              width={2400}
              height={1350}
              sizes="(min-width: 640px) 90vw, 100vw"
              className="h-auto w-full"
            />
          </Link>
        </section>

        {/* Суть за 30 секунд */}
        <section data-stage="3" aria-labelledby="gist-title" className="py-16 lg:py-24">
          <h2 id="gist-title" className="text-head font-semibold">
            Суть за 30 секунд
          </h2>
          <dl className="mt-10 flex max-w-[60ch] flex-col gap-10">
            <div className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="font-semibold text-primary">Проблема</dt>
              <dd className="leading-relaxed">
                В современной культуре нередко наблюдается утрата духовных ориентиров, и обращение к художественному опыту
                прошлого позволяет осмыслить значимость искусства как воспитательной силы. Цель работы: выявить роль
                музыки в формировании личности Абая на основе анализа текста романа «Путь Абая».
              </dd>
            </div>
            <div className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="font-semibold text-primary">Что сделано</dt>
              <dd className="leading-relaxed">
                Рассмотрены музыкальные жанры казахской степи (кюй, терме, жыр) и эпизоды романа: детство и юность Абая,
                акыны и айтыс, музыка как источник вдохновения и символ. Отрывок «Айтыс и домбра» сопоставлен в трёх
                версиях: казахский оригинал, перевод Л. Соболева и перевод А. Кима.
              </dd>
            </div>
            <div className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="font-semibold text-primary">Результат</dt>
              <dd className="leading-relaxed">
                Музыка, слово и культурная среда формируют Абая во всех трёх версиях, а степень художественного выражения
                этого формирования зависит от перевода: оригинал раскрывает Абая через переживание, Соболев через
                осмысление, Ким через наблюдение и понимание. Выводы относятся только к исследованным фрагментам.
              </dd>
            </div>
          </dl>

          <h3 className="mt-16 text-lead font-semibold">Работа в цифрах</h3>
          <dl className="mt-6 grid max-w-[44rem] grid-cols-2 gap-1 sm:grid-cols-4">
            {[
              { n: "3", label: "версии одного отрывка: оригинал и два перевода" },
              { n: "3", label: "фрагмента романа для близкого чтения" },
              { n: "3", label: "уровня сравнения: лексика, синтаксис, стилистика" },
              { n: String(sourcesCount), label: `${plural(sourcesCount, "источник", "источника", "источников")} в списке литературы` },
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-2 bg-muted/60 p-4">
                <dt className="order-2 text-[0.9375rem] leading-snug text-muted-foreground">{f.label}</dt>
                <dd className="order-1 text-[2.75rem] leading-none font-semibold tracking-[-0.02em] tabular-nums">{f.n}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Живая часть: одна сцена в трёх версиях */}
        <section data-stage="14" aria-labelledby="voices-title" className="py-16 lg:py-24">
          <h2 id="voices-title" className="text-head font-semibold">
            Одна сцена, три Абая
          </h2>
          <p className="mt-4 max-w-[58ch] leading-relaxed">
            Абай впервые по-настоящему слушает айтыс и домбру. Переключайте версии и сравните, как один и тот же эпизод
            передаёт становление героя.
          </p>
          <div className="mt-8">
            <ThreeVoices voices={voices} />
          </div>
          <p className="mt-6">
            <Link href="/rabota/glava-3#analiz-otryvka-aytys-i-dombra" className="font-semibold text-primary underline underline-offset-4">
              Полный разбор отрывка в главе 3
            </Link>
          </p>
        </section>

        {/* Содержание работы */}
        <section data-stage="6" aria-labelledby="contents-title" className="py-16 lg:py-24">
          <h2 id="contents-title" className="text-head font-semibold">
            Содержание работы
          </h2>
          <ol className="mt-8 flex max-w-[44rem] flex-col gap-1">
            {sections.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/rabota/${s.slug}`}
                  className="group grid gap-1 bg-muted/60 px-5 py-4 transition-colors hover:bg-muted sm:grid-cols-[1fr_auto] sm:gap-6"
                >
                  <span>
                    <span className="block font-semibold group-hover:text-primary">{s.title}</span>
                    <span className="mt-1 block text-[0.9375rem] leading-snug text-muted-foreground">{s.summary}</span>
                  </span>
                  <span className="text-[0.9375rem] whitespace-nowrap text-muted-foreground tabular-nums">{s.minutes} мин</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/istochniki" className="group grid gap-1 bg-muted/60 px-5 py-4 transition-colors hover:bg-muted sm:grid-cols-[1fr_auto] sm:gap-6">
                <span className="block font-semibold group-hover:text-primary">Список литературы</span>
                <span className="text-[0.9375rem] text-muted-foreground tabular-nums">{sourcesCount} {plural(sourcesCount, "запись", "записи", "записей")}</span>
              </Link>
            </li>
          </ol>
        </section>

        {/* Для продолжателей */}
        <section data-stage="16" aria-labelledby="next-title" className="py-16 lg:py-24">
          <h2 id="next-title" className="text-head font-semibold">
            Если вы продолжаете тему
          </h2>
          <p className="mt-4 max-w-[58ch] leading-relaxed">
            Отдельная страница собирает всё, что работа оставляет следующим исследователям: что уже сделано, где
            проходят границы выводов, какие направления автор называет перспективными, и словарь терминов с
            определениями из текста.
          </p>
          <ul className="mt-8 grid max-w-[44rem] gap-1 sm:grid-cols-2">
            {[
              { href: "/prodolzhatelyam#sdelano", label: "Что сделано" },
              { href: "/prodolzhatelyam#ogranicheniya", label: "Ограничения работы" },
              { href: "/prodolzhatelyam#perspektivy", label: "Перспективы исследования" },
              { href: "/prodolzhatelyam#glossariy", label: "Глоссарий терминов" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex min-h-14 items-center justify-between gap-3 bg-muted/60 px-5 font-semibold transition-colors hover:bg-muted hover:text-primary">
                  {l.label}
                  <ArrowRight aria-hidden className="size-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
