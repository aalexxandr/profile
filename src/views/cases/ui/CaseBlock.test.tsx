import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Dictionary, Locale } from "@/shared/i18n";

import type { CaseShort } from "../model/case";
import { CaseBlock } from "./CaseBlock";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const caseData: CaseShort = {
  blurImage: "https://picsum.photos/seed/product-ui/10/10",
  image: "https://picsum.photos/seed/product-ui/520/430",
  name: "Product UI",
  objectsCount: 347,
  projectLink: "https://example.com/product-ui",
  shortDesc: "Short description",
  slug: "product-ui",
};

const labelsByLocale = {
  en: {
    actions: {
      moreInformation: "More information",
      projectLink: "Project link",
    },
    controlLabels: {
      close: "Close window",
      fullScreen: "Full screen window",
      minimize: "Minimize window",
    },
    detail: {
      achievementsTitle: "Results",
      backToCases: "Back to cases",
      categoryLabel: "Category",
      roleLabel: "Role",
      stackLabel: "Stack",
    },
    status: { objects: "objects" },
    title: "cases",
  },
  ru: {
    actions: { moreInformation: "Подробнее", projectLink: "Ссылка на проект" },
    controlLabels: {
      close: "Закрыть окно",
      fullScreen: "Развернуть окно",
      minimize: "Свернуть окно",
    },
    detail: {
      achievementsTitle: "Результаты",
      backToCases: "Назад к кейсам",
      categoryLabel: "Категория",
      roleLabel: "Роль",
      stackLabel: "Стек",
    },
    status: { objects: "объектов" },
    title: "кейсы",
  },
} satisfies Record<Locale, Dictionary["pages"]["cases"]>;

const renderCaseBlock = (locale: Locale) =>
  render(
    <CaseBlock
      caseData={caseData}
      caseLabels={labelsByLocale[locale]}
      index={0}
      locale={locale}
    />,
  );

describe("CaseBlock status counter", () => {
  it("shows the count from the case data with the Russian word on /ru", () => {
    renderCaseBlock("ru");

    expect(screen.getByText("347 объектов")).toBeInTheDocument();
    expect(screen.queryByText(/\bobjects?\b/)).not.toBeInTheDocument();
  });

  it("shows the count from the case data with the English word on /en", () => {
    renderCaseBlock("en");

    expect(screen.getByText("347 objects")).toBeInTheDocument();
  });
});
