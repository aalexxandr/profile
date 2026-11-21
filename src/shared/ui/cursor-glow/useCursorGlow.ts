"use client";

import { useEffect, useRef } from "react";

import { GLOW_SIZE } from "./constants";
import { getGlowStep } from "./getGlowStep";
import { useGlowMode } from "./useGlowMode";

// Assumed length of the first frame after the loop has been idle.
const FIRST_FRAME_MS = 1000 / 60;

// Drives the glow in "follow" mode: the element lags behind the pointer and only gets a
// transform each frame; the frame loop idles once settled. The layer is
// fixed and the target is the pointer's viewport position, so only a mouse
// move can change it (scroll and resize cannot).
export const useCursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const mode = useGlowMode();

  useEffect(() => {
    const element = glowRef.current;

    if (mode !== "follow" || !element) {
      return;
    }

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const position = { ...pointer };
    let frame = 0;
    let lastTime: number | null = null;

    const tick = (time: number) => {
      frame = 0;
      const frameMs = lastTime === null ? FIRST_FRAME_MS : time - lastTime;
      lastTime = time;

      position.x = getGlowStep(position.x, pointer.x, frameMs);
      position.y = getGlowStep(position.y, pointer.y, frameMs);
      element.style.transform = `translate3d(${position.x - GLOW_SIZE / 2}px, ${position.y - GLOW_SIZE / 2}px, 0)`;
      element.style.opacity = "1";

      if (position.x !== pointer.x || position.y !== pointer.y) {
        frame = requestAnimationFrame(tick);
      } else {
        lastTime = null;
      }
    };

    const handleMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      if (frame === 0) {
        frame = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("mousemove", handleMove);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, [mode]);

  return { glowRef, mode };
};
