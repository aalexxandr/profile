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
    introParagraphs: [
      "Привет, я Саша. Уже 6 лет я делаю веб.",
      "За это время собирал лендинги с анимацией и 3D, сервисы бронирования, финтех-интерфейсы с большими данными, Chrome-виджеты, мобильные приложения и backend.",
      "В пикселях, коде и хаосе ищу порядок, смысл и радость, люблю ощущение приключения и интерфейсы, которые цепляют.",
    ],
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
      title: "кейсы",
    },
    contacts: {
      title: "контакты",
    },
  },
} satisfies Dictionary;
