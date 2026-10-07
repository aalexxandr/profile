import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Dictionary, Locale } from "@/shared/i18n";

import { getStatusCount } from "../lib/getStatusCount";
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
    status: { objects: { one: "object", other: "objects" } },
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
    status: {
      objects: {
        few: "объекта",
        many: "объектов",
        one: "объект",
        other: "объекта",
      },
    },
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
  it("is written in Russian with the correct plural form on /ru", () => {
    renderCaseBlock("ru");
    const count = getStatusCount(caseData.slug);
    const word = new Intl.PluralRules("ru").select(count);
    const objects: Partial<Record<Intl.LDMLPluralRule, string>> =
      labelsByLocale.ru.status.objects;

    expect(screen.getByText(`${count} ${objects[word]}`)).toBeInTheDocument();
    expect(screen.queryByText(/\bobjects?\b/)).not.toBeInTheDocument();
  });

  it("is written in English on /en", () => {
    renderCaseBlock("en");

    expect(
      screen.getByText(`${getStatusCount(caseData.slug)} objects`),
    ).toBeInTheDocument();
  });
});
