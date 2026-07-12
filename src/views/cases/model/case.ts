import type { Locale } from "@/shared/i18n";

type CaseBase = {
  blurImage: string;
  image: string;
  name: string;
  projectLink: string;
  slug: string;
};

export type CaseShort = CaseBase & {
  shortDesc: string;
};

export type CaseAchievement = {
  description: string;
  metric: string;
  title: string;
};

export type CaseFull = CaseBase & {
  achievements: CaseAchievement[];
  category: string;
  description: string;
  role: string;
  shortDescription: string;
  stack: string[];
};

const mockCaseItemsByLocale = {
  en: [
    {
      blurImage: "https://picsum.photos/seed/product-ui/10/10",
      image: "https://picsum.photos/seed/product-ui/520/430",
      name: "Product UI",
      projectLink: "https://example.com/product-ui",
      shortDesc:
        "A product-team interface with quick metric scans, careful states, and navigation that keeps repeated daily work clear.",
      slug: "product-ui",
    },
    {
      blurImage: "https://picsum.photos/seed/booking-flow/10/10",
      image: "https://picsum.photos/seed/booking-flow/520/430",
      name: "Booking Flow",
      projectLink: "https://example.com/booking-flow",
      shortDesc:
        "A booking journey with readable steps, validation, and a calm visual rhythm across mobile and desktop screens.",
      slug: "booking-flow",
    },
    {
      blurImage: "https://picsum.photos/seed/fintech-console/10/10",
      image: "https://picsum.photos/seed/fintech-console/520/430",
      name: "Fintech Console",
      projectLink: "https://example.com/fintech-console",
      shortDesc:
        "An operations console for data-heavy work: dense layout, high-contrast accents, tables, and controls for repeated tasks.",
      slug: "fintech-console",
    },
  ],
  ru: [
    {
      blurImage: "https://picsum.photos/seed/product-ui/10/10",
      image: "https://picsum.photos/seed/product-ui/520/430",
      name: "Product UI",
      projectLink: "https://example.com/product-ui",
      shortDesc:
        "Интерфейс для команды продукта: быстрый обзор метрик, аккуратные состояния и навигация, которая помогает не теряться в ежедневной работе.",
      slug: "product-ui",
    },
    {
      blurImage: "https://picsum.photos/seed/booking-flow/10/10",
      image: "https://picsum.photos/seed/booking-flow/520/430",
      name: "Booking Flow",
      projectLink: "https://example.com/booking-flow",
      shortDesc:
        "Пользовательский сценарий бронирования с понятными шагами, валидацией и спокойным визуальным ритмом для мобильных и desktop-экранов.",
      slug: "booking-flow",
    },
    {
      blurImage: "https://picsum.photos/seed/fintech-console/10/10",
      image: "https://picsum.photos/seed/fintech-console/520/430",
      name: "Fintech Console",
      projectLink: "https://example.com/fintech-console",
      shortDesc:
        "Рабочая консоль для данных и операций: плотная компоновка, контрастные акценты, таблицы и элементы управления для повторяющихся задач.",
      slug: "fintech-console",
    },
  ],
} satisfies Record<Locale, CaseShort[]>;

export const getMockCaseItems = (locale: Locale) =>
  mockCaseItemsByLocale[locale];
