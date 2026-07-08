# MCP playbook

Используй MCP как способ получать актуальную правду, а не как декоративный ритуал. Если задача может быть решена точнее через доступный MCP, используй его до вывода решения.

## Context7

Использовать для библиотек, frameworks, SDK, API, CLI и cloud-сервисов.

Порядок:

1. `resolve-library-id` с названием библиотеки и вопросом пользователя.
2. Выбрать лучший `/org/project` по совпадению имени, релевантности, количеству snippets и качеству источника.
3. `query-docs` с выбранным ID и полным вопросом пользователя.
4. Ответить или писать код на основе полученных docs.

Не использовать Context7 для бизнес-логики проекта, обычного рефакторинга или code review без библиотечных вопросов.

## Next.js local docs

Для Next.js этот проект сначала использует локальные docs установленной версии:

```text
node_modules/next/dist/docs/
```

Частые файлы:

- App Router pages/layouts: `01-app/01-getting-started/03-layouts-and-pages.md`
- Server/client components: `01-app/01-getting-started/05-server-and-client-components.md`
- Metadata: `01-app/01-getting-started/14-metadata-and-og-images.md`
- Proxy: `01-app/01-getting-started/16-proxy.md`
- MCP: `01-app/02-guides/mcp.md`
- AI agents: `01-app/02-guides/ai-agents.md`

## Next DevTools MCP

`.mcp.json` подключает `next-devtools-mcp`. Когда dev-сервер запущен, агент может использовать его для:

- runtime/build/type errors;
- routes и page metadata;
- development logs;
- диагностики hydration и server/client проблем.

## Figma MCP

Использовать, когда пользователь дает Figma URL, просит реализовать дизайн, синхронизировать UI с макетом или создать дизайн-систему.

Правила:

- Дизайн из Figma — reference, не финальный код.
- После чтения макета адаптируй результат к правилам skill `feature-sliced-design`, локальным компонентам, Tailwind и i18n.
- Не обходи существующие `shared/ui` компоненты без причины.

## Playwright и Chrome DevTools MCP

Использовать для UI QA и debugging:

- проверка адаптивности;
- визуальные проблемы;
- runtime console errors;
- интерактивность client components;
- регрессии после изменения верстки.

Для UI-изменений желательно проверять desktop и mobile viewport.

## Node REPL MCP

Использовать для быстрой JS/TS-инспекции, анализа данных, проверки package metadata или вспомогательных вычислений. Не использовать как замену проектным тестам и сборке.

## Google Drive и Calendar

Использовать только когда пользователь явно просит работать с документами, таблицами, презентациями, файлами, календарем или встречами. Не читать личные данные без явного контекста задачи.
