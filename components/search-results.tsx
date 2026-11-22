"use client"

import { useEffect, useMemo, useState, useDeferredValue } from "react"
import Link from "next/link"
import type MiniSearch from "minisearch"
import { buildSnippet, normalize, type SearchDoc } from "@/lib/search-shared"

type Hit = { id: string; doc: SearchDoc; snippet: string }

let enginePromise: Promise<MiniSearch<SearchDoc>> | null = null

export function loadEngine() {
  if (!enginePromise) {
    enginePromise = Promise.all([import("minisearch"), fetch("/search-index.json").then((r) => {
      if (!r.ok) throw new Error(String(r.status))
      return r.json() as Promise<SearchDoc[]>
    })]).then(([mod, docs]) => {
      const ms = new mod.default<SearchDoc>({
        fields: ["title", "heading", "text"],
        storeFields: ["title", "heading", "text", "url", "kind"],
        processTerm: (t) => normalize(t) || null,
        searchOptions: { boost: { title: 3, heading: 2 }, prefix: true, fuzzy: 0.15, combineWith: "AND" },
      })
      ms.addAll(docs)
      return ms
    })
    enginePromise.catch(() => {
      enginePromise = null
    })
  }
  return enginePromise
}

export function useSearch(query: string) {
  const [engine, setEngine] = useState<MiniSearch<SearchDoc> | null>(null)
  const [error, setError] = useState(false)
  const deferred = useDeferredValue(query)

  useEffect(() => {
    let alive = true
    loadEngine()
      .then((e) => alive && setEngine(e))
      .catch(() => alive && setError(true))
    return () => {
      alive = false
    }
  }, [])

  const hits = useMemo<Hit[]>(() => {
    const q = deferred.trim()
    if (!engine || q.length < 2) return []
    return engine.search(q).slice(0, 30).map((r) => {
      const doc = r as unknown as SearchDoc & { id: string }
      return { id: doc.id, doc, snippet: buildSnippet(doc.text, q) }
    })
  }, [engine, deferred])

  return { hits, ready: Boolean(engine), error, pending: deferred !== query }
}

export function SearchResults({ query, onNavigate }: { query: string; onNavigate?: () => void }) {
  const { hits, ready, error } = useSearch(query)
  const q = query.trim()
  if (error) {
    return (
      <p className="text-muted-foreground" role="status">
        Не удалось загрузить поисковый индекс. Обновите страницу и попробуйте ещё раз.
      </p>
    )
  }
  if (!ready) return <p className="text-muted-foreground" role="status">Загружаю индекс…</p>
  if (q.length < 2) {
    return (
      <p className="text-muted-foreground" role="status">
        Введите хотя бы две буквы: например, «кюй», «айтыс», «Соболев».
      </p>
    )
  }
  if (!hits.length) {
    return (
      <p className="text-muted-foreground" role="status">
        По запросу «{q}» ничего не нашлось. Попробуйте другое слово или начало слова.
      </p>
    )
  }
  return (
    <>
      <p className="sr-only" role="status">
        Найдено: {hits.length}
      </p>
      <ol className="flex flex-col">
        {hits.map((h) => (
          <li key={h.id}>
            <Link
              href={h.doc.url}
              onClick={onNavigate}
              className="block px-3 py-3 transition-colors hover:bg-muted focus-visible:bg-muted"
            >
              <span className="block text-small text-muted-foreground">{h.doc.title}</span>
              {h.doc.heading ? <span className="block font-semibold">{h.doc.heading}</span> : null}
              <span
                className="mt-1 block text-[0.9375rem] leading-snug [&_mark]:bg-mark [&_mark]:text-foreground"
                dangerouslySetInnerHTML={{ __html: h.snippet }}
              />
            </Link>
          </li>
        ))}
      </ol>
    </>
  )
}

