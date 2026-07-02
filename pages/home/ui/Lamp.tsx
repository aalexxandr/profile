'use client';

import clsx from 'clsx';
import { FC, useState } from 'react';
import Image from 'next/image';
import lampOn from './assets/lamp-on.svg';
import lampOff from './assets/lamp-off.svg';

interface LampProps {
	className?: string;
}

export const Lamp: FC<LampProps> = ({ className }) => {
	const [isLampOn, setIsLampOn] = useState(true);

	const toggleLamp = () => {
		setIsLampOn(!isLampOn);
	};

	return (
		<div
			className={clsx(
				'flex w-fit cursor-pointer items-center justify-center',
				className,
			)}
			onClick={toggleLamp}
		>
			<Image src={isLampOn ? lampOn : lampOff} alt="lamp" unoptimized />
			{isLampOn && (
				<div className="absolute left-25 -top-10 z-[-1] h-81 w-81 opacity-90 [background:linear-gradient(94.84deg,#FF6B00_51.74%,#232323_56.65%)] transform-[translate3d(0,0,0)_translateX(-50%)] [-webkit-filter:url(#svg-blur)] will-change-[filter]">
					<svg
						id="svg-filter"
						className="hidden"
						xmlns="http://www.w3.org/2000/svg"
					>
						<defs>
							<filter
								id="svg-blur"
								x="-150%"
								y="-150%"
								width="400%"
								height="400%"
							>
								<feGaussianBlur in="SourceGraphic" stdDeviation="110" />
							</filter>
						</defs>
					</svg>
				</div>
			)}
		</div>
	);
};
