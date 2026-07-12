"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Reveal } from "@/shared/ui/Reveal";
import {
  getLocalizedPath,
  type Dictionary,
  type Locale,
  type NavigationItem,
} from "@/shared/i18n";

import { useActiveNavigationIndicator } from "../lib/useActiveNavigationIndicator";
import { LanguageSwitcher } from "./LanguageSwitcher";

type HeaderProps = {
  ariaLabel: string;
  currentLocale: Locale;
  items: NavigationItem[];
  languageSwitcher: Dictionary["navigation"]["languageSwitcher"];
};

const isItemActive = (pathname: string, href: string) => {
  if (href === "/ru" || href === "/en") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export const Header = ({
  ariaLabel,
  currentLocale,
  items,
  languageSwitcher,
}: HeaderProps) => {
  const pathname = usePathname();
  const activePage =
    items.find(({ page }) =>
      isItemActive(pathname, getLocalizedPath(page, currentLocale)),
    )?.page ?? null;

  const { activeLinkRef, isIndicatorMeasured, navRef, navigationIndicator } =
    useActiveNavigationIndicator({
      activePage,
    });

  return (
    <header className="mx-auto w-[min(calc(100vw-24px),540px)] pt-5 pb-4 sm:w-[min(calc(100vw-32px),580px)]">
      <Reveal delay={120} direction="down">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 min-[360px]:gap-x-5 sm:gap-x-7">
          <nav
            aria-label={ariaLabel}
            className="relative isolate flex min-w-0 items-center justify-center gap-4 font-vcr text-[11px]/none text-white uppercase min-[360px]:gap-6 min-[360px]:text-[12px]/none sm:gap-9 sm:text-[13px]/none"
            ref={navRef}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 z-0 h-0.75 bg-accent transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{
                opacity: isIndicatorMeasured ? 1 : 0,
                transform: `translate3d(${navigationIndicator?.x ?? 0}px, 0, 0)`,
                width: navigationIndicator?.width ?? 0,
              }}
            />
            {items.map(({ label, page }) => {
              const href = getLocalizedPath(page, currentLocale);
              const isActive = page === activePage;

              return (
                <Link
                  key={page}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "relative z-10 px-1 pt-1 pb-2 no-underline transition-colors outline-none hover:text-accent focus-visible:text-accent active:text-accent-active",
                    "after:absolute after:bottom-0 after:left-1/2 after:h-0.75 after:w-full after:-translate-x-1/2 after:bg-accent after:transition-opacity",
                    isActive && !isIndicatorMeasured
                      ? "after:opacity-100"
                      : "after:opacity-0",
                  )}
                  href={href}
                  ref={isActive ? activeLinkRef : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <LanguageSwitcher
          currentLocale={currentLocale}
          languageSwitcher={languageSwitcher}
          className="mx-auto mt-5"
        />
      </Reveal>
    </header>
  );
};
