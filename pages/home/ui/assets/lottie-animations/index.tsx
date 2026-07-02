"use client";

import clsx from "clsx";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import React, { FC, PropsWithChildren, useEffect, useRef } from "react";

import { Lamp } from "@/components/ZKProofDemoPage/Lamp";
import { ZoomButton } from "@/components/ZKProofDemoPage/ZoomButton";
import { TOAST_CONTAINER_ID } from "@/components/ZKProofDemoPage/constants";
import {
  SCREEN_BG_COLOR,
  useZkProofContext,
} from "@/components/ZKProofDemoPage/context/zkProofDemoContext";
import { useScreenWidthSmaller } from "@/hooks/useScreenWidthSmaller";
import { ZkproofDesktopBg } from "@/icons/zkproof-desktop-bg";

import paws from "../../../lottie-animations/playground/cat-paws.json";
import coffee from "../../../lottie-animations/playground/coffee-cup.json";

export const DesktopScreen: FC<PropsWithChildren> = ({ children }) => {
  const { isTyping, isZoomed, setIsZoomed, screenBgColor } =
    useZkProofContext();
  const pawsRef = useRef<LottieRefCurrentProps>(null);
  const isZoomButtonHidden = screenBgColor === SCREEN_BG_COLOR.dark;
  const isMobile = useScreenWidthSmaller(960);

  useEffect(() => {
    if (!isMobile) return;
    setIsZoomed(false);
  }, [isMobile]);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  useEffect(() => {
    if (!pawsRef.current) return;
    if (isTyping) {
      pawsRef.current.play();
    } else {
      pawsRef.current.stop();
    }
  }, [isTyping, isMobile, isZoomed]);

  if (isZoomed) {
    return (
      <>
        <div
          className={clsx(
            "fixed inset-0 z-40 flex flex-col items-center justify-center px-[50px] py-[38px]",
            screenBgColor === SCREEN_BG_COLOR.dark && "bg-black",
          )}
          id={TOAST_CONTAINER_ID}
        >
          <div className="w-full max-w-[596px]">{children}</div>
        </div>
        {!isZoomButtonHidden && (
          <ZoomButton
            onClick={toggleZoom}
            isZoomActive={isZoomed}
            className="fixed bottom-8 right-8 z-50"
          />
        )}
      </>
    );
  }

  return (
    <>
      <img
        src="/playground/zk-proof-demo/painting.svg"
        className="hidden lg:absolute lg:right-18 lg:top-20.5 lg:block"
        alt=""
      />
      <img
        src="/playground/zk-proof-demo/shelves.svg"
        className="hidden lg:absolute lg:left-0 lg:top-27.5 lg:block"
        alt=""
      />
      <div className="hidden lg:absolute lg:bottom-0 lg:left-1/2 lg:block lg:-translate-x-1/2">
        <Lamp className="absolute right-[118px] top-[-150px]" />
        <Lottie
          animationData={coffee}
          loop
          autoplay
          className="absolute bottom-[68px] left-[142px] h-[121px] w-[121px]"
        />
        <Lottie
          animationData={paws}
          loop
          lottieRef={pawsRef}
          className="absolute bottom-[-56px] left-1/2 h-[184px] w-[382px] -translate-x-1/2"
        />
        <img
          src="/playground/zk-proof-demo/table.svg"
          alt=""
        />
        <div className="absolute bottom-[146px] left-1/2 h-[508px] w-[596px] -translate-x-1/2 p-6 pb-[72px]">
          <ZkproofDesktopBg className="absolute inset-0" bg={screenBgColor} />
          <div
            className="relative flex h-full flex-col items-center justify-center px-[50px] py-[38px]"
            id={TOAST_CONTAINER_ID}
          >
            {children}
          </div>
        </div>
      </div>
      {!isZoomButtonHidden && (
        <ZoomButton
          onClick={toggleZoom}
          isZoomActive={isZoomed}
          className="fixed bottom-8 right-8 z-50"
        />
      )}
    </>
  );
};
