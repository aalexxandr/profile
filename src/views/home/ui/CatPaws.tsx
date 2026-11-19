"use client";

import { LazyLottie } from "./LazyLottie";
import type { FC } from "react";
import { useAlternatingDirection } from "../lib/useAlternatingDirection";
import paws from "./assets/lottie-animations/cat-paws.json";

interface CatPawsProps {
  className?: string;
}

export const CatPaws: FC<CatPawsProps> = ({ className }) => {
  const { lottieRef, subscriptions } = useAlternatingDirection();

  return (
    <LazyLottie
      src={paws}
      loop={false}
      autoplay
      lottieRef={lottieRef}
      subscriptions={subscriptions}
      className={className}
    />
  );
};
