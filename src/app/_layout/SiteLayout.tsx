import clsx from "clsx";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { Header } from "@/widgets/header";
import type { Dictionary, Locale } from "@/shared/i18n";

const helvetica = localFont({
  src: [
    {
      path: "../fonts/HelveticaNeue-thin.ttf",
      weight: "200",
      style: "thin",
    },
    {
      path: "../fonts/HelveticaNeue-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/HelveticaNeue-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/HelveticaNeue.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/HelveticaNeue-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/HelveticaNeue-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/HelveticaNeue-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-helvetica",
});

const betterVCR = localFont({
  src: [
    {
      path: "../fonts/BetterVCR.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  adjustFontFallback: false,
  variable: "--font-betterVCR",
});

type SiteLayoutProps = {
  children: ReactNode;
  dictionary: Dictionary;
  locale: Locale;
};

export const SiteLayout = ({
  children,
  dictionary,
  locale,
}: SiteLayoutProps) => (
  <html
    lang={locale}
    className={clsx(
      helvetica.variable,
      betterVCR.variable,
      "h-full antialiased",
    )}
  >
    <body className="grid min-h-dvh grid-rows-[auto_1fr] bg-canvas">
      <Header
        ariaLabel={dictionary.navigation.ariaLabel}
        currentLocale={locale}
        items={dictionary.navigation.items}
        languageSwitcher={dictionary.navigation.languageSwitcher}
      />
      <main className="grid min-h-0">{children}</main>
    </body>
  </html>
);
