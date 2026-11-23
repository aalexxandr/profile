import type { Dictionary } from "@/shared/i18n";

export const en = {
  common: {
    loading: "Loading...",
  },
  metadata: {
    home: {
      title: "Alex - Web Developer",
      description:
        "Portfolio: web interfaces, animated landing pages, services, fintech, mobile apps, and backend work.",
    },
    cases: {
      title: "Cases",
      description: "Selected projects, interfaces, and product cases by Alex.",
    },
    contacts: {
      title: "Contacts",
      description: "Contact Alex to discuss web projects and interfaces.",
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
      "Hi, I'm Alex. I've spent over six years exploring the world of software development.\n\nI love working on things that, not long ago, existed only in someone's imagination. Listening, asking questions, experimenting, making mistakes, creating. At some point, an idea stops being just a conversation and becomes part of someone's life.\n\nAnd every time, I find myself wanting to do it all over again.",
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
        projectPrivate: "Private project",
      },
      controlLabels: {
        close: "Close window",
        fullScreen: "Full screen window",
        minimize: "Minimize window",
      },
      detail: {
        aboutTitle: "About case",
        achievementsTitle: "Achievements",
        backToCases: "Back to cases",
        companyLabel: "Company",
        periodLabel: "Period",
        periodPresent: "present",
        roleLabel: "Role",
        roles: {
          FRONTEND: "Frontend developer",
          FULLSTACK: "Fullstack developer",
          PRODUCT: "Product engineer",
        },
        stackTitle: "Stack",
        teamSizeLabel: "Team",
        teamSizeUnit: {
          one: "person",
          other: "people",
        },
      },
      noImage: "No image",
      status: {
        objects: "objects",
      },
      title: "cases",
    },
    contacts: {
      form: {
        emailLabel: "Your email",
        errors: {
          invalidEmail: "Enter a valid email address",
          required: "This field is required",
          tooLong: "No more than {max} characters",
        },
        messageLabel: "Your message",
        methodLabel: "Preferred method of communication",
        methods: {
          email: "Email",
          telegram: "Telegram",
        },
        nameLabel: "Your name / company",
        send: "Send",
        success: {
          text: "Thank you! I will get back to you soon.",
          title: "Message sent",
        },
        title: "start work",
        usernameLabel: "Your number or username",
      },
      illustrationAlt: "Retro computer",
      infoText:
        "See an opportunity to create something interesting together? I'd be happy to connect, discuss your idea, and turn it into something bigger.",
      links: {
        linkedin: "Open LinkedIn profile",
        telegram: "Write on Telegram",
      },
      title: "contacts",
    },
  },
  errors: {
    notFound: {
      metaTitle: "Page not found",
      title: "Nothing is here",
      description: "Some things just don’t exist... Try to return to homepage.",
      home: "Back to homepage",
    },
    serverError: {
      title: "Something went wrong",
      description: "Try again in a moment or go back to the homepage.",
      retry: "Try again",
      home: "Back to homepage",
    },
  },
} satisfies Dictionary;
