"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Menu } from "lucide-react"
import type { NavItem } from "./nav-links"

const MobileNavPanel = dynamic(() => import("./mobile-nav-panel"), { ssr: false })
const preload = () => void import("./mobile-nav-panel")

/** Кнопка меню для узких экранов; сама панель подгружается при первом открытии. */
export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false)
  const [armed, setArmed] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setArmed(true)
          setOpen(true)
        }}
        onPointerEnter={preload}
        onTouchStart={preload}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex size-11 items-center justify-center transition-colors hover:bg-muted active:bg-accent xl:hidden"
        aria-label="Открыть меню"
      >
        <Menu aria-hidden className="size-5" />
      </button>
      {armed ? <MobileNavPanel items={items} open={open} onOpenChange={setOpen} /> : null}
    </>
  )
}
