"use client";

import Lottie from "lottie-react";
import { FC } from "react";
import coffee from "./assets/lottie-animations/coffee-cup.json";

interface CoffeeProps {
  className?: string;
}

export const Coffee: FC<CoffeeProps> = ({ className }) => {
  return <Lottie animationData={coffee} loop autoplay className={className} />;
};
