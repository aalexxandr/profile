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
bun run typecheck
bun run test
bun run test:watch
bun run test:coverage
bun run test:e2e
bun run build
bun run check
bun run fsd:check
```

`bun run check` запускает lint, проверку форматирования, typecheck, тесты (Vitest) и production build. Тесты лежат рядом с кодом (`*.test.ts(x)`); `bun run test:coverage` считает покрытие и падает, если оно ниже порогов из `vitest.config.mts` (в CI запускается именно он, HTML-отчёт сохраняется артефактом `coverage-report`), поэтапный план покрытия — в `TESTING_PLAN.md`. E2E на Playwright (`e2e/`) запускаются отдельно через `bun run test:e2e`: команда сама собирает и поднимает приложение на порту 3100; при первом запуске нужен `bunx playwright install chromium`. `bun run fsd:check` запускается отдельно (в CI тоже), потому что в локальном окружении Steiger может падать с `EMFILE: too many open files, watch`.

Переменные окружения описаны в `.env.example`.

## Архитектура

Код приложения находится в `src`:

- `src/app` — маршруты, layouts, metadata, sitemap, robots, global styles.
- `src/views` — крупные страницы и экранные композиции.
- `src/widgets` — самостоятельные блоки страницы.
- `src/features` — пользовательские сценарии, когда появятся.
- `src/entities` — доменные сущности, когда появятся.
- `src/shared` — общие UI, i18n, config и низкоуровневые helpers.

## Контроль качества

- Pre-commit (husky + lint-staged): ESLint и Prettier по staged-файлам.
- CI (`.github/workflows/ci.yml`): lint, format:check, typecheck, test, build, fsd:check, e2e (при падении сохраняется отчёт Playwright).
- Dependabot обновляет npm-зависимости и GitHub Actions.

## Работа с Claude Code

Правила для агента лежат в `CLAUDE.md`. В `.claude/settings.json` настроены разрешения и хуки: автоформатирование и ESLint после каждой правки файла, typecheck при завершении ответа. Для FSD-решений используется skill `feature-sliced-design`, для написания тестов — skill `writing-tests` (лежит в `.agents/skills`, симлинк в `.claude/skills`). По правилам из `CLAUDE.md` любая новая функциональность и любое исправление бага поставляются с тестами.
