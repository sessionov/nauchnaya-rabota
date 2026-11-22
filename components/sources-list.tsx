"use client"

import { useDeferredValue, useEffect, useState } from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"
import type { Source } from "@/lib/sources"

function Inline({ md }: { md: string }) {
  const parts = md.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") ? <em key={i}>{p.slice(1, -1)}</em> : <span key={i}>{p}</span>
      )}
    </>
  )
}

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е")

export function SourcesList({ sources }: { sources: Source[] }) {
  const [q, setQ] = useState("")
  // Фильтр синхронизирован с адресом: ?q=… можно отправить ссылкой
  useEffect(() => {
    const v = new URLSearchParams(location.search).get("q")
    if (v) setQ(v)
  }, [])
  useEffect(() => {
    const url = new URL(location.href)
    if (q.trim()) url.searchParams.set("q", q.trim())
    else url.searchParams.delete("q")
    history.replaceState(null, "", url)
  }, [q])
  const dq = useDeferredValue(q)
  const query = norm(dq.trim())
  const shown = query ? sources.filter((s) => norm(s.plain).includes(query) || String(s.n) === query) : sources

  return (
    <div>
      <div className="no-print flex max-w-[40rem] items-center gap-3 bg-muted px-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
        <Search aria-hidden className="size-5 shrink-0 text-muted-foreground" />
        <label htmlFor="sources-filter" className="sr-only">
          Поиск по списку литературы
        </label>
        <input
          id="sources-filter"
          name="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Автор, название, город или год…"
          autoComplete="off"
          className="h-12 w-full bg-transparent outline-none placeholder:text-muted-foreground"
        />
        {q ? (
          <button
            type="button"
            onClick={() => setQ("")}
            className="inline-flex size-10 shrink-0 items-center justify-center hover:bg-accent"
            aria-label="Очистить поиск"
          >
            <X aria-hidden className="size-4" />
          </button>
        ) : null}
      </div>
      <p role="status" aria-live="polite" className="mt-3 text-[0.9375rem] text-muted-foreground">
        {query ? `Найдено: ${shown.length} из ${sources.length}` : `Всего записей: ${sources.length}`}
      </p>

      {shown.length ? (
        <ol className="mt-6 flex flex-col gap-1">
          {shown.map((s) => (
            <li key={s.n} id={`src-${s.n}`} className="grid scroll-mt-24 grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 bg-muted/50 px-4 py-5 target:bg-mark/60 sm:grid-cols-[3rem_minmax(0,1fr)] sm:px-6">
              <span className="pt-0.5 text-right font-semibold tabular-nums text-muted-foreground">{s.n}.</span>
              <div className="min-w-0">
                <p className="leading-relaxed">
                  <Inline md={s.md} />
                </p>
                <div className="mt-3 flex flex-col gap-1.5 text-[0.9375rem]">
                  <p>
                    <span className="text-muted-foreground">Ссылка: </span>
                    {s.url ? (
                      <a href={s.url} className="break-all text-primary underline underline-offset-4" rel="noopener noreferrer" target="_blank">
                        {s.url}
                      </a>
                    ) : (
                      <span>ссылка не найдена</span>
                    )}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Где упоминается: </span>
                    {s.mentions.length ? (
                      s.mentions.map((m, i) => (
                        <span key={m.href}>
                          {i > 0 ? ", " : ""}
                          <Link href={m.href} className="text-primary underline underline-offset-4">
                            {m.label}
                          </Link>
                        </span>
                      ))
                    ) : (
                      <span>в тексте работы не упоминается</span>
                    )}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-6 bg-muted/50 p-6">
          <p className="font-semibold">В списке нет записей по запросу «{dq.trim()}».</p>
          <p className="mt-2 text-muted-foreground">Проверьте написание или поищите по фамилии автора, городу или году издания.</p>
          <button type="button" onClick={() => setQ("")} className="mt-4 inline-flex min-h-11 items-center bg-primary px-4 font-semibold text-primary-foreground">
            Показать весь список
          </button>
        </div>
      )}
    </div>
  )
}
