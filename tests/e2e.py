"""
Сквозной тест production-сборки (npm run build && npm run start).
Запуск: python3 tests/e2e.py [http://localhost:3000]
Проверяет: все страницы и ссылки, якоря, скачивания, поиск, тему, презентацию,
фильтр источников, копирование цитаты, мобильное меню, ошибки консоли.
"""
import asyncio, sys, re
from urllib.parse import urljoin, urlparse
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
PAGES = ["/", "/rabota", "/rabota/vvedenie", "/rabota/glava-1", "/rabota/glava-2", "/rabota/glava-3",
         "/rabota/zaklyuchenie", "/istochniki", "/prezentatsiya", "/prodolzhatelyam", "/skachat", "/poisk",
         "/sitemap.xml", "/robots.txt", "/search-index.json", "/manifest.webmanifest", "/icon.svg", "/opengraph-image.png"]

results = []
def check(name, cond, detail=""):
    results.append((bool(cond), name, detail))
    print(("PASS " if cond else "FAIL ") + name + (f" — {detail}" if detail and not cond else ""))

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width": 1280, "height": 900})
        await ctx.grant_permissions(["clipboard-read", "clipboard-write"], origin=BASE)
        page = await ctx.new_page()
        console_errors = []
        page.on("console", lambda m: console_errors.append(f"{page.url}: {m.text}") if m.type == "error" else None)
        page.on("pageerror", lambda e: console_errors.append(f"{page.url}: {e}"))

        # 1. Все страницы отвечают 200
        for path in PAGES:
            r = await ctx.request.get(BASE + path)
            check(f"HTTP 200 {path}", r.status == 200, str(r.status))
        r = await ctx.request.get(BASE + "/net-takoy-stranicy")
        check("404 для несуществующей страницы", r.status == 404, str(r.status))

        # 2. Обход ссылок: внутренние ведут на 200, якоря существуют, нет href="#" и пустых
        seen_links = set()
        for path in [p for p in PAGES if not re.search(r"\.(xml|txt|json|webmanifest|svg|png)$", p)]:
            await page.goto(BASE + path, wait_until="networkidle")
            hrefs = await page.eval_on_selector_all("a[href]", "els => els.map(e => e.getAttribute('href'))")
            bad = [h for h in hrefs if h in ("#", "", "javascript:void(0)") or h is None]
            check(f"нет заглушек href на {path}", not bad, str(bad))
            for h in hrefs:
                full = urljoin(BASE + path, h)
                u = urlparse(full)
                if u.netloc != urlparse(BASE).netloc:
                    seen_links.add(("ext", full))
                    continue
                seen_links.add(("int", full))
        for kind, full in sorted(seen_links):
            if kind == "ext":
                check(f"внешняя ссылка корректна {full}", full.startswith("https://"), full)
                continue
            u = urlparse(full)
            r = await ctx.request.get(f"{u.scheme}://{u.netloc}{u.path}" + (f"?{u.query}" if u.query else ""))
            check(f"ссылка {u.path}{('#'+u.fragment) if u.fragment else ''} → 200", r.status == 200, str(r.status))
            if u.fragment and not u.fragment.startswith("slide-"):
                await page.goto(full, wait_until="networkidle")
                exists = await page.evaluate("id => !!document.getElementById(decodeURIComponent(id))", u.fragment)
                check(f"якорь #{u.fragment} есть на {u.path}", exists)

        # 3. Скачивания
        for f, ctype in [("/files/valeev-rol-muzyki-abai-2026.pdf", "application/pdf"),
                         ("/files/valeev-rol-muzyki-abai-2026.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
                         ("/files/valeev-prezentatsiya-2026.pdf", "application/pdf"),
                         ("/files/valeev-prezentatsiya-2026-lite.pdf", "application/pdf")]:
            r = await ctx.request.head(BASE + f)
            check(f"файл {f}", r.status == 200 and ctype in r.headers.get("content-type", ""), f"{r.status} {r.headers.get('content-type')}")
        await page.goto(BASE + "/skachat", wait_until="networkidle")
        async with page.expect_download() as dl:
            await page.get_by_role("link", name=re.compile("Скачать Работа, PDF")).click()
        d = await dl.value
        check("кнопка «Скачать» отдаёт PDF работы", d.suggested_filename.endswith(".pdf"), d.suggested_filename)

        # 4. Поиск: диалог по Ctrl+K и страница поиска
        await page.goto(BASE + "/", wait_until="networkidle")
        await page.keyboard.press("Control+k")
        await page.get_by_label("Что найти").fill("кюй")
        await page.wait_for_selector("[role=dialog] ol li a", timeout=8000)
        n = await page.locator("[role=dialog] ol li a").count()
        check("поиск в диалоге находит «кюй»", n > 0, str(n))
        await page.locator("[role=dialog] ol li a").first.click()
        try:
            await page.wait_for_url(re.compile(r"/(rabota|prodolzhatelyam|prezentatsiya|istochniki)"), timeout=8000)
        except Exception:
            pass
        check("переход из результата поиска", "/rabota/" in page.url or "/prodolzhatelyam" in page.url, page.url)
        await page.goto(BASE + "/poisk?q=" + "Соболев", wait_until="networkidle")
        await page.wait_for_selector("ol li a", timeout=8000)
        check("страница поиска по ?q= работает", await page.locator("main ol li a, #main ol li a").count() > 0)
        await page.get_by_label("Что найти").fill("ьъьъьъ")
        await page.wait_for_timeout(400)
        check("пустой результат поиска показывает подсказку", await page.get_by_text("ничего не нашлось").count() == 1)

        # 5. Тема: переключение и запоминание
        await page.goto(BASE + "/", wait_until="networkidle")
        before = await page.evaluate("document.documentElement.dataset.theme")
        await page.get_by_role("button", name=re.compile("тему")).click()
        after = await page.evaluate("document.documentElement.dataset.theme")
        await page.reload(wait_until="networkidle")
        kept = await page.evaluate("document.documentElement.dataset.theme")
        check("переключатель темы меняет и запоминает тему", before != after and kept == after, f"{before}->{after}->{kept}")
        await page.get_by_role("button", name=re.compile("тему")).click()

        # 6. Главная: переключатель трёх версий
        await page.get_by_role("tab", name=re.compile("Перевод А. Кима")).click()
        vis = await page.locator("#voice-panel-kim").is_visible()
        hid = await page.locator("#voice-panel-original").is_hidden()
        check("переключатель «Одна сцена, три Абая»", vis and hid)
        await page.get_by_role("tab", name=re.compile("Перевод А. Кима")).focus()
        await page.keyboard.press("ArrowLeft")
        check("вкладки листаются стрелками", await page.locator("#voice-panel-sobolev").is_visible())

        # 7. Презентация: кнопки, клавиатура, миниатюры, хеш, полный экран
        await page.goto(BASE + "/prezentatsiya", wait_until="networkidle")
        counter = page.locator("p[aria-live=polite]").first
        await page.get_by_role("button", name="Следующий слайд").click()
        check("кнопка «Следующий слайд»", "2" in (await counter.inner_text()), await counter.inner_text())
        await page.keyboard.press("ArrowRight")
        check("стрелка вправо листает", (await counter.inner_text()).startswith("Слайд 3") or "3 /" in await counter.inner_text(), await counter.inner_text())
        await page.keyboard.press("End")
        check("End — последний слайд", "18 /" in await counter.inner_text(), await counter.inner_text())
        await page.get_by_role("button", name=re.compile("Слайд 7:")).click()
        check("миниатюра открывает слайд 7", "7 /" in await counter.inner_text() and page.url.endswith("#slide-7"))
        await page.goto(BASE + "/prezentatsiya#slide-15", wait_until="networkidle")
        check("прямая ссылка #slide-15", "15 /" in await page.locator("p[aria-live=polite]").first.inner_text())
        await page.get_by_role("button", name="Во весь экран").click()
        await page.wait_for_timeout(400)
        fs = await page.evaluate("!!document.fullscreenElement || !!document.querySelector('[aria-pressed=true]')")
        check("полный экран открывается", fs)
        await page.keyboard.press("Escape")

        # 8. Источники: фильтр и пустой результат
        await page.goto(BASE + "/istochniki", wait_until="networkidle")
        check("в списке 22 источника", await page.locator("ol > li[id^=src-]").count() == 22)
        await page.get_by_label("Поиск по списку литературы").fill("Ауэзов")
        await page.wait_for_timeout(300)
        c = await page.locator("ol > li[id^=src-]").count()
        check("фильтр источников «Ауэзов»", c == 2, str(c))
        await page.get_by_label("Поиск по списку литературы").fill("ничего такого")
        await page.wait_for_timeout(300)
        check("пустое состояние фильтра", await page.get_by_text("Показать весь список").count() == 1)
        await page.get_by_role("button", name="Показать весь список").click()
        await page.wait_for_timeout(300)
        check("сброс фильтра", await page.locator("ol > li[id^=src-]").count() == 22)

        # 9. Копирование ссылки по ГОСТ
        await page.get_by_role("button", name="Копировать ссылку по ГОСТ").click()
        clip = await page.evaluate("navigator.clipboard.readText()")
        check("кнопка «Копировать» кладёт строку ГОСТ в буфер", clip.startswith("Валеев, К. Роль музыки") and BASE in clip, clip[:80])

        # 10. Страница раздела: прогресс чтения, назад/далее, оглавление
        await page.goto(BASE + "/rabota/glava-2", wait_until="networkidle")
        await page.evaluate("window.scrollTo(0, 4000)")
        await page.wait_for_timeout(400)
        prog = await page.get_attribute("[role=progressbar]", "aria-valuenow")
        check("прогресс чтения растёт при прокрутке", prog and int(prog) > 0, str(prog))
        await page.get_by_role("link", name=re.compile("Далее")).click()
        await page.wait_for_url("**/rabota/glava-3")
        check("ссылка «Далее»", page.url.endswith("/rabota/glava-3"))
        await page.get_by_role("link", name=re.compile("Назад")).click()
        await page.wait_for_url("**/rabota/glava-2")
        check("ссылка «Назад»", page.url.endswith("/rabota/glava-2"))

        # 11. Мобильная версия: меню и оглавление
        m = await b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
        mp = await m.new_page()
        await mp.goto(BASE + "/rabota/glava-1", wait_until="networkidle")
        overflow = await mp.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
        check("нет горизонтальной прокрутки на 390 px", not overflow)
        await mp.get_by_role("button", name="Открыть меню").click()
        await mp.get_by_role("link", name="Источники").last.click()
        await mp.wait_for_url("**/istochniki")
        check("мобильное меню ведёт на «Источники»", mp.url.endswith("/istochniki"))
        await mp.goto(BASE + "/rabota/glava-1", wait_until="networkidle")
        await mp.get_by_role("button", name="Оглавление").click()
        await mp.get_by_role("dialog").get_by_role("link", name="Заключение").click()
        await mp.wait_for_url("**/rabota/zaklyuchenie")
        check("мобильное оглавление", mp.url.endswith("/zaklyuchenie"))
        # свайп по слайду
        await mp.goto(BASE + "/prezentatsiya", wait_until="networkidle")
        box = await mp.locator(".aspect-video").first.bounding_box()
        await mp.mouse.move(box["x"] + box["width"] * 0.8, box["y"] + box["height"] / 2)
        await mp.mouse.down()
        await mp.mouse.move(box["x"] + box["width"] * 0.2, box["y"] + box["height"] / 2, steps=6)
        await mp.mouse.up()
        await mp.wait_for_timeout(300)
        check("свайп листает слайды", "2 /" in await mp.locator("p[aria-live=polite]").first.inner_text())
        for w in [360, 390, 768, 1280, 1440]:
            await mp.set_viewport_size({"width": w, "height": 900})
            for path in ["/", "/rabota/glava-3", "/istochniki", "/prezentatsiya", "/prodolzhatelyam", "/skachat"]:
                await mp.goto(BASE + path, wait_until="networkidle")
                ov = await mp.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                check(f"без горизонтального переполнения {w}px {path}", ov <= 1, str(ov))
        await m.close()

        check("нет ошибок в консоли", not console_errors, "\n".join(console_errors[:10]))
        await b.close()

    failed = [r for r in results if not r[0]]
    print(f"\nИТОГО: {len(results) - len(failed)} из {len(results)} проверок пройдено")
    sys.exit(1 if failed else 0)

asyncio.run(main())
