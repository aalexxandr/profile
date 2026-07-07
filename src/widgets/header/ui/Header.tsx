"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Reveal } from "@/shared/ui/Reveal";

const navItems = [
  { href: "/", label: "главная" },
  { href: "/cases", label: "кейсы" },
  { href: "/contacts", label: "контакты" },
] as const;

const isItemActive = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="mx-auto w-[min(calc(100vw-32px),420px)] pt-5 pb-4">
      <Reveal delay={120} direction="down">
        <nav
          aria-label="Главная навигация"
          className="flex items-center justify-center gap-4 font-vcr text-[11px]/none text-white uppercase min-[360px]:gap-6 min-[360px]:text-[12px]/none sm:gap-9 sm:text-[13px]/none"
        >
          {navItems.map(({ href, label }) => {
            const isActive = isItemActive(pathname, href);

            return (
              <Link
                key={href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "relative px-1 pt-1 pb-2 no-underline transition-colors outline-none hover:text-accent focus-visible:text-accent active:text-accent-active",
                  "after:absolute after:bottom-0 after:left-1/2 after:h-0.75 after:w-full after:-translate-x-1/2 after:bg-accent after:transition-opacity",
                  isActive ? "after:opacity-100" : "after:opacity-0",
                )}
                href={href}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </Reveal>
    </header>
  );
};
