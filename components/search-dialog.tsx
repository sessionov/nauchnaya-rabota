"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Search } from "lucide-react"
import { loadEngine } from "./search-results"

const SearchDialogPanel = dynamic(() => import("./search-dialog-panel"), { ssr: false })
const preloadPanel = () => void import("./search-dialog-panel")

/** Кнопка поиска в шапке. Окно и индекс подгружаются только при первом обращении. */
export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      if ((e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault()
        setArmed(true)
        setOpen(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const warm = () => {
    preloadPanel()
    void loadEngine().catch(() => {})
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setArmed(true)
          setOpen(true)
        }}
        onPointerEnter={warm}
        onFocus={warm}
        className="inline-flex h-11 items-center gap-2 px-3 text-foreground transition-colors hover:bg-muted active:bg-accent"
        aria-keyshortcuts="Control+K /"
        aria-haspopup="dialog"
      >
        <Search aria-hidden className="size-5" />
        <span className="hidden lg:inline">Поиск</span>
        <span className="sr-only lg:hidden">Поиск по сайту</span>
      </button>
      {armed ? <SearchDialogPanel open={open} onOpenChange={setOpen} /> : null}
    </>
  )
}
