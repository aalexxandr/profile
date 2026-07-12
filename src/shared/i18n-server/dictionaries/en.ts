import type { Dictionary } from "@/shared/i18n";

export const en = {
  common: {
    loading: "Loading...",
  },
  metadata: {
    home: {
      title: "Sasha - Web Developer",
      description:
        "Portfolio: web interfaces, animated landing pages, services, fintech, mobile apps, and backend work.",
    },
    cases: {
      title: "Cases",
      description: "Selected projects, interfaces, and product cases by Sasha.",
    },
    contacts: {
      title: "Contacts",
      description: "Contact Sasha to discuss web projects and interfaces.",
    },
  },
  navigation: {
    ariaLabel: "Main navigation",
    languageSwitcher: {
      ariaLabel: "Language selector",
      locales: {
        en: {
          label: "EN",
          title: "English version",
        },
        ru: {
          label: "RU",
          title: "Russian version",
        },
      },
    },
    items: [
      { page: "home", label: "home" },
      { page: "cases", label: "cases" },
      { page: "contacts", label: "contacts" },
    ],
  },
  home: {
    introText:
      "Hi, I'm Sasha. I have been building for the web for 6\u00a0years.\n\nDuring that time I have built animated and 3D\u00a0landing pages, booking services, fintech interfaces with large datasets, Chrome widgets, mobile apps, and backend systems.\n\nIn pixels, code, and chaos I look for order, meaning, and joy. I love the feeling of adventure and interfaces that pull people in.",
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
      label: "View cases",
    },
    imageAlts: {
      lamp: "lamp",
      painting: "painting",
      shelves: "shelves",
      table: "table",
    },
  },
  pages: {
    cases: {
      actions: {
        moreInformation: "More information",
        projectLink: "Project link",
      },
      controlLabels: {
        close: "Close window",
        fullScreen: "Full screen window",
        minimize: "Minimize window",
      },
      status: {
        objects: {
          one: "object",
          other: "objects",
        },
      },
      title: "cases",
    },
    contacts: {
      title: "contacts",
    },
  },
} satisfies Dictionary;
