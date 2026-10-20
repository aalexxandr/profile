import type { Locale } from "@/shared/i18n/config";
import type { Schemas } from "@/shared/api/types";

type Detail = Schemas["CaseDetailDto"];
type Texts = Pick<
  Detail,
  "achievements" | "category" | "description" | "name" | "shortDescription"
>;
type Shared = Omit<Detail, keyof Texts | "locale">;

const STORAGE = "https://437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz";
const BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

// Each case differs in the values the pages must handle: nullable picture and
// blur, optional company / team size, an open end date and both roles.
const cases: { shared: Shared; texts: Record<Locale, Texts> }[] = [
  {
    shared: {
      slug: "spectre",
      stack: ["React", "TypeScript"],
      image: `${STORAGE}/cases/spectre/3f9a1c2b7d4e5f60.webp`,
      blurImage: BLUR,
      role: "FRONTEND",
      projectLink: "https://example.com/spectre",
      company: "Spectre Labs",
      teamSize: 6,
      startedAt: "2023-03-01",
      endedAt: "2024-06-30",
    },
    texts: {
      ru: {
        name: "Spectre Explorer",
        category: "FinTech / Web App",
        shortDescription: "Большой сервис для просмотра операций в блокчейне.",
        description:
          "Мультифункциональный сервис для просмотра блокчейн-операций с фильтрами и аналитикой.",
        achievements: [
          {
            title: "Времени на отчётность",
            description: "Обзор метрик переехал на один экран.",
            metric: "-40%",
          },
        ],
      },
      en: {
        name: "Spectre Explorer",
        category: "FinTech / Web App",
        shortDescription: "A large service for browsing blockchain operations.",
        description:
          "A multi-feature service for browsing blockchain operations with filters and analytics.",
        achievements: [
          {
            title: "Time spent on reporting",
            description: "Metric review moved to a single screen.",
            metric: "-40%",
          },
        ],
      },
    },
  },
  {
    shared: {
      slug: "orbit",
      stack: ["Next.js", "NestJS", "PostgreSQL"],
      image: null,
      blurImage: null,
      role: "FULLSTACK",
      projectLink: "https://example.com/orbit",
      company: null,
      teamSize: null,
      startedAt: "2024-09-01",
      endedAt: null,
    },
    texts: {
      ru: {
        name: "Orbit Booking",
        category: "Сервис бронирования",
        shortDescription: "Сценарий бронирования с понятными шагами.",
        description:
          "Сценарий бронирования, разбитый на шаги, со встроенной валидацией и сводкой.",
        achievements: [
          {
            title: "Завершённых бронирований",
            description: "Валидация ловит ошибки до оплаты.",
            metric: "+18%",
          },
        ],
      },
      en: {
        name: "Orbit Booking",
        category: "Booking service",
        shortDescription: "A booking journey with readable steps.",
        description:
          "A booking journey split into steps with inline validation and a persistent summary.",
        achievements: [
          {
            title: "Completed bookings",
            description: "Validation catches mistakes before payment.",
            metric: "+18%",
          },
        ],
      },
    },
  },
  {
    shared: {
      slug: "nova",
      stack: ["React", "TanStack Table"],
      image: `${STORAGE}/cases/nova/8a1b2c3d4e5f6071.webp`,
      blurImage: null,
      role: "FRONTEND",
      projectLink: "https://example.com/nova",
      company: "Nova Systems",
      teamSize: 3,
      startedAt: "2022-01-15",
      endedAt: "2022-12-20",
    },
    texts: {
      ru: {
        name: "Nova Console",
        category: "Финтех-консоль",
        shortDescription: "Рабочая консоль для данных и операций.",
        description:
          "Операционная консоль с плотной компоновкой, таблицами и горячими клавишами.",
        achievements: [
          {
            title: "Строк в таблице",
            description: "Виртуализация держит большие объёмы данных.",
            metric: "100k+",
          },
        ],
      },
      en: {
        name: "Nova Console",
        category: "Fintech console",
        shortDescription: "An operations console for data-heavy work.",
        description:
          "An operations console with dense layouts, tables and hotkeys.",
        achievements: [
          {
            title: "Rows per table",
            description: "Virtualization keeps large datasets responsive.",
            metric: "100k+",
          },
        ],
      },
    },
  },
];

export const caseSlugs = cases.map(({ shared }) => shared.slug);

export const getListItems = (locale: Locale): Schemas["CaseListItemDto"][] =>
  cases.map(({ shared, texts }) => ({
    slug: shared.slug,
    locale,
    name: texts[locale].name,
    category: texts[locale].category,
    stack: shared.stack,
    shortDescription: texts[locale].shortDescription,
    image: shared.image,
    blurImage: shared.blurImage,
  }));

export const getDetail = (slug: string, locale: Locale): Detail | undefined => {
  const found = cases.find(({ shared }) => shared.slug === slug);

  return found && { ...found.shared, ...found.texts[locale], locale };
};
