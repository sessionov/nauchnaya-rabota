import type { Metadata, Viewport } from "next"
import "./globals.css"
import { fontVariables } from "./fonts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { siteDescription, siteName, siteUrl, work } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${siteName} — научный проект К. Валеева`,
    template: `%s — ${siteName}`,
  },
  description: siteDescription,
  authors: [{ name: work.author }],
  keywords: ["Абай", "Путь Абая", "Мухтар Ауэзов", "музыка", "кюй", "терме", "жыр", "айтыс", "литературоведение", "перевод"],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: { card: "summary_large_image", title: siteName, description: siteDescription },
  alternates: { canonical: "/" },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eff1ec" },
    { media: "(prefers-color-scheme: dark)", color: "#131815" },
  ],
}

// Тема выставляется до первой отрисовки: сохранённый выбор, иначе системная настройка.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-theme="light" suppressHydrationWarning className={fontVariables}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only z-50 bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Перейти к содержанию
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
