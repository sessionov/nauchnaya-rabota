"use client"

import { useSyncExternalStore } from "react"
import { gostCitation } from "@/lib/site"
import { CopyButton } from "./copy-button"

const noop = () => () => {}

const dateFormat = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" })
function today() {
  return dateFormat.format(new Date())
}

/** Строка по ГОСТ Р 7.0.100–2018 с адресом сайта и сегодняшней датой обращения. */
export function Citation({ fallbackUrl, tone = "page" }: { fallbackUrl: string; tone?: "page" | "field" }) {
  const url = useSyncExternalStore(noop, () => window.location.origin + "/", () => fallbackUrl)
  const date = useSyncExternalStore(noop, today, () => "")
  const text = gostCitation(url, date || "дд.мм.гггг")
  return (
    <div className="flex flex-col gap-4">
      <p
        className={
          tone === "field"
            ? "bg-black/20 p-4 text-[0.9375rem] leading-relaxed text-field-foreground"
            : "bg-muted p-4 text-[0.9375rem] leading-relaxed"
        }
        id="gost-citation"
      >
        {text}
      </p>
      <CopyButton text={text} label="Копировать ссылку по ГОСТ" doneLabel="Скопировано" tone={tone} />
    </div>
  )
}
