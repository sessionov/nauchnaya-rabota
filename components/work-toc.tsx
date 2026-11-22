import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Heading } from "@/lib/content"

export type TocSection = { slug: string; title: string; headings: Heading[] }

/** Оглавление работы: все разделы, у текущего раскрыты подразделы. */
export function WorkToc({ sections, current }: { sections: TocSection[]; current?: string }) {
  return (
    <div className="text-[0.9375rem] leading-snug">
      <p className="mb-3 font-semibold">
        <Link href="/rabota" className="hover:text-primary">
          Текст работы
        </Link>
      </p>
      <ol className="flex flex-col gap-0.5">
        {sections.map((s) => {
          const active = s.slug === current
          return (
            <li key={s.slug}>
              <Link
                href={`/rabota/${s.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative block py-2 pr-2 pl-4 transition-colors hover:bg-muted",
                  active && "font-semibold text-primary before:absolute before:inset-y-1 before:left-0 before:w-[3px] before:bg-primary"
                )}
              >
                {s.title}
              </Link>
              {active && s.headings.some((h) => h.depth === 2) ? (
                <ol className="mb-2 flex flex-col">
                  {s.headings
                    .filter((h) => h.depth === 2)
                    .map((h) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`} className="block py-1.5 pr-2 pl-8 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                          {h.text}
                        </a>
                      </li>
                    ))}
                </ol>
              ) : null}
            </li>
          )
        })}
        <li>
          <Link href="/istochniki" className="block py-2 pr-2 pl-4 transition-colors hover:bg-muted">
            Список литературы
          </Link>
        </li>
      </ol>
    </div>
  )
}
