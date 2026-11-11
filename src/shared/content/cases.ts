import type { Schemas } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";

type Detail = Schemas["CaseDetailDto"];
type Texts = Pick<
  Detail,
  "achievements" | "category" | "description" | "name" | "shortDescription"
>;
type Shared = Omit<Detail, keyof Texts | "locale">;

// TEMPORARY: used while `API_URL` is not set (the site runs without the
// backend). Add or edit a case here: shared fields once, texts per locale. The
// data was copied from the backend (`GET /cases/{slug}?lang=ru|en`).
const cases: { shared: Shared; texts: Record<Locale, Texts> }[] = [
  {
    shared: {
      slug: "spectre",
      stack: [
        "React",
        "Remix",
        "MobX",
        "Tailwind",
        "Ethers",
        "Wagmi",
        "Reown",
        "TanStack",
        "Recharts",
        "Storybook",
        "Vite",
        "Webpack",
        "Vitest",
        "Playwright",
        "OpenAPI",
        "Husky",
        "CSS",
        "HTML",
      ],
      image:
        "https://437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz/cases/spectre/fda669aa78c38ce1.webp",
      blurImage:
        "data:image/webp;base64,UklGRoAAAABXRUJQVlA4WAoAAAAQAAAAEwAAFQAAQUxQSCQAAAABH3D//4iIhYJGkpr9qgsJHWxhDlcIiOh/JnAFKHwcQD1rrQdWUDggNgAAABADAJ0BKhQAFgA+7XCwUimmJKKoCAEwHYlnAMcwFqcUAAD+7t1LbYz8Ng5NxijO/oClFMAAAA==",
      backgroundImage:
        "https://437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz/cases/spectre/background/5693130a083e7259.webp",
      backgroundBlurImage:
        "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAwCdASoUAAkAPu1iqk2ppaQiMAgBMB2JYgCsAB8nQum6PlSaiAD+7sKudjVen7Y2TCrjKUuM8t9kAR3zs2qhx9WqXm9EAAA=",
      role: "FRONTEND",
      projectLink: "https://thespectre.io",
      company: "AIPeople",
      teamSize: 22,
      startedAt: "2023-04-01",
      endedAt: "2026-09-01",
    },
    texts: {
      ru: {
        name: "The Spectre Explorer",
        category: "FinTech / Web-приложение",
        shortDescription:
          "Spectre - быстрый и надёжный веб-сервис для поиска платежей и активов в блокчейне.",
        description:
          "Spectre - блокчейн-эксплорер с уникальными возможностями для изучения и анализа данных Ethereum и других блокчейн-сетей. Сервис собирает и показывает информацию о транзакциях, блоках, адресах и токенах, делая данные полностью прозрачными и доступными для каждого пользователя. Также Spectre предоставляет API, с которым удобно работать с этими данными.",
        achievements: [
          {
            title:
              "Высокопроизводительная визуализация сложных структур данных",
            description:
              "Проектировал и разрабатывал сложные data-heavy интерфейсы для визуализации и анализа данных: интерактивные диаграммы, динамические графики, рекурсивные компоненты для парсинга и отображения кода, а также высокопроизводительные realtime-таблицы для отображения и обработки миллионов записей с динамическим обновлением данных и другие нестандартные UI-компоненты",
            metric: "Выросла вовлеченность пользователей",
          },
          {
            title:
              "Построение харнес для надёжной AI-разработки с многоуровневой проверкой кода",
            description:
              "Выстроил процесс AI-assisted разработки с многоуровневой системой контроля качества: обеспечил 90% покрытия кода unit-тестами, покрыл ключевые пользовательские сценарии E2E-тестами и реализовал полное покрытие дизайн-системы в Storybook. Созданная инфраструктура позволила AI-агентам проверять корректность реализации по независимым критериям, повысив качество и предсказуемость генерируемого кода",
            metric:
              "Генерация кода ИИ стала более контролируемой, проверяемой и предсказуемой",
          },
          {
            title: "Создание масштабируемой мультипроектной архитектуры",
            description:
              "Спроектировал и реализовал архитектуру для поддержки трёх независимых проектов на единой кодовой базе. Адаптировал существующий продукт под два дополнительных блокчейна и внедрил гибкую систему конфигурации и кастомизации, позволяющую учитывать различия между проектами, сохраняя общую бизнес-логику и упрощая внедрение обновлений",
            metric:
              "Ускорен запуск новых проектов и распространение обновлений",
          },
        ],
      },
      en: {
        name: "The Spectre Explorer",
        category: "FinTech / Web App",
        shortDescription:
          "Spectre - a fast, reliable web service that lets anyone look up blockchain payments and assets.",
        description:
          "Spectre is a Blockchain Explorer that provides unique capabilities for exploring and analyzing data from Ethereum and other blockchain networks. Spectre gathers and displays information about transactions, blocks, addresses, and tokens across these networks, ensuring full transparency and accessibility of data for users, as well as offering an API for convenient data manipulation.",
        achievements: [
          {
            title: "High-Performance Visualization of Complex Data Structures",
            description:
              "Designed and developed complex data-heavy interfaces for data visualization and analysis, including interactive charts, dynamic graphs, recursive components for parsing and displaying code, high-performance real-time tables for displaying and processing millions of records with dynamically updated data, and other specialized UI components",
            metric: "Increased user engagement",
          },
          {
            title:
              "Building a Harness for Reliable AI-Assisted Development with Multi-Layer Code Validation",
            description:
              "Established an AI-assisted development workflow with a multi-layered quality assurance system: achieved 90% unit test coverage, implemented E2E tests for key user journeys, and ensured complete Storybook coverage of the design system. This infrastructure enabled AI agents to validate implementations against multiple independent criteria, improving the quality and predictability of AI-generated code",
            metric:
              "Made AI-generated code more controlled, verifiable, and predictable",
          },
          {
            title: "Building a Scalable Multi-Product Architecture",
            description:
              "Designed and implemented an architecture supporting three independent projects on a shared codebase. Extended the existing product to support two additional blockchains and introduced a flexible configuration and customization system that accommodates project-specific requirements while preserving shared business logic and streamlining updates across all three products.",
            metric:
              "Accelerated new product launches and update delivery across all three projects",
          },
        ],
      },
    },
  },
];

export const getCaseList = (locale: Locale): Schemas["CaseListItemDto"][] =>
  cases.map(({ shared, texts }) => ({
    slug: shared.slug,
    locale,
    name: texts[locale].name,
    category: texts[locale].category,
    projectLink: shared.projectLink,
    stack: shared.stack,
    shortDescription: texts[locale].shortDescription,
    image: shared.image,
    blurImage: shared.blurImage,
  }));

export const findCase = (slug: string, locale: Locale): Detail | undefined => {
  const found = cases.find(({ shared }) => shared.slug === slug);

  return found && { ...found.shared, ...found.texts[locale], locale };
};
