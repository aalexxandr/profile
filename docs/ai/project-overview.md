# Обзор проекта

Этот проект — Next.js 16.2.9 приложение на App Router с TypeScript, React 19, Tailwind CSS 4, локализованными маршрутами и FSD-подобной структурой.

## Стек

- Runtime/package manager: проектные команды написаны под `bun`.
- Framework: `next@16.2.9`, App Router, Turbopack config.
- UI: React 19, Tailwind CSS 4, `clsx`, локальные SVG/assets, Lottie-анимации.
- i18n: локали `ru` и `en`, словари в `src/shared/i18n-server/dictionaries`.
- Архитектура: FSD-подобная структура в `src`; решения по FSD принимать через skill `feature-sliced-design`.
- Качество: ESLint 9, Next core web vitals, TypeScript strict, Prettier с Tailwind plugin, Steiger для FSD.

## Команды

- `bun run dev` — dev-сервер.
- `bun run build` — production build.
- `bun run start` — запуск production-сборки.
- `bun run lint` — ESLint.
- `bun run lint:fix` — ESLint autofix.
- `bun run format` — форматирование Prettier.
- `bun run format:check` — проверка форматирования.
- `bun run check` — lint, format check и build.
- `bun run fsd:check` — архитектурная проверка Steiger.

## Маршруты

Маршруты локализованы через сегмент `[locale]`.

- `/ru`, `/en` — home page.
- `/ru/cases`, `/en/cases` — cases page.
- `/ru/contacts`, `/en/contacts` — contacts page.

`src/proxy.ts` определяет локаль из URL или `Accept-Language` и перенаправляет на локализованный путь.

## Текущая структура

- `src/app` — Next.js routes, layouts, metadata, sitemap, robots, global CSS, fonts.
- `src/app/_layout` — layout-композиция сайта, не доменная логика.
- `src/views/home` — home page view и ее локальные UI/assets.
- `src/widgets/header` — header widget.
- `src/shared/i18n` — общие типы и config локализации.
- `src/shared/i18n-server` — серверная загрузка словарей, metadata helpers, validation locale.
- `src/shared/ui` — переиспользуемые UI-примитивы.

## Важные соглашения

- Next.js API проверяй по `node_modules/next/dist/docs/`, потому что версия проекта может отличаться от привычной.
- Для FSD-решений используй skill `feature-sliced-design`; не дублируй его правила в проектной документации.
- Клиентские компоненты изолируй: не переносить `"use client"` выше по дереву без необходимости.
- Пользовательский текст добавляй в оба словаря `ru` и `en` и в типы словаря.
