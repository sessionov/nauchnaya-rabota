"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export type StageSlide = { n: number; src: string; alt: string; caption: string }

/**
 * Неподвижная половина главной страницы: слайд презентации, который меняется,
 * когда читатель доходит до соответствующего блока справа (атрибут data-stage).
 */
export function HomeStage({ slides }: { slides: StageSlide[] }) {
  const [current, setCurrent] = useState(slides[0].n)

  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"))
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(Number(e.target.getAttribute("data-stage")))
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    )
    blocks.forEach((b) => obs.observe(b))
    return () => obs.disconnect()
  }, [])

  const active = slides.find((s) => s.n === current) ?? slides[0]

  return (
    <figure className="flex h-full flex-col justify-center gap-5 px-6 py-10 xl:px-10">
      <Link
        href={`/prezentatsiya#slide-${active.n}`}
        className="group relative block aspect-video w-full overflow-hidden bg-black/20 outline-offset-4"
        aria-label={`Открыть слайд ${active.n} в просмотре презентации`}
      >
        {slides.map((s, i) => (
          <Image
            key={s.n}
            src={s.src}
            alt={s.n === active.n ? s.alt : ""}
            aria-hidden={s.n === active.n ? undefined : true}
            fill
            sizes="(min-width: 1280px) 40vw, 45vw"
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            className={cn(
              "object-contain transition-opacity duration-700 ease-out motion-reduce:transition-none",
              s.n === active.n ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
      </Link>
      <figcaption className="text-[0.9375rem] leading-snug text-field-muted" aria-live="polite">
        <span className="text-field-foreground">Слайд {active.n} из 18.</span> {active.caption}
      </figcaption>
    </figure>
  )
}
