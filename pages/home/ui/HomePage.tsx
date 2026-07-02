import Image from "next/image";
import { Lamp } from "./Lamp";

import { CatPaws } from "./CatPaws";
import { Coffee } from "./Coffee";
import paintingSrc from "./assets/painting.svg";
import shelvesSrc from "./assets/shelves.svg";
import tableSrc from "./assets/table.svg";
import { Computer } from "./Computer";
import { TypewriterText } from "./TypewriterText";

export const HomePage = () => {
  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <div className="relative m-auto h-full max-w-301">
        <Image
          src={paintingSrc}
          className="hidden lg:absolute lg:top-20.5 lg:right-18 lg:block"
          alt="painting"
          unoptimized
          loading="eager"
        />
        <Image
          src={shelvesSrc}
          className="hidden lg:absolute lg:top-27.5 lg:left-0 lg:block"
          alt="shelves"
          unoptimized
          loading="eager"
        />
        <div className="hidden lg:absolute lg:bottom-0 lg:left-1/2 lg:block lg:-translate-x-1/2">
          <Lamp className="absolute -top-30 right-29.5" />
          <Coffee className="absolute bottom-17 left-35.5 size-30.25" />
          <CatPaws className="absolute -bottom-15 left-1/2 -translate-x-1/2" />
          <Image
            src={tableSrc}
            alt="table"
            loading="eager"
            className="max-w-none"
          />

          <Computer>
            Привет, я Саша. Уже 6 лет я делаю веб: начинал с CMS, когда Figma
            только набирала обороты, а потом ушёл в мир сложных продуктов.
            <br />
            <br />
            За это время собирал лендинги с анимацией и 3D, сервисы
            бронирования, финтех-интерфейсы с большими данными, Chrome-виджеты,
            мобильные приложения и backend. <br />
            <br />
            В пикселях, коде и хаосе ищу порядок, смысл и радость, люблю
            ощущение приключения и интерфейсы, которые цепляют.
            <br />
            <br />
            <TypewriterText text="Never lost, always exploring…" />
          </Computer>
        </div>
      </div>
    </div>
  );
};
