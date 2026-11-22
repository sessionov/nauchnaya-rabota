"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export type NavItem = { href: string; label: string }

export function NavLinks({
  items,
  className,
  onNavigate,
}: {
  items: readonly NavItem[]
  className?: string
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  return (
    <ul className={cn("flex items-center", className)}>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/")
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center px-3 text-[0.9375rem] transition-colors hover:bg-muted",
                active && "font-semibold text-primary"
              )}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
