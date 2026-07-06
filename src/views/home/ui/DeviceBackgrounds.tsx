import type { ComponentType, PropsWithChildren } from "react";
import { Reveal } from "@/shared/ui/Reveal";
import { Computer } from "./Computer";
import { Mobile } from "./Mobile";
import { Tablet } from "./Tablet";

type DeviceFrameComponent = ComponentType<PropsWithChildren>;

const devices: Array<{
  Component: DeviceFrameComponent;
  className: string;
  name: string;
}> = [
  {
    Component: Mobile,
    className:
      "absolute bottom-1/2 left-1/2 block -translate-x-1/2 translate-y-1/2 md:hidden",
    name: "mobile",
  },
  {
    Component: Tablet,
    className:
      "absolute bottom-1/2 left-1/2 hidden -translate-x-1/2 translate-y-1/2 md:block lg:hidden",
    name: "tablet",
  },
  {
    Component: Computer,
    className:
      "hidden lg:absolute lg:bottom-40 lg:left-1/2 lg:block lg:-translate-x-1/2",
    name: "computer",
  },
];

export const DeviceBackgrounds = ({ children }: PropsWithChildren) => (
  <>
    {devices.map(({ Component, className, name }) => (
      <div className={className} key={name}>
        <Reveal delay={360}>
          <Component>{children}</Component>
        </Reveal>
      </div>
    ))}
  </>
);
