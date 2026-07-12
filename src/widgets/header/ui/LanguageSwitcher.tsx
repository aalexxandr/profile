import clsx from "clsx";
import Link from "next/link";

import { locales, type Dictionary, type Locale } from "@/shared/i18n";

import { useLanguageSwitcher } from "../lib/useLanguageSwitcher";

type LanguageSwitcherProps = {
  currentLocale: Locale;
  languageSwitcher: Dictionary["navigation"]["languageSwitcher"];
  className?: string;
};

export const LanguageSwitcher = ({
  currentLocale,
  languageSwitcher,
  className,
}: LanguageSwitcherProps) => {
  const { getLocaleHref } = useLanguageSwitcher();

  return (
    <nav
      aria-label={languageSwitcher.ariaLabel}
      className={clsx(
        "relative flex h-7 w-22 shrink-0 overflow-hidden bg-white/5 p-1 font-vcr text-[10px]/none text-white uppercase shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.8),inset_1px_1px_0_0_rgba(255,255,255,0.32)]",
        className,
      )}
    >
      {locales.map((locale) => {
        const isActive = locale === currentLocale;
        const localeCopy = languageSwitcher.locales[locale];

        return (
          <Link
            key={locale}
            aria-current={isActive ? "true" : undefined}
            aria-label={localeCopy.title}
            className={clsx(
              "flex h-full flex-1 items-center justify-center px-1 pt-0.5 no-underline transition-[background-color,color,box-shadow] duration-200 outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none",
              isActive
                ? "bg-accent text-white shadow-[0_0_14px_rgba(219,0,255,0.55),inset_-1px_-1px_0_0_rgba(0,0,0,0.55),inset_1px_1px_0_0_rgba(255,255,255,0.35)]"
                : "text-white/55 hover:text-white active:text-accent-active",
            )}
            href={getLocaleHref(locale)}
            title={localeCopy.title}
          >
            {localeCopy.label}
          </Link>
        );
      })}
    </nav>
  );
};
