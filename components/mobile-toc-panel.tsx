"use client"

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"

export default function MobileTocPanel({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[min(24rem,90vw)] gap-0 overflow-y-auto border-0 px-3 pt-14 pb-8">
        <SheetTitle className="sr-only">Оглавление работы</SheetTitle>
        <SheetDescription className="sr-only">Переход к разделам и подразделам работы</SheetDescription>
        <div
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) onOpenChange(false)
          }}
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
