import type { Dictionary } from "@/shared/i18n";
import { Button } from "@/shared/ui/Button";

import { TypewriterTextSequence } from "./TypewriterTextSequence";

type IntroContentProps = {
  ctaHref: string;
  home: Dictionary["home"];
};

export const IntroContent = ({ ctaHref, home }: IntroContentProps) => (
  <>
    <span className="whitespace-pre-line">{home.introText}</span>
    <br />
    <br />
    <TypewriterTextSequence startDelay={1400} texts={home.typewriterTexts} />
    <Button className="mt-5" href={ctaHref}>
      {home.cta.label}
    </Button>
  </>
);
