'use client';

import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { FC, useRef } from 'react';
import paws from './assets/lottie-animations/cat-paws.json';

interface CatPawsProps {
	className?: string;
}

export const CatPaws: FC<CatPawsProps> = ({ className }) => {
	const lottieRef = useRef<LottieRefCurrentProps>(null);
	const directionRef = useRef<1 | -1>(1);

	const handleComplete = () => {
		directionRef.current = directionRef.current === 1 ? -1 : 1;

		lottieRef.current?.setDirection(directionRef.current);
		lottieRef.current?.play();
	};

	return (
		<Lottie
			animationData={paws}
			loop={false}
			autoplay
			lottieRef={lottieRef}
			onComplete={handleComplete}
			className={className}
		/>
	);
};
