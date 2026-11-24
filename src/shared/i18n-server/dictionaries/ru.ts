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
    languageSwitcher: {
      ariaLabel: "Выбор языка",
      locales: {
        en: {
          label: "EN",
          title: "English version",
        },
        ru: {
          label: "RU",
          title: "Русская версия",
        },
      },
    },
    items: [
      { page: "home", label: "главная" },
      { page: "cases", label: "кейсы" },
      { page: "contacts", label: "контакты" },
    ],
  },
  home: {
    introText:
      "Привет, я Саша. Уже больше шести лет я исследую мир разработки.\n\nБерусь за идеи, которым ещё только предстоит обрести форму и довожу их до работающих продуктов.\n\nНе боюсь начинать с неопределённости. Погружаюсь в незнакомые области, нахожу ответы, принимаю решения и беру на себя ответственность за результат.",
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
      actions: {
        moreInformation: "Подробнее",
        projectLink: "Ссылка на проект",
        projectPrivate: "Закрытый проект",
      },
      controlLabels: {
        close: "Закрыть окно",
        fullScreen: "Развернуть окно",
        minimize: "Свернуть окно",
      },
      detail: {
        aboutTitle: "О кейсе",
        achievementsTitle: "Достижения",
        backToCases: "Назад к кейсам",
        companyLabel: "Компания",
        periodLabel: "Период",
        periodPresent: "по настоящее время",
        roleLabel: "Роль",
        roles: {
          FRONTEND: "Frontend-разработчик",
          FULLSTACK: "Fullstack-разработчик",
          PRODUCT: "Product engineer",
        },
        stackTitle: "Стек",
        teamSizeLabel: "Команда",
        teamSizeUnit: {
          few: "человека",
          many: "человек",
          one: "человек",
          other: "человека",
        },
      },
      noImage: "Нет картинки",
      status: {
        objects: "объектов",
      },
      title: "кейсы",
    },
    contacts: {
      form: {
        emailLabel: "Ваш email",
        errors: {
          invalidEmail: "Введите корректный email",
          required: "Обязательное поле",
          tooLong: "Не более {max} символов",
        },
        messageLabel: "Ваше сообщение",
        methodLabel: "Предпочтительный способ связи",
        methods: {
          email: "Email",
          telegram: "Telegram",
        },
        nameLabel: "Ваше имя / компания",
        send: "Отправить",
        success: {
          text: "Спасибо! Я скоро свяжусь с вами.",
          title: "Сообщение отправлено",
        },
        title: "начать работу",
        usernameLabel: "Ваш номер или username",
      },
      illustrationAlt: "Ретро-компьютер",
      infoText:
        "Увидели возможность создать что-то интересное вместе? \n Буду рад познакомиться, обсудить вашу задумку и превратить её во что-то большее.",
      links: {
        linkedin: "Открыть профиль в LinkedIn",
        telegram: "Написать в Telegram",
      },
      title: "контакты",
    },
  },
  errors: {
    notFound: {
      metaTitle: "Страница не найдена",
      title: "Здесь ничего нет",
      description:
        "Некоторых страниц просто не существует... Попробуйте вернуться на главную.",
      home: "На главную",
    },
    serverError: {
      title: "Что-то пошло не так",
      description: "Попробуйте ещё раз чуть позже или вернитесь на главную.",
      retry: "Попробовать снова",
      home: "На главную",
    },
  },
} satisfies Dictionary;
