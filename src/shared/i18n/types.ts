import type { PageKey } from "./config";

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
    items: NavigationItem[];
  };
  home: {
    introParagraphs: string[];
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
      title: string;
    };
    contacts: {
      title: string;
    };
  };
};
