import type { Dictionary } from "@/shared/i18n";

export const ru = {
  common: {
    loading: "Загрузка...",
  },
  metadata: {
    home: {
      title: "Саша - веб-разработчик",
      description:
        "Портфолио: веб-интерфейсы, лендинги с анимацией, сервисы, финтех, мобильные приложения и backend.",
    },
    cases: {
      title: "Кейсы",
      description: "Избранные проекты, интерфейсы и продуктовые кейсы.",
    },
    contacts: {
      title: "Контакты",
      description: "Контакты для обсуждения веб-проектов и интерфейсов.",
    },
  },
  navigation: {
    ariaLabel: "Главная навигация",
    items: [
      { page: "home", label: "главная" },
      { page: "cases", label: "кейсы" },
      { page: "contacts", label: "контакты" },
    ],
  },
  home: {
    introText:
      "Привет, я\u00a0Саша. Уже 6\u00a0лет я\u00a0делаю веб.\n\nЗа\u00a0это время собирал лендинги с\u00a0анимацией и\u00a03D, сервисы бронирования, финтех-интерфейсы с\u00a0большими данными, Chrome-виджеты, мобильные приложения и\u00a0backend.\n\nВ\u00a0пикселях, коде и\u00a0хаосе ищу порядок, смысл и\u00a0радость, люблю ощущение приключения и\u00a0интерфейсы, которые цепляют.",
    typewriterTexts: [
      "Never lost, always exploring.",
      "Open mind. Clean code.",
      "Step by step. Pixel by pixel.",
      "motherlode",
      "Knowledge is power.",
      "Now or never!",
      "No rush. Just progress.",
    ],
    cta: {
      label: "Перейти к кейсам",
    },
    imageAlts: {
      lamp: "лампа",
      painting: "картина",
      shelves: "полки",
      table: "стол",
    },
  },
  pages: {
    cases: {
      controlLabels: {
        close: "Закрыть окно",
        fullScreen: "Развернуть окно",
        minimize: "Свернуть окно",
      },
      statusSuffix: "объектов",
      title: "кейсы",
    },
    contacts: {
      title: "контакты",
    },
  },
} satisfies Dictionary;
