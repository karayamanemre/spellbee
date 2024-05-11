import React, { useEffect, useState } from "react";

interface TimerProps {
	initialTime: number;
	onTimeUp: () => void;
	addTime: number;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, addTime }) => {
	const [timeLeft, setTimeLeft] = useState(initialTime);
	const [showAnimation, setShowAnimation] = useState(false);

	const formatTime = (seconds: any) => {
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
		if (timeLeft === 0) {
			onTimeUp();
			return;
		}
		const timer = setTimeout(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [timeLeft, onTimeUp]);

	useEffect(() => {
		if (addTime > 0) {
			setTimeLeft((prevTime) => prevTime + addTime);
			setShowAnimation(true);
			setTimeout(() => setShowAnimation(false), 1000);
		}
	}, [addTime]);

	return (
		<div className='flex items-center justify-center border-4 bg-cream rounded-md p-1 shadow-[0px_3px_1px] border-primary w-32 relative'>
			<p className='font-bold text-xl sm:text-3xl'>{formatTime(timeLeft)}</p>
			{showAnimation && (
				<p className='time-add-animation ml-[88px] text-xl font-bold absolute top-2 -right-10'>
					+15
				</p>
			)}
		</div>
	);
};

export default Timer;
