import Image from "next/image";
import { Lamp } from "./Lamp";

import { CatPaws } from "./CatPaws";
import { Coffee } from "./Coffee";
import paintingSrc from "./assets/painting.svg";
import shelvesSrc from "./assets/shelves.svg";
import tableSrc from "./assets/table.svg";
import { DeviceBackgrounds } from "./DeviceBackgrounds";

import { Button } from "@/shared/ui/Button";
import { Reveal } from "@/shared/ui/Reveal";
import { TYPEWRITER_TEXTS } from "../model/constants";
import { TypewriterTextSequence } from "./TypewriterTextSequence";

const IntroContent = () => (
  <>
    Привет, я Саша. Уже 6 лет я делаю веб.
    <br />
    <br />
    За это время собирал лендинги с анимацией и 3D, сервисы бронирования,
    финтех-интерфейсы с большими данными, Chrome-виджеты, мобильные приложения и
    backend. <br />
    <br />
    В пикселях, коде и хаосе ищу порядок, смысл и радость, люблю ощущение
    приключения и интерфейсы, которые цепляют.
    <br />
    <br />
    <TypewriterTextSequence startDelay={1400} texts={TYPEWRITER_TEXTS} />
    <Button className="mt-5" href="#">
      Перейти к кейсам
    </Button>
  </>
);

export const HomePage = () => {
  return (
    <div className="relative h-full min-h-135 overflow-hidden lg:min-h-175">
      <div className="relative m-auto h-full max-w-340">
        <Reveal
          className="hidden lg:absolute lg:top-20.5 lg:right-18 lg:block"
          delay={120}
          direction="left"
        >
          <Image src={paintingSrc} alt="painting" />
        </Reveal>
        <Reveal
          className="hidden lg:absolute lg:top-27.5 lg:left-0 lg:block"
          delay={180}
          direction="right"
        >
          <Image src={shelvesSrc} alt="shelves" />
        </Reveal>
        <div className="hidden lg:absolute lg:bottom-0 lg:left-1/2 lg:block lg:-translate-x-1/2">
          <Reveal className="relative" delay={260}>
            <Reveal
              className="absolute -top-30 right-29.5"
              delay={420}
              direction="down"
            >
              <Lamp />
            </Reveal>
            <Reveal
              className="absolute bottom-17 left-35.5 size-30.25"
              delay={520}
            >
              <Coffee className="size-full" />
            </Reveal>
            <div className="absolute -bottom-15 left-1/2 -translate-x-1/2">
              <Reveal delay={620}>
                <CatPaws />
              </Reveal>
            </div>
            <Image src={tableSrc} alt="table" className="max-w-none" />
          </Reveal>
        </div>
        <DeviceBackgrounds>
          <IntroContent />
        </DeviceBackgrounds>
      </div>
    </div>
  );
};
