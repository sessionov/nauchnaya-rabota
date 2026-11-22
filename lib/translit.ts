const map: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  ә: "a", ғ: "g", қ: "q", ң: "n", ө: "o", ұ: "u", ү: "u", һ: "h", і: "i",
}

/** Короткий латинский якорь из заголовка: «2.1. Роль музыкальной среды…» → «2-1-rol-muzykalnoy-sredy». */
export function slugify(text: string, maxWords = 5): string {
  const lower = text.toLowerCase()
  let out = ""
  for (const ch of lower) {
    if (map[ch] !== undefined) out += map[ch]
    else if (/[a-z0-9]/.test(ch)) out += ch
    else out += " "
  }
  const words = out.trim().split(/\s+/).filter(Boolean)
  return words.slice(0, maxWords).join("-")
}
