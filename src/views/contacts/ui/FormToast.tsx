"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { TOAST_EXIT_TIME_MS } from "../config";
import { useExitTransition } from "../lib/useExitTransition";
import { FormNotice } from "./FormNotice";

type FormToastProps = {
  isVisible: boolean;
  text: string;
  title: string;
};

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// Popup at the top of the viewport. It is portalled to <body>: the form sits
// inside a translating `Reveal`, which would otherwise become the containing
// block of this `fixed` layer. The live region stays mounted so screen
// readers announce the text when it appears.
export const FormToast = ({ isVisible, text, title }: FormToastProps) => {
  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const { isLeaving, isRendered } = useExitTransition(
    isVisible,
    TOAST_EXIT_TIME_MS,
  );

  if (!isClient) {
    return null;
  }

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96"
      role="status"
    >
      {isRendered && (
        <FormNotice
          className="pointer-events-auto w-full"
          isLeaving={isLeaving}
          text={text}
          title={title}
        />
      )}
    </div>,
    document.body,
  );
};
