import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-display font-semibold tracking-[-0.025em]">Такой страницы нет</h1>
      <p className="mt-5 max-w-[52ch] text-lead text-muted-foreground">
        Возможно, адрес набран с ошибкой или раздел переименован. Текст работы, презентация и источники доступны по
        ссылкам ниже.
      </p>
      <ul className="mt-10 flex flex-wrap gap-3">
        <li>
          <Link href="/" className="inline-flex min-h-12 items-center bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90">
            На главную
          </Link>
        </li>
        <li>
          <Link href="/rabota" className="inline-flex min-h-12 items-center bg-muted px-5 font-semibold hover:bg-accent">
            Текст работы
          </Link>
        </li>
        <li>
          <Link href="/poisk" className="inline-flex min-h-12 items-center bg-muted px-5 font-semibold hover:bg-accent">
            Поиск по сайту
          </Link>
        </li>
      </ul>
    </div>
  )
}
