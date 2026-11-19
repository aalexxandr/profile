"use client";

import dynamic from "next/dynamic";

// lottie-react is ~90 KB gzip and only draws decorative animations, so it is
// split into its own chunk and loaded after hydration (`ssr: false` is only
// allowed in Client Components). The loader runs on the client at first render
// and is the one place that knows the scene is `hidden` below `lg` (64rem):
// `display: none` would still mount the animations, so on a narrow screen it
// resolves to an empty component and the chunk is never requested. The width
// is read once; resizing across `lg` later does not start the animations.
export const LazyLottie = dynamic(
  () =>
    window.matchMedia("(min-width: 64rem)").matches
      ? import("lottie-react").then((module) => module.Lottie)
      : Promise.resolve(() => null),
  { ssr: false },
);
