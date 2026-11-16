import type { LottieDirection, LottieHandle } from "lottie-react";
import { useMemo, useRef } from "react";

const OPPOSITE: Record<LottieDirection, LottieDirection> = {
  forward: "reverse",
  reverse: "forward",
};

// Makes an animation that plays once run the other way after every pass, so it
// goes back and forth without a pause. The handle is read at completion time,
// and the subscriptions are stable so the animation is not resubscribed.
export const useAlternatingDirection = () => {
  const lottieRef = useRef<LottieHandle>(null);
  const directionRef = useRef<LottieDirection>("forward");

  const subscriptions = useMemo(
    () => ({
      complete: () => {
        directionRef.current = OPPOSITE[directionRef.current];

        lottieRef.current?.setDirection(directionRef.current);
        lottieRef.current?.play();
      },
    }),
    [],
  );

  return { lottieRef, subscriptions };
};
