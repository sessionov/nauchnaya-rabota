import { cn } from "@/lib/utils"
import type { Slide } from "@/lib/slides"

export function SlideTranscript({ slide, className }: { slide: Slide; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 leading-relaxed", className)}>
      {slide.lines.length === 0 && !slide.table ? <p className="text-muted-foreground">На слайде только заголовок.</p> : null}
      {slide.lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
      {slide.table ? (
        <div className="table-scroll" tabIndex={0} role="region" aria-label={`Таблица со слайда ${slide.n}, прокручивается по горизонтали`}>
          <table className="data-table">
            <thead>
              <tr>
                {slide.table.head.map((h, i) => (
                  <th key={i} scope="col">
                    {h || <span className="sr-only">Версия</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slide.table.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="font-semibold">{c}</th> : <td key={j}>{c}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
