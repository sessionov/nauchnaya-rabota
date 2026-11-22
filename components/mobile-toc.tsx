"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { ListTree } from "lucide-react"

const MobileTocPanel = dynamic(() => import("./mobile-toc-panel"), { ssr: false })
const preload = () => void import("./mobile-toc-panel")

/** Оглавление в выдвижной панели для телефонов и планшетов. Содержимое приходит с сервера. */
export function MobileToc({ children }: { children: React.ReactNode }) {
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
        className="inline-flex min-h-11 items-center gap-2 bg-muted px-4 font-semibold transition-[background-color,transform] duration-150 hover:bg-accent active:scale-[0.98] lg:hidden"
      >
        <ListTree aria-hidden className="size-4" />
        Оглавление
      </button>
      {armed ? (
        <MobileTocPanel open={open} onOpenChange={setOpen}>
          {children}
        </MobileTocPanel>
      ) : null}
    </>
  )
}
