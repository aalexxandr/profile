import type { Locale, PageKey } from "./config";

export type NavigationItem = {
  page: PageKey;
  label: string;
};

type PluralizedLabel = Partial<Record<Intl.LDMLPluralRule, string>> & {
  other: string;
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
      status: {
        objects: PluralizedLabel;
      };
      title: string;
    };
    contacts: {
      title: string;
    };
  };
};
