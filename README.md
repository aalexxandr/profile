# My App

Next.js 16 приложение с App Router, TypeScript, Tailwind CSS 4, локализацией `ru/en` и FSD-подобной структурой.

## Стек

- `next@16.2.9`
- `react@19`
- `typescript`
- `tailwindcss@4`
- `lottie-react`
- `steiger` + `@feature-sliced/steiger-plugin`

## Команды

```bash
bun run dev
bun run lint
bun run format:check
bun run build
bun run check
bun run fsd:check
```

`bun run check` запускает lint, проверку форматирования и production build. `bun run fsd:check` запускается отдельно, потому что в текущем окружении Steiger может падать с `EMFILE: too many open files, watch`.

## Архитектура

Код приложения находится в `src`:

- `src/app` — маршруты, layouts, metadata, sitemap, robots, global styles.
- `src/views` — крупные страницы и экранные композиции.
- `src/widgets` — самостоятельные блоки страницы.
- `src/features` — пользовательские сценарии, когда появятся.
- `src/entities` — доменные сущности, когда появятся.
- `src/shared` — общие UI, i18n, config и низкоуровневые helpers.

Подробные правила для ИИ-агентов лежат в `AGENTS.md` и `docs/ai/`. Для FSD-решений используется подключенный skill `feature-sliced-design`.

## AI workflow

Перед изменениями агент должен:

- прочитать `AGENTS.md`;
- изучить релевантные файлы в `docs/ai/`;
- для Next.js свериться с `node_modules/next/dist/docs/`;
- для библиотек и SDK использовать Context7 MCP;
- для UI-задач использовать Figma/Playwright/Chrome DevTools MCP, когда это применимо.

Крупные UI-блоки нужно делить на компоненты, а повторяемую или нетривиальную логику выносить в hooks или helpers.
