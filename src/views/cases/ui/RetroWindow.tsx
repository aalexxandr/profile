"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

import CloseWindowIcon from "./assets/retro-window/close-window.svg?svgr";
import DragIcon from "./assets/retro-window/drag.svg?svgr";
import FolderIcon from "./assets/retro-window/folder.svg?svgr";
import FullScreenWindowIcon from "./assets/retro-window/fullscreen-window.svg?svgr";
import MinimizeWindowIcon from "./assets/retro-window/minimize-window.svg?svgr";
import { useRetroWindowAnimation } from "../lib/useRetroWindowAnimation";

type RetroWindowControlLabels = {
  close: string;
  fullScreen: string;
  minimize: string;
};

type RetroWindowProps = {
  children: ReactNode;
  className?: string;
  controlLabels: RetroWindowControlLabels;
  objectsCount: number;
  title: string;
};

const RETRO_WINDOW_OUTER_SHADOW =
  "shadow-[inset_-1px_-1px_0_0_#050409,inset_1px_1px_0_0_#d8cbd4,inset_-2px_-2px_0_0_#867883,inset_2px_2px_0_0_#b8adb7]";
const RETRO_WINDOW_INNER_SHADOW =
  "shadow-[inset_1px_1px_0_0_#b8adb7,inset_-1px_-1px_0_0_#867883]";

const RETRO_WINDOW_BUTTON_CLASS_NAME = clsx(
  "flex size-4 cursor-pointer appearance-none items-center justify-center border-0 bg-[#3f3d42] p-1 text-white outline-none hover:bg-[#56525a] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-focus-ring active:bg-[#2f2b33] active:shadow-[inset_1px_1px_0_0_#050409,inset_-1px_-1px_0_0_#d8cbd4,inset_2px_2px_0_0_#867883,inset_-2px_-2px_0_0_#b8adb7]",
  RETRO_WINDOW_OUTER_SHADOW,
);

export const RetroWindow = ({
  children,
  className,
  controlLabels,
  objectsCount,
  title,
}: RetroWindowProps) => {
  const { closeWindow, state, toggleCollapse, toggleFullScreen } =
    useRetroWindowAnimation();
  const wrapperClassName = clsx(
    "flex origin-center flex-col items-start bg-[#120d1b] p-1 font-vcr text-white",
    RETRO_WINDOW_OUTER_SHADOW,
    state.isShaking &&
      "animate-retro-shake-mobile motion-reduce:animate-none md:animate-retro-shake",
    state.isClosed && "animate-retro-zoom motion-reduce:animate-none",
    state.isJello && "animate-retro-jello motion-reduce:animate-none",
    className,
  );
  const contentClassName = clsx(
    "grid w-full overflow-hidden transition-[grid-template-rows,margin-top,opacity] ease-in-out motion-reduce:transition-none",
    state.isCollapsed
      ? "mt-0 grid-rows-[0fr] opacity-0 duration-[300ms,300ms,200ms]"
      : "mt-1 grid-rows-[1fr] opacity-100 duration-[300ms,300ms,2000ms]",
  );

  return (
    <section className={wrapperClassName} aria-label={title}>
      <header className="flex min-h-5.5 w-full items-start justify-between gap-2 bg-[#120d1b] py-0.5 pr-0.5 pl-1 text-[12px]/[13px]">
        <div className="flex min-w-0 items-end gap-1 pt-px text-white uppercase">
          <FolderIcon
            aria-hidden="true"
            className="size-4 shrink-0"
            focusable={false}
          />
          <span className="min-w-0 truncate">{title}</span>
        </div>
        <div className="flex shrink-0 gap-0.5">
          <button
            aria-label={controlLabels.minimize}
            className={RETRO_WINDOW_BUTTON_CLASS_NAME}
            onClick={toggleCollapse}
            type="button"
          >
            <MinimizeWindowIcon
              aria-hidden="true"
              className="size-2 shrink-0"
              focusable={false}
            />
          </button>
          <button
            aria-label={controlLabels.fullScreen}
            className={RETRO_WINDOW_BUTTON_CLASS_NAME}
            onClick={toggleFullScreen}
            type="button"
          >
            <FullScreenWindowIcon
              aria-hidden="true"
              className="size-2 shrink-0"
              focusable={false}
            />
          </button>
          <button
            aria-label={controlLabels.close}
            className={RETRO_WINDOW_BUTTON_CLASS_NAME}
            onClick={closeWindow}
            type="button"
          >
            <CloseWindowIcon
              aria-hidden="true"
              className="size-2 shrink-0"
              focusable={false}
            />
          </button>
        </div>
      </header>
      <div aria-hidden={state.isCollapsed} className={contentClassName}>
        <div className="relative flex min-h-0 flex-col overflow-hidden">
          <div
            className={clsx(
              "grid min-h-45 place-items-center bg-[#15101f] p-6",
              RETRO_WINDOW_INNER_SHADOW,
            )}
          >
            {children}
          </div>
          <div
            className={clsx(
              "mt-1 flex min-h-4.5 w-full items-center justify-between pt-1 text-[11px]/3 text-[#f7f4fb]",
              RETRO_WINDOW_INNER_SHADOW,
            )}
          >
            <p className="mb-0.5 ml-1">{objectsCount} objects</p>
          </div>
          <DragIcon
            aria-hidden="true"
            className="absolute right-0 bottom-0 size-3.25"
            focusable={false}
          />
        </div>
      </div>
    </section>
  );
};
