"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { SearchResults } from "./search-results"

export function SearchPage() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = useState(params.get("q") ?? "")

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center gap-3 bg-muted px-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring"
      >
        <Search aria-hidden className="size-5 shrink-0 text-muted-foreground" />
        <label htmlFor="page-search" className="sr-only">
          Что найти
        </label>
        <input
          id="page-search"
          name="q"
          type="search"
          value={q}
          autoComplete="off"
          onChange={(e) => {
            setQ(e.target.value)
            const v = e.target.value.trim()
            router.replace(v ? `${pathname}?q=${encodeURIComponent(v)}` : pathname, { scroll: false })
          }}
          placeholder="Например: кюй, айтыс, Соболев"
          className="h-14 w-full bg-transparent text-lead outline-none placeholder:text-muted-foreground"
        />
        {q ? (
          <button
            type="button"
            onClick={() => {
              setQ("")
              router.replace(pathname, { scroll: false })
              document.getElementById("page-search")?.focus()
            }}
            className="inline-flex size-11 shrink-0 items-center justify-center hover:bg-accent"
            aria-label="Очистить поиск"
          >
            <X aria-hidden className="size-5" />
          </button>
        ) : null}
      </form>
      <div className="mt-6">
        <SearchResults query={q} />
      </div>
    </div>
  )
}
