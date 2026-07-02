import Image from 'next/image';
import { Lamp } from './Lamp';

import { FC, PropsWithChildren } from 'react';
import { CatPaws } from './CatPaws';
import { Coffee } from './Coffee';
import paintingSrc from './assets/painting.svg';
import shelvesSrc from './assets/shelves.svg';
import tableSrc from './assets/table.svg';

export const HomePage: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="relative h-dvh w-full overflow-hidden">
			<Image
				src={paintingSrc}
				className="hidden lg:absolute lg:right-18 lg:top-20.5 lg:block"
				alt="painting"
				unoptimized
				loading="eager"
			/>
			<Image
				src={shelvesSrc}
				className="hidden lg:absolute lg:left-0 lg:top-27.5 lg:block"
				alt="shelves"
				unoptimized
				loading="eager"
			/>
			<div className="hidden lg:absolute lg:bottom-0 lg:left-1/2 lg:block lg:-translate-x-1/2">
				<Lamp className="absolute right-29.5 -top-30" />
				<Coffee className="absolute bottom-17 left-35.5 h-30.25 w-30.25" />
				<CatPaws className="absolute -bottom-5 -translate-x-1/2 left-1/2" />
				<Image
					src={tableSrc}
					alt="table"
					loading="eager"
					className="max-w-none"
				/>
				<div className="absolute bottom-36.5 left-1/2 h-127 w-149 -translate-x-1/2 p-6 pb-18">
					{/* <ZkproofDesktopBg className="absolute inset-0" bg={screenBgColor} /> */}
					<div className="relative flex h-full flex-col items-center justify-center px-12.5 py-9.5">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};
