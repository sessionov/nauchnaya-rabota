"use client"

import Link from "next/link"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { NavLinks, type NavItem } from "./nav-links"

export default function MobileNavPanel({
  items,
  open,
  onOpenChange,
}: {
  items: readonly NavItem[]
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[min(22rem,88vw)] gap-0 border-0 px-2 pt-14">
        <SheetTitle className="px-3 text-lead">Разделы сайта</SheetTitle>
        <SheetDescription className="sr-only">Переход к разделам сайта</SheetDescription>
        <nav aria-label="Разделы сайта (меню)" className="mt-4">
          <Link
            href="/"
            onClick={() => onOpenChange(false)}
            className="flex min-h-12 items-center px-3 text-lead transition-colors hover:bg-muted"
          >
            Главная
          </Link>
          <NavLinks
            items={items}
            onNavigate={() => onOpenChange(false)}
            className="flex-col items-stretch [&_a]:min-h-12 [&_a]:text-lead"
          />
          <Link
            href="/poisk"
            onClick={() => onOpenChange(false)}
            className="flex min-h-12 items-center px-3 text-lead transition-colors hover:bg-muted"
          >
            Поиск
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
