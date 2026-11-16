# My App

Next.js 16 приложение с App Router, TypeScript, Tailwind CSS 4, локализацией `ru/en` и FSD-подобной структурой.

## Стек

- `next@16.2.9`
- `react@19`
- `typescript`
- `tailwindcss@4`
- `lottie-react@3`
- `steiger` + `@feature-sliced/steiger-plugin`

## Команды

```bash
pnpm dev
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm test:e2e
pnpm build
pnpm check
pnpm fsd:check
pnpm api:generate
```

`pnpm check` запускает lint, проверку форматирования, typecheck, тесты (Vitest) и production build. Тесты лежат рядом с кодом (`*.test.ts(x)`); `pnpm test:coverage` считает покрытие и падает, если оно ниже порогов из `vitest.config.mts` (в CI запускается именно он, HTML-отчёт сохраняется артефактом `coverage-report`). E2E на Playwright (`e2e/`) запускаются отдельно через `pnpm test:e2e`: команда сама собирает приложение и поднимает его standalone-сервером (`.next/standalone/server.js`, `scripts/prepare-standalone.ts` копирует в него `public` и `.next/static`) на порту 3100 и останавливает серверы по SIGTERM; при первом запуске нужен `pnpm exec playwright install chromium`. `pnpm fsd:check` запускается отдельно (в CI тоже), потому что в локальном окружении Steiger может падать с `EMFILE: too many open files, watch`.

`pnpm api:generate` читает OpenAPI-спецификацию бэкенда (`$API_URL/docs-json`, по умолчанию `http://localhost:3000`) и сразу записывает типы в `src/shared/api/generated/schema.d.ts` (закоммиченный файл и есть снапшот контракта). Если бэкенд недоступен, команда завершается с понятной ошибкой и не трогает файл. **TODO:** после деплоя бэкенда добавить `api:check` (перегенерировать и упасть при отличии от закоммиченного `schema.d.ts`) в CI.

Переменные окружения описаны в `.env.example`.

## Архитектура

Код приложения находится в `src`:

- `src/app` — маршруты, layouts, metadata, sitemap, robots, global styles.
- `src/views` — крупные страницы и экранные композиции.
- `src/widgets` — самостоятельные блоки страницы.
- `src/features` — пользовательские сценарии, когда появятся.
- `src/entities` — доменные сущности, когда появятся.
- `src/shared` — общие UI, i18n, config и низкоуровневые helpers; `shared/api` — сгенерированные из OpenAPI бэкенда типы и типизированный клиент (только `GET`, серверный, адрес в `API_URL`). Запросы кейсов лежат рядом с потребителем: `getCases` в `src/views/cases/api` (список), `getCase` в `src/views/case-details/api` (страница кейса). **Временно сайт можно запускать без бэкенда:** если `API_URL` не задан, `getCases` и `getCase` берут данные из `src/shared/content/cases.ts` (скопированы с бэкенда, общие поля один раз, тексты по локалям); если задан, ходят в бэкенд. Чтобы вернуться к API, достаточно задать `API_URL` при сборке (затем можно удалить `src/shared/content`). Страницы кейсов генерируются статически (SSG), поэтому при заданном `API_URL` `pnpm build` обращается к бэкенду; без бэкенда используйте заглушку `pnpm stub:start` (`scripts/stub-api`), на ней же собирается CI и работают E2E.

## Контроль качества

- Pre-commit (husky + lint-staged): ESLint и Prettier по staged-файлам.
- CI (`.github/workflows/ci.yml`): lint, format:check, typecheck, test, build, fsd:check, e2e. У job и у шагов установки браузера и e2e есть `timeout-minutes` (20 / 8 + 5 / 8), у Playwright в CI — `globalTimeout` 5 минут; установка зависимостей и браузера повторяется через `scripts/retry.sh`, браузер кэшируется; устаревшие запуски той же ветки отменяются (`concurrency`). В логе e2e есть построчный репортер `list`, отчёт Playwright сохраняется всегда (`if: always()`).
- Dependabot обновляет npm-зависимости и GitHub Actions раз в неделю. `react` и `react-dom` обновляются одним PR (группа `react`: версии закреплены и должны совпадать), а новые мажорные версии `eslint` и `typescript` игнорируются, пока их не поддержат `eslint-plugin-react` и `typescript-eslint` (правила и причина описаны в `.github/dependabot.yml`; конфиг защищён тестом `scripts/dependabot-config.test.ts`).

## Работа с Claude Code

Правила для агента лежат в `CLAUDE.md`. В `.claude/settings.json` настроены разрешения и хуки: автоформатирование и ESLint после каждой правки файла, typecheck при завершении ответа. Для FSD-решений используется skill `feature-sliced-design`, для написания тестов — skill `writing-tests` (лежит в `.agents/skills`, симлинк в `.claude/skills`). По правилам из `CLAUDE.md` любая новая функциональность и любое исправление бага поставляются с тестами.
