import localFont from "next/font/local"

/*
  Literata (вариативный шрифт с осями opsz и wght) в виде подмножеств.
  Все подмножества объявлены одним семейством «Literata» с unicode-range,
  поэтому браузер скачивает только нужные части: русская кириллица, латиница
  с типографскими знаками и казахские буквы (ә, ғ, қ, ң, ө, ү, һ).
  Заранее загружаются только прямые начертания кириллицы и латиницы.
*/

export const literata = localFont({
  src: "./fonts/literata-cyrillic-standard-normal.woff2",
  style: "normal",
  weight: "200 900",
  variable: "--font-literata",
  display: "swap",
  preload: true,
  adjustFontFallback: "Times New Roman",
  declarations: [
    { prop: "font-family", value: "Literata" },
    { prop: "unicode-range", value: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116" },
  ],
})

export const literataLatin = localFont({
  src: "./fonts/literata-latin-min-normal.woff2",
  style: "normal",
  weight: "200 900",
  variable: "--font-literata-latin",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "Literata" },
    { prop: "unicode-range", value: "U+0020-007E, U+00A0, U+00A9, U+00AB, U+00BB, U+00B7, U+00D7, U+2010-2014, U+2018-201E, U+2022, U+2026, U+2192" },
  ],
})

export const literataCyrExt = localFont({
  src: "./fonts/literata-cyrillic-ext-standard-normal.woff2",
  style: "normal",
  weight: "200 900",
  variable: "--font-literata-cyrext",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "Literata" },
    { prop: "unicode-range", value: "U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F" },
  ],
})

export const literataItalic = localFont({
  src: "./fonts/literata-cyrillic-standard-italic.woff2",
  style: "italic",
  weight: "200 900",
  variable: "--font-literata-i",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "Literata" },
    { prop: "unicode-range", value: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116" },
  ],
})

export const literataLatinItalic = localFont({
  src: "./fonts/literata-latin-min-italic.woff2",
  style: "italic",
  weight: "200 900",
  variable: "--font-literata-latin-i",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "Literata" },
    { prop: "unicode-range", value: "U+0020-007E, U+00A0, U+00A9, U+00AB, U+00BB, U+00B7, U+00D7, U+2010-2014, U+2018-201E, U+2022, U+2026, U+2192" },
  ],
})

export const literataCyrExtItalic = localFont({
  src: "./fonts/literata-cyrillic-ext-standard-italic.woff2",
  style: "italic",
  weight: "200 900",
  variable: "--font-literata-cyrext-i",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "Literata" },
    { prop: "unicode-range", value: "U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F" },
  ],
})

export const fontVariables = [
  literata,
  literataLatin,
  literataCyrExt,
  literataItalic,
  literataLatinItalic,
  literataCyrExtItalic,
]
  .map((f) => f.variable)
  .join(" ")
