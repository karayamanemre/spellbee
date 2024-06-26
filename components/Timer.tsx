import React, { useEffect, useState, useRef } from "react";

interface TimerProps {
	initialTime: number;
	onTimeUp: () => void;
	addTime: number;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, addTime }) => {
	const [timeLeft, setTimeLeft] = useState(initialTime);
	const [showAnimation, setShowAnimation] = useState(false);
	const [animationAddTime, setAnimationAddTime] = useState(0);
	const intervalId = useRef<NodeJS.Timeout | null>(null);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${
			remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
		}`;
	};

	useEffect(() => {
		setTimeLeft(initialTime);
	}, [initialTime]);

	useEffect(() => {
		intervalId.current = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(intervalId.current as NodeJS.Timeout);
					onTimeUp();
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		return () => {
			if (intervalId.current) {
				clearInterval(intervalId.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (addTime > 0) {
			setTimeLeft((prevTime) => prevTime + addTime);
			setAnimationAddTime(addTime);
			setShowAnimation(true);
			setTimeout(() => {
				setShowAnimation(false);
				setAnimationAddTime(0);
			}, 1000);
		}
	}, [addTime]);

	return (
		<div className='flex items-center justify-center border-4 bg-cream rounded-md p-1 shadow-[0px_3px_1px] border-primary w-32 relative drop-shadow-2xl'>
			<p className='font-bold text-xl sm:text-3xl'>{formatTime(timeLeft)}</p>
			{showAnimation && (
				<p className='time-add-animation text-2xl font-bold'>
					+{animationAddTime}
				</p>
			)}
		</div>
	);
};

export default Timer;
