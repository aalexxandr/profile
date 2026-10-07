import type { Locale } from "@/shared/i18n";

import type { CaseFull } from "./case";

export type CaseDetails = Pick<
  CaseFull,
  "achievements" | "category" | "description" | "role" | "stack"
>;

export const mockCaseDetailsByLocale: Record<
  Locale,
  Record<string, CaseDetails>
> = {
  en: {
    "product-ui": {
      achievements: [
        {
          description:
            "Weekly metric review moved from a spreadsheet to one screen.",
          metric: "-40%",
          title: "Time spent on reporting",
        },
        {
          description:
            "Shared state components removed one-off screens from the backlog.",
          metric: "30+",
          title: "Reusable UI states",
        },
      ],
      category: "Product interface",
      description:
        "A daily-use interface for a product team: metric overviews, filters that remember context, and careful empty, loading and error states. Navigation was rebuilt so people always know where they are and how to get back.",
      role: "Frontend developer",
      stack: ["React", "TypeScript", "Tailwind CSS"],
    },
    "booking-flow": {
      achievements: [
        {
          description:
            "Step-by-step validation caught mistakes before the payment step.",
          metric: "+18%",
          title: "Completed bookings",
        },
        {
          description:
            "The same flow works from 320px phones to wide desktop screens.",
          metric: "320px+",
          title: "Responsive coverage",
        },
      ],
      category: "Booking service",
      description:
        "A booking journey split into readable steps with inline validation, a persistent summary and a calm visual rhythm. Special attention went to keyboard control and to recovering from errors without losing entered data.",
      role: "Frontend developer",
      stack: ["Next.js", "TypeScript", "Zod"],
    },
    "fintech-console": {
      achievements: [
        {
          description: "Virtualized tables keep large datasets responsive.",
          metric: "100k+",
          title: "Rows per table",
        },
        {
          description:
            "Hotkeys and bulk actions shortened repeated operator tasks.",
          metric: "-3 clicks",
          title: "Per routine operation",
        },
      ],
      category: "Fintech console",
      description:
        "An operations console for data-heavy work: dense layouts, high-contrast accents, tables with filtering and controls tuned for repeated tasks. Performance and predictable keyboard behavior mattered more than decoration.",
      role: "Frontend developer",
      stack: ["React", "TypeScript", "TanStack Table"],
    },
  },
  ru: {
    "product-ui": {
      achievements: [
        {
          description:
            "Еженедельный обзор метрик переехал из таблицы на один экран.",
          metric: "-40%",
          title: "Времени на отчётность",
        },
        {
          description:
            "Общие компоненты состояний убрали из бэклога разовые экраны.",
          metric: "30+",
          title: "Переиспользуемых состояний UI",
        },
      ],
      category: "Продуктовый интерфейс",
      description:
        "Интерфейс ежедневной работы для команды продукта: обзор метрик, фильтры, которые помнят контекст, и аккуратные состояния пустых данных, загрузки и ошибок. Навигацию пересобрали так, чтобы всегда было понятно, где ты и как вернуться.",
      role: "Frontend-разработчик",
      stack: ["React", "TypeScript", "Tailwind CSS"],
    },
    "booking-flow": {
      achievements: [
        {
          description: "Пошаговая валидация ловила ошибки до шага оплаты.",
          metric: "+18%",
          title: "Завершённых бронирований",
        },
        {
          description:
            "Один и тот же сценарий работает от телефонов 320px до широких экранов.",
          metric: "320px+",
          title: "Адаптивное покрытие",
        },
      ],
      category: "Сервис бронирования",
      description:
        "Сценарий бронирования, разбитый на понятные шаги, со встроенной валидацией, постоянной сводкой и спокойным визуальным ритмом. Особое внимание уделено управлению с клавиатуры и восстановлению после ошибок без потери введённых данных.",
      role: "Frontend-разработчик",
      stack: ["Next.js", "TypeScript", "Zod"],
    },
    "fintech-console": {
      achievements: [
        {
          description:
            "Виртуализированные таблицы остаются отзывчивыми на больших объёмах данных.",
          metric: "100k+",
          title: "Строк в таблице",
        },
        {
          description:
            "Горячие клавиши и массовые действия сократили повторяющиеся операции.",
          metric: "-3 клика",
          title: "На рутинную операцию",
        },
      ],
      category: "Финтех-консоль",
      description:
        "Рабочая консоль для данных и операций: плотная компоновка, контрастные акценты, таблицы с фильтрацией и элементы управления под повторяющиеся задачи. Производительность и предсказуемое поведение клавиатуры были важнее декора.",
      role: "Frontend-разработчик",
      stack: ["React", "TypeScript", "TanStack Table"],
    },
  },
};
