"use client"

import { useEffect, useRef } from "react"

/** Тонкая полоса прогресса чтения под шапкой. Обновляется без ре-рендера React. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return
    let frame = 0
    const update = () => {
      frame = 0
      const b = bar.current
      if (!b) return
      const rect = target.getBoundingClientRect()
      const total = rect.height - window.innerHeight * 0.6
      const done = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)))
      b.style.transform = `scaleX(${done})`
      wrap.current?.setAttribute("aria-valuenow", String(Math.round(done * 100)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [targetId])

  return (
    <div
      ref={wrap}
      className="no-print sticky top-16 z-30 h-[3px] bg-muted"
      role="progressbar"
      aria-label="Прочитано"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div ref={bar} className="h-full origin-left scale-x-0 bg-primary" />
    </div>
  )
}
