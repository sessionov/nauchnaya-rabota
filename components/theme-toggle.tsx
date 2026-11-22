"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"

type Theme = "light" | "dark"

function read(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"
}

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb)
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
  return () => obs.disconnect()
}

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, read, () => null)
  const next: Theme = theme === "dark" ? "light" : "dark"
  const label = theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"

  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.setAttribute("data-theme", next)
        try {
          localStorage.setItem("theme", next)
        } catch {}
      }}
      aria-label={label}
      title={label}
      className="inline-flex size-11 items-center justify-center text-foreground transition-colors hover:bg-muted active:bg-accent"
    >
      {/* До гидратации показываем обе иконки через CSS, чтобы не было скачка. */}
      <Sun aria-hidden className="size-5 hidden [[data-theme=dark]_&]:block" />
      <Moon aria-hidden className="size-5 block [[data-theme=dark]_&]:hidden" />
    </button>
  )
}
