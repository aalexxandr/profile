"use client";

import { LazyLottie } from "./LazyLottie";
import type { FC } from "react";
import coffee from "./assets/lottie-animations/coffee-cup.json";

interface CoffeeProps {
  className?: string;
}

export const Coffee: FC<CoffeeProps> = ({ className }) => {
  return <LazyLottie src={coffee} loop autoplay className={className} />;
};
