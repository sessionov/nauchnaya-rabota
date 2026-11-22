import Link from "next/link"
import { nav, siteUrl, work } from "@/lib/site"
import { Citation } from "./citation"

export function SiteFooter() {
  return (
    <footer data-site-footer className="mt-32 bg-field text-field-foreground">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
        <section aria-labelledby="cite-heading" className="lg:col-span-7">
          <h2 id="cite-heading" className="text-head font-semibold">
            Как цитировать эту работу
          </h2>
          <p className="mt-3 max-w-[60ch] text-field-muted">
            Готовая запись для списка литературы по ГОСТ Р 7.0.100–2018. Адрес и дата обращения подставляются автоматически.
          </p>
          <div className="mt-6 max-w-[62ch]">
            <Citation fallbackUrl={siteUrl() + "/"} tone="field" />
          </div>
        </section>
        <div className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
          <div>
            <p className="text-lead font-semibold">{work.author}</p>
            <p className="mt-1">{work.grade}, школа имени Абая</p>
            <p className="text-field-muted">{work.institutionRegion}</p>
            <p className="mt-3">Научный руководитель: {work.supervisor}</p>
            <p className="mt-3">
              {work.city}, {work.year}
            </p>
          </div>
          <nav aria-label="Разделы сайта (подвал)">
            <ul className="flex flex-wrap gap-x-1 gap-y-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="flex min-h-11 items-center px-2 underline decoration-field-muted underline-offset-4 hover:decoration-field-foreground first:pl-0">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/poisk" className="flex min-h-11 items-center px-2 underline decoration-field-muted underline-offset-4 hover:decoration-field-foreground">
                  Поиск
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-[90rem] px-4 pb-10 sm:px-6 lg:px-8">
        <p aria-hidden className="text-[clamp(2rem,6vw,6rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-field-foreground">
          {work.title}
        </p>
      </div>
    </footer>
  )
}
