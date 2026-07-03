"use client";

import clsx from "clsx";
import Link, { type LinkProps } from "next/link";
import type { ComponentProps, PropsWithChildren } from "react";

type BaseButtonProps = PropsWithChildren & {
  disabled?: boolean;
  isLoading?: boolean;
};

type ButtonAsButtonProps = BaseButtonProps &
  Omit<ComponentProps<"button">, keyof BaseButtonProps> & {
    href?: never;
  };

type ButtonAsLinkProps = BaseButtonProps &
  Omit<ComponentProps<"a">, keyof BaseButtonProps | "href"> & {
    href: LinkProps["href"];
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const retroShadow =
  "shadow-[inset_-1px_-1px_0_0_#000,inset_1px_1px_0_0_#fff,inset_-2px_-2px_0_0_#7f7f7f,inset_2px_2px_0_0_#dfdfdf]";

const disabledShadow =
  "shadow-[inset_2px_2px_0_0_#dfdfdf,inset_-2px_-2px_0_0_#7f7f7f,inset_1px_1px_0_0_#fff,inset_-1px_-1px_0_0_#000]";

const disabledClassName = clsx(
  "pointer-events-none cursor-default bg-[#a89898] text-[#554a4a] hover:bg-[#a89898] hover:text-[#554a4a]",
  disabledShadow,
);

const buttonClassName = clsx(
  "flex h-[35px] w-full cursor-pointer items-center justify-center gap-1 border-0 bg-[#cecece] px-4 py-1.5 font-vcr text-[12px] text-[#3a3a3a] uppercase no-underline transition-none outline-none hover:bg-[#db00ff] hover:text-white focus-visible:border focus-visible:border-[#ff5a8f] focus-visible:shadow-none active:bg-[#b102ce]",
  retroShadow,
);

const ButtonContent = ({
  children,
  isLoading,
}: Pick<BaseButtonProps, "children" | "isLoading">) => {
  if (isLoading) {
    return <span className="pt-0.75">Loading...</span>;
  }

  return <span className="pt-0.75">{children}</span>;
};

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const {
      children,
      className,
      disabled,
      href,
      isLoading,
      target,
      ...linkProps
    } = props;
    const isDisabled = disabled || isLoading;

    return (
      <Link
        {...linkProps}
        aria-disabled={isDisabled}
        className={clsx(
          buttonClassName,
          (isDisabled || href === "") && disabledClassName,
          className,
        )}
        href={href}
        tabIndex={isDisabled ? -1 : linkProps.tabIndex}
        target={target}
      >
        <ButtonContent isLoading={isLoading}>{children}</ButtonContent>
      </Link>
    );
  }

  const {
    children,
    className,
    disabled,
    isLoading,
    type = "button",
    ...buttonProps
  } = props;
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...buttonProps}
      className={clsx(
        buttonClassName,
        isDisabled && disabledClassName,
        className,
      )}
      disabled={isDisabled}
      type={type}
    >
      <ButtonContent isLoading={isLoading}>{children}</ButtonContent>
    </button>
  );
}
