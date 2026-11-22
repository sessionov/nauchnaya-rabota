import type { Metadata } from "next"
import Link from "next/link"
import { anchorHref, assertQuote } from "@/lib/content"
import { getGlossary } from "@/lib/glossary"
import { slides } from "@/lib/slides"
import { SlideTranscript } from "@/components/slide-transcript"

export const metadata: Metadata = {
  title: "Для продолжателей",
  description:
    "Что сделано в работе о роли музыки в становлении личности Абая, её ограничения, открытые вопросы, перспективы, порядок знакомства с материалами и глоссарий терминов.",
  alternates: { canonical: "/prodolzhatelyam" },
}

/** Дословная цитата из работы с проверкой при сборке и ссылкой на место в тексте. */
function Q({ slug, text, href, where }: { slug: string; text: string; href: string; where: string }) {
  return (
    <figure className="bg-muted/60 p-5 sm:p-6">
      <blockquote className="leading-relaxed">«{assertQuote(slug, text)}»</blockquote>
      <figcaption className="mt-3 text-[0.9375rem]">
        <Link href={href} className="text-primary underline underline-offset-4">
          {where}
        </Link>
      </figcaption>
    </figure>
  )
}

const toc = [
  { id: "sdelano", label: "Что сделано" },
  { id: "ogranicheniya", label: "Ограничения работы" },
  { id: "voprosy", label: "Открытые вопросы" },
  { id: "perspektivy", label: "Перспективы и идеи" },
  { id: "nachalo", label: "С чего начать" },
  { id: "tablitsy", label: "Образцы таблиц разбора" },
  { id: "glossariy", label: "Глоссарий" },
]

