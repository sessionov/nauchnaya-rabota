"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Slide } from "@/lib/slides"
import { SlideTranscript } from "./slide-transcript"

const src = (n: number) => `/slides/slide-${String(n).padStart(2, "0")}.webp`

export function SlideViewer({ slides }: { slides: Slide[] }) {
  const total = slides.length
  const [index, setIndex] = useState(0)
  const [full, setFull] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const thumbsRef = useRef<HTMLOListElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)

  const go = useCallback(
    (i: number) => {
      const next = Math.min(total - 1, Math.max(0, i))
      setIndex(next)
      history.replaceState(null, "", `#slide-${next + 1}`)
    },
    [total]
  )

  // Открытие по ссылке вида /prezentatsiya#slide-7
  useEffect(() => {
    const apply = () => {
      const m = location.hash.match(/^#slide-(\d+)$/)
      if (m) setIndex(Math.min(total - 1, Math.max(0, Number(m[1]) - 1)))
    }
    apply()
    window.addEventListener("hashchange", apply)
    return () => window.removeEventListener("hashchange", apply)
  }, [total])

  // Клавиатура: стрелки, Home/End, F — полный экран, Esc — выход
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement
      if (t.closest("input, textarea, [contenteditable], [role=dialog]")) return
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault()
        go(index + 1)
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault()
        go(index - 1)
      } else if (e.key === "Home") {
        e.preventDefault()
        go(0)
      } else if (e.key === "End") {
        e.preventDefault()
        go(total - 1)
      } else if (e.key === "f" || e.key === "F" || e.key === "а" || e.key === "А") {
        toggleFull()
      } else if (e.key === "Escape" && full && !document.fullscreenElement) {
        setFull(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  useEffect(() => {
    const onChange = () => setFull(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  // Держим активную миниатюру в поле зрения
  useEffect(() => {
    const el = thumbsRef.current?.children[index] as HTMLElement | undefined
    el?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }, [index])

  // Без системного полноэкранного режима (iPhone) — раскрываем просмотр на всё окно
  useEffect(() => {
    if (full && !document.fullscreenElement) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [full])

  function toggleFull() {
    const el = stageRef.current
    if (!el) return
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else if (el.requestFullscreen && document.fullscreenEnabled) {
      el.requestFullscreen().catch(() => setFull((v) => !v))
    } else {
      setFull((v) => !v)
    }
  }

  const slide = slides[index]

  return (
    <div>
      <div
        ref={stageRef}
        className={cn(
          "relative flex flex-col bg-field",
          full && "fixed inset-0 z-[60] justify-center [&:fullscreen]:static"
        )}
        aria-roledescription="карусель"
        aria-label="Слайды презентации"
      >
        <div
          className="relative aspect-video w-full touch-pan-y select-none"
          onPointerDown={(e) => {
            touch.current = { x: e.clientX, y: e.clientY }
          }}
          onPointerUp={(e) => {
            const start = touch.current
            touch.current = null
            if (!start) return
            const dx = e.clientX - start.x
            const dy = e.clientY - start.y
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) go(index + (dx < 0 ? 1 : -1))
          }}
          onPointerCancel={() => (touch.current = null)}
        >
          <Image
            key={slide.n}
            src={src(slide.n)}
            alt={`Слайд ${slide.n}: ${slide.title}`}
            fill
            priority={index === 0}
            sizes={full ? "100vw" : "(min-width: 1280px) 70rem, 100vw"}
            className="object-contain"
            draggable={false}
          />
          {/* Предзагрузка соседних слайдов */}
          {[index - 1, index + 1]
            .filter((i) => i >= 0 && i < total)
            .map((i) => (
              <Image key={`pre-${i}`} src={src(slides[i].n)} alt="" aria-hidden fill sizes="(min-width: 1280px) 70rem, 100vw" className="invisible" />
            ))}
        </div>

        <div className="flex items-center justify-between gap-2 px-2 py-2 text-field-foreground sm:px-3">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="inline-flex size-12 items-center justify-center transition-[background-color,transform] hover:bg-white/10 active:scale-95 disabled:opacity-40"
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft aria-hidden className="size-6" />
          </button>
          <p className="tabular-nums" aria-live="polite">
            <span className="sr-only">Слайд </span>
            {index + 1} <span className="text-field-muted">/ {total}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleFull}
              className="inline-flex size-12 items-center justify-center transition-[background-color,transform] hover:bg-white/10 active:scale-95"
              aria-label={full ? "Выйти из полноэкранного режима" : "Во весь экран"}
              aria-pressed={full}
            >
              {full ? <Minimize aria-hidden className="size-5" /> : <Maximize aria-hidden className="size-5" />}
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              disabled={index === total - 1}
              className="inline-flex size-12 items-center justify-center transition-[background-color,transform] hover:bg-white/10 active:scale-95 disabled:opacity-40"
              aria-label="Следующий слайд"
            >
              <ChevronRight aria-hidden className="size-6" />
            </button>
          </div>
        </div>
      </div>

      <ol ref={thumbsRef} className="no-print mt-3 flex gap-2 overflow-x-auto overscroll-x-contain pb-2" aria-label="Все слайды">
        {slides.map((s, i) => (
          <li key={s.n} className="shrink-0">
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={`Слайд ${s.n}: ${s.title}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "relative block w-28 outline-offset-2 transition-opacity sm:w-32",
                i === index ? "opacity-100 ring-3 ring-primary" : "opacity-70 hover:opacity-100"
              )}
            >
              <Image src={src(s.n)} alt="" width={256} height={144} sizes="128px" className="aspect-video w-full object-cover" loading="lazy" />
            </button>
          </li>
        ))}
      </ol>

      <section aria-labelledby="slide-text-title" className="mt-10 max-w-[70ch]">
        <h2 id="slide-text-title" className="text-lead font-semibold">
          Текст слайда {slide.n}: {slide.title}
        </h2>
        <SlideTranscript slide={slide} className="mt-4" />
      </section>
    </div>
  )
}
