import { Fragment } from "react"
import { jsx, jsxs } from "react/jsx-runtime"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import type { Root } from "hast"
import { cn } from "@/lib/utils"

/** Рендер текста раздела (HAST, собранный при сборке) в React без клиентского JS. */
export function Prose({ tree, className }: { tree: Root; className?: string }) {
  return (
    <div className={cn("prose-work", className)}>
      {toJsxRuntime(tree, { Fragment, jsx, jsxs })}
    </div>
  )
}
