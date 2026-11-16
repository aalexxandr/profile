"use client";

import { useEffect, useRef } from "react";

import { GLOW_SIZE } from "./constants";
import { getGlowEdgeMask } from "./getGlowEdgeMask";
import { getGlowStep } from "./getGlowStep";
import { getGlowTarget } from "./getGlowTarget";
import { useGlowEnabled } from "./useGlowEnabled";

// Assumed length of the first frame after the loop has been idle.
const FIRST_FRAME_MS = 1000 / 60;

const getBoundaryBottom = (boundaryId: string | undefined) => {
  const boundary = boundaryId ? document.getElementById(boundaryId) : null;

  return boundary ? boundary.getBoundingClientRect().bottom : null;
};

// Drives the glow: the element lags behind the pointer and, with a boundary,
// its centre stays at or below that element's bottom edge while the layer is
// cut at that edge. The element only gets a transform each frame; the mask
// is written only when the edge moves; the frame loop idles once settled.
export const useCursorGlow = (boundaryId?: string) => {
  const glowRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const isEnabled = useGlowEnabled();

  useEffect(() => {
    const element = glowRef.current;
    const layer = layerRef.current;

    if (!isEnabled || !element || !layer) {
      return;
    }

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const position = { ...pointer };
    let frame = 0;
    let lastTime: number | null = null;
    let lastMask: string | null = null;

    const writeMask = (boundaryBottom: number | null) => {
      const mask = getGlowEdgeMask(boundaryBottom);

      if (mask === lastMask) {
        return;
      }

      lastMask = mask;

      if (mask === null) {
        layer.style.removeProperty("mask-image");
      } else {
        layer.style.setProperty("mask-image", mask);
      }
    };

    const tick = (time: number) => {
      frame = 0;
      const frameMs = lastTime === null ? FIRST_FRAME_MS : time - lastTime;
      lastTime = time;
      const boundaryBottom = getBoundaryBottom(boundaryId);
      const target = getGlowTarget(pointer, boundaryBottom);

      position.x = getGlowStep(position.x, target.x, frameMs);
      position.y = getGlowStep(position.y, target.y, frameMs);
      writeMask(boundaryBottom);
      element.style.transform = `translate3d(${position.x - GLOW_SIZE / 2}px, ${position.y - GLOW_SIZE / 2}px, 0)`;
      element.style.opacity = "1";

      if (position.x !== target.x || position.y !== target.y) {
        frame = requestAnimationFrame(tick);
      } else {
        lastTime = null;
      }
    };

    const wake = () => {
      if (frame === 0) {
        frame = requestAnimationFrame(tick);
      }
    };

    const handleMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      wake();
    };

    // Scroll does not bubble and the pages scroll inside their own container,
    // so it is caught on the way down; the boundary may have moved.
    const scrollOptions = { capture: true, passive: true };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("scroll", wake, scrollOptions);
    window.addEventListener("resize", wake);
    wake();

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", wake, scrollOptions);
      window.removeEventListener("resize", wake);
      cancelAnimationFrame(frame);
    };
  }, [boundaryId, isEnabled]);

  return { glowRef, isEnabled, layerRef };
};
