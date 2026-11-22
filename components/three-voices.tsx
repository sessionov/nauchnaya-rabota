"use client"

import { useState, useSyncExternalStore } from "react"
import { cn } from "@/lib/utils"

const noop = () => () => {}

export type Voice = {
  id: string
  label: string
  short: string
  /** Кем Абай предстаёт в этой версии — из итоговой таблицы главы 3. */
  abai: string
  formula: string
  lang: "kk" | "ru"
  paragraphs: string[]
}

/**
 * Одна сцена — три Абая. Переключатель между казахским оригиналом и двумя
 * русскими переводами отрывка «Айтыс и домбра» (глава 3). Без JS видны все три текста.
 */
export function ThreeVoices({ voices }: { voices: Voice[] }) {
  const [active, setActive] = useState(voices[0].id)
  const enhanced = useSyncExternalStore(noop, () => true, () => false)

  return (
    <div>
      <div
        role="tablist"
        aria-label="Версия текста"
        className={cn("grid grid-cols-3 gap-1", !enhanced && "hidden")}
        onKeyDown={(e) => {
          const i = voices.findIndex((v) => v.id === active)
          let n = -1
          if (e.key === "ArrowRight") n = (i + 1) % voices.length
          if (e.key === "ArrowLeft") n = (i - 1 + voices.length) % voices.length
          if (e.key === "Home") n = 0
          if (e.key === "End") n = voices.length - 1
          if (n >= 0) {
            e.preventDefault()
            setActive(voices[n].id)
            document.getElementById(`voice-tab-${voices[n].id}`)?.focus()
          }
        }}
      >
        {voices.map((v) => {
          const on = v.id === active
          return (
            <button
              key={v.id}
              id={`voice-tab-${v.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`voice-panel-${v.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(v.id)}
              className={cn(
                "flex min-h-14 flex-col items-start justify-center px-3 py-2 text-left transition-[background-color,color] duration-200 active:scale-[0.99]",
                on ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-accent"
              )}
            >
              <span className="text-[0.9375rem] leading-tight font-semibold"><span className="sm:hidden">{v.short}</span><span className="hidden sm:inline">{v.label}</span></span>
              <span className={cn("hidden text-small leading-tight sm:block", on ? "text-primary-foreground/85" : "text-muted-foreground")}>
                {v.abai}
              </span>
            </button>
          )
        })}
      </div>

      {voices.map((v) => {
        const on = v.id === active
        return (
          <div
            key={v.id}
            id={`voice-panel-${v.id}`}
            role={enhanced ? "tabpanel" : undefined}
            aria-labelledby={enhanced ? `voice-tab-${v.id}` : undefined}
            hidden={enhanced && !on}
            tabIndex={enhanced ? 0 : undefined}
            className="mt-1 bg-card px-5 py-6 sm:px-7"
          >
            {!enhanced ? <h3 className="mb-3 font-semibold">{v.label}</h3> : null}
            <blockquote lang={v.lang} className="flex flex-col gap-3 text-[1.0625rem] leading-[1.7]">
              {v.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </blockquote>
            <dl className="mt-6 grid gap-x-6 gap-y-3 text-[0.9375rem] sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Абай в этой версии</dt>
                <dd className="font-semibold">{v.abai}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Музыкальная формула</dt>
                <dd className="font-semibold">{v.formula}</dd>
              </div>
            </dl>
          </div>
        )
      })}
    </div>
  )
}
