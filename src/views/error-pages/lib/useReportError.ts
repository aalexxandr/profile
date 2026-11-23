"use client";

import { useEffect } from "react";

// The error screen shows only dictionary texts; the cause goes to the console
// (and, in `pnpm dev`, to the Next error overlay) for diagnosis.
export const useReportError = (error: unknown) => {
  useEffect(() => {
    console.error(error);
  }, [error]);
};
