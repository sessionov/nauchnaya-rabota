"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

export function CopyButton({
  text,
  label,
  doneLabel,
  tone = "page",
}: {
  text: string
  label: string
  doneLabel: string
  tone?: "page" | "field"
}) {
  const [state, setState] = useState<"idle" | "done" | "error">("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setState("done")
    } catch {
      // Резерв для браузеров без Clipboard API: выделяем текст, чтобы скопировать вручную.
      const el = document.getElementById("gost-citation")
      if (el) {
        const range = document.createRange()
        range.selectNodeContents(el)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
      setState("error")
    }
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setState("idle"), 2400)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={copy}
        className={cn(
          "inline-flex min-h-11 items-center gap-2 px-4 font-semibold transition-[background-color,transform] duration-150 active:scale-[0.98]",
          tone === "field"
            ? "bg-field-foreground text-field hover:bg-white"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {state === "done" ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
        {state === "done" ? doneLabel : label}
      </button>
      <span role="status" aria-live="polite" className={tone === "field" ? "text-field-muted" : "text-muted-foreground"}>
        {state === "error" ? "Не удалось скопировать автоматически: текст выделен, нажмите Ctrl+C." : ""}
      </span>
    </div>
  )
}
