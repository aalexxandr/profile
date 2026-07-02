import Image from 'next/image';
import computerSrc from './assets/computer.svg';
import { FC, PropsWithChildren } from 'react';

export const Computer: FC<PropsWithChildren> = ({ children }) => (
	<div className="absolute bottom-40 left-1/2 h-127 w-149 -translate-x-1/2 p-10">
		<Image
			src={computerSrc}
			alt="computer"
			loading="eager"
			className="absolute inset-0"
		/>
		<div className="absolute top-0 left-1/2 h-127 w-149 -translate-x-1/2 p-6 pb-18">
			<div className="relative flex h-full flex-col items-center justify-center px-12.5 py-9.5 font-vcr text-[14px] font-normal leading-5 text-white">
				{children}
			</div>
		</div>
	</div>
);
