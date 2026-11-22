"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { SearchResults } from "./search-results"

/** Окно поиска. Загружается отдельным чанком при первом открытии. */
export default function SearchDialogPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[8vh] translate-y-0 gap-0 p-0 sm:max-w-2xl" aria-describedby="search-hint">
        <DialogTitle className="sr-only">Поиск по сайту</DialogTitle>
        <DialogDescription id="search-hint" className="sr-only">
          Ищет по тексту работы, источникам, слайдам и материалам для продолжателей.
        </DialogDescription>
        <form
          role="search"
          className="flex items-center gap-3 bg-muted px-4 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-ring"
          onSubmit={(e) => {
            e.preventDefault()
            if (query.trim()) {
              onOpenChange(false)
              router.push(`/poisk?q=${encodeURIComponent(query.trim())}`)
            }
          }}
        >
          <Search aria-hidden className="size-5 shrink-0 text-muted-foreground" />
          <label htmlFor="site-search" className="sr-only">
            Что найти
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Слово или фраза из работы…"
            className="h-14 w-full bg-transparent pr-12 text-lead outline-none placeholder:text-muted-foreground"
          />
        </form>
        <div className="max-h-[60vh] overflow-y-auto overscroll-contain p-2">
          {open ? <SearchResults query={query} onNavigate={() => onOpenChange(false)} /> : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
