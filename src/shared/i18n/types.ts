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
      };
      controlLabels: {
        close: string;
        fullScreen: string;
        minimize: string;
      };
      detail: {
        achievementsTitle: string;
        backToCases: string;
        categoryLabel: string;
        companyLabel: string;
        periodLabel: string;
        periodPresent: string;
        roleLabel: string;
        roles: Record<Schemas["CaseDetailDto"]["role"], string>;
        stackLabel: string;
        teamSizeLabel: string;
      };
      noImage: string;
      status: {
        objects: string;
      };
      title: string;
    };
    contacts: {
      title: string;
    };
  };
};
