import Link from "next/link"
import { nav } from "@/lib/site"
import { NavLinks } from "./nav-links"
import { MobileNav } from "./mobile-nav"
import { SearchDialog } from "./search-dialog"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  return (
    <header data-site-header className="sticky top-0 z-40 bg-background">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mr-auto max-w-[15rem] py-2 text-[0.9375rem] leading-tight font-semibold sm:max-w-none"
        >
          Роль музыки в становлении <span className="whitespace-nowrap">личности Абая</span>
        </Link>
        <nav aria-label="Основные разделы" className="hidden xl:block">
          <NavLinks items={nav} />
        </nav>
        <SearchDialog />
        <ThemeToggle />
        <MobileNav items={nav} />
      </div>
    </header>
  )
}
