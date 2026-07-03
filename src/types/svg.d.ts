declare module "*.svg?svgr" {
  import type { ComponentPropsWithoutRef } from "react";

  const SvgComponent: (props: ComponentPropsWithoutRef<"svg">) => JSX.Element;

  export default SvgComponent;
}
