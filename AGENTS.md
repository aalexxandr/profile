<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Правила проекта для ИИ-агентов

Главный источник проектных правил: `AGENTS.md` и файлы в `docs/ai/`. Перед изменениями сначала изучи текущую структуру, соседние компоненты и локальные соглашения. Не начинай с генерации нового паттерна, если в проекте уже есть похожий.

## Документация и MCP

- Для любых задач по Next.js сначала читай релевантный файл из `node_modules/next/dist/docs/`. Особенно важны App Router, server/client components, metadata, proxy, caching, routing и MCP.
- Для библиотек, SDK, API, CLI и cloud-сервисов используй Context7 MCP: сначала `resolve-library-id`, затем `query-docs` с полным вопросом пользователя.
- Для UI-верстки по дизайну используй Figma MCP, если есть ссылка, макет или задача синхронизации дизайна.
- Для проверки интерфейса используй Playwright/Chrome DevTools MCP, когда задача меняет отображение, адаптивность, интерактивность или клиентское поведение.
- Для диагностики Next.js во время dev-сервера используй Next DevTools MCP из `.mcp.json`, если сервер доступен.

Подробнее: `docs/ai/mcp-playbook.md`.

## Архитектура

Для любых решений по Feature-Sliced Design используй подключенный skill `feature-sliced-design`. Он является источником правды по слоям, слайсам, public API, импортам, размещению assets и интеграции с Next.js.

В проекте уже есть FSD-подобная структура в `src`: `app`, `views`, `widgets`, `shared`; новые слои и слайсы добавляй только по правилам skill-а.

## Код и композиция

- Пиши строгий TypeScript без `any`, если нет веской причины.
- Серверные компоненты — по умолчанию. Добавляй `"use client"` только для hooks, browser API, событий, анимаций или client-only библиотек.
- Дели крупные UI-блоки на небольшие компоненты с понятной ответственностью.
- Максимально отделяй логику от JSX: повторяемую или нетривиальную логику выноси в hooks, helpers или место, выбранное по `feature-sliced-design` skill.
- JSX должен оставаться декларативным и читаемым: без длинных inline-вычислений, вложенных условий и случайной бизнес-логики внутри разметки.
- Tailwind-классы держи читаемыми; для условий используй `clsx`.
- Все пользовательские тексты, alt, navigation labels и metadata проходят через словари i18n.

Подробнее: `docs/ai/coding-standards.md`.

## Проверки перед финалом

Перед ответом пользователю запусти релевантные проверки. Для большинства изменений:

- `bun run lint`
- `bun run format:check`
- `bun run build`

Для архитектурных изменений дополнительно пробуй `bun run fsd:check`. Если Steiger падает с `EMFILE: too many open files, watch`, зафиксируй это как известный blocker runtime/окружения, а не как успешную FSD-проверку.

Подробнее: `docs/ai/checklists.md`.
