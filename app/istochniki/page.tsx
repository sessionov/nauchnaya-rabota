import type { Metadata } from "next"
import { getSources } from "@/lib/sources"
import { SourcesList } from "@/components/sources-list"
import { plural } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Список литературы",
  description: "Полный список литературы научного проекта о роли музыки в становлении личности Абая: 22 записи, результат проверки ссылок и место упоминания.",
  alternates: { canonical: "/istochniki" },
}

export default function SourcesPage() {
  const sources = getSources()
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-12">
        <header className="lg:col-span-5">
          <h1 className="text-display font-semibold tracking-[-0.025em]">Список литературы</h1>
          <p className="mt-5 max-w-[48ch] text-lead text-muted-foreground">
            Все {sources.length} {plural(sources.length, "запись", "записи", "записей")} в том виде, в каком они даны в работе.
          </p>
        </header>
        <section aria-labelledby="check-title" className="bg-muted p-6 sm:p-8 lg:col-span-6 lg:col-start-7">
          <h2 id="check-title" className="text-lead font-semibold">
            Как найти книгу
          </h2>
          <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 leading-relaxed marker:text-primary">
            <li>
              В списке печатные издания, у них нет DOI. Чтобы найти книгу, нажмите «Искать в Google Книгах» под
              записью или ищите по автору и названию в каталоге библиотеки.
            </li>
            <li>
              Если источник прямо назван в тексте работы или в презентации, под записью указано, в каком разделе или на
              каком слайде.
            </li>
          </ul>
        </section>
      </div>
      <div className="mt-14 max-w-[64rem]">
        <SourcesList sources={sources} />
      </div>
    </div>
  )
}
