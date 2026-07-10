"use client";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type AnimationName = "closed" | "jello" | "shaking";

type RetroWindowAnimationState = {
  isClosed: boolean;
  isCollapsed: boolean;
  isJello: boolean;
  isShaking: boolean;
};

const CLOSE_WINDOW_ANIMATION_DURATION = 1000;
const CHANGE_WINDOW_SIZE_ANIMATION_DURATION = 800;

export const useRetroWindowAnimation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isJello, setIsJello] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const animationTimersRef = useRef<Partial<Record<AnimationName, number>>>({});

  useEffect(() => {
    return () => {
      Object.values(animationTimersRef.current).forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      animationTimersRef.current = {};
    };
  }, []);

  const clearAnimationTimer = (animationName: AnimationName) => {
    const timerId = animationTimersRef.current[animationName];

    if (!timerId) {
      return;
    }

    window.clearTimeout(timerId);
    delete animationTimersRef.current[animationName];
  };

  const triggerAnimation = (
    animationName: AnimationName,
    setter: Dispatch<SetStateAction<boolean>>,
    duration: number,
    onComplete?: () => void,
  ) => {
    clearAnimationTimer(animationName);
    setter(true);

    animationTimersRef.current[animationName] = window.setTimeout(() => {
      setter(false);
      delete animationTimersRef.current[animationName];
      onComplete?.();
    }, duration);
  };

  const closeWindow = () => {
    setIsShaking(false);
    setIsJello(false);
    triggerAnimation(
      "closed",
      setIsClosed,
      CLOSE_WINDOW_ANIMATION_DURATION,
      () => setIsCollapsed(false),
    );
  };

  const toggleCollapse = () => {
    if (isCollapsed) {
      triggerAnimation(
        "shaking",
        setIsShaking,
        CHANGE_WINDOW_SIZE_ANIMATION_DURATION,
      );
      return;
    }

    setIsCollapsed(true);
  };

  const toggleFullScreen = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      return;
    }

    triggerAnimation(
      "jello",
      setIsJello,
      CHANGE_WINDOW_SIZE_ANIMATION_DURATION,
    );
  };

  return {
    closeWindow,
    state: {
      isClosed,
      isCollapsed,
      isJello,
      isShaking,
    } satisfies RetroWindowAnimationState,
    toggleCollapse,
    toggleFullScreen,
  };
};