export default function ContinuersPage() {
  const conclusion = slides.find((s) => s.n === 16)!
  const g3 = "/rabota/glava-3"
  const glossary = getGlossary()

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-x-16 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <nav aria-label="Разделы страницы" className="sticky top-24 hidden self-start lg:block">
          <p className="mb-3 font-semibold">На этой странице</p>
          <ul className="flex flex-col text-[0.9375rem]">
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="block py-1.5 text-muted-foreground hover:text-foreground">
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 max-w-[72ch]">
          <header>
            <h1 className="text-display font-semibold tracking-[-0.025em]">Для продолжателей темы</h1>
            <p className="mt-5 text-lead text-muted-foreground">
              Здесь собрано то, что работа оставляет следующим исследователям. Всё в кавычках взято из текста работы
              дословно, у каждой цитаты есть ссылка на её место.
            </p>
          </header>

          <section id="sdelano" aria-labelledby="sdelano-h" className="scroll-mt-24 pt-16">
            <h2 id="sdelano-h" className="text-head font-semibold">
              Что сделано
            </h2>
            <p className="mt-4 leading-relaxed">Выводы, как они сформулированы на слайде 16 презентации защиты:</p>
            <ol className="mt-4 flex flex-col gap-2 leading-relaxed">
              {conclusion.lines.map((l) => (
                <li key={l} className="bg-muted/60 px-5 py-3">
                  {l}
                </li>
              ))}
            </ol>
            <div className="mt-6">
              <Q
                slug="glava-3"
                text="Итог главы можно свести к одной фразе. Музыка, слово и культурная среда формируют Абая во всех трёх версиях. Степень художественного выражения этого формирования зависит от перевода."
                href={g3 + "#analiz-otryvka-aytys-i-dombra"}
                where="Глава 3, итог"
              />
            </div>
          </section>

          <section id="ogranicheniya" aria-labelledby="ogr-h" className="scroll-mt-24 pt-20">
            <h2 id="ogr-h" className="text-head font-semibold">
              Ограничения работы
            </h2>
            <p className="mt-4 leading-relaxed">Границы, которые автор называет сам:</p>
            <div className="mt-4 flex flex-col gap-2">
              <Q slug="vvedenie" text="Объектом исследования является роман М. Ауэзова «Путь Абая» (I том, части 1–2)." href="/rabota/vvedenie" where="Введение" />
              <Q
                slug="glava-3"
                text="Это наблюдение нельзя распространять на весь перевод 2007 года. Оно описывает плотность художественной формулы в выбранных местах, а не полноту бытового и этнографического слоя, которую другие работы отмечают, как достоинство новой версии."
                href={g3 + "#analiz-otryvka-aytys-i-dombra"}
                where="Глава 3"
              />
              <Q
                slug="glava-3"
                text="Следует помнить, что «Соболев» в этой главе — имя традиции: исторически русский текст советских изданий готовился группой переводчиков при его ведущем участии."
                href={g3 + "#analiz-otryvka-aytys-i-dombra"}
                where="Глава 3"
              />
              <figure className="bg-muted/60 p-5 sm:p-6">
                <blockquote className="leading-relaxed">«Выводы относятся только к исследованным фрагментам.»</blockquote>
                <figcaption className="mt-3 text-[0.9375rem]">
                  <Link href="/prezentatsiya#slide-16" className="text-primary underline underline-offset-4">
                    Презентация, слайд 16
                  </Link>
                </figcaption>
              </figure>
            </div>
            <aside className="mt-6 bg-mark/40 p-5 text-[0.9375rem] leading-relaxed sm:p-6" aria-label="Примечание сайта">
              <p className="font-semibold">Состав материалов (примечание сайта, не текст работы)</p>
              <p className="mt-2">
                Глава 3 называет три отрывка для близкого чтения и регистр 33 музыкальных эпизодов; в тексте работы
                подробно разобран отрывок «Айтыс и домбра», а сам регистр в присланных файлах не приведён. На слайде 8
                презентации указано число 31 пример. Три строки регистра показаны на слайде 15.
              </p>
            </aside>
          </section>

          <section id="voprosy" aria-labelledby="vopr-h" className="scroll-mt-24 pt-20">
            <h2 id="vopr-h" className="text-head font-semibold">
              Открытые вопросы
            </h2>
            <p className="mt-4 leading-relaxed">Вопрос, который глава 3 ставит перед сопоставлением переводов:</p>
            <div className="mt-4 flex flex-col gap-2">
              <Q
                slug="glava-3"
                text="Если событие в трёх текстах одно и то же - Абай читает, слушает айтыс, стоит у могил, - остаётся ли одним и тем же способ, которым это событие формирует героя? Или перевод незаметно меняет модальность становления: чувство на понимание, понимание на наблюдение, степной образ на бытовую подробность?"
                href={g3}
                where="Глава 3, начало"
              />
            </div>
            <p className="mt-6 leading-relaxed">И правило, которое автор выводит для дальнейшей работы с эпопеей:</p>
            <div className="mt-4">
              <Q
                slug="glava-3"
                text="Русская цитата из «Пути Абая» не нейтральна к тому, чьим переводом она взята. Формула Соболева и абзац Кима способны подтвердить разные тезисы об одном эпизоде. Там, где речь идёт не о событии, а о характере личности Абая, сопоставление с казахским текстом обязательно."
                href={g3 + "#analiz-otryvka-aytys-i-dombra"}
                where="Глава 3, практическое следствие"
              />
            </div>
          </section>

          <section id="perspektivy" aria-labelledby="persp-h" className="scroll-mt-24 pt-20">
            <h2 id="persp-h" className="text-head font-semibold">
              Перспективы и идеи следующих исследований
            </h2>
            <div className="mt-4 flex flex-col gap-2">
              <Q
                slug="zaklyuchenie"
                text="Возможные направления будущих исследований могут включать более глубокий анализ конкретных музыкальных произведений, которые повлияли на Абая, а также исследование музыкальной символики в его стихах и произведениях."
                href={anchorHref("zaklyuchenie", "3.")}
                where="Заключение, раздел 3"
              />
              <Q
                slug="zaklyuchenie"
                text="Важно также рассмотреть влияние музыки на литературные и культурные традиции Казахстана в более широком контексте, исследуя связь между музыкой и другими видами искусства."
                href={anchorHref("zaklyuchenie", "3.")}
                where="Заключение, раздел 3"
              />
              <Q
                slug="zaklyuchenie"
                text="Дополнительно, можно исследовать влияние музыки на других казахских мыслителей и поэтов того времени, чтобы понять, как музыкальная традиция влияла на общественные и культурные процессы в Казахстане XIX века."
                href={anchorHref("zaklyuchenie", "3.")}
                where="Заключение, раздел 3"
              />
            </div>
          </section>

          <section id="nachalo" aria-labelledby="nach-h" className="scroll-mt-24 pt-20">
            <h2 id="nach-h" className="text-head font-semibold">
              С чего начать новичку
            </h2>
            <p className="mt-4 leading-relaxed">Порядок знакомства с материалами сайта:</p>
            <ol className="mt-4 flex list-decimal flex-col gap-3 pl-6 leading-relaxed marker:font-semibold marker:text-primary">
              <li>
                <Link href="/rabota/vvedenie" className="font-semibold text-primary underline underline-offset-4">
                  Введение
                </Link>
                : цель, задачи, гипотеза, объект и предмет, методология.
              </li>
              <li>
                <Link href={anchorHref("glava-3", "Рабочая формула")} className="font-semibold text-primary underline underline-offset-4">
                  Глава 3, «Рабочая формула главы»
                </Link>
                : три отрывка, регистр эпизодов, уровни сопоставления и функциональная типология.
              </li>
              <li>
                <Link href={g3 + "#analiz-otryvka-aytys-i-dombra"} className="font-semibold text-primary underline underline-offset-4">
                  Разбор отрывка «Айтыс и домбра»
                </Link>{" "}
                и две сводные таблицы главы 3.
              </li>
              <li>
                <a href="#tablitsy" className="font-semibold text-primary underline underline-offset-4">
                  Образцы таблиц разбора эпизодов
                </a>{" "}
                со слайдов 7 и 15: как оформлять собственный регистр.
              </li>
              <li>
                <Link href="/rabota/zaklyuchenie" className="font-semibold text-primary underline underline-offset-4">
                  Заключение
                </Link>{" "}
                и{" "}
                <Link href="/istochniki" className="font-semibold text-primary underline underline-offset-4">
                  список литературы
                </Link>
                . Ссылок на издания из списка найти не удалось, поэтому перед использованием их стоит сверить по
                библиотечным каталогам.
              </li>
            </ol>
          </section>

          <section id="tablitsy" aria-labelledby="tabl-h" className="scroll-mt-24 pt-20">
            <h2 id="tabl-h" className="text-head font-semibold">
              Образцы таблиц разбора эпизодов
            </h2>
            <p className="mt-4 leading-relaxed">Перенесены со слайдов презентации без изменений.</p>
            {[7, 15].map((n) => {
              const s = slides.find((x) => x.n === n)!
              return (
                <div key={n} className="mt-8">
                  <h3 className="text-lead font-semibold">
                    Слайд {n}: {s.title}
                  </h3>
                  <SlideTranscript slide={s} className="mt-4" />
                </div>
              )
            })}
          </section>

          <section id="glossariy" aria-labelledby="gl-h" className="scroll-mt-24 pt-20">
            <h2 id="gl-h" className="text-head font-semibold">
              Глоссарий
            </h2>
            <p className="mt-4 leading-relaxed">Определения взяты из текста работы.</p>
            <dl className="mt-6 flex flex-col gap-1">
              {glossary.map((g) => (
                <div key={g.term} className="grid gap-2 bg-muted/60 p-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6 sm:p-6">
                  <dt lang={g.lang} className="text-lead font-semibold">
                    {g.term}
                  </dt>
                  <dd>
                    <p className="leading-relaxed">«{assertQuote(g.slug, g.def)}»</p>
                    <p className="mt-2 text-[0.9375rem]">
                      <Link href={g.href} className="text-primary underline underline-offset-4">
                        {g.where}
                      </Link>
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  )
}
