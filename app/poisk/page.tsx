import type { Metadata } from "next"
import { Suspense } from "react"
import { SearchPage } from "@/components/search-page"

export const metadata: Metadata = {
  title: "Поиск",
  description: "Поиск по тексту работы, списку литературы, слайдам презентации и материалам для продолжателей.",
  alternates: { canonical: "/poisk" },
}

export default function Page() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="text-display font-semibold tracking-[-0.025em]">Поиск по сайту</h1>
      <p className="mt-5 max-w-[56ch] text-lead text-muted-foreground">
        Ищет по тексту работы, источникам, слайдам и материалам для продолжателей.
      </p>
      <div className="mt-10 max-w-[48rem]">
        <Suspense fallback={<p className="text-muted-foreground">Загружаю поиск…</p>}>
          <SearchPage />
        </Suspense>
      </div>
    </div>
  )
}
