import clsx from "clsx";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { Header } from "@/widgets/header";
import type { Dictionary, Locale } from "@/shared/i18n";

// Only the regular (400) and bold (700) upright faces are used; Tailwind's
// `font-light`/`italic` are not applied anywhere, so those files are not shipped.
const helvetica = localFont({
  src: [
    {
      path: "../fonts/HelveticaNeue.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/HelveticaNeue-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
});

const betterVCR = localFont({
  src: [
    {
      path: "../fonts/BetterVCR.woff2",
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
    <body className="relative grid min-h-dvh grid-rows-[auto_1fr] bg-canvas">
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
