import type { Schemas } from "@/shared/api";

import type { Locale, PageKey } from "./config";

export type NavigationItem = {
  page: PageKey;
  label: string;
};

export type Dictionary = {
  common: {
    loading: string;
  };
  metadata: Record<
    PageKey,
    {
      title: string;
      description: string;
    }
  >;
  navigation: {
    ariaLabel: string;
    languageSwitcher: {
      ariaLabel: string;
      locales: Record<
        Locale,
        {
          label: string;
          title: string;
        }
      >;
    };
    items: NavigationItem[];
  };
  home: {
    introText: string;
    typewriterTexts: string[];
    cta: {
      label: string;
    };
    imageAlts: {
      lamp: string;
      painting: string;
      shelves: string;
      table: string;
    };
  };
  pages: {
    cases: {
      actions: {
        moreInformation: string;
        projectLink: string;
        projectPrivate: string;
      };
      controlLabels: {
        close: string;
        fullScreen: string;
        minimize: string;
      };
      detail: {
        aboutTitle: string;
        achievementsTitle: string;
        backToCases: string;
        companyLabel: string;
        periodLabel: string;
        periodPresent: string;
        roleLabel: string;
        roles: Record<Schemas["CaseDetailDto"]["role"], string>;
        stackTitle: string;
        teamSizeLabel: string;
        teamSizeUnit: Partial<Record<Intl.LDMLPluralRule, string>> & {
          other: string;
        };
      };
      noImage: string;
      status: {
        objects: string;
      };
      title: string;
    };
    contacts: {
      form: {
        emailLabel: string;
        errors: {
          invalidEmail: string;
          required: string;
          // Contains the {max} placeholder for the character limit.
          tooLong: string;
        };
        messageLabel: string;
        methodLabel: string;
        methods: {
          email: string;
          telegram: string;
        };
        nameLabel: string;
        send: string;
        success: {
          text: string;
          title: string;
        };
        title: string;
        usernameLabel: string;
      };
      illustrationAlt: string;
      infoText: string;
      links: {
        linkedin: string;
        telegram: string;
      };
      title: string;
    };
  };
};
