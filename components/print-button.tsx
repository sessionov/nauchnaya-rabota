"use client"

import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex min-h-11 items-center gap-2 px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Printer aria-hidden className="size-4" />
      Распечатать раздел
    </button>
  )
}
