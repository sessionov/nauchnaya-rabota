"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { Heading } from "@/lib/content"

/** «На этой странице»: подсвечивает подраздел, который сейчас читается. */
export function OnThisPage({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null)

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [headings])

  if (!headings.length) return null
  return (
    <nav aria-label="На этой странице" className="text-[0.875rem] leading-snug">
      <p className="mb-3 font-semibold">На этой странице</p>
      <ol className="flex flex-col">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "location" : undefined}
              className={cn(
                "block py-1.5 text-muted-foreground transition-colors hover:text-foreground",
                h.depth === 3 && "pl-3",
                active === h.id && "font-semibold text-foreground"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
